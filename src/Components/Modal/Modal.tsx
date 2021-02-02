import React, { Component } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import ModalT9n from "../../t9n/Modal/resources.json";

interface ModalProps {}

interface ModalState {
  open: boolean;
  messages: typeof ModalT9n;
}

class Modal extends Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      open: true,
      messages: null
    };
  }

  async componentDidMount() {
    const messages = await fetchMessageBundle(
      `${process.env.PUBLIC_URL}/assets/Modal/resources`
    );
    this.setState({
      messages
    });
  }

  render() {
    const messages = this.state?.messages;
    return (
      <calcite-modal aria-labelledby="modal-title" active={this.state.open}>
        <h3 slot="header" id="modal-title">
          {messages?.welcome}
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
          {messages?.enter}
        </calcite-button>
      </calcite-modal>
    );
  }

  closeModal(): void {
    this.setState({ open: false });
  }
}

export default Modal;
