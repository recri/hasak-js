//
// hasak-js - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
//
// MIT License
//
// Copyright (c) 2022 hasak-js
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

//
// map notes, nrpns, and other control change messages
// maintain a state map for the device such that current note,
// nrpn, and control change values can be retrieved
//
import { LitElement, html, css } from 'lit';

import "./hasak-view.js"

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CTRL_CHANGE = 0xB0;

const DATA_MSB = 6;
const DATA_LSB = 38;
const NRPN_LSB = 98;
const NRPN_MSB = 99;

const NRPN_ID_DEVICE = 1;
const NRPN_ID_VERSION = 2;
const NRPN_STRING_START = 3;
const NRPN_STRING_END = 4;
const NRPN_STRING_BYTE = 5;

const ENDP_JSON_TO_HOST = 0;

const VAL_HASAK_ID_DEVICE = 0xad5;
// const VAL_CWKEYER_ID_DEVICE = 0x50F;
const VAL_HASAK1_ID_VERSION = 100;
const VAL_HASAK2_ID_VERSION = 110;

export class HasakDevice extends LitElement {

  //
  // bulk of LitElement implementation and constructor at end
  //
  
  //
  // on midi message from and to our device
  //

  onmidimessage(msg) {
    // console.log(`onmidimessage(${msg[0]}, ${msg[1]}, ${msg[2]})`)
    const [cmd,msg1,msg2] = msg
    /* eslint-disable no-bitwise */
    const chan = 1+(cmd&0xF)
    if ( ! this.channels[chan]) this.channels[chan] = 0;
    this.channels[chan] += 1;
    this.channel = chan;
    switch (cmd & 0xf0) {
    /* eslint-enable no-bitwise */
    case NOTE_ON: {
      const note = msg1;
      const velocity = msg2;
      const oldvelocity = this.notes[note]
      this.notes[note] = velocity;
      this.noteInvokeListeners('note', note, oldvelocity);
      break;
    }
    case NOTE_OFF: {
      const note = msg1;
      // const velocity = msg2;
      const oldvelocity = this.notes[note]
      this.notes[note] = 0; 
      this.noteInvokeListeners('note', note, oldvelocity);
      break;
    }
    case CTRL_CHANGE: { 
      // notify first, then set
      const ctrl = msg1;
      const data = msg2;
      const olddata = this.ctrls[ctrl]
      this.ctrlInvokeListeners('ctrl', ctrl, olddata)
      this.ctrls[ctrl] = data;
      if (ctrl === DATA_LSB) {
	/* eslint-disable no-bitwise */
	const nrpn = (this.ctrls[NRPN_MSB]<<7) | this.ctrls[NRPN_LSB]
	const nrpnData = (this.ctrls[DATA_MSB]<<7) | (this.ctrls[DATA_LSB]); 
	const oldNrpnData = this.nrpns[nrpn];
	/* eslint-enable no-bitwise */
	this.nrpns[nrpn] = nrpnData;
	this.nrpnInvokeListeners('nrpn', nrpn, oldNrpnData);
      }
      break;
    }
    default:
      console.log(`HasakDevice: uncaught message ${msg[0]} ${msg[1]} ${msg[2]}}`);
      break;
    }
  }

  sendmidi(data) { 
    // console.log(`sendmidi([${data[0]}, ${data[1]}, ${data[2]}])`);
    this.midi.sendmidi(this.name, data); 
  }

  //
  // add listeners to midi
  //

  noteListen(index, listener) { 
    if ( ! this.noteListeners[index]) this.noteListeners[index] = [];
    this.noteListeners[index].push(listener);
  }

  ctrlListen(index, listener) {
    if ( ! this.ctrlListeners[index]) this.ctrlListeners[index] = [];
    this.ctrlListeners[index].push(listener);
  }

  nrpnListen(index, listener) {
    if ( ! this.nrpnListeners[index]) this.nrpnListeners[index] = [];
    this.nrpnListeners[index].push(listener);
  }
  
  //
  // invoke listeners
  //
  
  noteInvokeListeners(tag, index, oldval) { 
    ['*', index].forEach(i => this.noteListeners[i] && this.noteListeners[i].forEach(f => f(tag, index, oldval)))
  }

  ctrlInvokeListeners(tag, index, oldval) { 
    ['*', index].forEach(i => this.ctrlListeners[i] && this.ctrlListeners[i].forEach(f => f(tag, index, oldval)))
  }

  nrpnInvokeListeners(tag, index, oldval) { 
    ['*', index].forEach(i => this.nrpnListeners[i] && this.nrpnListeners[i].forEach(f => f(tag, index, oldval)))
  }

  //
  // get current values
  //

  noteGet(note) { return this.notes[note]; }
  
  ctrlGet(ctrl) { return this.ctrls[ctrl]; }

  nrpnGet(nrpn) { return this.nrpns[nrpn]; }

  //
  // set current values, delegated to device, which echoes back the true current values
  //

  /* eslint-disable no-bitwise */
  noteSet(note, velocity) { this.sendmidi([NOTE_ON|(this.channel-1), note&127, velocity&127]); }

  ctrlSet(ctrl, data) { this.sendmidi([CTRL_CHANGE|(this.channel-1), ctrl&127, data&127]); }

