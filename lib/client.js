window.__ModuleLoader__.load({
	id: "dsh-client-ui-skin-alice-greyrat",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		//#region src/client/asset-url.ts
		/** Package id the client loader uses for this bundle. */
		const SKIN_PACKAGE_ID = "dsh-client-ui-skin-alice-greyrat";
		/** Skin id as declared in skin.json; also the artwork route segment. */
		const SKIN_ID = "alice-greyrat";
		/** Resolve against the host base, including reverse-proxy mounts. */
		function skinAssetUrl(file) {
			return new URL(`skin-assets/${SKIN_ID}/${file}`, document.baseURI).href;
		}
		/** Content-addressed artwork shipped with this skin. */
		const ART = {
			figureLeft: skinAssetUrl("6dcc48b861d68e0788cc3faddbd0be2d2dfc22375159e563fb9660ecb66d54fb.webp"),
			figureRight: skinAssetUrl("dc0ef560b1e2bc1211774d1fcd128e6d28f95b771d230f3d91bc6da23681c5ae.webp"),
			standee: skinAssetUrl("28946d3fda113b5e6899ebc019b74ad26beebdc0e119833bbfdd7e667e2b20da.webp"),
			backdropLight: skinAssetUrl("24485d01faff7a616ec5d0ee4a35951a028da8b5368141f301ed6782034cbf60.webp"),
			backdropDark: skinAssetUrl("d0d9d617473b4035a345e8676722096af628f748270ae7d9722d1fb93a1a7fd2.webp"),
			sigil: skinAssetUrl("9d44d6e42b0b98b4c71c106dc2beff20108a92e9efa0f73e04756aa29673182f.png"),
			embers: skinAssetUrl("1e9601dda925d8770564c8733156e37e15eaab954f75102c3d6502e8ee6f2b0c.png"),
			icon: skinAssetUrl("079f935c52cb45e342207d4ed8d7c81ab30de7cf9cf1bc53b81362e8c454486b.png"),
		};
		//#endregion

		//#region src/client/protocol.ts
		/**
		 * Skin customization protocol v2, inlined so this skin has no runtime
		 * dependency on the manager that renders the controls.
		 */
		const SKIN_CUSTOMIZATION_PROTOCOL = 2;
		const READY_EVENT = "dsh:skin-customization-ready-v2";
		const REGISTER_EVENT = "dsh:skin-customization-register-v2";
		const UNREGISTER_EVENT = "dsh:skin-customization-unregister-v2";

		/**
		 * Expose one skin definition. The ready handshake makes load order and
		 * manager hot reload irrelevant; the returned disposer releases every
		 * customization-owned state through `apply(null)`.
		 */
		function exposeSkinCustomization(definition, target = window) {
			const token = {};
			const register = () => {
				target.dispatchEvent(new CustomEvent(REGISTER_EVENT, { detail: { token, definition } }));
			};
			target.addEventListener(READY_EVENT, register);
			register();
			return () => {
				target.removeEventListener(READY_EVENT, register);
				target.dispatchEvent(new CustomEvent(UNREGISTER_EVENT, { detail: { token, definition } }));
				definition.apply(null);
			};
		}
		//#endregion

		//#region src/client/claimed-styles.ts
		/**
		 * Hand back the `<style>` tags the client loader claimed for this skin by
		 * mistake. After any plugin's factory runs, the loader stamps every
		 * `<style>` without a `data-plugin` with that plugin's id, then deletes
		 * everything carrying the id once the plugin's effects clean up. Because a
		 * skin is switched far more often than any other plugin, other plugins'
		 * runtime styles would be claimed by this skin and removed with it. Tags
		 * this bundle emitted carry `data-plugin-css`, so anything else carrying
		 * our id is somebody else's.
		 */
		function releaseClaimedStyles(doc = document, id = SKIN_PACKAGE_ID) {
			const selector = `style[data-plugin=${JSON.stringify(id)}]:not([data-plugin-css])`;
			for (const style of doc.querySelectorAll(selector)) style.removeAttribute("data-plugin");
		}
		//#endregion

		//#region src/client/style.css
		/**
		 * The palette is deliberately pale, and every host surface it overrides is an
		 * opaque tint: text must never land on a background it cannot be read
		 * against. The sidebar in particular inherits the shared label tokens rather
		 * than overriding them, because a host dialog is portalled into the sidebar
		 * column and would inherit those overrides onto its own, differently coloured
		 * surface.
		 */
		const CSS = `
/* ── palette ───────────────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat]{
  --alice-accent:#c2606a;
  --alice-accent-deep:#a04a55;
  --alice-accent-soft:color-mix(in srgb,var(--alice-accent) 16%,transparent);
  --alice-gold:#c2a05a;
  --alice-gold-line:color-mix(in srgb,var(--alice-gold) 44%,transparent);
  --alice-ink:#3d262b;
  --alice-app-bg:#f9f2ef;
  --alice-panel:#fffdfb;
  --alice-panel-2:#fbf4f2;
  --alice-panel-3:#f6ebe9;
  --alice-sidebar-a:#fdf7f5;
  --alice-sidebar-b:#f1e0de;
  --alice-scrim:rgba(252,247,244,.70);
  --alice-scrim-edge:rgba(252,247,244,.95);
  --alice-shadow:0 10px 30px rgba(122,62,72,.10),0 1px 3px rgba(122,62,72,.08);
  --alice-art-opacity:.85;
  --alice-standee-opacity:.94;
  --alice-backdrop-dim:.30;
  --alice-backdrop-art:url("${ART.backdropLight}");
  --alice-sigil-art:url("${ART.sigil}");
  --alice-ember-art:url("${ART.embers}");

  --dsw-alias-bg-base:var(--alice-app-bg)!important;
  --dsw-alias-bg-layer-1:var(--alice-panel)!important;
  --dsw-alias-bg-layer-2:var(--alice-panel-2)!important;
  --dsw-alias-bg-layer-3:var(--alice-panel-3)!important;
  --dsw-alias-bg-overlay:var(--alice-panel)!important;
  --dsw-alias-border-l1:color-mix(in srgb,var(--alice-accent) 16%,transparent)!important;
  --dsw-alias-border-l2:color-mix(in srgb,var(--alice-accent) 26%,transparent)!important;
  --dsw-alias-border-l2-darkmode-thin:color-mix(in srgb,var(--alice-accent) 18%,transparent)!important;
  --dsw-alias-border-l3:var(--alice-gold-line)!important;
  --dsw-alias-brand-primary:var(--alice-accent)!important;
  --dsw-alias-brand-text:#fffaf8!important;
  --dsw-alias-button-elevated-fill:var(--alice-panel)!important;
  --dsw-alias-button-floating-fill:var(--alice-panel)!important;
  --dsw-alias-button-floating-hover:var(--alice-panel-3)!important;
  --dsw-alias-button-info-fill:var(--alice-accent)!important;
  --dsw-alias-button-info-hover:var(--alice-accent-deep)!important;
  --dsw-alias-interactive-bg-active:color-mix(in srgb,var(--alice-gold) 28%,transparent)!important;
  --dsw-alias-interactive-bg-hover:color-mix(in srgb,var(--alice-accent) 10%,transparent)!important;
  --dsw-alias-interactive-bg-hover-solid:var(--alice-panel-3)!important;
  --dsw-alias-label-primary:var(--alice-ink)!important;
  --dsw-alias-label-primary-bluish:#54343a!important;
  --dsw-alias-label-secondary:#6f5359!important;
  --dsw-alias-label-tertiary:#8d757b!important;
  --dsw-alias-label-caption:#a08d92!important;
  --dsw-alias-label-deep-diving:var(--alice-accent-deep)!important;
  --dsw-alias-menu-group-header-fill:var(--alice-panel-3)!important;
  --dsw-alias-state-business-primary:var(--alice-accent)!important;
  --dsw-alias-state-business-tertiary:color-mix(in srgb,var(--alice-accent) 14%,#fff)!important;
  --dsw-alias-scrollbar-bg-l2:color-mix(in srgb,var(--alice-accent) 30%,transparent)!important;
  --dsw-alias-scrollbar-hover-l2:var(--alice-accent)!important;
  --dsw-shadow-lv2:var(--alice-shadow)!important;
  --dsw-specific-input-major:var(--alice-panel)!important;
  --dsw-specific-selector:var(--alice-panel-2)!important;
  --dsw-specific-sidebar-fill:var(--alice-sidebar-b)!important;
}
body[data-dsh-alice-greyrat][data-ds-dark-theme]{
  --alice-accent:#d98a90;
  --alice-accent-deep:#bd6b74;
  --alice-gold:#d3b273;
  --alice-ink:#f3e6e3;
  --alice-app-bg:#1c0d12;
  --alice-panel:#2e1a20;
  --alice-panel-2:#271419;
  --alice-panel-3:#201016;
  --alice-sidebar-a:#341a21;
  --alice-sidebar-b:#221017;
  --alice-scrim:rgba(26,10,15,.70);
  --alice-scrim-edge:rgba(22,8,12,.95);
  --alice-shadow:0 12px 32px rgba(0,0,0,.44),0 1px 4px rgba(0,0,0,.34);
  --alice-art-opacity:.76;
  --alice-standee-opacity:.88;
  --alice-backdrop-dim:.34;
  --alice-backdrop-art:url("${ART.backdropDark}");
  --dsw-alias-label-primary-bluish:#e2ccc8!important;
  --dsw-alias-label-secondary:#cdb3af!important;
  --dsw-alias-label-tertiary:#ad9490!important;
  --dsw-alias-label-caption:#8f7874!important;
  --dsw-alias-state-business-tertiary:color-mix(in srgb,var(--alice-accent) 26%,transparent)!important;
}

/* ── conversation column ───────────────────────────────────────────────── */
/* The column is made a stacking context and the stage is pushed to a negative
   level, so it is painted above the column's own background but below *every*
   piece of host content — positioned or not. The host's conversation root is
   positioned, but this does not depend on that staying true. */
body[data-dsh-alice-greyrat] [class*=centerCol]{
  position:relative;
  z-index:0;
  background:0 0!important;
}
/* The conversation root paints --dsw-alias-bg-base, which is opaque so that host
   text is never ambiguous. Clear it here only, so the stage behind it shows. */
body[data-dsh-alice-greyrat] [class*=centerCol] [data-phase]{
  background:0 0!important;
}
body[data-dsh-alice-greyrat] [data-slot="main"]>:not([data-slot="main.conversation"]){
  position:relative;
  z-index:2;
}

/* The stage carries the scene, the sigil and the figures. Its own pseudo
   elements are the reading scrim; they are pinned below the real children so
   the artwork is never washed out by them. */
body[data-dsh-alice-greyrat] [data-alice-chrome=stage]{
  position:absolute;
  inset:0;
  z-index:-1;
  overflow:hidden;
  isolation:isolate;
  pointer-events:none;
  background:var(--alice-backdrop-art) center bottom/cover no-repeat;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=stage]>*{
  position:relative;
  z-index:1;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=stage]:before{
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  background:
    linear-gradient(180deg,var(--alice-scrim-edge) 0 10%,var(--alice-scrim) 32% 68%,var(--alice-scrim-edge) 100%);
}
body[data-dsh-alice-greyrat] [data-alice-chrome=stage]:after{
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  background:var(--alice-sidebar-b);
  opacity:var(--alice-backdrop-dim);
}
body[data-dsh-alice-greyrat][data-alice-backdrop=off] [data-alice-chrome=stage]{background-image:none}
body[data-dsh-alice-greyrat][data-alice-backdrop=off] [data-alice-chrome=stage]:before{background:var(--alice-scrim)}
body[data-dsh-alice-greyrat][data-alice-backdrop=off] [data-alice-chrome=stage]:after{opacity:0}

body[data-dsh-alice-greyrat] [data-alice-chrome=embers]{
  position:absolute;
  inset:0;
  background:var(--alice-ember-art) 0 0/380px repeat;
  opacity:.42;
  animation:aliceEmberDrift 90s linear infinite;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=sigil]{
  position:absolute;
  left:50%;
  bottom:-20%;
  width:min(84vh,760px);
  aspect-ratio:1;
  translate:-50% 0;
  background:var(--alice-sigil-art) center/contain no-repeat;
  opacity:.24;
  animation:aliceSigilSpin 120s linear infinite;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=weave]{
  position:absolute;
  inset:0;
  background:
    repeating-linear-gradient(45deg,rgba(255,236,190,.028) 0 1px,transparent 1px 9px),
    repeating-linear-gradient(-45deg,rgba(255,236,190,.028) 0 1px,transparent 1px 9px);
}
body[data-dsh-alice-greyrat][data-alice-sigil=off] [data-alice-chrome=sigil],
body[data-dsh-alice-greyrat][data-alice-sigil=off] [class*=sidebarCol]>div:before{display:none}

/* the two full-body figures */
body[data-dsh-alice-greyrat] [data-alice-figure]{
  position:absolute;
  bottom:0;
  z-index:1;
  width:auto;
  max-width:none;
  height:min(80%,740px);
  object-fit:contain;
  object-position:center bottom;
  pointer-events:none;
  opacity:var(--alice-art-opacity);
  filter:drop-shadow(0 18px 26px rgba(90,25,35,.26));
  transition:opacity .45s ease,translate .6s cubic-bezier(.22,.78,.2,1);
  animation:aliceFloat 9s ease-in-out infinite;
}
body[data-dsh-alice-greyrat] [data-alice-figure=left]{left:clamp(-56px,-1vw,14px)}
body[data-dsh-alice-greyrat] [data-alice-figure=right]{right:clamp(-56px,-1vw,14px);height:min(86%,800px);animation-delay:-4.5s}
body[data-dsh-alice-greyrat][data-alice-artwork=off] [data-alice-figure]{display:none}
@media (max-width:1024px){
  body[data-dsh-alice-greyrat] [data-alice-figure=left]{display:none}
}
@media (max-width:720px){
  body[data-dsh-alice-greyrat] [data-alice-figure]{display:none}
  body[data-dsh-alice-greyrat] [data-alice-chrome=embers]{display:none}
}

/* gilt frame around the column */
body[data-dsh-alice-greyrat] [data-alice-chrome=top-trim],
body[data-dsh-alice-greyrat] [data-alice-chrome=bottom-trim]{
  position:absolute;
  left:0;
  right:0;
  height:12px;
  z-index:3;
  pointer-events:none;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=top-trim]{top:0}
body[data-dsh-alice-greyrat] [data-alice-chrome=bottom-trim]{bottom:0}
body[data-dsh-alice-greyrat] [data-alice-chrome=top-trim]{
  background:
    linear-gradient(90deg,transparent,var(--alice-gold-line) 5% 95%,transparent) 50% 0/100% 1px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 1.7px,transparent 2.1px) 5% 0/10px 10px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 1.7px,transparent 2.1px) 95% 0/10px 10px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 2.2px,transparent 2.6px) 50% 0/14px 14px no-repeat;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=bottom-trim]{
  background:
    linear-gradient(90deg,transparent,var(--alice-gold-line) 5% 95%,transparent) 50% 100%/100% 1px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 1.7px,transparent 2.1px) 5% 100%/10px 10px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 1.7px,transparent 2.1px) 95% 100%/10px 10px no-repeat,
    radial-gradient(circle,var(--alice-gold) 0 2.2px,transparent 2.6px) 50% 100%/14px 14px no-repeat;
}

/* ── sidebar shell ─────────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] [class*=sidebarCol]{
  background:linear-gradient(180deg,var(--alice-sidebar-a),var(--alice-sidebar-b))!important;
  border-right:0!important;
  box-shadow:
    inset -1px 0 0 var(--alice-gold-line),
    6px 0 22px rgba(122,62,72,.08);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol]>div{
  position:relative;
  isolation:auto;
  overflow:hidden;
}
/* The sigil watermark sits behind everything the sidebar renders. */
body[data-dsh-alice-greyrat] [class*=sidebarCol]>div:before{
  content:"";
  position:absolute;
  inset:auto -30% -14% -30%;
  aspect-ratio:1;
  background:var(--alice-sigil-art) center/contain no-repeat;
  opacity:.13;
  pointer-events:none;
  z-index:0;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol]>div>:not([data-alice-chrome],[role=tooltip]){
  position:relative;
  z-index:2;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=fade]{background:0 0!important}

/* ── sidebar dressing ──────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=topStrip]{
  position:relative;
  background:linear-gradient(180deg,color-mix(in srgb,var(--alice-accent) 14%,transparent),transparent);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=topStrip]:after{
  content:"";
  position:absolute;
  left:14%;
  right:14%;
  bottom:0;
  height:1px;
  background:linear-gradient(90deg,transparent,var(--alice-gold),transparent);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=topStrip] button{
  color:var(--alice-accent-deep)!important;
  border-radius:7px;
  transition:background .14s ease,color .14s ease;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=topStrip] button:is(:hover,:focus-visible){
  background:color-mix(in srgb,var(--alice-gold) 26%,transparent)!important;
  color:var(--alice-ink)!important;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=topStrip] button svg{
  color:inherit!important;
  stroke:currentColor;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=logoRow]{
  position:relative;
  border-bottom:1px solid var(--alice-gold-line);
  box-shadow:0 4px 12px rgba(122,62,72,.06);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=brandMark]{
  color:var(--alice-accent)!important;
  filter:drop-shadow(0 1px 2px color-mix(in srgb,var(--alice-accent) 40%,transparent));
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=brandName]{
  font-family:Georgia,"Songti SC","Noto Serif SC",ui-serif,serif;
  letter-spacing:.08em;
  color:var(--alice-accent-deep)!important;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=buildVersion]{
  color:color-mix(in srgb,var(--alice-ink) 55%,transparent)!important;
  letter-spacing:.04em;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=iconButton]{
  color:var(--alice-accent-deep)!important;
  border-radius:50%;
  transition:background .14s ease,color .14s ease,box-shadow .14s ease;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=iconButton]:is(:hover,:focus-visible){
  background:color-mix(in srgb,var(--alice-gold) 24%,transparent)!important;
  color:var(--alice-ink)!important;
  box-shadow:inset 0 0 0 1px var(--alice-gold-line);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=iconButton] svg{
  color:inherit!important;
  stroke:currentColor;
}

/* the primary action reads as a soft gilt plaque */
body[data-dsh-alice-greyrat] button[class*=newSession]{
  color:var(--alice-accent-deep)!important;
  background:linear-gradient(180deg,var(--alice-panel),var(--alice-panel-3))!important;
  border:1px solid var(--alice-gold-line)!important;
  border-radius:11px!important;
  box-shadow:0 2px 8px rgba(122,62,72,.10),inset 0 1px 0 #fff!important;
  letter-spacing:.04em;
  font-family:Georgia,"Songti SC","Noto Serif SC",ui-serif,serif;
  transition:box-shadow .16s ease,translate .16s ease,border-color .16s ease;
}
body[data-dsh-alice-greyrat] button[class*=newSession]:is(:hover,:focus-visible){
  translate:0 -1px;
  border-color:var(--alice-gold)!important;
  box-shadow:0 6px 16px rgba(122,62,72,.16),inset 0 1px 0 #fff!important;
}
body[data-dsh-alice-greyrat] button[class*=newSession] svg{color:var(--alice-accent)!important}

/* sidebar panel rows: the plugin and workspace glyphs get a gilt plate */
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelRow]{
  border-radius:10px;
  transition:background .14s ease,box-shadow .14s ease;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelRow]:hover{
  background:color-mix(in srgb,var(--alice-accent) 10%,transparent)!important;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelActive]{
  background:linear-gradient(90deg,color-mix(in srgb,var(--alice-accent) 18%,transparent),transparent 92%)!important;
  box-shadow:inset 2px 0 0 var(--alice-accent);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelGlyph]{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  box-sizing:border-box;
  width:26px;
  height:26px;
  flex:none;
  border-radius:8px;
  color:var(--alice-accent-deep)!important;
  background:linear-gradient(180deg,var(--alice-panel),var(--alice-panel-3));
  border:1px solid var(--alice-gold-line);
  box-shadow:inset 0 1px 0 #fff,0 1px 2px rgba(122,62,72,.10);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelGlyph] svg,
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelGlyph] img{
  width:16px;
  height:16px;
  color:inherit!important;
  stroke:currentColor;
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelActive] [class*=panelGlyph]{
  color:#fffaf8!important;
  background:linear-gradient(180deg,var(--alice-accent),var(--alice-accent-deep));
  border-color:var(--alice-accent-deep);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=panelTitle]{
  letter-spacing:.02em;
}

/* session rows inside the region: the region is its own stacking context and the
   standee sits at a negative level, so every host row paints above it even though
   the region's children use display:contents and cannot be re-ordered. */
body[data-dsh-alice-greyrat] [class*=regionArea]{
  position:relative;
  z-index:0;
}
body[data-dsh-alice-greyrat] [class*=regionArea] [role=treeitem]{
  border-radius:9px;
  transition:background .14s ease,box-shadow .14s ease;
}
body[data-dsh-alice-greyrat] [class*=regionArea] [role=treeitem]:hover{
  background:color-mix(in srgb,var(--alice-accent) 9%,transparent)!important;
}
body[data-dsh-alice-greyrat] [class*=regionArea] [role=treeitem][aria-selected=true]{
  background:linear-gradient(90deg,color-mix(in srgb,var(--alice-accent) 17%,transparent),transparent 94%)!important;
  box-shadow:
    inset 2px 0 0 var(--alice-accent),
    inset 0 0 0 1px var(--alice-gold-line)!important;
}

/* search field + section headings */
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=search][class*=searchExpanded]:has(>input){
  color:var(--alice-ink)!important;
  background:var(--alice-panel)!important;
  border:1px solid var(--alice-gold-line)!important;
  border-radius:9px;
  box-shadow:inset 0 1px 2px rgba(122,62,72,.06);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=search][class*=searchExpanded]:has(>input):focus-within{
  border-color:var(--alice-accent)!important;
  box-shadow:0 0 0 2px var(--alice-accent-soft);
}
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=sectionHeader]{
  letter-spacing:.08em;
  color:color-mix(in srgb,var(--alice-accent-deep) 82%,transparent)!important;
}

/* footer actions sit on a gilt rail */
body[data-dsh-alice-greyrat] [class*=footArea]{
  border-top:1px solid var(--alice-gold-line);
}
body[data-dsh-alice-greyrat] [class*=settingsArea] button[aria-haspopup=dialog]{
  color:var(--alice-accent-deep)!important;
  background:linear-gradient(180deg,var(--alice-panel),var(--alice-panel-3))!important;
  border:1px solid var(--alice-gold-line)!important;
  border-radius:10px!important;
  letter-spacing:.05em;
  font-family:Georgia,"Songti SC","Noto Serif SC",ui-serif,serif;
  transition:box-shadow .15s ease,border-color .15s ease;
}
body[data-dsh-alice-greyrat] [class*=settingsArea] button[aria-haspopup=dialog]:is(:hover,:focus-visible){
  border-color:var(--alice-gold)!important;
  box-shadow:0 4px 14px rgba(122,62,72,.14);
}

/* ── sidebar standee ───────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] [data-alice-chrome=standee]{
  position:absolute;
  left:50%;
  bottom:10px;
  translate:-50% 0;
  z-index:-1;
  width:min(84%,200px);
  pointer-events:none;
  opacity:var(--alice-standee-opacity);
  transition:opacity .30s ease,translate .30s ease,bottom .30s ease;
}
body[data-dsh-alice-greyrat] [data-alice-chrome=standee] img{
  display:block;
  width:100%;
  height:auto;
  max-height:330px;
  object-fit:contain;
  object-position:center bottom;
  filter:drop-shadow(0 10px 16px rgba(122,62,72,.22));
}
/* the acrylic base the standee rests on */
body[data-dsh-alice-greyrat] [data-alice-chrome=standee]:after{
  content:"";
  position:absolute;
  left:14%;
  right:14%;
  bottom:-6px;
  height:10px;
  border-radius:50%;
  background:radial-gradient(50% 50% at 50% 50%,rgba(122,62,72,.28),transparent 72%);
}
body[data-dsh-alice-greyrat][data-ds-dark-theme] [data-alice-chrome=standee] img{
  filter:drop-shadow(0 10px 18px rgba(0,0,0,.5));
}
body[data-dsh-alice-greyrat][data-alice-standee=off] [data-alice-chrome=standee]{display:none}

/* the rail collapses the standee away with the sidebar */
div[data-sidebar-collapsed] [data-alice-chrome=standee],
body[data-dsh-alice-greyrat] [class*=sidebarCol] [class*=root][class*=collapsed] [data-alice-chrome=standee]{
  opacity:0;
  translate:-50% 16px;
}
@media (max-width:1024px){
  body[data-dsh-alice-greyrat] [data-alice-chrome=standee]{width:min(84%,148px)}
}

/* ── app surfaces ──────────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] [data-slot="conversation.header"]>header{
  position:relative;
  border-bottom:0!important;
  background:linear-gradient(180deg,color-mix(in srgb,var(--alice-accent) 7%,transparent),transparent)!important;
}
body[data-dsh-alice-greyrat] [data-slot="conversation.header"]>header:after{
  content:"";
  position:absolute;
  left:8%;
  right:8%;
  bottom:0;
  height:1px;
  background:linear-gradient(90deg,transparent,var(--alice-gold-line) 20% 80%,transparent);
  pointer-events:none;
}

/* ── composer ──────────────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] [data-composer-card]{
  border:1px solid var(--alice-gold-line)!important;
  border-radius:16px!important;
  background:linear-gradient(180deg,var(--alice-panel),var(--alice-panel-2))!important;
  box-shadow:var(--alice-shadow)!important;
  transition:border-color .18s ease,box-shadow .18s ease;
}
body[data-dsh-alice-greyrat] [data-composer-card]:focus-within{
  border-color:var(--alice-accent)!important;
  box-shadow:0 0 0 3px var(--alice-accent-soft),var(--alice-shadow)!important;
}
body[data-dsh-alice-greyrat] [data-composer-input]{
  font-family:Georgia,"Songti SC","Noto Serif SC",ui-serif,serif;
}

/* ── prose, code and tables ────────────────────────────────────────────── */
body[data-dsh-alice-greyrat] div[class*=markdown] :is(h1,h2,h3){
  font-family:Georgia,"Songti SC","Noto Serif SC",ui-serif,serif;
  letter-spacing:.01em;
}
body[data-dsh-alice-greyrat] div[class*=markdown] h2{
  padding-bottom:.28em;
  border-bottom:1px solid var(--alice-gold-line);
}
body[data-dsh-alice-greyrat] div[class*=markdown] blockquote{
  border-inline-start:3px solid var(--alice-gold-line)!important;
  background:color-mix(in srgb,var(--alice-gold) 10%,transparent);
  border-radius:0 8px 8px 0;
}
body[data-dsh-alice-greyrat] div[class*=markdown] a{
  color:var(--alice-accent-deep);
  border-bottom:1px dotted var(--alice-gold-line);
}
body[data-dsh-alice-greyrat] div[class*=markdown] pre{
  border:1px solid var(--alice-gold-line);
  border-radius:12px;
}
body[data-dsh-alice-greyrat] .md-table-wide :is(th,td),
body[data-dsh-alice-greyrat] div[class*=markdown] table :is(th,td){
  border-color:var(--alice-gold-line)!important;
}
body[data-dsh-alice-greyrat] div[class*=markdown] thead th{
  background:color-mix(in srgb,var(--alice-accent) 10%,transparent);
}

/* ── accent targets ────────────────────────────────────────────────────── */
body[data-dsh-alice-greyrat][data-alice-accent~="frame"] [class*=sidebarCol]{
  box-shadow:
    inset -1px 0 0 var(--alice-accent),
    6px 0 22px rgba(122,62,72,.08);
}
body[data-dsh-alice-greyrat][data-alice-accent~="composer"] [data-composer-card]{
  border-color:color-mix(in srgb,var(--alice-accent) 48%,transparent)!important;
}
body[data-dsh-alice-greyrat][data-alice-accent~="title"] div[class*=markdown] :is(a,strong),
body[data-dsh-alice-greyrat][data-alice-accent~="title"] [class*=sidebarCol] [class*=panelTitle]{
  color:var(--alice-accent-deep);
}
body[data-dsh-alice-greyrat][data-alice-glow=on] [data-composer-card]:focus-within{
  box-shadow:0 0 0 3px var(--alice-accent-soft),0 0 30px var(--alice-accent-soft),var(--alice-shadow)!important;
}
body[data-dsh-alice-greyrat][data-alice-glow=on] [data-alice-figure],
body[data-dsh-alice-greyrat][data-alice-glow=on] [data-alice-chrome=standee] img{
  filter:
    drop-shadow(0 0 14px color-mix(in srgb,var(--alice-accent) 30%,transparent))
    drop-shadow(0 12px 20px rgba(90,25,35,.24));
}
body[data-dsh-alice-greyrat] [role=menu],
body[data-dsh-alice-greyrat] [role=listbox],
body[data-dsh-alice-greyrat] [role=dialog][aria-modal=true]{
  background-color:var(--alice-panel)!important;
  border:1px solid var(--alice-gold-line);
  box-shadow:var(--alice-shadow)!important;
}
body[data-dsh-alice-greyrat] [role=menu],
body[data-dsh-alice-greyrat] [role=listbox]{border-radius:12px}
body[data-dsh-alice-greyrat] button[class*=primary],
body[data-dsh-alice-greyrat] [data-variant=primary]{
  background:linear-gradient(180deg,var(--alice-accent),var(--alice-accent-deep))!important;
  color:#fffaf8!important;
}

/* ── motion and reduced-motion ─────────────────────────────────────────── */
@keyframes aliceSigilSpin{from{rotate:0deg}to{rotate:360deg}}
@keyframes aliceEmberDrift{from{background-position:0 0}to{background-position:380px -760px}}
@keyframes aliceFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}
@media (prefers-reduced-motion:reduce){
  body[data-dsh-alice-greyrat] [data-alice-chrome=sigil],
  body[data-dsh-alice-greyrat] [data-alice-chrome=embers]{animation:none}
  body[data-dsh-alice-greyrat] [data-alice-figure]{animation:none}
  body[data-dsh-alice-greyrat] :is([data-alice-figure],[data-alice-chrome=standee]){transition:none}
}
`;
		//#endregion

		//#region src/client/settings.ts
		const ACCENT_TARGETS = [
			{ value: "frame", label: "侧栏描边", labelEn: "Sidebar frame" },
			{ value: "composer", label: "输入框描边", labelEn: "Composer outline" },
			{ value: "title", label: "标题与链接", labelEn: "Headings and links" },
			{ value: "glow", label: "光晕", labelEn: "Glow" },
		];
		const SETTINGS = [
			{
				key: "backdrop",
				type: "boolean",
				label: "场景背景",
				labelEn: "Scene backdrop",
				description: "在对话区铺一张淡色的魔法大陆场景。",
				descriptionEn: "A washed-out magic-continent scene behind the conversation.",
				defaultValue: true,
			},
			{
				key: "backdropDim",
				type: "range",
				label: "背景压暗",
				labelEn: "Backdrop dimming",
				defaultValue: 30,
				min: 0,
				max: 80,
				step: 2,
				unit: "%",
				visibleWhen: { key: "backdrop", values: [true] },
			},
			{
				key: "sigil",
				type: "boolean",
				label: "魔法阵纹章",
				labelEn: "Arcane sigil",
				description: "在背景与侧栏叠加缓慢旋转的魔法阵。",
				descriptionEn: "Overlay a slowly turning arcane sigil.",
				defaultValue: true,
			},
			{
				key: "artwork",
				type: "boolean",
				label: "角色立绘",
				labelEn: "Character art",
				defaultValue: true,
			},
			{
				key: "artworkOpacity",
				type: "range",
				label: "立绘不透明度",
				labelEn: "Artwork opacity",
				defaultValue: 85,
				min: 30,
				max: 100,
				step: 2,
				unit: "%",
				visibleWhen: { key: "artwork", values: [true] },
			},
			{
				key: "sidebarStandee",
				type: "boolean",
				label: "侧栏幼年立牌",
				labelEn: "Sidebar young Eris standee",
				description: "在左侧任务栏的空白处立一块幼年艾莉丝，展开收起时一起收放。",
				descriptionEn: "A young Eris standee in the sidebar's empty space; it collapses with the rail.",
				defaultValue: true,
			},
			{
				key: "accent",
				type: "color",
				label: "强调色",
				labelEn: "Accent",
				defaultValue: "#c2606a",
			},
			{
				key: "accentTargets",
				type: "checkbox-group",
				label: "强调目标",
				labelEn: "Accent targets",
				defaultValue: ["frame", "composer", "title"],
				options: ACCENT_TARGETS,
			},
			{
				key: "sfwMode",
				type: "visibility-schedule",
				label: "不那么二次元模式",
				labelEn: "Less-anime mode",
				description: "在设定的时段内隐藏立绘与立牌。",
				descriptionEn: "Hide the figures and the standee during the configured hours.",
				defaultValue: { enabled: false, outside: "visible", ranges: [] },
			},
		];
		//#endregion

		//#region src/client/dom.ts
		const BODY_ATTRIBUTE = "data-dsh-alice-greyrat";
		const OWNER = "data-alice-owner";

		/** Remove nodes a previous instance left behind, so hot reload never doubles up. */
		function sweepStaleNodes() {
			for (const node of document.querySelectorAll(`[${OWNER}=${JSON.stringify(SKIN_ID)}]`)) node.remove();
		}

		const layer = (name) => {
			const element = document.createElement("div");
			element.setAttribute("data-alice-chrome", name);
			element.setAttribute(OWNER, SKIN_ID);
			return element;
		};

		const figure = (side, url) => {
			const image = document.createElement("img");
			image.setAttribute("data-alice-chrome", "figure");
			image.setAttribute("data-alice-figure", side);
			image.setAttribute(OWNER, SKIN_ID);
			image.decoding = "async";
			image.alt = "";
			image.src = url;
			return image;
		};

		/** The sidebar standee: a wrapper so the acrylic base can be drawn under it. */
		function standee() {
			const wrapper = layer("standee");
			const image = document.createElement("img");
			image.decoding = "async";
			image.alt = "";
			image.src = ART.standee;
			wrapper.append(image);
			return wrapper;
		}

		/** Owns every body inline custom property this skin writes. */
		class BodyStyleLease {
			constructor(body) {
				this.body = body;
				this.originals = new Map();
			}
			set(name, value) {
				if (!this.originals.has(name)) {
					this.originals.set(name, {
						value: this.body.style.getPropertyValue(name),
						priority: this.body.style.getPropertyPriority(name),
					});
				}
				this.body.style.setProperty(name, value);
			}
			release() {
				for (const [name, original] of this.originals) {
					if (original.value === "") this.body.style.removeProperty(name);
					else this.body.style.setProperty(name, original.value, original.priority);
				}
				this.originals.clear();
			}
		}
		//#endregion

		//#region src/client/customization.ts
		let customizationState = null;
		let customizationLive = false;
		let lease = null;

		const asBoolean = (value, fallback) => (typeof value === "boolean" ? value : fallback);
		const asNumber = (value, fallback) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
		const asString = (value, fallback) => (typeof value === "string" && value !== "" ? value : fallback);

		/** Project the manager's computed state onto body attributes and custom properties. */
		function renderCustomization() {
			if (!customizationLive || lease === null) return;
			const body = document.body;

			if (customizationState === null) {
				for (const name of [
					"data-alice-backdrop",
					"data-alice-sigil",
					"data-alice-artwork",
					"data-alice-standee",
					"data-alice-glow",
					"data-alice-accent",
				]) {
					body.removeAttribute(name);
				}
				lease.release();
				return;
			}

			const values = customizationState.values ?? {};
			const visibility = customizationState.visibility ?? {};
			const allowed = visibility.sfwMode !== false;

			const backdrop = asBoolean(values.backdrop, true);
			const sigil = asBoolean(values.sigil, true);
			const artwork = asBoolean(values.artwork, true) && allowed;
			const standeeOn = asBoolean(values.sidebarStandee, true) && allowed;
			const artworkOpacity = asNumber(values.artworkOpacity, 85);
			const dim = asNumber(values.backdropDim, 30);
			const accent = asString(values.accent, "#c2606a");
			const targets = Array.isArray(values.accentTargets)
				? values.accentTargets.filter((value) => typeof value === "string")
				: [];

			body.setAttribute("data-alice-backdrop", backdrop ? "on" : "off");
			body.setAttribute("data-alice-sigil", sigil ? "on" : "off");
			body.setAttribute("data-alice-artwork", artwork ? "on" : "off");
			body.setAttribute("data-alice-standee", standeeOn ? "on" : "off");
			body.setAttribute("data-alice-accent", targets.join(" "));
			if (targets.includes("glow")) body.setAttribute("data-alice-glow", "on");
			else body.removeAttribute("data-alice-glow");

			const artOpacity = Math.min(1, Math.max(0.3, artworkOpacity / 100));
			lease.set("--alice-accent", accent);
			lease.set("--alice-accent-deep", `color-mix(in srgb, ${accent} 76%, #2f1016)`);
			lease.set("--alice-accent-soft", `color-mix(in srgb, ${accent} 16%, transparent)`);
			lease.set("--alice-art-opacity", String(artOpacity));
			lease.set("--alice-standee-opacity", String(Math.min(1, artOpacity + 0.09)));
			lease.set("--alice-backdrop-dim", String(Math.min(0.8, Math.max(0, dim / 100))));
		}

		/** Register the settings card and keep its projection alive for this activation. */
		function installCustomization() {
			customizationLive = true;
			lease = new BodyStyleLease(document.body);
			renderCustomization();
			const dispose = exposeSkinCustomization({
				protocol: SKIN_CUSTOMIZATION_PROTOCOL,
				skinId: SKIN_ID,
				title: "艾莉丝 狂剑王",
				titleEn: "Eris the Sword King",
				settings: SETTINGS,
				apply(state) {
					customizationState = state;
					renderCustomization();
				},
			});
			return () => {
				customizationLive = false;
				dispose();
				lease?.release();
				lease = null;
			};
		}
		//#endregion

		//#region src/client/favicon.ts
		/** Swap the page icon for the skin's badge while it is active. */
		function installFavicon() {
			const head = document.head;
			const link = document.querySelector("link[rel~='icon']");
			const previous = link === null ? null : link.getAttribute("href");
			const tag = link ?? document.createElement("link");
			if (link === null) {
				tag.setAttribute("rel", "icon");
				tag.setAttribute("type", "image/png");
				head.append(tag);
			}
			tag.setAttribute("href", ART.icon);
			return () => {
				if (link === null) tag.remove();
				else if (previous === null) link.removeAttribute("href");
				else link.setAttribute("href", previous);
			};
		}
		//#endregion

		//#region src/client/chrome.ts
		/**
		 * Mount every piece of skin chrome: the conversation stage with its scene,
		 * sigil and two figures, the gilt frame around that column, and the sidebar
		 * standee.
		 *
		 * Both host containers are replaced whenever the app remounts its shell, so
		 * a debounced observer re-parents the decorations instead of relying on a
		 * single lookup. Each decoration reports for duty only while it is
		 * disconnected, which keeps the steady state free of queries even though the
		 * transcript mutates the document constantly.
		 */
		function installChrome() {
			const body = document.body;
			const stage = layer("stage");
			stage.append(
				layer("embers"),
				layer("sigil"),
				layer("weave"),
				figure("left", ART.figureLeft),
				figure("right", ART.figureRight),
			);
			const topTrim = layer("top-trim");
			const bottomTrim = layer("bottom-trim");
			const chibi = standee();

			/** Move one decoration into `host`; `first` keeps the stage behind app content. */
			const place = (element, host, first) => {
				if (host === null) return;
				if (element.parentElement === host && (!first || host.children[0] === element)) return;
				if (first) host.prepend(element);
				else host.append(element);
			};

			/**
			 * True once every decoration sits in its *real* host rather than the
			 * `body` fallback.
			 *
			 * DSH activates this plugin before it mounts the shell, so the first
			 * attach finds no conversation column and parks the column pieces on
			 * `body`. A check that only asked "are they connected, do they share a
			 * parent" would then call that settled for the rest of the session —
			 * leaving the stage covering the whole viewport and the artwork in the
			 * wrong container. Both hosts are therefore verified by name, and the
			 * observer keeps retrying until the shell exists.
			 */
			const inColumn = (element) => {
				const parent = element.parentElement;
				return (
					parent !== null &&
					parent !== body &&
					typeof parent.className === "string" &&
					parent.className.includes("centerCol")
				);
			};
			let sidebarSeen = false;
			const settled = () => {
				if (!stage.isConnected || !chibi.isConnected) return false;
				if (!inColumn(stage) || !inColumn(topTrim) || !inColumn(bottomTrim)) return false;
				return !sidebarSeen || chibi.parentElement !== body;
			};

			const attach = (force = false) => {
				if (!force && settled()) return;
				const column = document.querySelector("[class*=centerCol]");
				const columnHost = column ?? body;
				place(stage, columnHost, column !== null);
				place(topTrim, columnHost, false);
				place(bottomTrim, columnHost, false);
				// The session region ends where the footer begins, so the standee
				// lands in the sidebar's empty space without measuring anything.
				const sidebarHost =
					document.querySelector("[class*=regionArea]") ??
					document.querySelector("[class*=sidebarCol]>div");
				if (sidebarHost !== null) {
					sidebarSeen = true;
					place(chibi, sidebarHost, false);
				} else {
					place(chibi, body, false);
				}
			};
			attach();

			// A few forced passes cover a shell that mounts in stages after the
			// plugin; `place` is idempotent, so re-running costs nothing visible.
			const retries = [120, 400, 1200, 2500].map((delay) =>
				setTimeout(() => {
					try {
						attach(true);
					} catch {
						// Never let chrome placement disturb the skin.
					}
				}, delay),
			);

			let frame = 0;
			const observer = new MutationObserver(() => {
				if (frame !== 0) return;
				frame = requestAnimationFrame(() => {
					frame = 0;
					attach();
				});
			});
			observer.observe(body, { childList: true, subtree: true });

			return () => {
				observer.disconnect();
				if (frame !== 0) cancelAnimationFrame(frame);
				for (const timer of retries) clearTimeout(timer);
				for (const element of [stage, topTrim, bottomTrim, chibi]) element.remove();
			};
		}
		//#endregion

		//#region src/index.ts
		/**
		 * Presentation-only skin: it installs its own stylesheet, favicon and DOM
		 * chrome, declares its settings card, and retracts every write through the
		 * Cordis effect disposers. It injects no service, emits no event and never
		 * reaches the model request path.
		 */
		function apply(ctx) {
			// The loader stamps untagged <style> tags with this bundle's id; hand back
			// the ones that belong to other plugins before anything else runs.
			ctx.effect(() => {
				releaseClaimedStyles();
				return () => releaseClaimedStyles();
			}, "alice-greyrat: release styles claimed by the loader");

			ctx.effect(() => {
				sweepStaleNodes();
				document.body.setAttribute(BODY_ATTRIBUTE, "");
				const style = document.createElement("style");
				style.setAttribute("data-plugin-css", SKIN_PACKAGE_ID);
				style.textContent = CSS;
				document.head.append(style);

				const disposeChrome = installChrome();
				const disposeFavicon = installFavicon();

				return () => {
					disposeFavicon();
					disposeChrome();
					style.remove();
					document.body.removeAttribute(BODY_ATTRIBUTE);
					sweepStaleNodes();
				};
			}, "alice-greyrat: presentation layer");

			ctx.effect(() => installCustomization(), "alice-greyrat: settings card");
		}

		exports.apply = apply;
		//#endregion
		return module.exports;
	},
});
