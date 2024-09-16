import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';

export class HasakSelect extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      key: { type: String },
    };
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.device.nrpnListen(
      this.device.props[this.key].value,
      this.itemListener,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.device.nrpnUnlisten(
      this.device.props[this.key].value,
      this.itemListener(),
    );
  }

  onInput(e) {
    const nrpn = this.device.props[this.key].value;
    const valueKey = e.target.select.value;
    const { value } = this.device.props[valueKey];
    console.log(`onInput e.target.select.value = ${valueKey}`);
    this.device.nrpnSet(nrpn, value);
  }

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this;
    const { value, title, values } = this.device.props[key]; // , label
    const opts = this.device.props[values].split();
    const nrpnValue = this.device.nrpnGet(value);
    console.log(`hasak-select ${key} ${opts}`);
    return html`
      <div class="body" title="${title}">
        <sl-select value="${nrpnValue}">
          ${opts.map(
            opt => html`
              <sl-option value="${this.device.props[opt].value}"
                >${this.device.props[opt].label}</sl-option
              >
            `,
          )}
        </sl-select>
      </div>
    `;
  }
}

customElements.define('hasak-select', HasakSelect);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
