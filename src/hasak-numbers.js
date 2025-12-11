//
// hasak-numbers - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-numbers
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

import './hasak-number.js';

// block of numbers with labels and units

export class HasakNumbers extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      div.body {
      }
      div.flexrow {
        width: 95%;
        margins: auto;
        display: flex;
        flex-flow: wrap;
        justify-content: space-evenly;
      }
    `;
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.keys.forEach(key =>
      this.device.nrpnListen(this.device.getValue(key), this.itemListener),
    );
    this.device.nrpn_query_list(this.keys);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.keys.forEach(key =>
      this.device.nrpnUnlisten(this.device.getValue(key), this.itemListener),
    );
  }

  render() {
    // console.log(`hasak-numbers ${this.keys} ${this.device.name}`);
    return html`
      <div class="body flexrow">
	${this.keys.map(
          key =>
            html`<div class="value">
              <hasak-number key="${key}" .device=${this.device}></hasak-number>
            </div>`,
        )}
      </div>
    `;
  }
}

customElements.define('hasak-numbers', HasakNumbers);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
