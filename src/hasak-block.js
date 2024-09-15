import { LitElement, html, css } from 'lit';

import './hasak-number.js';

export class HasakBlock extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      div.body { display: grid; grid-template-areas: "a b c d"; column-gap: 10px; }
      div.label,div.units { font-size: smaller; text-align: center; }
    `;
  }

  render() {
    const { keys } = this;
    return html`
      <div class="body">
        ${keys.map(key => html`<div class="label" title="${this.device.getTitle(key)}"> ${this.device.getLabel(key)} </div>`)}
        ${keys.map(key => html`<div class="value"> <hasak-number key="${key}" .device=${this.device}></hasak-value></div>`)}
        ${keys.map(key => html`<div class="units"> ${this.getUnit(key)} </div>`)}
      </div>
      `;
  }
}

customElements.define('hasak-block', HasakBlock);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
