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
    this.device.nrpn_query(this.key);
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
    return css`
      sl-select {
        width: 75%;
        margin: auto;
      }
    `;
  }

  render() {
    const { key } = this;
    // console.log(`hasak-select key ${key}`);
    const { value, title, values } = this.device.props[key]; // , label
    // console.log(`hasak-select value ${value} title ${title} values ${values}`);
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-select nrpnValue ${nrpnValue}`);
    const { opts } = this.device.props[values];
    // console.log(`hasak-select opts ${opts}`);
    // console.log(`hasak-select ${key} ${opts}`);
    return html`
      <div class="body" title="${title}">
        <sl-select hoist name="${key}" value="${nrpnValue}">
          ${opts
            .split(' ')
            .map(
              opt => html`
                <sl-option hoist value="${this.device.props[opt].value}"
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
