import {
  property,
  subclass
} from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";

@subclass("ShareItem")
class ShareItem extends Accessor {
  @property() id: string = null;

  @property() name: string = null;

  @property() iconName: string = null;

  @property() urlTemplate: string = null;
}

export default ShareItem;
