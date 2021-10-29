import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Point from "@arcgis/core/geometry/Point";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";

import esriRequest from "@arcgis/core/request";

import { substitute } from "@arcgis/core/intl";

import Collection from "@arcgis/core/core/Collection";

import Share_t9n from "../../t9n/Share/resources.json";

import ShareItem from "./Share/ShareItem";
import ShareFeatures from "./Share/ShareFeatures";

import "./Share/css/Share.scss";

import { useMessages } from "../../hooks/useMessages";
import { mapSelector } from "../../redux/reducers/map";
import { useIsMounted } from "../../hooks/useIsMounted";

const projection = require("@arcgis/core/geometry/projection") as __esri.projection;

const SHORTEN_API = "https://arcg.is/prod/shorten";

const CSS = {
  base: "esri-share",
  closeButton: "esri-share__close-button",
  shareContent: "esri-share__share-content",
  shareButton: "esri-share__share-button",

  shareIframe: {
    iframeContainer: "esri-share__iframe-container",
    iframeTabSectionContainer: "esri-share__iframe-tab-section-container",
    iframeInputContainer: "esri-share__iframe-input-container",
    iframePreview: "esri-share__iframe-preview",
    iframeInput: "esri-share__iframe-input"
  },
  header: {
    heading: "esri-share__heading"
  },
  main: {
    mainHeader: "esri-share__main-header",
    mainHR: "esri-share__hr",
    mainCopy: {
      copyContainer: "esri-share__copy-container",
      copyClipboardContainer: "esri-share__copy-clipboard-container"
    },
    mainUrl: {
      inputGroup: "esri-share__copy-url-group",
      urlInput: "esri-share__url-input",
      linkGenerating: "esri-share--link-generating"
    },
    mainShare: {
      shareContainer: "esri-share__share-container",
      shareItemContainer: "esri-share__share-item-container",
      shareIcons: {
        facebook: "icon-social-facebook",
        twitter: "icon-social-twitter",
        email: "icon-social-contact",
        linkedin: "icon-social-linkedin",
        pinterest: "icon-social-pinterest",
        rss: "icon-social-rss"
      }
    }
  },
  icons: {
    widgetIcon: "esri-icon-share",
    copy: "esri-share__copy-icon",
    svgIcon: "esri-share__svg-icon",
    facebook: "esri-share__facebook-icon",
    twitter: "esri-share__twitter-icon",
    linkedIn: "esri-share__linked-in-icon",
    mail: "esri-share__mail-icon"
  },
  shareIcon: "esri-share__share-icon"
};

const FACEBOOK_ITEM = new ShareItem({
  id: "facebook",
  name: "Facebook",
  urlTemplate: "https://facebook.com/sharer/sharer.php?s=100&u={url}"
});
const TWITTER_ITEM = new ShareItem({
  id: "twitter",
  name: "Twitter",
  urlTemplate: "https://twitter.com/intent/tweet?text={title}&url={url}"
});
const LINKEDIN_ITEM = new ShareItem({
  id: "linkedin",
  name: "LinkedIn",
  urlTemplate: "https://linkedin.com/sharing/share-offsite/?url={url}&title={title}"
});
const EMAIL_ITEM = new ShareItem({
  id: "email",
  name: "E-mail",
  urlTemplate: "mailto:?subject={title}&body={summary}%20{url}"
});

interface ShareProps {
  theme?: "light" | "dark";
  view: __esri.MapView | __esri.SceneView;
}

