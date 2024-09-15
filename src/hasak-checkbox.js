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

  onChange(e) {
    this.device.nrpnSet(
      this.props.value,
      this.device.nrpnGet(this.props.value) === 0 ? 1 : 0
    );
  }

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    return html`
      <div>
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
