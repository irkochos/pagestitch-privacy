const definitions = [
  ["document-geometry", [
    ["short-document", "Document shorter than viewport", "short"],
    ["exact-viewport", "Document exactly one viewport", "viewport"],
    ["two-viewports", "Document spanning two viewports", "tall"],
    ["fractional-blocks", "Fractional CSS pixel block heights", "fractional"],
    ["margin-collapse", "Collapsing vertical margins", "margins"],
    ["border-box", "Border-box geometry", "borders"],
    ["min-height", "Viewport-relative minimum height", "minimum"],
    ["large-padding", "Large document padding", "padding"],
    ["writing-mode", "Vertical writing mode section", "writing"],
    ["cross-origin-frame", "Cross-origin frame interior", "frame", "limitation"]
  ]],
  ["horizontal-overflow-rtl", [
    ["wide-ltr", "Wide left-to-right canvas", "wide"],
    ["wide-rtl", "Wide right-to-left canvas", "rtl"],
    ["negative-rtl", "RTL negative scroll origin", "rtl-negative"],
    ["both-axes", "Overflow on both axes", "both"],
    ["inline-table", "Wide inline table", "table"],
    ["nowrap-text", "Long unwrapped text line", "nowrap"],
    ["wide-svg", "Generated wide SVG grid", "svg"],
    ["vertical-rl-wide", "Vertical writing with horizontal overflow", "vertical"],
    ["fractional-width", "Fractional horizontal boundaries", "fractional-wide"],
    ["overscroll-container", "Document with contained overscroll", "overscroll"]
  ]],
  ["fixed-overlays", [
    ["top-header", "Fixed top header", "top"],
    ["bottom-banner", "Fixed bottom banner", "bottom"],
    ["left-rail", "Fixed left rail", "left"],
    ["right-rail", "Fixed right rail", "right"],
    ["corner-badge", "Fixed corner badge", "corner"],
    ["full-modal", "Fixed modal overlay", "modal"],
    ["transparent-overlay", "Translucent fixed overlay", "transparent"],
    ["nested-fixed", "Fixed child in transformed ancestor", "transformed", "limitation"],
    ["multiple-fixed", "Multiple fixed regions", "multiple"],
    ["fixed-pseudo", "Fixed element with pseudo content", "pseudo"]
  ]],
  ["sticky-elements", [
    ["sticky-top", "Sticky top heading", "top"],
    ["sticky-bottom", "Sticky bottom footer", "bottom"],
    ["sticky-left", "Sticky first table column", "left"],
    ["sticky-right", "Sticky final table column", "right"],
    ["nested-sticky", "Nested sticky headings", "nested"],
    ["stacked-sticky", "Stacked sticky headings", "stacked"],
    ["sticky-grid", "Sticky cells in a grid", "grid"],
    ["sticky-overflow", "Sticky inside overflow region", "overflow"],
    ["sticky-threshold", "Sticky with inset threshold", "threshold"],
    ["sticky-horizontal", "Sticky during horizontal travel", "horizontal"]
  ]],
  ["lazy-images", [
    ["native-lazy", "Native lazy generated images", "native"],
    ["observer-lazy", "Intersection-observer images", "observer"],
    ["delayed-lazy", "Timer-delayed image reveal", "delayed"],
    ["srcset-lazy", "Generated responsive image candidates", "srcset"],
    ["background-lazy", "Lazy background images", "background"],
    ["aspect-ratio-lazy", "Reserved aspect-ratio images", "ratio"],
    ["unreserved-lazy", "Images without reserved space", "unreserved"],
    ["broken-image", "Broken image does not block readiness", "broken"],
    ["horizontal-lazy", "Horizontally lazy image strip", "horizontal"],
    ["late-observer", "Observer installed after reset", "late"]
  ]],
  ["finite-dynamic-layout", [
    ["append-once", "Append one block after reset", "append"],
    ["append-three", "Append three bounded blocks", "append-three"],
    ["expand-panel", "Expand a finite panel", "expand"],
    ["font-swap", "Deterministic font metric swap", "font"],
    ["image-reflow", "Generated image causes finite reflow", "image"],
    ["remove-placeholder", "Placeholder replaced with content", "replace"],
    ["two-stage", "Two-stage bounded growth", "two-stage"],
    ["width-reflow", "Finite width-driven reflow", "width"],
    ["collapse-after-grow", "Growth followed by finite collapse", "collapse"],
    ["unbounded-growth", "Unbounded layout growth", "unbounded", "limitation"]
  ]],
  ["animation-transitions", [
    ["css-spinner", "Infinite CSS spinner", "spinner"],
    ["pulse-opacity", "Pulsing opacity animation", "pulse"],
    ["translate-box", "Transform translation animation", "translate"],
    ["height-transition", "Height transition after reset", "height"],
    ["color-transition", "Color transition after reset", "color"],
    ["waapi-motion", "Web Animations API motion", "waapi"],
    ["delayed-animation", "Delayed CSS animation", "delay"],
    ["multiple-animations", "Concurrent animations", "multiple"],
    ["pseudo-animation", "Animated pseudo element", "pseudo"],
    ["scroll-animation", "Scroll-linked animation", "scroll", "limitation"]
  ]],
  ["video-media", [
    ["canvas-video", "Canvas-backed video stream", "canvas"],
    ["paused-video", "Initially paused generated video", "paused"],
    ["playing-video", "Initially playing generated video", "playing"],
    ["muted-video", "Muted generated video", "muted"],
    ["rate-video", "Video with custom playback rate", "rate"],
    ["loop-video", "Looping generated video", "loop"],
    ["poster-video", "Video with generated poster", "poster"],
    ["two-videos", "Two independent media elements", "two"],
    ["removed-video", "Media removed during capture", "removed", "limitation"],
    ["autoplay-policy", "Autoplay policy playback observation", "policy", "limitation"]
  ]],
  ["dominant-nested-scrollers", [
    ["vertical-scroller", "Dominant vertical scroller", "vertical"],
    ["horizontal-scroller", "Dominant horizontal scroller", "horizontal"],
    ["two-axis-scroller", "Dominant two-axis scroller", "both"],
    ["rtl-scroller", "Dominant RTL scroller", "rtl"],
    ["bordered-scroller", "Dominant bordered scroller", "bordered"],
    ["padded-scroller", "Dominant padded scroller", "padded"],
    ["small-scroller", "Scroller below dominance threshold", "small"],
    ["multiple-panels", "Multiple independent panels", "multiple", "limitation"],
    ["transformed-scroller", "Transformed dominant scroller", "transformed", "limitation"],
    ["virtualized-list", "Virtualized destructive list", "virtualized", "limitation"]
  ]],
  ["output-scale-part-boundaries", [
    ["integer-grid", "Integer pixel seam grid", "integer"],
    ["half-pixel-grid", "Half CSS pixel seam grid", "half"],
    ["third-pixel-grid", "Third CSS pixel seam grid", "third"],
    ["dpr-one", "Device scale one reference", "dpr-1"],
    ["dpr-one-quarter", "Device scale 1.25 reference", "dpr-1-25"],
    ["dpr-one-half", "Device scale 1.5 reference", "dpr-1-5"],
    ["dpr-two", "Device scale two reference", "dpr-2"],
    ["edge-32767", "32,767 pixel edge boundary", "edge"],
    ["area-67108864", "67,108,864 pixel area boundary", "area"],
    ["multipart-cross", "Rows and columns cross part boundaries", "multipart"]
  ]]
];

function expectedScope(category, variant) {
  if (category === "dominant-nested-scrollers" && !["small", "multiple", "transformed"].includes(variant)) {
    return "The selected dominant scroller's full content";
  }
  return "The complete finite document surface";
}

export const compatibilityCases = definitions.flatMap(([category, cases]) =>
  cases.map(([suffix, name, variant, outcome = "success"], index) => ({
    id: `${category}-${suffix}`,
    category,
    name,
    expectedOutcome: outcome,
    expectedScope: expectedScope(category, variant),
    restorationChecks: ["document and target scroll offsets", "fixture-owned timers and media state"],
    fixture: { kind: category, variant, ordinal: index + 1 }
  }))
);