const Share: FC<ShareProps> = ({ theme, view }): ReactElement => {
  const { portalItem } = useSelector(mapSelector);
  const isMounted = useIsMounted();
  const [shareUrl, setShareUrl] = useState<string>(null);
  const urlInputNode = useRef<HTMLInputElement>(null);
  const iframeInputNode = useRef<HTMLInputElement>(null);
  const messages: typeof Share_t9n = useMessages("Share");
  const shareItems = useRef<__esri.Collection<ShareItem>>(
    new Collection([FACEBOOK_ITEM, TWITTER_ITEM, LINKEDIN_ITEM, EMAIL_ITEM])
  );
  const shareFeatures = useRef<ShareFeatures>(
    new ShareFeatures({
      embedMap: false
    })
  );

  useEffect(() => {
    function generateShareUrlParams(point: __esri.Point): string {
      const { href } = window.location;
      const { longitude, latitude } = point;
      if (longitude === undefined || latitude === undefined) {
        return href;
      }
      const roundedLon = roundValue(longitude);
      const roundedLat = roundValue(latitude);
      const { type, zoom } = view;
      const roundedZoom = roundValue(zoom);
      const path = href.split("center")[0];
      // If no "?", then append "?". Otherwise, check for "?" and "="
      const sep = path.indexOf("?") === -1 ? "?" : path.indexOf("?") !== -1 && path.indexOf("=") !== -1 ? "&" : "";
      const shareParams = `${path}${sep}center=${roundedLon},${roundedLat}&level=${roundedZoom}`;
      // Checks if view.type is 3D, if so add, 3D url parameters
      if (type === "3d") {
        const { camera } = view as __esri.SceneView;
        const { heading, fov, tilt } = camera;
        const roundedHeading = roundValue(heading);
        const roundedFov = roundValue(fov);
        const roundedTilt = roundValue(tilt);
        return `${shareParams}&heading=${roundedHeading}&fov=${roundedFov}&tilt=${roundedTilt}`;
      }

      // Otherwise, just return original url parameters for 2D
      return shareParams;
    }
    async function generateShareUrl(): Promise<string> {
      const { href } = window.location;
      // If view is not ready
      if (!view?.ready) {
        return href;
      }
      // Use x/y values and the spatial reference of the view to instantiate a geometry point
      const { x, y } = view.center;
      const { spatialReference } = view;
      const centerPoint = new Point({
        x,
        y,
        spatialReference
      });
      // Use pointToConvert to project point. Once projected, pass point to generate the share URL parameters
      const point = await processPoint(centerPoint);
      return generateShareUrlParams(point);
    }
    async function generateUrl(): Promise<string> {
      const { href } = window.location;
      const url = await generateShareUrl();
      const { shortenLink } = shareFeatures.current;
      if (shortenLink) {
        const shortenedUrl = await shorten(url);
        return shortenedUrl;
      }

      return href;
      // return url;
    }
    async function createShareUrl(): Promise<void> {
      setShareUrl(await generateUrl());
    }
    if (isMounted) {
      createShareUrl();
    }
  }, [view, isMounted]);

  function renderShareContent() {
    const contentNode = renderContent();
    return <>{contentNode}</>;
  }

  function renderContent() {
    const sendALinkContentNode = renderSendALinkContent();
    const embedMapContentNode = renderEmbedMapContent();
    const embedMap = shareFeatures.current?.embedMap;
    return embedMap ? (
      <calcite-tabs theme={theme}>
        <calcite-tab-nav slot="tab-nav">
          <calcite-tab-title active>{messages?.sendLink}</calcite-tab-title>
          <calcite-tab-title>{messages?.embedMap}</calcite-tab-title>
        </calcite-tab-nav>
        <calcite-tab active>{sendALinkContentNode}</calcite-tab>
        <calcite-tab>{embedMapContentNode}</calcite-tab>
      </calcite-tabs>
    ) : (
      sendALinkContentNode
    );
  }

  function renderShareItem(shareItem: ShareItem) {
    const name = shareItem?.name;
    const iconName = shareItem?.iconName;
    return (
      <button
        key={name}
        onClick={(e) => {
          processShareItem(e);
        }}
        className={`${CSS.shareIcon} ${iconName}`}
        title={name}
        aria-label={name}
        data-share-item={name}
      >
        {shareItem.id === "facebook"
          ? renderFacebookIcon()
          : shareItem.id === "twitter"
          ? renderTwitterIcon()
          : shareItem.id === "linkedin"
          ? renderLinkedInIcon()
          : shareItem.id === "email"
          ? renderMailIcon()
          : null}
      </button>
    );
  }

  function renderShareItems() {
    if (!shareItems) {
      return;
    }

    const { shareIcons } = CSS.main.mainShare;
    // Assign class names of icons to share item
    shareItems.current.forEach((shareItem: ShareItem) => {
      for (const icon in shareIcons) {
        if (icon === shareItem.id) {
          shareItem.iconName = shareIcons[shareItem.id];
        }
      }
    });

    return shareItems.current.toArray().map((shareItem) => renderShareItem(shareItem));
  }

  function renderShareItemContainer() {
    const { shareServices } = shareFeatures.current;
    const shareItemNodes = shareServices && shareItems.current?.length > 0 ? renderShareItems() : null;

    return shareServices ? (
      <div className={CSS.main.mainShare.shareContainer} key="share-container">
        <span className={CSS.main.mainHeader}>{messages?.subHeading}</span>
        <div className={CSS.main.mainShare.shareItemContainer}>{shareItemNodes}</div>
      </div>
    ) : null;
  }

  function renderCopyUrl() {
    const { copyToClipboard } = shareFeatures.current;
    return copyToClipboard ? (
      <div className={CSS.main.mainCopy.copyContainer} key="copy-container">
        <div className={CSS.main.mainUrl.inputGroup}>
          <span className={CSS.main.mainHeader}>{messages?.clipboard}</span>
          <div className={CSS.main.mainCopy.copyClipboardContainer}>
            <calcite-button
              onClick={() => {
                copyUrlInput();
              }}
              onkeydown={() => {
                copyUrlInput();
              }}
              title={messages?.clipboard}
            >
              <calcite-icon scale="s" icon="copy" />
            </calcite-button>
            <input
              type="text"
              className={CSS.main.mainUrl.urlInput}
              value={shareUrl ? shareUrl : ""}
              ref={urlInputNode}
              readOnly
            />
          </div>
        </div>
      </div>
    ) : null;
  }

  function renderSendALinkContent() {
    const copyUrlNode = renderCopyUrl();
    const shareServicesNode = renderShareItemContainer();
    const { copyToClipboard, shareServices } = shareFeatures.current;
    return (
      <div>
        {shareServicesNode}
        {!copyToClipboard || !shareServices ? null : <hr className={CSS.main.mainHR} />}
        {copyUrlNode}
      </div>
    );
  }

  function renderCopyIframe() {
    const embedCode = getEmbedCode();
    return (
      <div className={CSS.shareIframe.iframeInputContainer}>
        <calcite-button
          onClick={(e) => {
            copyIframeInput();
          }}
          onkeydown={(e) => {
            copyIframeInput();
          }}
          title={messages?.clipboard}
        >
          <calcite-icon icon="copy" />
        </calcite-button>
        <input
          className={CSS.shareIframe.iframeInput}
          type="text"
          tabIndex={0}
          value={embedCode}
          ref={iframeInputNode}
          readOnly
        />
      </div>
    );
  }

  function renderEmbedMapContent() {
    const { embedMap } = shareFeatures.current;
    const copyIframeCodeNode = renderCopyIframe();

    return embedMap ? (
      <div key="iframe-tab-section-container" className={CSS.shareIframe.iframeTabSectionContainer}>
        <h2 className={CSS.main.mainHeader}>{messages?.clipboard}</h2>
        {copyIframeCodeNode}
        <div className={CSS.shareIframe.iframeContainer}>
          {embedMap ? (
            <iframe
              className={CSS.shareIframe.iframePreview}
              src={shareUrl ? shareUrl : ""}
              tabIndex={-1}
              scrolling="no"
              title={messages?.iframeTitle}
            />
          ) : null}
        </div>
      </div>
    ) : null;
  }

  function renderFacebookIcon() {
    return (
      <svg className={`${CSS.icons.facebook} ${CSS.icons.svgIcon}`}>
        <path
          d="M2.2,0.5C1.6,0.5,1,1.1,1,1.8v20.5c0,0.7,0.6,1.3,1.3,1.3H13v-10h-3v-3h3V8.1
	c0.3-3,2.1-4.6,4.8-4.6C19,3.5,21,3.6,21,3.6v2.9h-2.4C17.1,6.7,17,8.4,17,8.4v2.1h3.3l-0.4,3H17v10h5.7c0.7,0,1.3-0.6,1.3-1.3V1.8
	c0-0.7-0.6-1.3-1.3-1.3L2.2,0.5L2.2,0.5z"
        />
      </svg>
    );
  }

  function renderTwitterIcon() {
    return (
      <svg className={`${CSS.icons.twitter} ${CSS.icons.svgIcon}`}>
        <path
          d="M24,4.3c-0.8,0.4-1.8,0.7-2.7,0.8c1-0.6,1.7-1.6,2.1-2.8c-0.9,0.6-1.9,1-3,1.2
	c-0.9-1-2.1-1.6-3.4-1.6c-2.6,0-4.7,2.3-4.7,5c0,0.4,0,0.8,0.1,1.2C8.4,7.9,4.9,5.9,2.6,2.8C2.2,3.6,2,4.5,2,5.4
	c0,1.8,0.8,3.3,2.1,4.2C3.3,9.6,2.6,9.3,1.9,9c0,0,0,0,0,0.1c0,2.4,1.6,4.5,3.8,5c-0.4,0.1-0.8,0.2-1.2,0.2c-0.3,0-0.6,0-0.9-0.1
	c0.6,2,2.3,3.5,4.4,3.5c-1.6,1.4-3.7,2.2-5.9,2.2c-0.4,0-0.8,0-1.1-0.1c2.1,1.4,4.6,2.3,7.2,2.3c8.7,0,13.4-7.7,13.4-14.4
	c0-0.2,0-0.4,0-0.7C22.6,6.2,23.4,5.3,24,4.3"
        />
      </svg>
    );
  }

  function renderLinkedInIcon() {
    return (
      <svg className={`${CSS.icons.linkedIn} ${CSS.icons.svgIcon}`}>
        <path
          d="M2.7,0.5C1.8,0.5,1,1.2,1,2.1v19.7c0,0.9,0.8,1.6,1.7,1.6h19.6c0.9,0,1.7-0.7,1.7-1.6V2.1
	c0-0.9-0.8-1.6-1.7-1.6H2.7z M6.2,3.9c1.2,0,1.9,0.8,1.9,1.8c0,1-0.8,1.8-2,1.8h0C5,7.5,4.3,6.7,4.3,5.7C4.3,4.7,5,3.9,6.2,3.9
	L6.2,3.9z M16.1,9.3c2.2,0,3.9,1.4,3.9,4.5v5.7h-3v-5.6c0-1.4-0.5-2.4-1.9-2.4c-1.1,0-1.7,0.7-2,1.3C13,13,13,13.4,13,13.7v5.8H9.6
	c0,0,0-9.1,0-10H13v1.4C13.5,10.2,14.3,9.3,16.1,9.3L16.1,9.3z M13,10.5C13,10.5,13,10.5,13,10.5L13,10.5L13,10.5z M5,9.5h3v10H5
	V8.9V9.5z"
        />
      </svg>
    );
  }

  function renderMailIcon() {
    const fill = theme === "dark" ? { fill: "#ffffff" } : {};
    return (
      <svg style={fill} className={`${CSS.icons.mail} ${CSS.icons.svgIcon}`}>
        <path
          d="M14.8,11.7l9.1-7.3C24,4.7,24,4.9,24,5.1v14.6c0,0.3-0.1,0.6-0.3,0.9L14.8,11.7z M12,12.8l11.3-9.1
	c-0.3-0.2-0.6-0.3-0.9-0.3H1.6c-0.3,0-0.6,0.1-0.9,0.3L12,12.8z M14.1,12.4L12,14.1l-2.1-1.7l-8.9,8.9c0.2,0.1,0.4,0.1,0.6,0.1h20.9
	c0.2,0,0.4,0,0.6-0.1L14.1,12.4z M0.1,4.5C0.1,4.7,0,4.9,0,5.1v14.6c0,0.3,0.1,0.6,0.3,0.9l8.9-8.9L0.1,4.5z"
        />
      </svg>
    );
  }

  async function processPoint(point: __esri.Point): Promise<__esri.Point> {
    const { isWGS84, isWebMercator } = point.spatialReference;
    // If spatial reference is WGS84 or Web Mercator, use longitude/latitude values to generate the share URL parameters
    if (isWGS84 || isWebMercator) {
      return point;
    }
    // Check if client side projection is not supported
    if (!projection.isSupported()) {
      const point = new Point({
        x: null,
        y: null
      });
      return point;
    }
    const outputSpatialReference = new SpatialReference({
      wkid: 4326
    });
    await projection.load();
    const projectedPoint = projection.project(point, outputSpatialReference) as __esri.Point;
    return projectedPoint;
  }

  async function shorten(url: string): Promise<string> {
    const request = await esriRequest(SHORTEN_API, {
      query: {
        longUrl: url,
        f: "json"
      }
    });

    const shortUrl = request.data && request.data.data && request.data.data.url;
    if (shortUrl) {
      return shortUrl;
    }
  }

  function roundValue(val: number): number {
    return parseFloat(val.toFixed(4));
  }

  function getEmbedCode(): string {
    return `<iframe src="${shareUrl}" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>`;
  }

  function copyUrlInput(): void {
    urlInputNode.current.focus();
    urlInputNode.current.setSelectionRange(0, urlInputNode.current.value.length);
    document.execCommand("copy");
  }

  function copyIframeInput(): void {
    iframeInputNode.current.focus();
    iframeInputNode.current.setSelectionRange(0, iframeInputNode.current.value.length);
    document.execCommand("copy");
  }

  function processShareItem(event): void {
    const node = event.currentTarget as HTMLElement;
    const shareItemName = node.getAttribute("data-share-item");

    const shareItem = shareItems.current.find((shareItem) => shareItem.name === shareItemName);

    const urlTemplate = shareItem?.urlTemplate;
    const title = portalItem ? substitute(messages?.urlTitle, { title: portalItem.title }) : null;
    const summary = portalItem
      ? substitute(messages?.urlSummary, {
          summary: portalItem.snippet
        })
      : null;
    openUrl(shareUrl, title, summary, urlTemplate);
  }

  function openUrl(url: string, title: string, summary: string, urlTemplate: string): void {
    const urlToOpen = substitute(urlTemplate, {
      url,
      title,
      summary
    });
    window.open(urlToOpen);
  }

  function closeShare(): void {
    const popover = document.getElementById("share-calcite-popup") as HTMLCalcitePopoverElement;
    if (popover) {
      popover.toggle();
    }
  }

  return (
    <div className={CSS.base} aria-labelledby="shareContent">
      <calcite-action class={CSS.closeButton} icon="x" scale="s" onClick={() => closeShare()}></calcite-action>
      {renderShareContent()}
    </div>
  );
};

export default Share;
