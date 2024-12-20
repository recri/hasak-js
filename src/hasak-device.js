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

import { hasakProperties as hasakProperties100 } from './hasakProperties100.js';
import { hasakProperties110 } from './hasakProperties110.js';

import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

import './hasak-view.js';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CTRL_CHANGE = 0xb0;
const SYS_EX = 0xf0; // system exclusive message
// const SYS_EX_END = 0xF7;

const DATA_MSB = 6;
const DATA_LSB = 38;
const NRPN_LSB = 98;
const NRPN_MSB = 99;

const NRPN_ID_DEVICE = 1;
const NRPN_ID_VERSION = 2;
const NRPN_NRPN_QUERY = 4;
const NRPN_STRING_START = 6;
const NRPN_STRING_END = 7;
const NRPN_STRING_BYTE = 8;

// const ENDP_JSON_TO_HOST = 0;

const VAL_HASAK_ID_DEVICE = 0xad5;
// const VAL_CWKEYER_ID_DEVICE = 0x50F;
const VAL_HASAK1_ID_VERSION = 100;
const VAL_HASAK2_ID_VERSION = 110;

// const SYS_EX_ID = 0x7D;		// system exclusive non-commercial id
// const SYS_EX_HASAK = 'H'	// system exclusive hasak sub id

export class HasakDevice extends LitElement {
  //
  // bulk of LitElement implementation and constructor at end
  //

  //
  // on midi message from and to our device
  //

  onmidimessage(msg) {
    // console.log(`onmidimessage(${msg[0]}, ${msg[1]}, ${msg[2]})`)
    this.counts.midimessage += 1;
    const [cmd] = msg;
    if (cmd === SYS_EX) {
      this.counts.sysex += 1;
      console.log(`SYS_EX ${msg.length} bytes msg[1] = ${msg[1]}, msg[2] = ${msg[2]}`);
    } else {
      const [, msg1, msg2] = msg;
      /* eslint-disable no-bitwise */
      const chan = 1 + (cmd & 0xf);
      this.counts.channels[chan-1] += 1;
      this.channel = chan;
      switch (cmd & 0xf0) {
        /* eslint-enable no-bitwise */
        case NOTE_ON: {
          const note = msg1;
          const velocity = msg2;
          const oldvelocity = this.notes[note];
          this.notes[note] = velocity;
          this.noteInvokeListeners(note, oldvelocity);
	  this.counts.notes[note] += 1;
          break;
        }
        case NOTE_OFF: {
          const note = msg1;
          // const velocity = msg2;
          const oldvelocity = this.notes[note];
          this.notes[note] = 0;
          this.noteInvokeListeners(note, oldvelocity);
	  this.counts.notes[note] += 1;
          break;
        }
        case CTRL_CHANGE: {
          // notify first, then set
          const ctrl = msg1;
          const data = msg2;
          const olddata = this.ctrls[ctrl];
          this.ctrlInvokeListeners(ctrl, olddata);
          this.ctrls[ctrl] = data;
	  this.counts.ctrls[ctrl] += 1;
          if (ctrl === DATA_LSB) {
            /* eslint-disable no-bitwise */
            const nrpn = (this.ctrls[NRPN_MSB] << 7) | this.ctrls[NRPN_LSB];
            const nrpnData =
              (((this.ctrls[DATA_MSB] << 7) | this.ctrls[DATA_LSB]) <<
                (32 - 14)) >>
              (32 - 14); // will this sign extend?
            const oldNrpnData = this.nrpns[nrpn];
            this.nrpns[nrpn] = nrpnData;
            /* eslint-enable no-bitwise */
            this.nrpnInvokeListeners(nrpn, oldNrpnData);
	    if (this.counts.nrpns[nrpn])
	      this.counts.nrpns[nrpn] += 1;
	    else
	      this.counts.nrpns[nrpn] = 1;
          }
          break;
        }
        default:
          console.log(`HasakDevice: uncaught message ${msg[0]} ${msg[1]} ${msg[2]}}`);
          break;
      }
    }
  }

  sendmidi(data) {
    // console.log(`sendmidi([${data[0]}, ${data[1]}, ${data[2]}])`);
    this.midi.sendmidi(this.name, data);
  }

