import {
  property,
  subclass
} from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";

@subclass("ShareFeatures")
class ShareFeatures extends Accessor {
  // constructor(value?: unknown) {
  //   super(value);
  // }

  @property({ value: true })
  set copyToClipboard(value: boolean) {
    if (!this.shareServices) {
      console.error(
        "ERROR: Unable to toggle both Share Item AND Copy URL features off."
      );
      return;
    }
    this._set("copyToClipboard", value);
  }

  @property({ value: true })
  set shareServices(value: boolean) {
    if (!this.copyToClipboard) {
      console.error(
        "ERROR: Unable to toggle both Share Item AND Copy URL features off."
      );
      return;
    }
    this._set("shareServices", value);
  }

  @property() embedMap = true;

  @property() shortenLink = false;
}

export default ShareFeatures;
