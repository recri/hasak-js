//
// hasak-term - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-term
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

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class HasakSwitch extends LitElement {
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
    // console.log(`onChange e.target.checked = ${e.target.checked}`);
    this.device.nrpnSet(this.props.value, e.target.checked ? 1 : 0);
  }

  static get styles() {
    return css``;
  }

  render() {
    // console.log(`hasak-switch[${this.device.name}, ${this.key}, ${this.props}]`);
    // const { key } = this;
    const { value, label, title } = this.props;
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-switch ${key} ${value} ${label} ${title} ${nrpnValue}`);
    return html`
      <div title="${title}">
        <sl-switch @sl-change=${this.onChange} ?checked=${nrpnValue !== 0}>
          ${label}
        </sl-switch>
      </div>
    `;
  }
}

customElements.define('hasak-switch', HasakSwitch);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
