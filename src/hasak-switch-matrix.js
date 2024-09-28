import { LitElement, html, css } from 'lit';

import './hasak-switch.js';

export class HasakSwitchMatrix extends LitElement {
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
	      <hasak-switch .device=${device} key="${key}">
	      </hasak-switch>
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

customElements.define('hasak-switch-matrix', HasakSwitchMatrix);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
