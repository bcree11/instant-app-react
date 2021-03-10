import {
  registerMessageBundleLoader,
  onLocaleChange,
  createJSONLoader,
  fetchMessageBundle
} from "@arcgis/core/intl";

export function registerLoader(pattern, base) {
  registerMessageBundleLoader(
    createJSONLoader({
      pattern,
      base,
      location: new URL("./", window.location.href)
    })
  );
}
export const autoUpdatedStrings: Set<{
  obj: any;
  property: string;
  bundleName: string;
  key: string;
}> = new Set();
onLocaleChange(() => {
  const bundleNames = Array.from(autoUpdatedStrings, item => item.bundleName);
  const bundleMap: { [bundleName: string]: any } = {};

  Promise.all(
    bundleNames.map(bundleName =>
      fetchMessageBundle(bundleName).then(messages => {
        bundleMap[bundleName] = messages;
      })
    )
  ).then(() => {
    autoUpdatedStrings.forEach(val => {
      const { obj, property, bundleName, key } = val;
      obj[property] = getPathValue(`${bundleName}.${key}`, bundleMap);
    });
  });
});
export function autoUpdateString(
  obj: any,
  property: string,
  bundleName: string,
  key: string
): { remove(): void } {
  const autoUpdatedString = { obj, property, bundleName, key };
  fetchMessageBundle(bundleName).then(messages => {
    if (autoUpdatedStrings.has(autoUpdatedString)) {
      obj[property] = messages[key];
    }
  });
  return {
    remove(): void {
      autoUpdatedStrings.delete(autoUpdatedString);
    }
  };
}
function getPathValue(str, obj) {
  return str.split(".").reduce((o, i) => o[i], obj);
}

export function getMessageBundlePath(componentName: string): string {
  const { hostname } = window.location;
  return hostname === "localhost" || hostname === "127.0.0.1"
    ? `${process.env.PUBLIC_URL}/assets/${componentName}/resources`
    : `${process.env.PUBLIC_URL}/${componentName}/resources`;
}
