const models = {
  "document-geometry": {
    short: { height: "260px" }, viewport: { height: "calc(100vh - 64px)" }, tall: { height: "1500px" },
    fractional: { height: "1260.5px", markerSize: "159.5px" }, margins: { height: "1380px", collapsedMargins: true },
    borders: { height: "1440px", boxSizing: "border-box", borderWidth: "17px" }, minimum: { minHeight: "135vh" },
    padding: { height: "1750px", padding: "137px 83px" }, writing: { height: "1350px", writingMode: "vertical-rl" },
    frame: { height: "900px", iframe: "data:text/html,%3Ch1%3EDeterministic%20opaque-origin%20frame%3C%2Fh1%3E" }
  },
  "horizontal-overflow-rtl": {
    wide: { width: "2400px" }, rtl: { width: "2475px", direction: "rtl" },
    "rtl-negative": { width: "2550px", direction: "rtl", initialScroll: "inline-end" }, both: { width: "2625px", height: "1800px" },
    table: { width: "2700px", element: "table", columns: 12 }, nowrap: { width: "2775px", whiteSpace: "nowrap", textRun: 240 },
    svg: { width: "2850px", element: "svg", columns: 18 }, vertical: { width: "2925px", writingMode: "vertical-rl" },
    "fractional-wide": { width: "3000.5px", markerSize: "159.5px" }, overscroll: { width: "3075px", overscrollBehavior: "contain" }
  },
  "fixed-overlays": {
    top: { position: "fixed", inset: "64px 0 auto" }, bottom: { position: "fixed", inset: "auto 0 0" },
    left: { position: "fixed", inset: "20% auto 20% 0" }, right: { position: "fixed", inset: "20% 0 20% auto" },
    corner: { position: "fixed", inset: "auto 17px 19px auto", shape: "circle" }, modal: { position: "fixed", inset: "15%", backdrop: true },
    transparent: { position: "fixed", inset: "30% 12%", opacity: ".45" }, transformed: { position: "fixed", inset: "20px", ancestorTransform: "translateZ(0)" },
    multiple: { position: "fixed", placements: ["top", "bottom", "right"] }, pseudo: { position: "fixed", inset: "80px 20px auto auto", pseudo: "FIXED::AFTER" }
  },
  "sticky-elements": {
    top: { position: "sticky", top: "0" }, bottom: { position: "sticky", bottom: "0" },
    // A pinned table column only demonstrates pinning when its scrollport is narrower than the
    // table, so both table cases overflow the viewport horizontally.
    left: { position: "sticky", left: "0", table: true, columns: 16, width: "2600px" },
    right: { position: "sticky", right: "0", table: true, columns: 16, width: "2600px" },
    nested: { position: "sticky", top: "0", nested: true }, stacked: { position: "sticky", top: "stacked" },
    grid: { position: "sticky", top: "0", grid: true }, overflow: { position: "sticky", top: "0", overflowContainer: true },
    threshold: { position: "sticky", top: "96px" }, horizontal: { position: "sticky", left: "40px", horizontal: true }
  },
  "lazy-images": {
    native: { trigger: "native", reserve: true }, observer: { trigger: "intersection-observer", reserve: true },
    delayed: { trigger: "timer", delay: 180, reserve: true }, srcset: { trigger: "native", srcset: true, reserve: true },
    background: { trigger: "timer", background: true, reserve: true }, ratio: { trigger: "timer", aspectRatio: "16 / 11", reserve: true },
    unreserved: { trigger: "timer", reserve: false }, broken: { trigger: "broken", reserve: true },
    horizontal: { trigger: "intersection-observer", horizontal: true, reserve: true }, late: { trigger: "late-observer", delay: 160, reserve: true }
  },
  "finite-dynamic-layout": {
    append: { operation: "append", stages: [1] }, "append-three": { operation: "append", stages: [1, 2, 3] },
    expand: { operation: "expand", finalHeight: "620px", stages: [1] }, font: { operation: "font-swap", finalFont: "serif", stages: [1] },
    image: { operation: "image-reflow", finalHeight: "480px", stages: [1] }, replace: { operation: "replace", stages: [1] },
    "two-stage": { operation: "append", stages: [1, 2] }, width: { operation: "width-reflow", finalWidth: "55%", stages: [1] },
    collapse: { operation: "grow-collapse", stages: [1, 2] }, unbounded: { operation: "append", stages: "unbounded" }
  },
  "animation-transitions": {
    spinner: { mechanism: "css-animation", animation: "spin" }, pulse: { mechanism: "css-animation", animation: "pulse" },
    translate: { mechanism: "css-animation", animation: "translate" }, height: { mechanism: "css-transition", property: "height" },
    color: { mechanism: "css-transition", property: "background-color" }, waapi: { mechanism: "waapi", property: "transform" },
    delay: { mechanism: "css-animation", animation: "spin", delay: "600ms" }, multiple: { mechanism: "css-animation", animation: "spin,pulse" },
    pseudo: { mechanism: "css-animation", animation: "pseudo", pseudo: true }, scroll: { mechanism: "scroll-timeline", property: "transform" }
  },
  "video-media": {
    canvas: { state: "playing", source: "canvas-stream", controls: true }, paused: { state: "paused", source: "canvas-stream" },
    playing: { state: "playing", source: "canvas-stream", hideCanvas: true }, muted: { state: "playing", muted: true, volume: 0.25, source: "canvas-stream" },
    rate: { state: "playing", playbackRate: 1.5, source: "canvas-stream" }, loop: { state: "playing", loop: true, source: "canvas-stream" },
    poster: { state: "paused", poster: true, source: "canvas-stream" }, two: { state: "playing", count: 2, source: "canvas-stream" },
    removed: { state: "playing", removeAfter: 120, source: "canvas-stream" }, policy: { state: "observe-policy", muted: false, source: "canvas-stream" }
  },
  "dominant-nested-scrollers": {
    vertical: { axes: "vertical", extent: { width: "100%", height: "1960px" } }, horizontal: { axes: "horizontal", extent: { width: "3200px", height: "100%" } },
    both: { axes: "both", extent: { width: "3200px", height: "1960px" } }, rtl: { axes: "horizontal", direction: "rtl", extent: { width: "3200px", height: "100%" } },
    // Dominance is measured on the CLIENT rectangle, which excludes this case's 18px border on
    // all four sides. The box is therefore widened (and the card's padding dropped so the wider
    // box still fits the card's content box) to stay above the 50% viewport-area threshold. The
    // height is left alone: a taller box would push the document past the viewport, and a
    // document with overflow is always captured in preference to any nested scroller.
    bordered: {
      axes: "vertical",
      borderWidth: "18px",
      box: { width: "98vw", height: "60vh" },
      cardPadding: "0",
      extent: { width: "100%", height: "1960px" }
    }, padded: { axes: "vertical", padding: "61px", extent: { width: "100%", height: "1960px" } },
    small: { axes: "vertical", dominant: false, extent: { width: "100%", height: "1400px" } }, multiple: { axes: "vertical", count: 2, extent: { width: "100%", height: "1400px" } },
    transformed: { axes: "vertical", transform: "rotate(.5deg)", extent: { width: "100%", height: "1960px" } }, virtualized: { axes: "vertical", virtualization: "destructive", extent: { width: "100%", height: "5000px" } }
  },
  "output-scale-part-boundaries": {
    integer: { geometry: { width: "1600px", height: "1400px" }, seam: "1px", requiredScale: "any" },
    half: { geometry: { width: "1600.5px", height: "1400.5px" }, seam: ".5px", requiredScale: "any" },
    third: { geometry: { width: "1600.333px", height: "1400.333px" }, seam: ".333px", requiredScale: "any" },
    "dpr-1": { geometry: { width: "2400px", height: "1800px" }, seam: "1px", requiredScale: "1" },
    "dpr-1-25": { geometry: { width: "2400px", height: "1800px" }, seam: ".8px", requiredScale: "1.25" },
    "dpr-1-5": { geometry: { width: "2400px", height: "1800px" }, seam: ".666667px", requiredScale: "1.5" },
    "dpr-2": { geometry: { width: "2400px", height: "1800px" }, seam: ".5px", requiredScale: "2" },
    edge: { geometry: { width: "8192px", height: "2048px" }, seam: "1px", requiredScale: "1" },
    area: { geometry: { width: "4096px", height: "4096px" }, seam: "1px", requiredScale: "1" },
    multipart: { geometry: { width: "9000px", height: "5000px" }, seam: "1px", requiredScale: "1" }
  }
};

export function caseModel(entry) {
  const model = models[entry.category]?.[entry.fixture.variant];
  if (!model) throw new Error(`No fixture behavior for ${entry.id}`);
  return globalThis.structuredClone({ feature: `${entry.category}:${entry.fixture.variant}`, ...model });
}