  //
  // add listeners to midi
  // listener must be a function whose value persists
  // not one constructed in the call
  //
  noteListen(index, listener) {
    if (index === '*') this.allNoteListeners.push(listener);
    else if (!this.noteListeners[index]) this.noteListeners[index] = [listener];
    else this.noteListeners[index].push(listener);
  }

  ctrlListen(index, listener) {
    if (index === '*') this.allCtrlListeners.push(listener);
    else if (!this.ctrlListeners[index]) this.ctrlListeners[index] = [listener];
    else this.ctrlListeners[index].push(listener);
  }

  nrpnListen(index, listener) {
    if (index === '*') this.allNrpnListeners.push(listener);
    else if (!this.nrpnListeners[index]) this.nrpnListeners[index] = [listener];
    else this.nrpnListeners[index].push(listener);
  }

  //
  // remove listeners
  // listener must be a function whose value persists
  // not one constructed in the call
  //
  noteUnlisten(index, listener) {
    if (index === '*') 
      this.allNoteListeners = this.allNoteListeners.filter(item => item !== listener);
    else
      this.noteListeners[index] = this.notelisteners.filter[index].filter(item => item !== listener);
  }

  ctrlUnlisten(index, listener) {
    if (index === '*') 
      this.allCtrlListeners = this.allCtrlListeners.filter(item => item !== listener);
    else
      this.ctrlListeners[index] = this.ctrlListeners[index].filter(item => item  !== listener);
  }

  nrpnUnlisten(index, listener) {
    if (index === '*') 
      this.allNrpnListeners = this.allNrpnListeners.filter(item => item !== listener);
    else
      this.nrpnListeners[index] = this.nrpnListeners[index].filter(item => item !== listener);
  }

  //
  // invoke listeners
  //

  noteInvokeListeners(note, oldval) {
    const type = 'note';
    this.allNoteListeners.forEach(listener => listener(type, note, oldval));
    if (this.noteListeners[note])
      this.noteListeners[note].forEach(listener =>
        listener(type, note, oldval),
      );
  }

  ctrlInvokeListeners(ctrl, oldval) {
    const type = 'ctrl';
    this.allCtrlListeners.forEach(listener => listener(type, ctrl, oldval));
    if (this.ctrlListeners[ctrl])
      this.ctrlListeners[ctrl].forEach(listener =>
        listener(type, ctrl, oldval),
      );
  }

  nrpnInvokeListeners(nrpn, oldval) {
    const type = 'nrpn';
    this.allNrpnListeners.forEach(listener => listener(type, nrpn, oldval));
    if (this.nrpnListeners[nrpn])
      this.nrpnListeners[nrpn].forEach(listener =>
        listener(type, nrpn, oldval),
      );
  }

  //
  // get current values
  //

  noteGet(note) {
    return this.notes[note];
  }

  ctrlGet(ctrl) {
    return this.ctrls[ctrl];
  }

  nrpnGet(nrpn) {
    return this.nrpns[nrpn];
  }

  //
  // set current values, delegated to device, which echoes back the true current values
  //

  /* eslint-disable no-bitwise */
  noteSet(note, velocity) {
    this.sendmidi([NOTE_ON | (this.channel - 1), note & 127, velocity & 127]);
  }

  ctrlSet(ctrl, data) {
    this.sendmidi([CTRL_CHANGE | (this.channel - 1), ctrl & 127, data & 127]);
  }

  nrpnSet(nrpn, value) {
    this.ctrlSet(NRPN_MSB, nrpn >> 7);
    this.ctrlSet(NRPN_LSB, nrpn);
    this.ctrlSet(DATA_MSB, value >> 7);
    this.ctrlSet(DATA_LSB, value);
    this.ctrlSet(NRPN_MSB, 127);
    this.ctrlSet(NRPN_LSB, 127);
  }
  /* eslint-enable no-bitwise */

  nrpnQuery(nrpn) {
    this.nrpnSet(NRPN_NRPN_QUERY, nrpn);
  }

