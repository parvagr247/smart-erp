export const PointerBlocker = {
  active: false,
  isProgrammatic: false,

  blockEvent(e) {
    if (!PointerBlocker.active) return;
    if (PointerBlocker.isProgrammatic) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },

  init(shouldBlock) {
    this.active = shouldBlock;
    const eventsToBlock = [
      'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave',
      'pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'wheel', 'contextmenu',
      'dragstart', 'dragover', 'drop', 'touchstart', 'touchmove', 'touchend', 'touchcancel',
      'gesturestart', 'gesturechange', 'gestureend'
    ];

    eventsToBlock.forEach(eventType => {
      window.removeEventListener(eventType, this.blockEvent, { capture: true });
      if (shouldBlock) {
        window.addEventListener(eventType, this.blockEvent, { capture: true, passive: false });
      }
    });

    const body = document.body;
    if (shouldBlock) {
      body.classList.add('keyboard-only-active');
    } else {
      body.classList.remove('keyboard-only-active');
    }
  },

  destroy() {
    this.active = false;
    this.init(false);
  }
};
