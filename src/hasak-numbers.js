import { LitElement, html, css } from 'lit';

import './hasak-number.js';

// block of numbers with labels and units

export class HasakNumbers extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      div.body {
      }
      div.flexrow {
        width: 95%;
        margins: auto;
        display: flex;
        flex-flow: wrap;
        justify-content: space-evenly;
      }
    `;
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.keys.forEach(key =>
      this.device.nrpnListen(this.device.getValue(key), this.itemListener),
    );
    this.device.nrpn_query_list(this.keys);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.keys.forEach(key =>
      this.device.nrpnUnlisten(this.device.getValue(key), this.itemListener),
    );
  }

  render() {
    // console.log(`hasak-numbers ${this.keys} ${this.device.name}`);
    return html`
      <div class="body flexrow">
	${this.keys.map(
          key =>
            html`<div class="value">
              <hasak-number key="${key}" .device=${this.device}></hasak-number>
            </div>`,
        )}
      </div>
    `;
  }
}

customElements.define('hasak-numbers', HasakNumbers);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
