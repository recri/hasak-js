//
// hasak-selects - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-selects
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

import './hasak-select.js';

// block of labelled selects

export class HasakSelects extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      keys: { type: Array },
    };
  }

  static get styles() {
    return css`
      div.body {
        display: grid;
        column-gap: 10px;
      }
      div.label,
      div.units {
        font-size: smaller;
        text-align: center;
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

  labels() {
    return this.keys.map(
      key =>
        html`<div class="label" title="${this.device.getTitle(key)}">
          ${this.device.getLabel(key)}
        </div>`,
    );
  }

  selects() {
    return this.keys.map(
      key =>
        html`<div class="value">
          <hasak-select key="${key}" .device=${this.device}></hasak-select>
        </div>`,
    );
  }

  render() {
    // console.log(`hasak-selects ${this.keys} ${this.device.name}`);
    return html`
      <style>
        div.body { grid-template-areas: "${[
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
        ]
          .slice(0, this.keys.length)
          .join(' ')}";
      </style>
      <div class="body">${this.labels()} ${this.selects()}</div>
    `;
  }
}

customElements.define('hasak-selects', HasakSelects);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
