// jsdom has no ResizeObserver. React Flow and some Cloudscape components
// observe their container size; a no-op observer is enough to mount them.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = NoopResizeObserver as unknown as typeof ResizeObserver;
}
