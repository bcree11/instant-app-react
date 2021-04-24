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

export function getPopupTitle(graphic: __esri.Graphic) {
  let attributes = {};
  for (const [key, value] of Object.entries(graphic.attributes)) {
    attributes = {
      ...attributes,
      [`{${key.toUpperCase()}}`]: value
    };
  }
  const layer = graphic.layer as __esri.FeatureLayer;
  const popupTitle = layer.popupTemplate.title as string;
  return popupTitle.replace(/{\w+}/g, (placeholder: string) => attributes[placeholder.toUpperCase()] || placeholder);
}
