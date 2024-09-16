/*
 ** Redo this so that the number expands to a number with
 ** adjustment buttons when selected, and bind up/down arrow
 ** with modifier(s) to adjust by multiples of +/- 10
 **
 ** I may need to post the sl-input event myself when calling
 ** .stepUp() and .stepDown()
 */

import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

export class HasakNumber extends LitElement {
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
    this.device.nrpnListen(this.props.value, this.itemListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.device.nrpnListen(this.props.value, this.itemListener());
  }

  onInput(e) {
    console.log(`onInput e.target.input.value = ${e.target.input.value}`);
    this.device.nrpnSet(this.props.value, e.target.input.value);
  }

  // need to know the dom node for sl-input to apply these two.
  stepDown() {
    const node = this.renderRoot.querySelector('sl-input');
    node.stepDown();
  }

  stepUp() {
    const node = this.renderRoot.querySelector('sl-input');
    if (!node) console.log(`this.renderRoot.querySelector('sl-input') failed`);
    else if (!node.stepUp)
      console.log(`found sl-input, but has no stepUp method`);
    else node.stepUp();
  }

  static get styles() {
    return css`
      div.value {
        display: grid;
      }
      sl-input {
        width: 3em;
      }
      sl-input::part(input) {
        text-align: center;
      }
      div.a {
        grid-row: 1;
        grid-column: 1;
      }
      div.b {
        grid-row: 1;
        grid-column: 2;
      }
      div.c {
        grid-row: 1;
        grid-column: 3;
      }
      sl-icon-button {
        font-size: 0.5rem;
      }
    `;
  }

  render() {
    const { key } = this;
    const { value, title, range } = this.props; // , label, unit
    const [min, max] = range ? range.split(' ') : [undefined, undefined];
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-number ${this.device.name} key=${key} nrpn=${value} label=${label} title=${title} range=${range} unit=${unit} value=${nrpnValue} min=${min} max=${max}`);
    switch (key) {
      case 'NRPN_VOLUME':
      case 'NRPN_LEVEL':
      case 'NRPN_TONE':
      case 'NRPN_SPEED':
      default:
        return html` <div class="value">
          <div class="a">
            <sl-icon-button
              @click=${this.stepDown}
              label="Step down value"
              name="minus"
            ></sl-icon-button>
          </div>
          <div class="b">
            <sl-input
              outline
              type="number"
              value="${nrpnValue}"
              min="${min}"
              max="${max}"
              @sl-input="${this.onInput}"
              no-spin-buttons
              title="${title}"
            ></sl-input>
          </div>
          <div class="c">
            <sl-icon-button
              @click=${this.stepUp}
              label="Step up value"
              name="plus"
            ></sl-icon-button>
          </div>
        </div>`;
    }
  }
}

customElements.define('hasak-number', HasakNumber);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
