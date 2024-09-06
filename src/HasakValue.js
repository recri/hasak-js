//
// hasak-js - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
//
// MIT License
//
// Copyright (c) 2022 hasak-js
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

import { LitElement, html, css } from 'lit';

export class HasakValue extends LitElement {

  static get properties() {
    return {
      view: { type: Object },	// the parent view, which provides style
      key: { type: String }, 	// the device property key
      prop: { type: Object }, // the device property value
      type: { type: String },	// note, ctrl, or nrpn, or other
      tindex: { type: Number }, // note, ctrl, or nrpn number
      value: { type: Number }	// the value displayed
    };
  }

  static get styles() {
    return css`
`;
  }

  // I'm not sure this one is necessary
  connectedCallback() {
    super.connectedCallback()
    if (this.key && this.prop) {
      this.type = this.prop.type;
      this.tindex = this.prop.value;
    }
    // console.log(`HasakValue() ${this.type}[${this.tindex}] as ${this.view.view}`);
    // console.log(`HasakValue ${this.type}[${this.tindex}] calling back to HasakView[${this.view.view}] to name ourself`);
    this.view.valueCallback(this.type, this.tindex, this);
    // console.log(`HasakValue ${this.type}[${this.tindex}] installing listener for our value`);
    switch (this.type) {
    case 'note': this.view.device.noteListen(this.tindex, (tag, index,) => { this.value = this.view.device.noteGet(index) }); break;
    case 'ctrl': this.view.device.ctrlListen(this.tindex, (tag, index,) => { this.value = this.view.device.ctrlGet(index) }); break;
    case 'nrpn': this.view.device.nrpnListen(this.tindex, (tag, index,) => { this.value = this.view.device.nrpnGet(index) }); break;
    default: break;
    }
  }

  render() {
    return html`
	${this.type && this.tindex ? 
	  html`<span class="raw ${this.type} value"> ${this.tindex}:${this.value}; </span>` :
	  html``}
	`;
  }
}

