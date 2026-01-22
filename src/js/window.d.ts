// global.d.ts  (or window.d.ts)
export {};

declare global {
  interface Window {
    toggleDetails: (btn: HTMLButtonElement) => void;
  }
}
