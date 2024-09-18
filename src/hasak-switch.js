import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class HasakSwitch extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      key: { type: String },
    };
  }

  get props() {
    return this.device.props[this.key];
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.device.nrpnListen(this.props.value, this.itemListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.device.nrpnListen(this.props.value, this.itemListener);
  }

  onChange(e) {
    console.log(`onChange e.target.input.value = ${e.target.input.value}`);
    this.device.nrpnSet(this.props.value, e.target.input.value);
  }

  static get styles() {
    return css``;
  }

  render() {
    console.log(
      `hasak-switch[${this.device.name}, ${this.key}, ${this.props}]`,
    );
    const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    console.log(`hasak-number ${key} ${value} ${label} ${title} ${nrpnValue}`);
    return html`
      <div>
        <sl-switch @change=${this.onChange} ${nrpnValue ? 'checked' : ''}>
          ${label}
        </sl-switch>
      </div>
    `;
  }
}

customElements.define('hasak-switch', HasakSwitch);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
