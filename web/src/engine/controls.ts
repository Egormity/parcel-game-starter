import type { Direction } from './contracts';

const KEY_DIRECTIONS: Readonly<Record<string, Direction>> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

export class Controls {
  private keyboard = new Set<string>();
  private touch = new Set<Direction>();
  constructor(
    private host: HTMLElement,
    private onPause: () => void,
  ) {
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.loseFocus);
    document.addEventListener('visibilitychange', this.visibility);
    host.addEventListener('focusout', this.focusOut);
  }
  private focused = (): boolean => this.host.contains(document.activeElement);
  private keyDown = (event: KeyboardEvent): void => {
    if (!this.focused()) return;
    if (KEY_DIRECTIONS[event.code]) {
      event.preventDefault();
      this.keyboard.add(event.code);
    } else if (event.code === 'Escape') {
      event.preventDefault();
      this.loseFocus();
    }
  };
  private keyUp = (event: KeyboardEvent): void => {
    this.keyboard.delete(event.code);
  };
  private loseFocus = (): void => {
    this.clear();
    this.onPause();
  };
  private visibility = (): void => {
    if (document.hidden) this.loseFocus();
  };
  private focusOut = (event: FocusEvent): void => {
    if (!(event.relatedTarget instanceof Node) || !this.host.contains(event.relatedTarget))
      this.clear();
  };
  set(direction: Direction, pressed: boolean): void {
    if (pressed) this.touch.add(direction);
    else this.touch.delete(direction);
  }
  vector(): { x: number; y: number } {
    const active = new Set(this.touch);
    for (const key of this.keyboard) active.add(KEY_DIRECTIONS[key]);
    let x = Number(active.has('right')) - Number(active.has('left'));
    let y = Number(active.has('down')) - Number(active.has('up'));
    const length = Math.hypot(x, y);
    if (length > 0) {
      x /= length;
      y /= length;
    }
    return { x, y };
  }
  clear(): void {
    this.keyboard.clear();
    this.touch.clear();
  }
  dispose(): void {
    this.clear();
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('blur', this.loseFocus);
    document.removeEventListener('visibilitychange', this.visibility);
    this.host.removeEventListener('focusout', this.focusOut);
  }
}
