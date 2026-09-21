export function createFixtureResetController({
  document, window, stage, selector, identity, readiness, cases, createCard, render, waitForReady
}) {
  let generation = 0;
  let cleanups = [];

  async function dispose() {
    const errors = [];
    for (const cleanup of cleanups.splice(0)) {
      try { await cleanup(); } catch (error) { errors.push(error); }
    }
    for (const media of stage.querySelectorAll("video, audio")) {
      try { media.pause(); } catch (error) { errors.push(error); }
    }
    if (errors.length === 1) throw errors[0];
    if (errors.length > 1) throw new AggregateError(errors, "Fixture cleanup failed.");
  }

  async function reset(id) {
    const entry = cases.find((candidate) => candidate.id === id);
    if (!entry) throw new Error(`Unknown compatibility case: ${id}`);
    const ownGeneration = ++generation;
    document.documentElement.dataset.fixtureReady = "false";
    readiness.dataset.ready = "false"; readiness.textContent = "Resetting";
    await dispose();
    if (ownGeneration !== generation) return;
    stage.replaceChildren(); window.scrollTo(0, 0);
    cleanups = [];
    const own = (cleanup) => cleanups.unshift(cleanup);

    try {
      const card = createCard(entry);
      stage.append(card);
      render(entry, card, own);
      await waitForReady(entry, own);
      if (ownGeneration !== generation) return;
      selector.value = entry.id;
      identity.value = `${entry.id} · ${entry.expectedOutcome}`;
      window.history.replaceState(null, "", `?case=${encodeURIComponent(entry.id)}`);
      document.documentElement.dataset.fixtureCase = entry.id;
      document.documentElement.dataset.fixtureReady = "true";
      readiness.dataset.ready = "true"; readiness.textContent = "Ready";
    } catch (error) {
      try { await dispose(); } catch { /* preserve the original actionable failure */ }
      stage.replaceChildren();
      readiness.dataset.ready = "false"; readiness.textContent = error.message;
      document.documentElement.dataset.fixtureReady = "false";
      throw error;
    }
  }

  return { dispose, reset };
}