  nrpnSet(nrpn, value) { 
    this.ctrlSet(NRPN_MSB, (nrpn>>7));
    this.ctrlSet(NRPN_LSB, nrpn);
    this.ctrlSet(DATA_MSB, (value>>7));
    this.ctrlSet(DATA_LSB, value);
  }
  /* eslint-enable no-bitwise */
  
  /*
  ** device management implementation
  ** when we open a device we try to get a JSON string
  */
  deviceListener(tag, index, oldval) {
    console.log(`deviceListener(${tag}, ${index}, ${oldval})`);
    switch (tag) {
    case 'note':
      break;
    case 'ctrl':
      break;
    case 'nrpn':
      switch(index) {
      case NRPN_ID_DEVICE: 
	console.log(`ID_DEVICE === ${this.nrpnGet(NRPN_ID_DEVICE)}`);
	break;
      case NRPN_ID_VERSION: 
	console.log(`ID_VERSION === ${this.nrpnGet(NRPN_ID_VERSION)}`);
	if (this.nrpnGet(NRPN_ID_DEVICE) === VAL_HASAK_ID_DEVICE) {
	  if (this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK2_ID_VERSION) {
	    if ( ! this.request_json) {
	      this.request_json = true;
	      console.log("requesting JSON string");
	      /* eslint-disable no-bitwise */
	      this.nrpnSet(NRPN_STRING_START, ENDP_JSON_TO_HOST<<9);
	      /* eslint-enable no-bitwise */
	      // console.log('sending NRPN_STRING_START, ENDP_JSON_TO_HOST<<9');
	      this.string = [];
	    } else {
	      console.log('avoided extra NRPN_ID_JSON');
	    }
	  } else if (this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK1_ID_VERSION) {
	    // pull props from canned image
	    console.log("fetching local copy of properties");
	  } else {
	    // don't know what this means
	    console.log("what?");
	  }
	}
	break;
      case NRPN_STRING_START:
	console.log(`STRING_START === ${this.nrpnGet(NRPN_STRING_START)}`);
	this.startTime = performance.now()
	this.startDate = new Date();
	if (this.nrpnGet(NRPN_STRING_START) === 0) {
	  break;
	}
	break;
      case NRPN_STRING_BYTE: {
	const byte = this.nrpnGet(NRPN_STRING_BYTE);
	// console.log(`byte ${byte} total ${this.string.length}`);
	/* eslint-disable no-bitwise */
	this.string.push(String.fromCharCode(byte&255));
	/* eslint-enable no-bitwise */
	// this.nrpnSet(NRPN_STRING_BYTE, 1);
	if (byte <= 127) break;
	console.log(`STRING_BYTE === ${byte}???`);
	break;
      }
      case NRPN_STRING_END: {
	console.log(`STRING_END === ${this.nrpnGet(NRPN_STRING_END)}`);
	this.endTime = performance.now();
	this.endDate = new Date();
	const dTime = this.endTime-this.startTime;
	const dDate = this.endDate-this.startDate;
	const cpsTime = this.string.length / (dTime / 1e3);
	const cpsDate = this.string.length / ((dDate) / 1e3);
	console.log(`received ${this.string.length} bytes at ${cpsTime} or ${cpsDate} chars/second`);
	if (this.nrpnGet(NRPN_STRING_END) === 0) {
	  break;
	}
	this.properties = JSON.parse(this.string.join(''));
	break;
      }
      default:
	console.log(`deviceListener(${tag}, ${index}, ${oldval}`);
	break;
      }
      break;
    default:
      console.log(`deviceListener(${tag}, ${index}, ${oldval}`);
      break;
    }
  }

  /*
  ** LitElement implementation
  ** with a few ties back into the class details
  */
  static get properties() {
    return {
      name: { type: String },
      midi: { type: Object },
      views: { type: Array },
      properties: { type: Object}
    };
  }
  
  static get styles() {
    return css``;
  }

  viewCallback(name, view) {
    this.views[name] = view;
  }

  connectedCallback() {
    super.connectedCallback()
    this.midi.deviceCallback(this.name, this);
    this.noteListen('*', (type,tindex,oldvalue) => this.deviceListener(type,tindex,oldvalue));
    this.ctrlListen('*', (type,tindex,oldvalue) => this.deviceListener(type,tindex,oldvalue));
    this.nrpnListen('*', (type,tindex,oldvalue) => this.deviceListener(type,tindex,oldvalue));
  }
  
  constructor() {
    super();
    this.channels = {};
    this.channel = 10;
    this.notes = {};		// note state map
    this.ctrls = {};		// control change state map
    this.nrpns = {};		// nrpn state map
    this.allNoteListeners = [];
    this.allCtrlListeners = [];
    this.allNrpnListeners = [];
    this.noteListeners = {};
    this.ctrlListeners = {};
    this.nrpnListeners = {};
    this.views = {raw: null, json: null, complete: null, min: null };
  }

  render() {
    return html`
	<hasak-view .device=${this} view="raw"></hasak-view>
	<hasak-view .device=${this} view="json"></hasak-view>
	<hasak-view .device=${this} view="complete"></hasak-view>
	<hasak-view .device=${this} view="min"></hasak-view>
    `;
  }
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
