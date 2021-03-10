export function getDynamicStyleClass(prop: boolean, className: string): string {
  return prop ? className : "";
}

export function getTheme(theme: "light" | "dark"): "light" | "dark" {
  return theme === "light" ? "light" : "dark";
}

export function setLocalStorage(key: string, value: unknown): void {
  const { localStorage } = window;
  localStorage.setItem(key, JSON.stringify(value));
}
