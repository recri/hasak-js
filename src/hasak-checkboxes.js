import { LitElement, html, css } from 'lit';

import './hasak-checkbox.js';

// list of checkboxes

export class HasakCheckboxes extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css``;
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
              <hasak-checkbox
                key="${key}"
                .device=${this.device}
              ></hasak-checkbox>
            </div>
          `,
        )}
      </div>
    `;
  }
}

customElements.define('hasak-checkboxes', HasakCheckboxes);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
