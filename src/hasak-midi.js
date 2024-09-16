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
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<"] }] */

/*
 ** The MIDI interface may need to be enabled in chrome://flags,
 ** but even then it may not implement everything needed.
 **
 ** This works in chrome-stable as of 2020-11-04, Version 86.0.4240.111 (Official Build) (64-bit)
 */
import { LitElement, html, css } from 'lit';

import './hasak-device.js';

export class HasakMidi extends LitElement {
  static get properties() {
    return {
      devices: { type: Array },
      app: { type: Object },
    };
  }

  static get styles() {
    return css``;
  }

  connectedCallback() {
    super.connectedCallback();
    this.app.midiCallback(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.app.midiCallback(null);
  }

  deviceCallback(name, dev) {
    console.log(`deviceCallback(${name}, ${dev})`);
    // don't update yet until we get the <hasak-device> to display
    this.dev[name] = dev;
  }

  constructor() {
    super();
    this.midiAvailable = false;
    this.midiAccess = null; // global MIDIAccess object
    this.dev = {};
    this.devices = [];
    this.refresh();
  }

  onmidimessage(name, e) {
    if (this.dev[name]) this.dev[name].onmidimessage(e.data);
  }

  sendmidi(name, data) {
    const out = this.output(name);
    if (out) out.send(data);
    // console.log(`KeyerMidiSource.send midi ${name} ${data} to ${out}`);
  }

  output(name) {
    return this.midiAccess.outputs.get(this.outputMap[name]);
  }

  recordOutput(name, id) {
    if (!this.outputMap[name]) this.outputMap[name] = id;
    if (!this.dev[name]) this.dev[name] = null;
    return name;
  }

  recordInput(name, id) {
    if (!this.inputMap[name]) this.inputMap[name] = id;
    if (!this.dev[name]) this.dev[name] = null;
    return name;
  }

  get names() {
    return Object.getOwnPropertyNames(this.dev);
  }

  get inputs() {
    return this.midiAccess ? Array.from(this.midiAccess.inputs.values()) : [];
  }

  get outputs() {
    return this.midiAccess ? Array.from(this.midiAccess.outputs.values()) : [];
  }

  rebind() {
    // console.log("HasakMidi rebind()");
    this.inputMap = {};
    this.outputMap = {};
    this.inputs.forEach(input => {
      const name = this.recordInput(input.name, input.id);
      // console.log(`rebind ${input.name} to ${name}`);
      input.onmidimessage = e => this.onmidimessage(name, e);
    });
    this.outputs.forEach(output => this.recordOutput(output.name, output.id));
    this.devices = Object.keys(this.dev);
    // this.requestUpdate(devices, []);
  }

  onMIDISend(name, data) {
    const out = this.output(name);
    if (out) out.send(data);
    // console.log(`KeyerMidiSource.send midi ${name} ${data} to ${out}`);
  }

  onStateChange() {
    this.rebind();
  }

  onMIDISuccess(midiAccess) {
    // console.log("onMIDISuccess");
    this.midiAccess = midiAccess;
    this.midiAvailable = true;
    this.midiAccess.onstatechange = event => this.onStateChange(event);
    this.rebind();
  }

  onMIDIFailure() {
    // console.log("onMIDIFailure");
    this.midiAccess = null;
    this.rebind();
  }

  refresh() {
    // console.log("midi refresh");
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true, software: true }).then(
        (...args) => this.onMIDISuccess(...args),
        (...args) => this.onMIDIFailure(...args),
      );
    } else {
      console.log('no navigator.requestMIDIAccess found');
    }
  }

  render() {
    // ${Object.keys(this.dev).map(d => html`<div>${d}</div>`)}
    return html`
      ${Object.keys(this.dev)
        .filter(d => !d.match(/^.*Through.*$/))
        .map(d => html`<hasak-device .midi=${this} name=${d}></hasak-device>`)}
    `;
  }
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

customElements.define('hasak-midi', HasakMidi);
