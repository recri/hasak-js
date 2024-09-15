import { LitElement, html, css } from 'lit';

import './hasak-checkbox.js';
import './hasak-number.js';
import './hasak-switch.js';
import './hasak-block.js';

export class HasakView extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      view: { type: String }, // raw, complete, ...
    };
  }

  static get styles() {
    return css``;
  }

  render() {
    console.log(
      `hasak-view render ${this.device.name}, ${this.view}] in render with props ${this.device.props}`,
    );
    if (!this.device) return html`hasak ?device?`;
    if (!this.device.props) return html`${this.device.name}`;
    switch (this.view) {
    case 'min':
      const keys = ['NRPN_VOLUME', 'NRPN_LEVEL', 'NRPN_TONE', 'NRPN_SPEED']
      this.device.nrpn_query_list(keys);
      return html`
        <style>
	  div.body { display: grid; grid-template-areas: "a b c d"; column-gap: 10px; }
	  div.label,div.units { font-size: smaller; text-align: center; }
	</style>
	<div class="body">
	  <div class="label" title="${this.device.getTitle('NRPN_VOLUME')}"> ${this.device.getLabel('NRPN_VOLUME')} </div>
	  <div class="label" title="${this.device.getTitle('NRPN_LEVEL')}"> ${this.device.getLabel('NRPN_LEVEL')} </div>
	  <div class="label" title="${this.device.getTitle('NRPN_TONE')}"> ${this.device.getLabel('NRPN_TONE')} </div>
	  <div class="label" title="${this.device.getTitle('NRPN_SPEED')}"> ${this.device.getLabel('NRPN_SPEED')} </div>
          <div class="value"> <hasak-number key="NRPN_VOLUME" .device=${this.device}></hasak-value></div>
          <div class="value"> <hasak-number key="NRPN_LEVEL"  .device=${this.device}></hasak-value></div>
          <div class="value"> <hasak-number key="NRPN_TONE"   .device=${this.device}></hasak-value></div>
          <div class="value"> <hasak-number key="NRPN_SPEED"  .device=${this.device}></hasak-value></div>
	  <div class="units"> ${this.device.getUnit('NRPN_VOLUME')} </div>
	  <div class="units"> ${this.device.getUnit('NRPN_LEVEL')} </div>
	  <div class="units"> ${this.device.getUnit('NRPN_TONE')} </div>
	  <div class="units"> ${this.device.getUnit('NRPN_SPEED')} </div>
	</div>
    `;

    case 'fist': {
      const keys = ["NRPN_WEIGHT","NRPN_RATIO","NRPN_FARNS","NRPN_COMP"];
      this.device.nrpn_query_list(keys);
      return html`
        <style>
	  div.body { display: grid; grid-template-areas: "a b c d"; column-gap: 10px; }
	  div.label,div.units { font-size: smaller; text-align: center; }
	</style>
	<div class="body">
          ${keys.map(key => html`<div class="label" title="${this.device.getTitle(key)}"> ${this.device.getLabel(key)} </div>`)}
	  ${keys.map(key => html`<div class="value"> <hasak-number key="${key}" .device=${this.device}></hasak-value></div>`)}
	  ${keys.map(key => html`<div class="units"> ${this.device.getUnit(key)} </div>`)}
	</div>
      `;
    }

    case 'pots':
      this.device.nrpn_query("NRPN_PADC_ENABLE");
        return html`
          <div class="body">
            <div class="checkbox">
              <hasak-checkbox
                key="NRPN_PADC_ENABLE"
                .device=${this.device}
              ></hasak-checkbox>
            </div>
          </div>
        `;

    case 'hdw':
      this.device.nrpn_query("NRPN_HDW_OUT_ENABLE");
        return html`
          <div class="body">
            <div class="checkbox">
              <hasak-checkbox
                key="NRPN_HDW_OUT_ENABLE"
                .device=${this.device}
              ></hasak-checkbox>
            </div>
          </div>
        `;

    case 'mixers': /* mixer levels */
      return html`mixer levels`;

    case 'mixens': /* mixer enables */
      return html`mixer enables`;
      
    case 'enables': {
      const keys = ["NRPN_INPUT_ENABLE","NRPN_OUTPUT_ENABLE","NRPN_ECHO_ENABLE","NRPN_LISTENER_ENABLE",
		    "NRPN_PIN_ENABLE","NRPN_POUT_ENABLE","NRPN_PADC_ENABLE","NRPN_ST_ENABLE","NRPN_TX_ENABLE",
		    "NRPN_IQ_ENABLE","NRPN_PTT_REQUIRE","NRPN_RKEY_ENABLE","NRPN_CW_AUTOPTT","NRPN_RX_MUTE",
		    "NRPN_MIC_HWPTT","NRPN_CW_HWPTT","NRPN_NOTE_LEAK","NRPN_CTRL_LEAK"];
      this.device.nrpn_query_list(keys);
      return html`
          <div class="body">
	    ${keys.map(key => html`
            <div class="checkbox">
              <hasak-checkbox
		key="${key}"
                .device=${this.device}
              ></hasak-checkbox>
            </div>
	  `)}
          </div>
	`;
    }

    case 'statistics': {
      const keys = [ "NRPN_MIDI_INPUTS", "NRPN_MIDI_OUTPUTS", "NRPN_MIDI_ECHOES", "NRPN_MIDI_SENDS", "NRPN_MIDI_NOTES",
		     "NRPN_MIDI_CTRLS", "NRPN_MIDI_NRPNS", "NRPN_LISTENER_NODES", "NRPN_LISTENER_LISTS", "NRPN_LISTENER_CALLS",
		     "NRPN_LISTENER_FIRES", "NRPN_LISTENER_LOOPS" ];
      const statistics = (key) => html`
              <div class="number">
	        <hasak-value key="${key}" .device=${this.device}></hasak-value>
              </div>
	  `;
      this.nrpn_query_list(keys);
      return html`
          <div class="body">
	    ${keys.map(key => statistics(key))}
	    <sl-button @click=this.device.nrpnSetFromKey("NRPN_STATS_RESET", 0)>Statistics Reset</sl-button>
          </div>
	`;
    }
      
    default:
        return html`hasak-view ${this.device.name} ${this.view}`;
    }
  }
}

customElements.define('hasak-view', HasakView);

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
