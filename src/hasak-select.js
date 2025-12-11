//
// hasak-select - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-select
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

import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';

export class HasakSelect extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      key: { type: String },
    };
  }

  itemListener = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.device.nrpn_query(this.key);
    this.device.nrpnListen(
      this.device.props[this.key].value,
      this.itemListener,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.device.nrpnUnlisten(
      this.device.props[this.key].value,
      this.itemListener(),
    );
  }

  onInput(e) {
    this.device.nrpnSet(this.device.props[this.key].value, e.target.value);
  }

  static get styles() {
    return css`
      sl-select {
        width: 75%;
        margin: auto;
      }
    `;
  }

  render() {
    const { key } = this;
    // console.log(`hasak-select key ${key}`);
    const { value, title, values } = this.device.props[key]; // , label
    // console.log(`hasak-select value ${value} title ${title} values ${values}`);
    const nrpnValue = this.device.nrpnGet(value);
    // console.log(`hasak-select nrpnValue ${nrpnValue}`);
    const { opts } = this.device.props[values];
    // console.log(`hasak-select opts ${opts}`);
    // console.log(`hasak-select ${key} ${opts}`);
    return html`
      <div class="body" title="${title}">
        <sl-select
          hoist
          name="${key}"
          value="${nrpnValue}"
	  size="small"
          @sl-input=${this.onInput}
        >
          ${opts
            .split(' ')
            .map(
              opt => html`
                <sl-option 
		  hoist
		  value="${this.device.props[opt].value}"
		  size="small">
                    ${this.device.props[opt].label}
		</sl-option>
              `,
            )}
        </sl-select>
      </div>
    `;
  }
}

customElements.define('hasak-select', HasakSelect);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
