import { LitElement, html, css } from 'lit';

import './hasak-value.js'
import './hasak-json.js'

export class HasakView extends LitElement {

  static get properties() {
    return {
      view: { type: String },	// raw, complete, ...
      device: { type: Object },	// parent device
      values: { type: Array }	// child values
    };
  }

  static get styles() {
    return css`
`;
  }

  constructor() {
    super();
    this.values = { note: {}, ctrl: {}, nrpn: {} };
  }
  
  connectedCallback() {
    super.connectedCallback()
    // console.log(`${this.name} calling back to ${this.midi} to name ourself as ${this}`);
    this.device.viewCallback(this.name, this);
  }
  
  valueCallback(type, tindex, value) {
    // console.log(`valueCallback(${type}, ${tindex}, ${value})`);
    this.values[type][tindex] = value;
  }

  render() {
    switch(this.view) {
    case 'raw': {
      const notes = Array.from(Array(128).keys());
      const ctrls = Array.from(Array(120).keys());
      const nrpns = Array.from(Array(300).keys());
      return html`
	<div class="raw view">
	  ${notes.forEach(note => html`<hasak-value .view=${this} type="note" tindex="${note}"></hasak-value>`)}
	  ${ctrls.forEach(ctrl => html`<hasak-value .view=${this} type="ctrl" tindex="${ctrl}"></hasak-value>`)}
	  ${nrpns.forEach(nrpn => html`<hasak-value .view=${this} type="nrpn" tindex="${nrpn}"></hasak-value>`)}
	</div>`;
    }
    case 'min': 
      return html`
	<div class="min view">
	</div>
      `;
    case 'json': {
      const entries = this.device.properties && 
	    Object.entries(this.device.properties);
      return html`
	<div class="json view">
	  ${entries.forEach((key, value) => html`<hasak-json-value .view=${this} .property=${value} key="${key}"></hasak-json-value>`)}
	</div>
      `;
    }
    case 'complete': {
      const entries = this.device.properties && 
	    Object.entries(this.device.properties)
	    .filter((k,v) => v.type === 'note' ||v.type === 'ctrl' || v.type === 'nrpn')
      return html`
	<div class="complete view">
	  ${entries.forEach((key, value) => html`<hasak-value .view=${this} .property=${value} key="${key}"></hasak-value>`)}
	</div>
      `;
    }
    default:
      return html``;
    }
  }
}

