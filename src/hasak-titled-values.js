import { LitElement, html, css } from 'lit';

import './hasak-value.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

// list of values with titles

export class HasakTitledValues extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      .body { display: flex; flex-flow: column; }
      .value { display: flex; flex-flow: row nowrap; }
    `;
  }

/*
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
*/
  render() {
    // console.log(`hasak-titled-values ${this.keys} ${this.device.name}`);
    return html`
      <div class="body">
	<sl-divider></sl-divider>
	${this.keys.map(
          key =>
            html`<div class="value">
              <hasak-value key="${key}" .device=${this.device}></hasak-value>
	      <sl-divider vertical></sl-divider>
	      <span>${this.device.getTitle(key)}</span>
            </div>`
        )}
      </div>
    `;
  }
}

customElements.define('hasak-titled-values', HasakTitledValues);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
