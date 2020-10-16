import React, { Component } from "react";

interface ModalProps {}

interface ModalState {
  open: boolean;
}

class Modal extends Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      open: true
    };
  }

  render() {
    return (
      <calcite-modal aria-labelledby="modal-title" active={this.state.open}>
        <h3 slot="header" id="modal-title">
          Welcome!
        </h3>
        <div slot="content">
          This ArcGIS Online Instant App example is built with the following:
          <ul>
            <li>React with TypeScript</li>
            <li>Redux</li>
            <li>ArcGIS Core (ArcGIS API for JavaScript ES modules)</li>
            <li>
              Calcite Components (Shared Web Components for Esri's Calcite
              design framework)
            </li>
            <li>
              Esri's Application Base (Boilerplate code for ArcGIS Online
              Templates and Instant Apps)
            </li>
          </ul>
        </div>
        <calcite-button
          onClick={() => this.closeModal()}
          slot="primary"
          width="full"
        >
          Enter
        </calcite-button>
      </calcite-modal>
    );
  }

  closeModal(): void {
    this.setState({ open: false });
  }
}

export default Modal;
