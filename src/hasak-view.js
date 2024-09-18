import { LitElement, html, css } from 'lit';

import './hasak-switches.js';
import './hasak-number.js';
import './hasak-switch.js';
import './hasak-numbers.js';
import './hasak-select.js';

export class HasakView extends LitElement {
  static get properties() {
    return {
      device: { type: Object }, // parent device
      view: { type: String }, // raw, complete, ...
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
        flex-flow: wrap;
        justify-content: space-evenly;
      }
    `;
  }

  render() {
    console.log(
      `hasak-view render ${this.device.name}, ${this.view}] in render with props ${this.device.props}`,
    );
    if (!this.device) return html`hasak ?device? ${this.view}`;
    if (!this.device.props) return html`${this.device.name} ${this.view}`;
    switch (this.view) {
      case 'minimum':
        return html`
          <div class="body minimum">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_VOLUME', 'NRPN_LEVEL', 'NRPN_TONE', 'NRPN_SPEED']}
            ></hasak-numbers>
            <hasak-switches
              .device=${this.device}
              .keys=${[
                'NRPN_PADC_ENABLE',
                'NRPN_HDW_OUT_ENABLE',
                'NRPN_PAD_SWAP',
              ]}
            ></hasak-switches>
          </div>
        `;

      case 'paddle': // add mode, adapter, swap, automatic spacing
        return html`
          <div class="body paddle">
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
            <sl-switches
              .style="width: 95%; margin: auto;"
              .device=${this.device}
              .keys=${['NRPN_PAD_SWAP', 'NRPN_AUTO_ILS', 'NRPN_AUTO_IWS']}
            >
            </sl-switches>
          </div>
        `;

      case 'fist':
        return html`
          <div class="body fist">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_WEIGHT', 'NRPN_RATIO', 'NRPN_COMP', 'NRPN_FARNS']}
            ></hasak-numbers>
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
          <div class="body enables">
            <hasak-switches
              .device=${this.device}
              .keys=${keys}
            ></hasak-switches>
          </div>
        `;
      }

      case 'envelope':
        return html`
          <div class="body envelope">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_RISE_TIME', 'NRPN_FALL_TIME']}
            ></hasak-numbers>
            <div
              class="selects"
              style="display: inline-flex; flex-direction: row;"
            >
              <hasak-select
                .device=${this.device}
                key="NRPN_RISE_RAMP"
              ></hasak-select>
              <hasak-select
                .device=${this.device}
                key="NRPN_FALL_RAMP"
              ></hasak-select>
            </div>
          </div>
        `;

      case 'ptt':
        return html`
          <div class="body ptt">
            <hasak-numbers
              .device=${this.device}
              .keys=${['NRPN_HEAD_TIME', 'NRPN_TAIL_TIME', 'NRPN_HANG_TIME']}
            ></hasak-numbers>
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
      //    case 'mixers': /* mixer levels */
      //      return html`mixer levels`;

      //    case 'mixens': /* mixer enables */
      //      return html`mixer enables`;

/*
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
        const statistics = key => html`
          <hasak-value key="${key}" .device=${this.device}></hasak-value>
        `;
        this.nrpn_query_list(keys);
        return html`
          <div class="body statistics">
            <div class="flexrow">${keys.map(key => statistics(key))}</div>
            <sl-button
              style="margins: auto;"
              @click=${this.device.nrpnSetFromKey('NRPN_STATS_RESET', 0)}
            >
              Statistics Reset
            </sl-button>
          </div>
        `;
      }
*/

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
