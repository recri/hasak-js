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
    const nrpn = this.props.value;
    this.device.nrpnQuery(nrpn);
    this.device.nrpnListen(nrpn, this.itemListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.device.nrpnListen(this.props.value, this.itemListener);
  }

  onChange(e) {
    // console.log(`onChange e.target.checked = ${e.target.checked}`);
    this.device.nrpnSet(this.props.value, e.target.checked ? 1 : 0);
  }

  static get styles() {
    return css``;
  }

  render() {
    // console.log(`hasak-switch[${this.device.name}, ${this.key}, ${this.props}]`);
    // const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-switch ${key} ${value} ${label} ${title} ${nrpnValue}`);
    return html`
      <div title="${title}">
        <sl-switch @sl-change=${this.onChange} ?checked=${nrpnValue !== 0}>
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
