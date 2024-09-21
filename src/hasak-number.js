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

  targetOnInput(target) {
    this.device.nrpnSet(this.props.value, target.input.value);
  }

  onInput(e) {
    console.log(`onInput e.target.input.value = ${e.target.input.value}`);
    this.targetOnInput(e.target);
  }

  // need to know the dom node for sl-input to apply these two.
  stepDown() {
    const node = this.renderRoot.querySelector('sl-input');
    node.stepDown();
    this.targetOnInput(node);
  }

  stepUp() {
    const node = this.renderRoot.querySelector('sl-input');
    node.stepUp();
    this.targetOnInput(node);
  }

  static get styles() {
    return css`
      div.number {
	display: flex;
	flex-direction: column;
	align-items: center;
      }
      div.value {
	display: flex;
	justify-content: center;
	font-size: larger;
      }
      div.label, div.unit {
	font-size: smaller;
      }
      sl-input {
        width: 4em;
      }
      sl-input::part(input) {
        text-align: center;
      }
    `;
  }

  render() {
    const { key } = this;
    const { value, title, range, label, unit } = this.props;
    const [min, max] = range ? range.split(' ') : [undefined, undefined];
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-number ${this.device.name} key=${key} nrpn=${value} label=${label} title=${title} range=${range} unit=${unit} value=${nrpnValue} min=${min} max=${max}`);
    return html`
      <div class="number" title="${title}">
	<div class="label">
	  ${label}
	</div>
	<div class="value">
          <sl-input
            type="number"
            name="${key}"
            title="${title}"
            value="${nrpnValue}"
            min="${min}"
            max="${max}"
            @sl-input="${this.onInput}">
	</div>
	<div class="unit">
	  ${unit}
	</div>
      </div>
    `;
  }
}

/*
  	    no-spin-buttons

	      <sl-icon-button 
	        class="down" 
	        name="arrow-down"
	        @click=${this.stepDown}>
	      </sl-icon-button>
	  </sl-input>
	      <sl-icon-button
	        class="up"
	        name="arrow-up"
	        @click=${this.stepUp}>
	      </sl-icon-button>

        <div class="value">
      <div class="a">
        <sl-icon-button
          @click=${this.stepDown}
          label="Step down value"
          name="minus"
        ></sl-icon-button>
      </div>
      <div class="b">
        <sl-input
          hoist
          outline
          type="number"
          name="${key}"
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
    </div>

      sl-icon-button {
	display: block-inline;
        font-size: 1em;
	z-index: 1;
      }
      sl-icon-button.up {
	position: relative;
	left: -1.5em;
      }      
      sl-icon-button.down {
	position: relative;
	left: +1.5em;
	z-index: 1;
      }      

*/
customElements.define('hasak-number', HasakNumber);


// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
