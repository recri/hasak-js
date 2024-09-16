import { LitElement, html, css } from 'lit';

export class HasakValue extends LitElement {
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

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this;
    const { value, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    console.log(
      `hasak-value ${this.device.name} key=${key} nrpn=${value} title=${title} value=${nrpnValue}`,
    );
    return html` <div class="value" title="${title}">${nrpnValue}</div> `;
  }
}

customElements.define('hasak-value', HasakValue);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