  //
  // device management implementation
  // when we open a device we try to get a JSON string
  //
  deviceListener(type, tindex, oldval) {
    // console.log(`**deviceListener(${type}, ${tindex}, ${oldval})`);
    switch (type) {
      case 'note':
        break;
      case 'ctrl':
        switch (tindex) {
          case DATA_MSB:
          case DATA_LSB:
          case NRPN_LSB:
          case NRPN_MSB:
            break;
          default:
            break;
        }
        break;
      case 'nrpn':
        switch (tindex) {
          case NRPN_ID_DEVICE:
            // console.log(`ID_DEVICE === ${this.nrpnGet(NRPN_ID_DEVICE)}`);
            break;
          case NRPN_ID_VERSION:
            // console.log(`ID_VERSION === ${this.nrpnGet(NRPN_ID_VERSION)}`);
            if (this.nrpnGet(NRPN_ID_DEVICE) === VAL_HASAK_ID_DEVICE) {
              if (this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK2_ID_VERSION) {
                // console.log('fetching local copy of props v110');
                this.props = hasakProperties110;
                // if ( ! this.request_json) {
                // this.request_json = true;
                // console.log("requesting JSON string");
                /* eslint-disable no-bitwise */
                // this.nrpnSet(NRPN_STRING_START, ENDP_JSON_TO_HOST<<9);
                /* eslint-enable no-bitwise */
                // console.log('sending NRPN_STRING_START, ENDP_JSON_TO_HOST<<9');
                // this.string = [];
                // } else {
                // console.log('avoided duplicate JSON string request');
                // }
              } else if (this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK1_ID_VERSION) {
                // pull props from canned image
                // console.log('fetching local copy of props v100');
                this.props = hasakProperties100;
              } else {
                // don't know what this means
                console.log(`what NRPN_ID_DEVICE is ${this.nrpnGet(NRPN_ID_DEVICE)}?`);
              }
	      if (this.props) {
		this.selected = this.hasakSelected;
		this.views = this.hasakViews;
	      }
            }
            break;
          case NRPN_STRING_START:
            console.log(`STRING_START === ${this.nrpnGet(NRPN_STRING_START)}`);
            this.startTime = performance.now();
            this.startDate = new Date();
            if (this.nrpnGet(NRPN_STRING_START) === 0) {
              break;
            }
            break;
          case NRPN_STRING_BYTE: {
            const byte = this.nrpnGet(NRPN_STRING_BYTE);
            // console.log(`byte ${byte} total ${this.string.length}`);
            /* eslint-disable no-bitwise */
            this.string.push(String.fromCharCode(byte & 255));
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
            const dTime = this.endTime - this.startTime;
            // const dDate = this.endDate-this.startDate;
            const cpsTime = this.string.length / (dTime / 1e3);
            // const cpsDate = this.string.length / ((dDate) / 1e3);
            console.log(
              `received ${this.string.length} bytes at ${cpsTime} chars/second`,
            );
            console.log(`(${cpsTime * 12} with overhead)`);
            if (this.nrpnGet(NRPN_STRING_END) !== 0) {
              console.log(
                `STRING_END ${this.nrpnGet(NRPN_STRING_END)} is not 0`,
              );
              break;
            }
            console.log(`found JSON string`);
            try {
              this.jsonString = this.string.join('');
              this.props = JSON.parse(this.jsonString);
            } catch (error) {
              console.log(`error parsing props ${error}`);
            }
            // Object.entries(this.props).forEach((k,v) =>
            //  console.log(`${k}: ${Object.entries(v).map((k2,v2) => `${k2}: ${v2}`).join(', ')}`))
            this.requestUpdate();
            break;
          }
          default:
            break;
        }
        break;
      default:
        console.log(`*deviceListener(${type}, ${tindex}, ${oldval})`);
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
      props: { type: Object },
      views: { type: Array },
      selected: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log(`HasakDevice[${this.name}] calling back to HasakMidi to name ourself`);
    this.midi.deviceCallback(this.name, this);
    this.noteListen('*', (type, tindex, oldvalue) =>
      this.deviceListener(type, tindex, oldvalue),
    );
    this.ctrlListen('*', (type, tindex, oldvalue) =>
      this.deviceListener(type, tindex, oldvalue),
    );
    this.nrpnListen('*', (type, tindex, oldvalue) =>
      this.deviceListener(type, tindex, oldvalue),
    );
    this.nrpnQuery(NRPN_ID_DEVICE);
    this.nrpnQuery(NRPN_ID_VERSION);
  }

  get props() {
    return this._props;
  }

  set props(p) {
    // console.log(`set props(${p})`);
    this._props = p;
    this.requestUpdate();
  }

  getLabel(key) {
    return this.props[key].label || key.substring(5);
  }

  getUnit(key) {
    return this.props[key].unit || 'no unit';
  }

  getTitle(key) {
    return this.props[key].title || 'no title';
  }

  getValue(key) {
    return this.props[key].value || 'no value';
  }

  getValues(key) {
    return this.props[key].values || 'no values';
  }

  getOpts(key) {
    return this.props[key].opts || 'no opts';
  }

  nrpnGetFromKey(key) {
    return this.nrpnGet(this.getValue(key));
  }

  nrpnSetFromKey(key, value) {
    this.nrpnSet(this.getValue(key), value);
  }

  nrpn_query(key) {
    // console.log(`nrpn_query(${key}) ${this.getValue(key)}`);
    this.nrpnQuery(this.getValue(key));
  }

  nrpn_query_list(keys) {
    keys.flat().forEach(key => this.nrpn_query(key));
  }

  constructor() {
    super();
    this.counts = {			// device statistics
      midimessage: 0,			// total messages
      sysex: 0,				// total system exclusives (ignored)
      channels: Array(16).fill(0),	// messages to channels counts
      notes: Array(127).fill(0),	// note messages count
      ctrls: Array(127).fill(0),	// ctrl messages count
      nrpns: []				// nrpn messages count
    };
    this.channel = 10;
    this.notes = {}; // note state map
    this.ctrls = {}; // control change state map
    this.nrpns = {}; // nrpn state map
    this.allNoteListeners = [];
    this.allCtrlListeners = [];
    this.allNrpnListeners = [];
    this.noteListeners = [];
    this.ctrlListeners = [];
    this.nrpnListeners = [];
    this._props = null;
    this.otherSelected = [ 'device-info' ];
    this.otherViews = [
      "device-info", /* "midi-stats", "midi-notes", "midi-ctrls", "midi-nrpns" */
    ];
    this.hasakSelected = [ 'minimum' ];
    this.hasakViews = [ 
      "device-info", 
      "minimum", "paddle", "fist", "envelope", "ptt", "levels",
      "mixens", "mixers",
      "enables",
      /* "misc",
      "pinput", "poutput", "padcmap",
      "wm8960", */
      /* "statistics", */
      /* "midi-stats", "midi-notes", "midi-ctrls", "midi-nrpns" */
    ];
    this.selected = this.otherSelected;
    this.views = this.otherViews;
  }

  static get styles() {
    return css`
	div.device {
	  width: 90%;
	  margin: auto;
	  display: flex;
	  flex-flow: row nowrap;
	}
	sl-select { width: 90%; }
	hasak-view.shown { display: block; }
	hasak-view.hidden { display: none; }
	`;
  }

  onInput(e) {
    // console.log(`onInput e.target.value = ${e.target.value}`);
    this.selected = e.target.value;
  }

  render() {
    // console.log(`hasak-device render with props ${this.props}`);
    const { selected, views } = this;

    return html`
	<div class="device">
	  <sl-select
	    name="device"
	    title="Select the component(s) of the controller."
            .value=${selected}
            @sl-input=${this.onInput}
	    multiple
	    size="small">
	      ${views.map(view => html`
		<sl-option
		  value="${view}" 
		  size="small">
		    ${view}
		</sl-option>`)}
	  </sl-select>
	</div>
	${views.map(view =>
	  html`
	    <hasak-view 
	      .device=${this} 
	      .props=${this.props}
	      view="${view}" 
	    class="view ${view} ${this.selected.includes(view) ? 'shown' : 'hidden'}">
	    </hasak-view>`
	  )}
      `;
    
  }
}

customElements.define('hasak-device', HasakDevice);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
