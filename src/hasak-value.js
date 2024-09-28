import { LitElement, html, css } from 'lit';

export class HasakValue extends LitElement {
  static get properties() {
    return {
      device: { type: Object },
      key: { type: String },
    };
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    const nrpn = this.device.props[this.key].value;
    this.device.nrpnQuery(nrpn);
    this.device.nrpnListen(nrpn, this.itemListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const nrpn = this.device.props[this.key].value;
    this.device.nrpnListen(nrpn, this.itemListener());
  }

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this; 
    if ( ! key ) { console.log("hasak-value no key"); return html``; }
    const props = this.device.props[key];
    if ( ! props ) { console.log(`hasak-value no props for ${key}`); return html``; }
    const { value, title } = this.device.props[this.key];
    const nrpn = value;
    if ( ! nrpn ) { console.log(`hasak-value no value for ${key}`); return html``; }
    let nrpnValue = this.device.nrpnGet(nrpn);
    /* eslint-disable no-bitwise */
    if (key === 'NRPN_ID_CODEC') nrpnValue &= 0x3fff;
    /* eslint-enable no-bitwise */
    // console.log(`hasak-value ${this.device.name} key=${key} nrpn=${value} title=${title} value=${nrpnValue}`);
    return html`<div class="value" title="${title}">${nrpnValue}</div>`;
  }
}

customElements.define('hasak-value', HasakValue);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
