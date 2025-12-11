
//
// hasak-json - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-json
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

export class HasakJson extends LitElement {
  static get properties() {
    return {
      view: { type: Object }, // the parent view, which provides style
      property: { type: Object }, // the device property value
      key: { type: String }, // the device property key
    };
  }

  static get styles() {
    return css``;
  }

  render() {
    return html`<span class="json value"
      >${this.key}
      ${Object.entries(this.property)
        .map((k, v) => html`${k}: ${v}`)
        .join(', ')}</span
    >`;
  }
}

customElements.define('hasak-json', HasakJson);
