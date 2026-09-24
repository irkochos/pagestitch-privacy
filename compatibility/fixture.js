import { compatibilityCases } from "./cases.js";
import { caseModel } from "./case-models.js";
import { createFixtureResetController } from "./reset-controller.js";

const fixtureDocument = globalThis.document;
const fixtureWindow = globalThis.window;
const selector = fixtureDocument?.querySelector("#case-selector");
const identity = fixtureDocument?.querySelector("#case-identity");
const readiness = fixtureDocument?.querySelector("#fixture-readiness");
const stage = fixtureDocument?.querySelector("#fixture-stage");

const tones = ["#e5484d", "#147d64", "#3559c7", "#a05a00", "#7b3fb2"];

function markerGrid(count, offset = 0) {
  const grid = fixtureDocument.createElement("div");
  grid.className = "marker-grid";
  for (let index = 0; index < count; index += 1) {
    const marker = fixtureDocument.createElement("div");
    marker.className = "marker";
    marker.style.setProperty("--hue", String((index * 47 + offset * 29) % 360));
    marker.textContent = `x${index % 5}:y${Math.floor(index / 5)} · ${index + offset}`;
    grid.append(marker);
  }
  return grid;
}

function generatedSvg(label, hue) {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="100%" height="100%" fill="hsl(${hue} 70% 75%)"/><path d="M0 0L320 220M320 0L0 220" stroke="#14213d" stroke-width="8"/><text x="18" y="115" font-size="24">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(source)}`;
}

function baseCase(entry) {
  const card = fixtureDocument.createElement("article");
  card.className = "case-card";
  card.style.setProperty("--tone", tones[(entry.fixture.ordinal - 1) % tones.length]);
  card.innerHTML = `<h1>${entry.name}</h1><p>${entry.id}</p>`;
  return card;
}

function renderGeometry(entry, card) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.dataset.pattern = model.feature;
  if (model.height) card.style.setProperty("--case-height", model.height);
  if (model.minHeight) card.style.minHeight = model.minHeight;
  if (model.padding) card.style.padding = model.padding;
  if (model.writingMode) card.style.writingMode = model.writingMode;
  if (model.boxSizing) { card.style.boxSizing = model.boxSizing; card.style.borderWidth = model.borderWidth; }
  if (model.collapsedMargins) card.innerHTML += "<section class='margin-parent'><h2 class='margin-child'>Collapsed margins</h2></section>";
  if (model.iframe) { const frame = fixtureDocument.createElement("iframe"); frame.src = model.iframe; frame.title = "Cross-origin frame limitation"; card.append(frame); }
  card.append(markerGrid(30, entry.fixture.ordinal));
}

function renderHorizontal(entry, card) {
  const model = caseModel(entry);
  card.classList.add("wide", "tall"); card.dataset.pattern = model.feature;
  card.style.setProperty("--case-width", model.width); card.style.setProperty("--case-height", model.height ?? "1100px");
  if (model.direction) card.dir = model.direction;
  if (model.writingMode) card.style.writingMode = model.writingMode;
  if (model.whiteSpace) card.style.whiteSpace = model.whiteSpace;
  if (model.element === "table") {
    const table = fixtureDocument.createElement("table");
    for (let row = 0; row < 8; row += 1) { const tr = table.insertRow(); for (let column = 0; column < model.columns; column += 1) tr.insertCell().textContent = `r${row}c${column}`; }
    card.append(table);
  } else if (model.element === "svg") {
    const image = fixtureDocument.createElement("img"); image.alt = "Wide generated SVG coordinate grid"; image.src = generatedSvg("wide-svg", 210); image.style.width = model.width; card.append(image);
  } else if (model.textRun) {
    const line = fixtureDocument.createElement("p"); line.textContent = Array.from({ length: model.textRun }, (_, index) => `cell-${index}`).join(" · "); card.append(line);
  } else if (model.overscrollBehavior) {
    // A real overscroll-behavior demonstration needs an element that actually scrolls: applying
    // the property to a non-scrolling ancestor has no observable effect in any browser.
    const scroller = fixtureDocument.createElement("section");
    scroller.className = "overscroll-scroller";
    scroller.style.overflow = "auto";
    scroller.style.overscrollBehavior = model.overscrollBehavior;
    scroller.style.height = "480px";
    scroller.append(markerGrid(40, entry.fixture.ordinal));
    card.append(scroller);
  } else card.append(markerGrid(40, entry.fixture.ordinal));
  if (model.initialScroll) card.dataset.initialScroll = model.initialScroll;
}

function renderOverlay(entry, card) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "1700px");
  card.dataset.pattern = model.feature;
  card.append(markerGrid(45, entry.fixture.ordinal));
  const positions = model.placements ?? [entry.fixture.variant];
  const owner = model.ancestorTransform ? fixtureDocument.createElement("div") : card;
  if (model.ancestorTransform) { owner.style.transform = model.ancestorTransform; owner.className = "fixed-transform-owner"; card.append(owner); }
  for (const position of positions) {
    const overlay = fixtureDocument.createElement("aside");
    overlay.className = `overlay ${position}`;
    overlay.style.position = model.position; overlay.style.inset = positions.length > 1 ? "" : model.inset;
    overlay.textContent = `fixed ${position} · restore visibility`;
    if (model.opacity) overlay.style.opacity = model.opacity;
    if (model.shape) overlay.style.borderRadius = "50%";
    if (model.backdrop) { overlay.classList.add("modal"); overlay.innerHTML = "<section class='dialog'>Modal overlay</section>"; }
    if (model.pseudo) { overlay.classList.add("has-pseudo"); overlay.dataset.pseudo = model.pseudo; }
    owner.append(overlay);
  }
}

function renderSticky(entry, card) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "1900px");
  card.dataset.pattern = model.feature;

  if (model.table) {
    // Sticky table columns are a real, named browser structure distinct from a sticky heading:
    // the sticky cell must live inside an actual <table>/<tr>/<td> so the browser's table layout
    // and sticky-positioning algorithms both apply.
    const table = fixtureDocument.createElement("table"); table.className = "sticky-column-table";
    // The card must be wider than the viewport: a sticky cell pins against its scrollport, so a
    // table that fits on screen cannot show the pinned-column behaviour this case is named for.
    card.classList.add("wide"); card.style.setProperty("--case-width", model.width);
    const columns = model.columns;
    for (let row = 0; row < 6; row += 1) {
      const tr = table.insertRow();
      for (let column = 0; column < columns; column += 1) {
        const cell = tr.insertCell();
        cell.textContent = `r${row}c${column}`;
        const isStickyColumn = model.left ? column === 0 : column === (columns - 1);
        if (isStickyColumn) {
          cell.className = "sticky-cell";
          cell.style.position = model.position;
          if (model.left) cell.style.left = model.left; else cell.style.right = model.right;
        }
      }
    }
    card.append(table, markerGrid(20, entry.fixture.ordinal));
    return;
  }

  if (model.grid) {
    // A grid-area assignment only means anything on an actual CSS grid container; otherwise the
    // property is inert and the heading behaves like a plain block.
    const grid = fixtureDocument.createElement("section"); grid.className = "sticky-grid-container";
    grid.style.display = "grid"; grid.style.gridTemplateRows = "repeat(5, 220px)"; grid.style.gridTemplateColumns = "1fr";
    for (let index = 0; index < 5; index += 1) {
      const heading = fixtureDocument.createElement("h2"); heading.className = "sticky";
      heading.style.position = model.position; heading.style.top = model.top; heading.style.gridArea = `${index + 1} / 1`;
      heading.textContent = `Sticky region ${index + 1}`;
      grid.append(heading, markerGrid(10, index * 10));
    }
    card.append(grid);
    return;
  }

  const owner = model.overflowContainer ? fixtureDocument.createElement("section") : card;
  if (model.overflowContainer) { owner.className = "sticky-scroll-container"; owner.style.overflow = "auto"; owner.style.height = "520px"; card.append(owner); }
  for (let index = 0; index < 5; index += 1) {
    const heading = fixtureDocument.createElement("h2"); heading.className = "sticky";
    heading.style.position = model.position;
    if (model.top) heading.style.top = model.top === "stacked" ? `${index * 42}px` : model.top;
    if (model.bottom) { heading.style.top = "auto"; heading.style.bottom = model.bottom; }
    if (model.horizontal && model.left) heading.style.left = model.left;
    heading.textContent = `Sticky region ${index + 1}`;
    const section = model.nested ? fixtureDocument.createElement("section") : owner;
    if (model.nested) { section.className = "nested-sticky-region"; owner.append(section); }
    section.append(heading, markerGrid(10, index * 10));
  }
  if (model.horizontal) { card.classList.add("wide"); card.style.setProperty("--case-width", "2800px"); }
}

function renderLazy(entry, card, own) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "2400px");
  card.dataset.pattern = model.feature;
  if (model.horizontal) { card.classList.add("wide"); card.style.setProperty("--case-width", "3000px"); }
  // Several cases only diverge once their timer/observer callback fires; state the actual
  // trigger mechanism up front so the case's real, distinct configuration is visible immediately
  // rather than only after that callback runs.
  const label = fixtureDocument.createElement("p"); label.className = "lazy-trigger-label";
  label.textContent = `Trigger: ${model.trigger}${model.delay ? ` (delay ${model.delay}ms)` : ""}`;
  card.append(label);
  for (let index = 0; index < 4; index += 1) {
    const image = fixtureDocument.createElement(model.background ? "div" : "img"); image.className = "lazy-tile";
    image.alt = `Generated lazy marker ${index + 1}`;
    if (model.reserve) { image.width = 320; image.height = 220; }
    if (model.aspectRatio) image.style.aspectRatio = model.aspectRatio;
    const publish = () => {
      const source = generatedSvg(image.alt, index * 80 + entry.fixture.ordinal);
      if (model.background) image.style.backgroundImage = `url("${source}")`; else image.src = source;
    };
    if (model.trigger === "native") {
      image.loading = "lazy"; publish();
      if (model.srcset) { image.srcset = `${generatedSvg("small", 30)} 320w, ${generatedSvg("large", 210)} 640w`; image.sizes = "320px"; }
    } else if (model.trigger === "broken") image.src = "missing-generated-image.svg";
    else if (model.trigger === "intersection-observer" && "IntersectionObserver" in fixtureWindow) {
      const observer = new fixtureWindow.IntersectionObserver((records) => {
        for (const record of records) {
          if (record.isIntersecting) { publish(); observer.unobserve(record.target); }
        }
      });
      own(() => observer.disconnect());
      observer.observe(image);
    } else {
      const install = () => {
        if (model.trigger === "late-observer" && "IntersectionObserver" in fixtureWindow) {
          const observer = new fixtureWindow.IntersectionObserver((records) => { if (records.some((record) => record.isIntersecting)) publish(); });
          own(() => observer.disconnect()); observer.observe(image);
        } else publish();
      };
      const timer = globalThis.setTimeout(install, (model.delay ?? 40) + index * 35);
      own(() => globalThis.clearTimeout(timer));
    }
    card.append(image);
  }
}

function renderDynamic(entry, card, own) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "900px"); card.append(markerGrid(20));
  card.dataset.pattern = model.feature;
  const target = fixtureDocument.createElement("section"); target.className = "dynamic-target"; card.append(target);
  // The mutation itself only happens once the bounded timer fires; declare the planned operation
  // and stage count up front so the case's real configuration (not just its eventual effect) is
  // part of its rendered, inspectable state.
  const stageLabel = Array.isArray(model.stages) ? model.stages.join(",") : model.stages;
  target.dataset.operation = model.operation;
  target.dataset.stages = stageLabel;
  target.textContent = `Initial deterministic layout — will ${model.operation} over stages [${stageLabel}]`;
  const repeats = model.stages === "unbounded" ? 80 : model.stages.length;
  let count = 0;
  const timer = globalThis.setInterval(() => {
    if (model.operation === "expand") target.style.height = model.finalHeight;
    else if (model.operation === "font-swap") target.style.fontFamily = model.finalFont;
    else if (model.operation === "image-reflow") { const image = fixtureDocument.createElement("img"); image.src = generatedSvg("reflow", 45); image.style.height = model.finalHeight; target.append(image); }
    else if (model.operation === "replace") target.replaceChildren(markerGrid(12, 30));
    else if (model.operation === "width-reflow") target.style.width = model.finalWidth;
    else if (model.operation === "grow-collapse") target.style.height = count === 0 ? "700px" : "180px";
    else target.append(markerGrid(5, count * 5));
    count += 1;
    if (count >= repeats && model.stages !== "unbounded") globalThis.clearInterval(timer);
  }, 35);
  own(() => globalThis.clearInterval(timer));
}

function renderAnimation(entry, card, own) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "1450px");
  card.dataset.pattern = model.feature;
  const box = fixtureDocument.createElement("div"); box.className = "animated"; card.append(box, markerGrid(35));
  box.dataset.mechanism = model.mechanism;
  if (model.mechanism === "css-animation") { box.style.animationName = model.animation; if (model.delay) box.style.animationDelay = model.delay; }
  if (model.pseudo) box.classList.add("animated-pseudo");
  if (model.mechanism === "scroll-timeline") box.style.animationTimeline = "scroll()";
  if (model.mechanism === "css-transition") {
    box.style.transitionProperty = model.property;
    const frame = fixtureWindow.requestAnimationFrame(() => { if (model.property === "height") box.style.height = "420px"; else box.style.backgroundColor = "#147d64"; });
    own(() => fixtureWindow.cancelAnimationFrame(frame));
  }
  if (model.mechanism === "waapi" && box.animate) {
    const animation = box.animate([{ transform: "translateY(0)" }, { transform: "translateY(300px)" }], { duration: 900, iterations: Infinity });
    own(() => animation.cancel());
  }
}

function renderMedia(entry, card, own) {
  const model = caseModel(entry);
  card.classList.add("tall"); card.style.setProperty("--case-height", "1500px");
  card.dataset.pattern = model.feature;
  const canvas = fixtureDocument.createElement("canvas"); canvas.width = 480; canvas.height = 270; canvas.className = "media-canvas";
  const context = canvas.getContext("2d"); let frame = 0;
  const draw = () => { context.fillStyle = `hsl(${frame % 360} 70% 55%)`; context.fillRect(0, 0, 480, 270); context.fillStyle = "white"; context.font = "32px monospace"; context.fillText(`frame ${frame}`, 30, 140); frame += 3; };
  draw(); const timer = globalThis.setInterval(draw, 80); own(() => globalThis.clearInterval(timer));
  // canvas-video demonstrates the raw generated source with native controls visible; playing-video
  // hides that source so only the resulting playing video is shown — two genuinely different
  // capture-relevant presentations of the same canvas-backed stream, not one case relabelled.
  if (model.hideCanvas) canvas.style.display = "none";
  card.append(canvas);
  let policyOutput = null;
  if (model.state === "observe-policy") {
    // This fixture cannot force a browser's autoplay policy decision. Record what actually
    // happened instead of asserting a specific outcome.
    policyOutput = fixtureDocument.createElement("output"); policyOutput.className = "policy-observation";
    policyOutput.textContent = "Policy-dependent playback observation: pending";
    card.append(policyOutput);
  }
  if (canvas.captureStream) {
    const count = model.count ?? 1;
    for (let index = 0; index < count; index += 1) {
    const video = fixtureDocument.createElement("video"); video.playsInline = true; video.srcObject = canvas.captureStream(12); card.append(video);
    video.muted = model.muted ?? true; video.loop = model.loop ?? false;
    if (model.controls) video.controls = true;
    if (model.volume !== undefined) video.volume = model.volume;
    if (model.playbackRate) video.playbackRate = model.playbackRate;
    if (model.poster) video.poster = generatedSvg("poster", 280);
    if (model.state === "playing" || model.state === "observe-policy") {
      const attempt = Promise.resolve(video.play());
      if (policyOutput) {
        attempt.then(
          () => { policyOutput.textContent = "Policy-dependent playback observation: played"; },
          (error) => { policyOutput.textContent = `Policy-dependent playback observation: blocked (${error?.message ?? "rejected"})`; }
        );
      } else attempt.catch(() => {});
    }
    if (model.removeAfter) { const removal = globalThis.setTimeout(() => video.remove(), model.removeAfter); own(() => globalThis.clearTimeout(removal)); }
    own(() => { video.pause(); for (const track of video.srcObject?.getTracks() ?? []) track.stop(); video.srcObject = null; });
    }
  }
  card.append(markerGrid(25, entry.fixture.ordinal));
}

function renderScroller(entry, card, own) {
  const model = caseModel(entry);
  const scroller = fixtureDocument.createElement("section"); scroller.className = "scroller";
  card.dataset.pattern = model.feature;
  if (model.dominant === false) scroller.classList.add("small-scroller");
  if (model.direction) scroller.dir = model.direction;
  if (model.transform) scroller.style.transform = model.transform;
  if (model.borderWidth) scroller.style.borderWidth = model.borderWidth;
  if (model.box) { scroller.style.width = model.box.width; scroller.style.height = model.box.height; }
  if (model.cardPadding) card.style.padding = model.cardPadding;
  if (model.padding) scroller.style.padding = model.padding;
  const content = markerGrid(70, entry.fixture.ordinal); content.classList.add("scroller-content"); content.style.width = model.extent.width; content.style.height = model.extent.height;
  scroller.append(content); card.append(scroller);
  if (model.count === 2) { const clone = scroller.cloneNode(true); card.append(clone); }
  if (model.virtualization) {
    let start = 0;
    const virtualize = () => { start += 10; content.replaceChildren(...Array.from({ length: 20 }, (_, index) => { const row = fixtureDocument.createElement("div"); row.textContent = `virtual row ${start + index}`; return row; })); };
    scroller.addEventListener("scroll", virtualize); own(() => scroller.removeEventListener("scroll", virtualize)); virtualize();
  }
}

function renderBoundaries(entry, card) {
  const model = caseModel(entry);
  card.classList.add("tall", "wide"); card.dataset.pattern = model.feature; card.dataset.requiredScale = model.requiredScale;
  card.style.setProperty("--case-height", model.geometry.height); card.style.setProperty("--case-width", model.geometry.width);
  const requirement = fixtureDocument.createElement("p"); requirement.className = "scale-requirement"; requirement.textContent = `Required browser scale: ${model.requiredScale}`; card.append(requirement);
  const grid = markerGrid(80, entry.fixture.ordinal); grid.style.setProperty("--seam-size", model.seam); card.append(grid);
}

const renderers = {
  "document-geometry": renderGeometry,
  "horizontal-overflow-rtl": renderHorizontal,
  "fixed-overlays": renderOverlay,
  "sticky-elements": renderSticky,
  "lazy-images": renderLazy,
  "finite-dynamic-layout": renderDynamic,
  "animation-transitions": renderAnimation,
  "video-media": renderMedia,
  "dominant-nested-scrollers": renderScroller,
  "output-scale-part-boundaries": renderBoundaries
};

export function renderCase(entry, card, own = () => {}) {
  const renderer = renderers[entry.fixture.kind];
  if (!renderer) throw new Error(`No renderer for ${entry.id}`);
  renderer(entry, card, own);
  return card;
}

function initialize() {
  const controller = createFixtureResetController({
    document: fixtureDocument,
    window: fixtureWindow,
    stage,
    selector,
    identity,
    readiness,
    cases: compatibilityCases,
    createCard: baseCase,
    render: renderCase,
    waitForReady: (entry, own) => new Promise((resolve) => {
      const timer = globalThis.setTimeout(resolve, 340);
      own(() => { globalThis.clearTimeout(timer); resolve(); });
    })
  });
  for (const entry of compatibilityCases) {
    const option = fixtureDocument.createElement("option"); option.value = entry.id; option.textContent = `${entry.category} — ${entry.name}`; selector.append(option);
  }
  selector.addEventListener("change", () => { controller.reset(selector.value).catch((error) => { readiness.textContent = error.message; }); });
  fixtureWindow.addEventListener("pagehide", () => { controller.dispose().catch((error) => { readiness.textContent = error.message; }); }, { once: true });
  fixtureWindow.pageStitchFixture = Object.freeze({ reset: controller.reset, cases: compatibilityCases });

  const requested = new fixtureWindow.URL(fixtureWindow.location.href).searchParams.get("case");
  controller.reset(compatibilityCases.some((entry) => entry.id === requested) ? requested : compatibilityCases[0].id).catch((error) => { readiness.textContent = error.message; });
}

if (selector && identity && readiness && stage && fixtureWindow) initialize();
