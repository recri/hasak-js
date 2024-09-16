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
        display: grid;
        column-gap: 10px;
      }
      div.label,
      div.units {
        font-size: smaller;
        text-align: center;
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

  labels() {
    return this.keys.map(
      key =>
        html`<div class="label" title="${this.device.getTitle(key)}">
          ${this.device.getLabel(key)}
        </div>`,
    );
  }

  values() {
    return this.keys.map(
      key =>
        html`<div class="value">
          <hasak-number key="${key}" .device=${this.device}></hasak-number>
        </div>`,
    );
  }

  units() {
    return this.keys.map(
      key => html`<div class="units">${this.device.getUnit(key)}</div>`,
    );
  }

  render() {
    // console.log(`hasak-numbers ${this.keys} ${this.device.name}`);
    return html`
      <style>
        div.body { grid-template-areas: "${[
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
        ]
          .slice(0, this.keys.length)
          .join(' ')}";
      </style>
      <div class="body">${this.labels()} ${this.values()} ${this.units()}</div>
    `;
  }
}

customElements.define('hasak-numbers', HasakNumbers);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
