import { LitElement, html, css } from 'lit';

export class HasakValue extends LitElement {

  static get properties() {
    return {
      view: { type: Object },	// the parent view, which provides style
      key: { type: String }, 	// the device property key
      property: { type: Object }, // the device property value
      type: { type: String },	// note, ctrl, or nrpn, or other
      tindex: { type: Number }, // note, ctrl, or nrpn number
      value: { type: Number }	// the value displayed
    };
  }

  static get styles() {
    return css`
`;
  }

  constructor() {
    super();
    if (this.key && this.property) {
      this.type = this.property.type;
      this.tindex = this.property.value;
    }
  }
  
  // I'm not sure this one is necessary
  connectedCallback() {
    super.connectedCallback()
    // console.log(`${this.name} calling back to ${this.midi} to name ourself as ${this}`);
    this.view.valueCallback(this.type, this.tindex, this);
    switch (this.type) {
    case 'note': this.view.device.noteListen(this.tindex, (tag, index,) => { this.value = this.view.device.noteGet(index) }); break;
    case 'ctrl': this.view.device.ctrlListen(this.tindex, (tag, index,) => { this.value = this.view.device.noteGet(index) }); break;
    case 'nrpn': this.view.device.nrpnListen(this.tindex, (tag, index,) => { this.value = this.view.device.noteGet(index) }); break;
    default: break;
    }
  }

  render() {
    return html`<div class="raw ${this.type} value">${this.type}[${this.tindex}] = ${this.value}</div>`;
  }
}

