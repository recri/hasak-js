import { LitElement, html, css } from 'lit';
import './hasak-midi.js';

export class HasakJs extends LitElement {

  static get properties() {
    return {
      title: { type: String },
    };
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

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'hasak-js';
  }

  midiCallback(midi) { this.midi = midi; }

  menuRender() {
    if (this.midi) {
      console.log(`this.midi = ${this.midi}`);
      if (this.midi.devices) console.log(`this.midi.devices = ${this.midi.devices}`);
      if (this.midi.dev) console.log(`this.midi.dev = ${this.midi.dev.keys().join(' ')}`);
    }
    // this.midi.devices.forEach(d => console.log(`${d}: ${this.midi.dev[d].views.keys().join(' ')}`));
    return html``;
  }
  
  render() {
    return html`
      <main>
	<div class="app-bar">
	  <img src="../assets/keyer-logo-512x128.svg" alt="A keyer icon" style="width:96px;height:24px" />
	  hasak-js
	  <img src="../node_modules/@mdi/svg/svg/menu.svg" alt="A menu icon" style="width:24px;height:24px" />
	  <div class="menu">${this.menuRender()}</div>
	</div>
	<hasak-midi .app=${this}></hasak-midi>
      </main>

      <p class="app-footer">
      </p>
    `;
  }
}

