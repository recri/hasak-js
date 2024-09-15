import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';

export class HasakSlCheckbox extends LitElement {
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
    this.device.nrpnListen(this.props.value, this.itemListener);
  }

  onChange(e) {
    console.log(`onChange e.target.input.value = ${e.target.input.value}`);
    this.device.nrpnSet(this.props.value, e.target.input.value);
  }

  static get styles() {
    return css``;
  }

  render() {
    console.log(`hasak-checkbox[${this.device.name}, ${this.key}]`);
    const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    console.log(`hasak-number ${key} ${value} ${label} ${title} ${nrpnValue}`);
    return html`
	  <div>
            <sl-checkbox
              @change=${this.onChange}
	      ${nrpnValue ? 'checked' : ''}
            >
	      ${label}
	    </sl-switch>
	  </div>
	`;
  }
}

customElements.define('hasak-sl-checkbox', HasakSlCheckbox);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
