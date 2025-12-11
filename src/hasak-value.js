//
// hasak-value - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-value
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
      device: { type: Object },
      key: { type: String },
    };
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    const nrpn = this.device.props[this.key].value;
    this.device.nrpnQuery(nrpn);
    this.device.nrpnListen(nrpn, this.itemListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const nrpn = this.device.props[this.key].value;
    this.device.nrpnListen(nrpn, this.itemListener());
  }

  static get styles() {
    return css``;
  }

  render() {
    const { key } = this; 
    if ( ! key ) { console.log("hasak-value no key"); return html``; }
    const props = this.device.props[key];
    if ( ! props ) { console.log(`hasak-value no props for ${key}`); return html``; }
    const { value, title } = this.device.props[this.key];
    const nrpn = value;
    if ( ! nrpn ) { console.log(`hasak-value no value for ${key}`); return html``; }
    let nrpnValue = this.device.nrpnGet(nrpn);
    /* eslint-disable no-bitwise */
    if (key === 'NRPN_ID_CODEC') nrpnValue &= 0x3fff;
    /* eslint-enable no-bitwise */
    // console.log(`hasak-value ${this.device.name} key=${key} nrpn=${value} title=${title} value=${nrpnValue}`);
    return html`<div class="value" title="${title}">${nrpnValue}</div>`;
  }
}

customElements.define('hasak-value', HasakValue);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
