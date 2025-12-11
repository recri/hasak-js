//
// hasak-value-matrix - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
// Copyright (c) 2025 Roger E Critchlow Jr, Las Cruces, NM, USA
//
// MIT License
//
// Copyright (c) 2022, 2025 hasak-value-matrix
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

export class HasakValueMatrix extends LitElement {
  static get properties() {
    return {
      device: { type: Object },
      matrix: { type: Array },
      columns: { type: Array },
      rows: { type: Array },
      xtitle: { type: String },
    };
  }

  static get styles() {
    return css`
      div.matrix {
	display: grid;
	grid-template-columns: repeat(auto-fit, 1fr);
      }
      div.flexrow {
        width: 95%;
        margins: auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
      }
    `;
  }

  render() {
    const {device, matrix, columns, rows, xtitle} = this;
    // const nRows = rows.length;
    const nColumns = columns.length
		       
    const renderKey = (key, rowIndex, columnIndex) =>
	  html`
	    <div style="grid-area: ${2+rowIndex} / ${2+columnIndex} / auto / auto;">
	      <hasak-value .device=${device} key="${key}">
	      </hasak-value>
	    </div>`;
    const renderRow = (row, rowIndex) =>
      html`
	     <div style="grid-area: ${2+rowIndex} / 1 / auto / auto;">
	       ${rows[rowIndex]}
	     </div>
	     ${row.map((key, columnIndex) => renderKey(key, rowIndex, columnIndex))}
	   `;
    const renderColumnLabels = () => 
      html`
	  <div style="grid-area: 1 / 1 / auto / auto">
	    Dst \\ Src
	  </div>
	  ${columns.map((label, columnIndex) => 
	    html`
	      <div style="grid-area: 1 / ${2+columnIndex} / auto / auto">${label}</div>
	    `)}
	</div>`;
    // console.log(`rendering ${xtitle}`);
    return html`
	  <hr/>
          <div>${xtitle}</div>
	  <div class="body matrix" style="grid-template-column: repeat(1+${nColumns}, 1fr);">
	     ${renderColumnLabels()}
	     ${matrix.map((row, rowIndex) => renderRow(row, rowIndex))}
	   </div>
	`;
  }
}

/*
*/

customElements.define('hasak-value-matrix', HasakValueMatrix);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
