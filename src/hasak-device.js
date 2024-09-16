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
    const [cmd] = msg;
    if (cmd === SYS_EX) {
      console.log(
        `SYS_EX ${msg.length} bytes msg[1] = ${msg[1]}, msg[2] = ${msg[2]}`,
      );
    } else {
      const [, msg1, msg2] = msg;
      /* eslint-disable no-bitwise */
      const chan = 1 + (cmd & 0xf);
      if (!this.channels[chan]) this.channels[chan] = 0;
      this.channels[chan] += 1;
      this.channel = chan;
      switch (cmd & 0xf0) {
        /* eslint-enable no-bitwise */
        case NOTE_ON: {
          const note = msg1;
          const velocity = msg2;
          const oldvelocity = this.notes[note];
          this.notes[note] = velocity;
          this.noteInvokeListeners(note, oldvelocity);
          break;
        }
        case NOTE_OFF: {
          const note = msg1;
          // const velocity = msg2;
          const oldvelocity = this.notes[note];
          this.notes[note] = 0;
          this.noteInvokeListeners(note, oldvelocity);
          break;
        }
        case CTRL_CHANGE: {
          // notify first, then set
          const ctrl = msg1;
          const data = msg2;
          const olddata = this.ctrls[ctrl];
          this.ctrlInvokeListeners(ctrl, olddata);
          this.ctrls[ctrl] = data;
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
          }
          break;
        }
        default:
          console.log(
            `HasakDevice: uncaught message ${msg[0]} ${msg[1]} ${msg[2]}}`,
          );
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
    if (index === '*') this.allNoteListeners.remove(listener);
    else if (this.noteListeners[index])
      this.noteListeners[index].remove(listener);
  }

  ctrlUnlisten(index, listener) {
    if (index === '*') this.allCtrlListeners.remove(listener);
    else if (this.ctrlListeners[index])
      this.ctrlListeners[index].remove(listener);
  }

  nrpnUnlisten(index, listener) {
    if (index === '*') this.allNrpnListeners.remove(listener);
    else if (this.nrpnListeners[index])
      this.nrpnListeners[index].remove(listener);
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
  }
  /* eslint-enable no-bitwise */

  nrpnQuery(nrpn) {
    this.nrpnSet(NRPN_NRPN_QUERY, nrpn);
  }

  //
  // get the props key for type and tindex
  //
  msgKey(ptype, pvalue) {
    if (this.props) {
      const [key] = Object.keys(this.props).filter(
        fkey =>
          this.props[fkey].type === ptype && this.props[fkey].value === pvalue,
      );
      if (key) return key;
    }
    return `${ptype}[${pvalue}]`;
  }

  msgString(type, tindex, oldval) {
    const key = this.msgKey(type, tindex);
    switch (type) {
      case 'note':
        return `${key} old=${oldval} new=${this.noteGet(tindex)}`;
      case 'ctrl':
        return `${key} old=${oldval} new=${this.ctrlGet(tindex)}`;
      case 'nrpn':
        return `${key} old=${oldval} new=${this.nrpnGet(tindex)}`;
      default:
        return `${type}[${tindex} old=${oldval}`;
    }
  }

  //
  // device management implementation
  // when we open a device we try to get a JSON string
  //
  deviceListener(type, tindex, oldval) {
    // console.log(`**deviceListener(${type}, ${tindex}, ${oldval})`);
    switch (type) {
      case 'note':
        // console.log(`*deviceListener(${this.msgString(type, tindex, oldval)})`);
        break;
      case 'ctrl':
        switch (tindex) {
          case DATA_MSB:
          case DATA_LSB:
          case NRPN_LSB:
          case NRPN_MSB:
            break;
          default:
            console.log(
              `*deviceListener(${this.msgString(type, tindex, oldval)})`,
            );
            break;
        }
        break;
      case 'nrpn':
        switch (tindex) {
          case NRPN_ID_DEVICE:
            console.log(`ID_DEVICE === ${this.nrpnGet(NRPN_ID_DEVICE)}`);
            break;
          case NRPN_ID_VERSION:
            console.log(`ID_VERSION === ${this.nrpnGet(NRPN_ID_VERSION)}`);
            if (this.nrpnGet(NRPN_ID_DEVICE) === VAL_HASAK_ID_DEVICE) {
              if (this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK2_ID_VERSION) {
                console.log('fetching local copy of props v110');
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
              } else if (
                this.nrpnGet(NRPN_ID_DEVICE) >= VAL_HASAK1_ID_VERSION
              ) {
                // pull props from canned image
                console.log('fetching local copy of props v100');
                this.props = hasakProperties100;
              } else {
                // don't know what this means
                console.log('what?');
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
            console.log(
              `*deviceListener(${this.msgString(type, tindex, oldval)})`,
            );
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
      views: { type: Array },
      props: { type: Object },
    };
  }

  viewCallback(name, view) {
    this.views[name] = view;
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
    this.nrpnSet(NRPN_ID_DEVICE, 0);
    this.nrpnSet(NRPN_ID_VERSION, 0);
  }

  get props() {
    return this._props;
  }

  set props(p) {
    console.log(`set props(${p})`);
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
    return this.getNrpn(this.getValue(key));
  }

  nrpnSetFromKey(key, value) {
    this.setNrpn(this.getValue(key), value);
  }

  nrpn_query(key) {
    console.log(`nrpn_query(${key}) ${this.getValue(key)}`);
    this.nrpnQuery(this.getValue(key));
  }

  nrpn_query_list(keys) {
    keys.forEach(key => this.nrpn_query(key));
  }

  constructor() {
    super();
    this.channels = {};
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
    this.views = { raw: null, json: null, complete: null, min: null };
  }

  static get styles() {
    return css``;
  }

  render() {
    console.log(`hasak-device render with props ${this.props}`);
    if (this.props)
      return html`
        <hr />
        <hasak-view .device=${this} view="min"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="fist"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="envelope"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="enables"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="ptt"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="ramp"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="keyer"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="levels"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="misc"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="pinput"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="poutput"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="padcmap"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="mixens"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="mixers"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="wm8960"></hasak-view>
        <hr />
        <hasak-view .device=${this} view="statistics"></hasak-view>
      `;
    return html`${this.name}`;
  }
}
/* 	<hr/>
 */

customElements.define('hasak-device', HasakDevice);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
