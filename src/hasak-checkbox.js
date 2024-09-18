import { LitElement, html, css } from 'lit';

export class HasakCheckbox extends LitElement {
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

  onChange() {
    // console.log(`onChange e.target.checked = ${e.target.checked}`);
    this.device.nrpnSet(this.props.value, e.target.checked ? 1 : 0);
  }

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    return html`
      <div class="body" title="${title}">
        <input
          name="${key}"
          type="checkbox"
          @change="${this.onChange}"
          ?checked=${nrpnValue !== 0}
        />
        <label for="${key}">${label}</label>
      </div>
    `;
  }
}

customElements.define('hasak-checkbox', HasakCheckbox);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
/*
 */
