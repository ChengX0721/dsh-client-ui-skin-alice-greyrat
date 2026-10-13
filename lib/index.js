import { readFile, stat } from "node:fs/promises";

/**
 * Serve this package's immutable artwork over a same-origin prefix while the
 * skin is enabled. Content-addressed names make the responses safely cacheable
 * forever, and the ETag is derived from the name rather than the bytes.
 */

/** Content-addressed names only: a 64-hex digest plus a raster extension. */
const IMMUTABLE_NAME = /^[a-f0-9]{64}\.(png|webp)$/;

/**
 * The shipped allowlist, re-read whenever the manifest changes.
 *
 * Reading it per request rather than at import keeps the artwork replaceable in
 * a running host. The manifest is a hash list this package's own build emits, so
 * a request still cannot name a file the build did not record; the check just
 * never goes stale against the files the same package is currently shipping.
 */
function createArtworkAllowlist(manifestUrl) {
	let loaded;
	let cached;

	const current = async () => {
		const { mtimeMs } = await stat(manifestUrl);
		if (cached !== undefined && loaded === mtimeMs) return cached;
		const parsed = JSON.parse(await readFile(manifestUrl, "utf8"));
		if (!Array.isArray(parsed) || parsed.some((file) => typeof file !== "string" || !IMMUTABLE_NAME.test(file))) {
			throw new Error("alice-greyrat: invalid artwork manifest");
		}
		cached = new Set(parsed);
		loaded = mtimeMs;
		return cached;
	};

	return current;
}

function installSkinAssets(ctx, id, directory, manifestUrl) {
	const prefix = `/skin-assets/${id}`;
	const allowlist = createArtworkAllowlist(manifestUrl);
	ctx.inject(["webServer"], (webCtx) => {
		const server = webCtx.get("webServer");
		webCtx.effect(
			() =>
				server.register({
					kind: "prefix",
					path: prefix,
					handler: async (req, res) => {
						if (req.method !== "GET" && req.method !== "HEAD") {
							res.writeHead(405, { Allow: "GET, HEAD" }).end();
							return;
						}
						const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
						const file = pathname.slice(prefix.length + 1);
						if (!pathname.startsWith(`${prefix}/`) || !IMMUTABLE_NAME.test(file)) {
							res.writeHead(404).end();
							return;
						}
						let files;
						try {
							files = await allowlist();
						} catch {
							res.writeHead(500).end();
							return;
						}
						if (!files.has(file)) {
							res.writeHead(404).end();
							return;
						}
						let bytes;
						try {
							bytes = await readFile(new URL(file, directory));
						} catch (error) {
							if (error.code !== "ENOENT") throw error;
							res.writeHead(404).end();
							return;
						}
						const etag = `"${file.split(".")[0]}"`;
						const headers = {
							"Content-Type": file.endsWith(".webp") ? "image/webp" : "image/png",
							"Cache-Control": "public, max-age=31536000, immutable",
							"X-Content-Type-Options": "nosniff",
							ETag: etag,
						};
						const requested = req.headers["if-none-match"]
							?.split(",")
							.some((value) => value.trim().replace(/^W\//, "") === etag || value.trim() === "*");
						if (requested === true) {
							res.writeHead(304, headers).end();
							return;
						}
						res.writeHead(200, { ...headers, "Content-Length": bytes.length });
						res.end(req.method === "HEAD" ? undefined : bytes);
					},
				}),
			`${id}: packaged artwork`,
		);
	});
}

/** Presentation-only plugin: it publishes artwork and touches nothing else. */
function apply(ctx) {
	installSkinAssets(
		ctx,
		"alice-greyrat",
		new URL("../assets/runtime/", import.meta.url),
		new URL("../assets/runtime/manifest.json", import.meta.url),
	);
}

export { apply };
