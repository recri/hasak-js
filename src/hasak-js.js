/*
** Merge in hasak-midi.
** Display selected midi device name in app-bar sl-select
** Use placeholder for none present or none selected.
** Display hasak-device for selected device.
** for non-hasak hasak-device, display MIDI statistics
** and active MIDI note, ctrl, rpn, and nrpn values.
** display those for hasak flavored devices, too.
*/

import { LitElement, html, css } from 'lit';

import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';

import './hasak-device.js';

export class HasakJs extends LitElement {

  static get properties() {
    return {
      names: { type: Array },
      selectValue: { type: Number },
      selectName: { type: String },
    };
  }

  constructor() {
    super();
    this.midiAvailable = false;
    this.midiAccess = null; // global MIDIAccess object
    this.dev = {};
    this.selectedValue = -1;
    this.selectedName = ""
    this.refresh();
  }

  deviceCallback(name, dev) {
    // console.log(`deviceCallback(${name}, ${dev})`);
    // don't update yet until we get the <hasak-device> to display
    this.dev[name] = dev;
  }

  onmidimessage(name, e) {
    if (this.dev[name]) this.dev[name].onmidimessage(e.data);
    else console.log(`midi message for device '${this.dev[name]}'`);
  }

  sendmidi(name, data) {
    const out = this.output(name);
    if (out) out.send(data);
    // console.log(`KeyerMidiSource.send midi ${name} ${data} to ${out}`);
  }

  output(name) {
    return this.midiAccess.outputs.get(this.outputMap[name]);
  }

    
  // take given name and id from midi api and uniquify
  uniquify(name, id, index) {

    // take given name from midi api and simplify
    const simplify = (n) => {
      const m = n.match(/^(.*) MIDI \d+$/) || 
	    n.match(/^(.*) Port-\d+$/);
      if (m) return m[1];
      return n;
    }

    if (this.idMap[id]) return this.idMap[id];
    const newname = `${simplify(name)}:${index}`;
    this.idMap[id] = newname;
    return newname;
  }
  
  recordOutput(name, id, index) {
    const newname = this.uniquify(name, id, index);
    if (!this.outputMap[newname]) this.outputMap[newname] = id;
    if (!this.dev[newname]) this.dev[newname] = null;
    // console.log(`recordOutput(name="${name}", id="${id}") mapped to "${newname}"`);
    return newname;
  }

  recordInput(name, id, index) {
    const newname = this.uniquify(name, id, index);
    if (!this.inputMap[newname]) this.inputMap[newname] = id;
    if (!this.dev[newname]) this.dev[newname] = null;
    // console.log(`recordInput(name="${name}", id="${id}") mapped to "${newname}"`);
    return newname; 
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

  get placeholder () {
    if (this.names.length === 0) return "No MIDI devices?";
    if (this.selectedValue === -1) return "Select MIDI device.";
    return ""
  }

  valueOfName(name) { 
    return this.names.findIndex(item => item === name);
  }
  
  rebind() {
    // console.log("hasak-js rebind()");
    this.idMap = {}
    this.nameMap = {};
    this.inputMap = {};
    this.outputMap = {};
    this.inputs.forEach((inp, inpIndex) => {
      const name = this.recordInput(inp.name, inp.id, inpIndex);
      // console.log(`input rebind ${inp.name} to ${name}`);
      /* eslint-disable no-param-reassign */
      inp.onmidimessage = e => this.onmidimessage(name, e);
    });
    this.outputs.forEach((output, outputIndex) =>  {
      /* eslint-disable no-unused-vars */
      const name = this.recordOutput(output.name, output.id, outputIndex);
      /* eslint-enable no-unused-vars */
      // console.log(`output rebind ${output.name} to ${name}`);
    });
    this.requestUpdate();
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
    this.midiAvailable = false;
    this.rebind();
  }

  refresh() {
    // console.log(`midi refresh`);
    // console.log(`navigator.requestMIDIAccess === ${navigator.requestMIDIAccess}`);
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: false, software: true }).then(
        (...args) => this.onMIDISuccess(...args),
        (...args) => this.onMIDIFailure(...args),
      );
    } else {
      console.log('no navigator.requestMIDIAccess found');
    }
  }

    // input handler for device selector
  onInput(e) {
    this.selectedValue = e.target.value;
    this.selectedName = this.names[this.selectedValue];
    this.requestUpdate();
    // console.log(`selectedValue ${this.selectedValue} is ${this.names[this.selectedValue]}`)
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--hasak-js-background-color);
      }

      main {
        flex-grow: 1;
      }

      .logo {
        margin-top: 36px;
      }

      .app-bar {
	 display: flex;
	 flex-flow: row wrap;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      .device.shown {
	display: block;
      }

      .device.hidden {
	display: none;
      }
    `;
  }

  render() {
    if (this.names.includes(this.selectedName)) {
      this.selectedValue = this.valueOfName(this.selectedName);
    } else {
      this.selectedValue = -1;
      this.selectedName = ""
    }
    // console.log(`selectedName = ${this.selectedName}`);
    return html`
      <main>
        <sl-divider></sl-divider>
        <div class="app-bar">
	  <div>
            <img
              src="/assets/app-icons/keyer-logo-512x128.svg"
              alt="A keyer icon"
              style="width:96px;height:24px"
            />
	  </div>
	  <sl-divider vertical></sl-divider>
	  <div>
            hasak
	  </div>
	  <sl-divider vertical></sl-divider>
	  <div>
	    <sl-select
	      placeholder="${this.placeholder}"
	      size="small"
	      @sl-input=${this.onInput}
	      value="${this.selectedValue}">
		${this.names.map(name => 
	    	  html`
		    <sl-option 
		      size="small"
		      value="${this.valueOfName(name)}"
		      @sl-input=${this.onInput}>
		      ${name}
		    </sl-option>`)}
	    </sl-select>
	  </div>
        </div>
        <sl-divider></sl-divider>
	  ${this.names.map(name => 
      	    html`
	      <div class="device ${name === this.selectedName ? 'shown' :'hidden'}">
	        <hasak-device
	          .midi=${this}
	          name="${name}">
	        </hasak-device>`)}
	      </div>
        <sl-divider></sl-divider>
      </main>
      <p class="app-footer"></p>
    `;
  }
}

customElements.define('hasak-js', HasakJs);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
