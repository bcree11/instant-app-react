import React, { Component } from "react";

import { connect } from "react-redux";

import { ApplicationConfig } from "../../ApplicationBase/interfaces";

import "./Header.scss";

interface HeaderProps {
  title: string;
  config: ApplicationConfig;
  setTitle: (title: string) => void;
}

const CSS = {
  base: "esri-map-series__header"
};

class Header extends Component<HeaderProps, null> {
  componentDidMount() {
    const title = "Instant Apps: React with TypeScript";
    this.props.setTitle(title);
  }

  render() {
    return <header className={CSS.base}>{this.props.title}</header>;
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(
  dispatch
): {
  setTitle: (title: string) => void;
} {
  return {
    setTitle: (title: string) => {
      dispatch({ type: "SET_TITLE", payload: title });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
