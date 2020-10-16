import React, { Component, createRef } from "react";

import { connect } from "react-redux";

import ApplicationBase from "../../ApplicationBase/ApplicationBase";

import { createMapFromItem } from "../../ApplicationBase/support/itemUtils";

import MapView from "@arcgis/core/views/MapView";

interface ViewProps {
  base: ApplicationBase;
}

interface ViewState {
  mapDiv: HTMLDivElement;
}

const CSS = {
  base: "esri-map-series__view"
};

class View extends Component<ViewProps, ViewState> {
  mapDiv = createRef() as React.RefObject<HTMLDivElement>;

  componentDidMount() {
    this.createView();
  }

  render() {
    return <div className={CSS.base} ref={this.mapDiv} />;
  }

  async createView(): Promise<__esri.MapView> {
    const portalItem: __esri.PortalItem = this.props.base.results
      .applicationItem.value;

    const appProxies = portalItem?.applicationProxies
      ? portalItem.applicationProxies
      : null;

    const { webMapItems } = this.props.base.results;

    let item = null;

    webMapItems.forEach(response => {
      item = response.value;
    });

    const map = await createMapFromItem({ item, appProxies });

    const view = new MapView({
      container: this.mapDiv.current,
      map
    });

    return view;
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps, null)(View);
