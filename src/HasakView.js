import { LitElement, html, css } from 'lit';

import './hasak-value.js'
import './hasak-json.js'

export class HasakView extends LitElement {

  static get properties() {
    return {
      device: { type: Object },	// parent device
      props: { type: Object}, // property description object
      view: { type: String },	// raw, complete, ...
      values: { type: Object },	// child values
      nNotes: { type: Number },	// number of notes
      nCtrls: { type: Number },	// number of controls
      nNrpns: { type: Number },	// number of nrpns
      jsonEntries: { type: Array },
      minEntries: { type: Array },
      completeEntries: { type: Array }
    };
  }

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
    this.values = { note: {}, ctrl: {}, nrpn: {} };
    this.props = null;
  }
  
  connectedCallback() {
    super.connectedCallback()
    // console.log(`HasakView[${this.view}] calling back to HasakDevice[${this.device.name}] to name ourself`);
    this.device.viewCallback(this.view, this);
  }
  
  valueCallback(type, tindex, value) {
    // console.log(`valueCallback(${type}, ${tindex}, ${value})`);
    this.values[type][tindex] = value;
  }

  get props() {
    return this._props;
  }
  
  set props(p) {
    this._props = p;
    this.nNotes = 128;
    this.nCtrls = 120;
    this.nNrpns = 300;
    this.jsonEntries = [];
    this.completeEntries = [];
    this.minEntries = [];
    if (p) {
      this.nNotes = p.KYR_N_NOTES;
      this.nCtrls = p.KYR_N_CTRLS;
      this.nNrpns = p.KYR_N_NRPNS;
      this.jsonEntries = Object.entries(p);
      this.completeEntries = this.jsonEntries
	.filter((k,v) => v.type === 'note' ||v.type === 'ctrl' || v.type === 'nrpn');
      if (p.VAL_MIN_INTERFACE && p.VAL_MIN_INTERFACE.value)
	this.minEntries = this.completeEntries
	.filter((k,) => p.VAL_MIN_INTERFACE.value.includes(k))
      else
	this.minEntries = this.completeEntries
      this.requestUpdate('props');
    }
  }

  render() {
    // console.log(`HasakView[${this.device.name},${this.view}] in render with props ${this.props}`);
    switch(this.view) {
    case 'raw': {
      return html`
	<div class="raw view">
	  <div class="view heading">Raw view</div>
	  <div class="view subheading">Notes</div>
	  ${[...Array(this.nNotes).keys()].map(note => html`<hasak-value .view=${this} type="note" tindex="${note}"></hasak-value>`)}
	  <div class="view subheading">Ctrls</div>
	  ${[...Array(this.nCtrls).keys()].map(ctrl => html`<hasak-value .view=${this} type="ctrl" tindex="${ctrl}"></hasak-value>`)}
	  <div class="view subheading">Nrpns</div>
	  ${[...Array(this.nNrpns).keys()].map(nrpn => html`<hasak-value .view=${this} type="nrpn" tindex="${nrpn}"></hasak-value>`)}
	</div>`;
    }
    case 'min':
      return html`
	${ ! this.minEntries ? html`` :
	  html`
	    <div class="min view">
	      <div class="view heading">Min View</div>
	      ${this.minEntries.forEach((key,value) => html`<hasak-value .view=${this} .property=${value} key="${key}"></hasak-value>`)}
	    </div>
	  `}`;
    case 'json': 
      return html`
        ${ ! this.jsonEntries ? html`` :
	  html`
	    <div class="json view">
	      <div class="view heading">Json View</div>
	      ${this.jsonEntries.forEach((key,value) => html`<hasak-value .view=${this} .property=${value} key="${key}"></hasak-value>`)}
	    </div>
	  `}`;
    case 'complete': 
      return html`
        ${ ! this.completeEntries ? html`` :
	  html`
	    <div class="complete view">
	      <div class="view heading">Complete View</div>
	      ${this.completeEntries.forEach((key,value) => html`<hasak-value .view=${this} .property=${value} key="${key}"></hasak-value>`)}
	    </div>
	  `}`;
    default:
      return html``;
    }
  }
}

