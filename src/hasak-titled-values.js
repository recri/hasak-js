//
// hasak-titled-values - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-titled-values
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

import './hasak-value.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

// list of values with titles

export class HasakTitledValues extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      .body { display: flex; flex-flow: column; }
      .value { display: flex; flex-flow: row nowrap; }
    `;
  }

/*
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
*/
  render() {
    // console.log(`hasak-titled-values ${this.keys} ${this.device.name}`);
    return html`
      <div class="body">
	<sl-divider></sl-divider>
	${this.keys.map(
          key =>
            html`<div class="value">
              <hasak-value key="${key}" .device=${this.device}></hasak-value>
	      <sl-divider vertical></sl-divider>
	      <span>${this.device.getTitle(key)}</span>
            </div>`
        )}
      </div>
    `;
  }
}

customElements.define('hasak-titled-values', HasakTitledValues);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
