import { LitElement, html, css } from 'lit';

import './hasak-checkbox.js';
import './hasak-checkboxes.js';
import './hasak-number.js';
import './hasak-numbers.js';
import './hasak-select.js';
import './hasak-switch.js';
import './hasak-switches.js';
import './hasak-titled-values.js';
import './hasak-value.js';
import './hasak-value-matrix.js';
import './hasak-switch-matrix.js';

import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

export class HasakView extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      view: { type: String }, // raw, complete, ...
      props: { type: Object  },
    };
  }

  static get styles() {
    return css`
      div.body {
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
    // console.log(`hasak-view render ${this.device.name}, ${this.view}] in render with props ${this.device.props}`);
    if (!this.device) return html`hasak ?device? ${this.view}`;
    if (!this.props) return html`${this.device.name} ${this.view}`;
    switch (this.view) {
    case 'minimum': {
      return html`
          <div class="body">
	    <hr/>
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_VOLUME', 'NRPN_LEVEL', 'NRPN_TONE', 'NRPN_SPEED']}
            ></hasak-numbers>
	    <sl-divider></sl-divider>
            <hasak-switches
              .device=${this.device}
              .keys=${['NRPN_PADC_ENABLE','NRPN_HDW_OUT_ENABLE','NRPN_PAD_SWAP']}
            ></hasak-switches>
          </div>
        `;
    }

    case 'paddle': {
      return html`
          <div class="body paddle">
	    <hr/>
            <div class="flexrow">
              <hasak-select
                style="width:30%;"
                .device=${this.device}
                key="NRPN_PAD_KEYER"
              ></hasak-select>
              <hasak-select
                style="width:30%;"
                .device=${this.device}
                key="NRPN_PAD_MODE"
              ></hasak-select>
              <hasak-select
                style="width:30%;"
                .device=${this.device}
                key="NRPN_PAD_ADAPT"
              ></hasak-select>
            </div>
	    <sl-divider></sl-divider>
            <hasak-switches
              .style="width: 95%; margin: auto;"
              .device=${this.device}
              .keys=${['NRPN_PAD_SWAP', 'NRPN_AUTO_ILS', 'NRPN_AUTO_IWS']}
            >
            </hasak-switches>
          </div>
        `;
    }

    case 'fist': {
      return html`
          <div class="body fist">
	    <hr/>
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_WEIGHT', 'NRPN_RATIO', 'NRPN_COMP', 'NRPN_FARNS']}
            ></hasak-numbers>
          </div>
        `;
    }

    case 'enables': {
      const keys = [
	/* these have to do with midi handling, rare user interest */
        'NRPN_INPUT_ENABLE','NRPN_OUTPUT_ENABLE','NRPN_ECHO_ENABLE','NRPN_LISTENER_ENABLE',
	/* these are pin mode enables, starting input, output, and adc input */
        'NRPN_PIN_ENABLE', 'NRPN_POUT_ENABLE', 'NRPN_PADC_ENABLE',
	/* these are operation enables */
        'NRPN_ST_ENABLE', 'NRPN_TX_ENABLE', 'NRPN_IQ_ENABLE', 'NRPN_RX_MUTE',
	/* these are capabilities/requirements */
        'NRPN_PTT_REQUIRE', 'NRPN_RKEY_ENABLE', 
	/* these are ptt options */
	'NRPN_CW_AUTOPTT','NRPN_MIC_HWPTT','NRPN_CW_HWPTT',
      ];
      keys.forEach(
        key =>
        this.props[key] ||
          console.log(`there is no ${key} in properties`),
      );
      return html`
          <div class="body enables">
	    <hr/>
            <hasak-switches
              .device=${this.device}
              .keys=${keys}
            ></hasak-switches>
          </div>
        `;
    }

    case 'envelope': {
      return html`
          <div class="body envelope">
	    <hr/>
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_RISE_TIME', 'NRPN_FALL_TIME']}
            ></hasak-numbers>
	    <sl-divider></sl-divider>
            <div class="selects flexrow">
              <hasak-select
		style="width: 45%;"
                .device=${this.device}
                key="NRPN_RISE_RAMP"
              ></hasak-select>
              <hasak-select
		style="width: 45%;"
                .device=${this.device}
                key="NRPN_FALL_RAMP"
              ></hasak-select>
            </div>
          </div>
        `;
    }

    case 'ptt': {
      return html`
          <div class="body ptt">
	    <hr/>
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_HEAD_TIME', 'NRPN_TAIL_TIME', 'NRPN_HANG_TIME']}
            ></hasak-numbers>
	    <sl-divider></sl-divider>
            <hasak-switches
              .device=${this.device}
              .keys=${[
                'NRPN_PTT_REQUIRE',
                'NRPN_CW_AUTOPTT',
                'NRPN_MIC_HWPTT',
                'NRPN_CW_HWPTT',
              ]}
            ></hasak-switches>
          </div>
        `;
    }

    case 'levels': {
      const commonKeys = [ "NRPN_VOLUME", "NRPN_LEVEL", "NRPN_USB_LEVEL", "NRPN_I2S_LEVEL", ];
      const miscKeys = [ "NRPN_HDW_LEVEL", "NRPN_ST_BALANCE", "NRPN_RX_PTT_LEVEL", ];
      // const codecKeys = [ "NRPN_CODEC_VOLUME", "NRPN_INPUT_LEVEL", ];
      return html`
          <div class="body">
	    <hr/>
            <hasak-numbers
              .device=${this.device}
              .keys=${commonKeys}
            ></hasak-numbers>
	    <sl-divider></sl-divider>
            <hasak-numbers
              .device=${this.device}
              .keys=${miscKeys}
            ></hasak-numbers>
          </div>
        `;
    }
      
    case 'mixens': {
      /* mixer enables */
      const columnLabels = ["I2S/USB", "ST", "IQ", "USB/I2S"];
      const rowLabels = ["USB L", "USB R", "I2S L", "I2S R", "HDW L", "HDW R"];
      const matrixKeys = [
	["NRPN_MIX_EN_USB_L0", "NRPN_MIX_EN_USB_L1", "NRPN_MIX_EN_USB_L2", "NRPN_MIX_EN_USB_L3"],
	["NRPN_MIX_EN_USB_R0", "NRPN_MIX_EN_USB_R1", "NRPN_MIX_EN_USB_R2", "NRPN_MIX_EN_USB_R3"], 
	["NRPN_MIX_EN_I2S_L0", "NRPN_MIX_EN_I2S_L1", "NRPN_MIX_EN_I2S_L2", "NRPN_MIX_EN_I2S_L3"],
	["NRPN_MIX_EN_I2S_R0", "NRPN_MIX_EN_I2S_R1", "NRPN_MIX_EN_I2S_R2", "NRPN_MIX_EN_I2S_R3"], 
	["NRPN_MIX_EN_HDW_L0", "NRPN_MIX_EN_HDW_L1", "NRPN_MIX_EN_HDW_L2", "NRPN_MIX_EN_HDW_L3"], 
	["NRPN_MIX_EN_HDW_R0", "NRPN_MIX_EN_HDW_R1", "NRPN_MIX_EN_HDW_R2", "NRPN_MIX_EN_HDW_R3"]
      ];
      // console.log("rendering mixer enable matrix");
      return html`<hasak-switch-matrix 
		    .device=${this.device} 
		    xtitle="mixer enable matrix"
		    .columns=${columnLabels}
		    .rows=${rowLabels}
		    .matrix=${matrixKeys}>
		  </hasak-value-matrix>`;
    }

    case 'mixers': {
      /* mixer levels */
      const columnLabels = ["I2S/USB", "ST", "IQ", "USB/I2S"];
      const rowLabels = ["USB L", "USB R", "I2S L", "I2S R", "HDW L", "HDW R"];
      const matrixKeys = [
	["NRPN_MIX_USB_L0", "NRPN_MIX_USB_L1", "NRPN_MIX_USB_L2", "NRPN_MIX_USB_L3"],
	["NRPN_MIX_USB_R0", "NRPN_MIX_USB_R1", "NRPN_MIX_USB_R2", "NRPN_MIX_USB_R3"], 
	["NRPN_MIX_I2S_L0", "NRPN_MIX_I2S_L1", "NRPN_MIX_I2S_L2", "NRPN_MIX_I2S_L3"],
	["NRPN_MIX_I2S_R0", "NRPN_MIX_I2S_R1", "NRPN_MIX_I2S_R2", "NRPN_MIX_I2S_R3"], 
	["NRPN_MIX_HDW_L0", "NRPN_MIX_HDW_L1", "NRPN_MIX_HDW_L2", "NRPN_MIX_HDW_L3"], 
	["NRPN_MIX_HDW_R0", "NRPN_MIX_HDW_R1", "NRPN_MIX_HDW_R2", "NRPN_MIX_HDW_R3"]
      ];
      // console.log("rendering level mixer matrix");
      return html`<hasak-value-matrix 
		    .device=${this.device} 
		    xtitle="mixer level matrix"
		    .columns=${columnLabels}
		    .rows=${rowLabels}
		    .matrix=${matrixKeys}>
		  </hasak-value-matrix>`;
    }

    case 'device-info': {
      if (this.props) {
	const deviceInfoKeys = [
	  "NRPN_ID_DEVICE", "NRPN_ID_VERSION", "NRPN_NRPN_SIZE", "NRPN_MSG_SIZE", "NRPN_SAMPLE_RATE", "NRPN_EEPROM_LENGTH", "NRPN_ID_CPU", "NRPN_ID_CODEC"
	];
	return html`
	  <hr/>
	  <div class="body">
	    <hasak-titled-values .device=${this.device} .keys=${deviceInfoKeys}></hasak-titled-values>
	  </div>
	`;
      }
      return html`
	<hr/>
	<div class="body device-info"><p>no device info available for ${this.device.name}</div>`;
    }
      
    default:
      return html`
	  <hr/>
	  <div class="body ${this.view}">
	    <span>hasak-view - ${this.device.name} - ${this.view} - not done</span>
	  </div>
        `;
    }
  }
}

customElements.define('hasak-view', HasakView);

/* problem with statistics is that reading the values changes the values 
   need some way to isolate them
    case 'statistics': {
      const keys = [
        'NRPN_MIDI_INPUTS',
        'NRPN_MIDI_OUTPUTS',
        'NRPN_MIDI_ECHOES',
        'NRPN_MIDI_SENDS',
        'NRPN_MIDI_NOTES',
        'NRPN_MIDI_CTRLS',
        'NRPN_MIDI_NRPNS',
        'NRPN_LISTENER_NODES',
        'NRPN_LISTENER_LISTS',
        'NRPN_LISTENER_CALLS',
        'NRPN_LISTENER_FIRES',
        'NRPN_LISTENER_LOOPS',
      ];
      // this.device.nrpn_query_list(keys);
      return html`
          <div class="body statistics">
	    <hasak-titled-values .keys=${keys} .device=${this.device}></hasak-titled-values>
            <sl-button style="margins: auto;"
              @click=${this.device.nrpnSetFromKey('NRPN_STATS_RESET', 0)}
            >
              Statistics Reset
            </sl-button>
          </div>
        `;
    }
*/
/* these don't work because they don't update on changes
   need a local device key that works like the NRPN_* keys
    case 'midi-stats':
      return html`
	  <hr/>
          <div class="body midi-stats">
	    <div>${this.device.counts.midimessage} messages total</div>
	    <div>${this.device.counts.sysex} system exclusives</div>
	    ${this.device.counts.channels.map((count, index) => 
		count ? html`<div>${count} messages on channel ${index+1}</div>` : html``)}
	    ${this.device.counts.notes.map((count, index) =>
		count ? html`<div>${count} note ${index} messages </div>` : html``)}
	    ${this.device.counts.ctrls.map((count, index) =>
		count ? html`<div>${count} ctrl ${index} messages </div>` : html``)}
	    ${this.device.counts.nrpns.map((count, index) =>
		count ? html`<div>${count} nrpn ${index} messages </div>` : html``)}
	  </div>
	`;
    case 'midi-notes':
    case 'midi-ctrls':
    case 'midi-nrpns':
*/    

// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
