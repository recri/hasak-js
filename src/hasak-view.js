import { LitElement, html, css } from 'lit';

import './hasak-checkboxes.js';
import './hasak-number.js';
import './hasak-switch.js';
import './hasak-numbers.js';

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
    if (!this.device) return html`hasak ?device? ${this.view}`;
    if (!this.device.props) return html`${this.device.name} ${this.view}`;
    switch (this.view) {
      case 'min':
        return html`
          <div class="body">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_VOLUME', 'NRPN_LEVEL', 'NRPN_TONE', 'NRPN_SPEED']}
            ></hasak-numbers>
            <hasak-checkboxes
              .device=${this.device}
              .keys=${['NRPN_PADC_ENABLE', 'NRPN_HDW_OUT_ENABLE']}
            ></hasak-checkboxes>
          </div>
        `;

      case 'fist':
        return html`
          <div class="body">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_WEIGHT', 'NRPN_RATIO', 'NRPN_COMP', 'NRPN_FARNS']}
            ></hasak-numbers
            >>
          </div>
        `;

      case 'enables': {
        const keys = [
          'NRPN_INPUT_ENABLE',
          'NRPN_OUTPUT_ENABLE',
          'NRPN_ECHO_ENABLE',
          'NRPN_LISTENER_ENABLE',
          'NRPN_PIN_ENABLE',
          'NRPN_POUT_ENABLE',
          'NRPN_PADC_ENABLE',
          'NRPN_ST_ENABLE',
          'NRPN_TX_ENABLE',
          'NRPN_IQ_ENABLE',
          'NRPN_PTT_REQUIRE',
          'NRPN_RKEY_ENABLE',
          'NRPN_CW_AUTOPTT',
          'NRPN_RX_MUTE',
          'NRPN_MIC_HWPTT',
          'NRPN_CW_HWPTT',
        ];
        keys.forEach(
          key =>
            this.device.props[key] ||
            console.log(`there is no ${key} in properties`),
        );
        return html`
          <div class="body">
            <hasak-checkboxes
              .device=${this.device}
              .keys=${keys}
            ></hasak-checkboxes>
          </div>
        `;
      }

      case 'envelope':
        return html`
          <div class="body">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_RISE_TIME', 'NRPN_FALL_TIME']}
            ></hasak-numbers>
            <hasak-selects
              .device=${this.device}
              .keys=${['NRPN_RISE_RAMP', 'NRPN_FALL_RAMP']}
            ></hasak-selects>
          </div>
        `;

      //    case 'mixers': /* mixer levels */
      //      return html`mixer levels`;

      //    case 'mixens': /* mixer enables */
      //      return html`mixer enables`;

      //    case 'statistics': {
      //      const keys = [ "NRPN_MIDI_INPUTS", "NRPN_MIDI_OUTPUTS", "NRPN_MIDI_ECHOES", "NRPN_MIDI_SENDS", "NRPN_MIDI_NOTES",
      //		     "NRPN_MIDI_CTRLS", "NRPN_MIDI_NRPNS", "NRPN_LISTENER_NODES", "NRPN_LISTENER_LISTS", "NRPN_LISTENER_CALLS",
      //		     "NRPN_LISTENER_FIRES", "NRPN_LISTENER_LOOPS" ];
      //      const statistics = (key) => html`
      //              <div class="number">
      //	        <hasak-value key="${key}" .device=${this.device}></hasak-value>
      //              </div>
      //	  `;
      //      this.nrpn_query_list(keys);
      //      return html`
      //          <div class="body">
      //	    ${keys.map(key => statistics(key))}
      //	    <sl-button @click=this.device.nrpnSetFromKey("NRPN_STATS_RESET", 0)>Statistics Reset</sl-button>
      //          </div>
      //	`;
      //    }

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
