export function updateJSAPIStyles(theme: "light" | "dark"): void {
  const jsapiStyles = document.getElementById("jsapiStyles") as HTMLLinkElement;
  jsapiStyles.href = `${process.env.PUBLIC_URL}/assets/esri/themes/${theme}/main.css`;
}

export function setLocalStorage(key: string, value: unknown): void {
  const { localStorage } = window;
  localStorage.setItem(key, JSON.stringify(value));
}

export function handlePaneHeight(header: boolean, headerEl: HTMLDivElement): void {
  const instantAppContainer = document.getElementById("instant-app-container");
  if (instantAppContainer) {
    if (header && headerEl) {
      instantAppContainer.style.height = `calc(100% - ${headerEl.clientHeight}px)`;
    } else {
      instantAppContainer.style.height = "100%";
    }
  }
}