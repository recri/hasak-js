import { LitElement, html, css } from 'lit';

import './hasak-switch.js';

// list of switches, chef's choice layout

export class HasakSwitches extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      div.body {
        width: 90%;
        margin: auto;
        display: flex;
        flex-flow: row wrap;
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
    // console.log(`hasak-checkboxes ${this.keys.length} items ${this.device.name}`);

    return html`
      <div class="body">
        ${this.keys.map(
          key => html`
            <div class="checkbox">
              <hasak-switch key="${key}" .device=${this.device}></hasak-switch>
            </div>
          `,
        )}
      </div>
    `;
  }
}

customElements.define('hasak-switches', HasakSwitches);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
