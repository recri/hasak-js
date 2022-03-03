import { LitElement, html, css } from 'lit';
const keyboard_arrow_down = '\u23f7';
const keyboard_arrow_up = '\u23f5';
import '@kor-ui/kor/components/icon';
import '@kor-ui/kor/components/page';
import '@kor-ui/kor/components/app-bar';
import '@kor-ui/kor/components/tabs';
import '@kor-ui/kor/components/drawer';
import '@kor-ui/kor/components/pane';
import '@kor-ui/kor/components/accordion';

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

  render() {
    return html`
      <main>
	<kor-page>
	  <kor-app-bar slot="top" mobile label="hasak-js">
	    <kor-icon slot="left" icon="menu" button
	      onclick="document.querySelector("#left").visible = true"
	    ></kor-icon>
<!--	    <kor-tabs orient="horizontal">
	      <kor-tab-item label="device" disabled></kor-tab-item>
	      <kor-tab-item label="about"></kor-tab-item>
	      <kor-tab-item label="colophon"></kor-tab-item>
	    </kor-tabs> -->
	  </kor-app-bar>
	  <kor-drawer id="left" width="calc(100%-40px)">
	    <kor-accordion label="hasak" disabled></kor-accordion>
	    <kor-accordion label="about"></kor-accordion>
	    <kor-accordion label="colophon"></kor-accordion>
	  </kor-drawer>
	  <kor-accordion label="hasak">
	    <kor-accordion label="enables"></kor-accordion>
	    <kor-accordion label="keyer"></kor-accordion>
	    <kor-accordion label="ptt"></kor-accordion>
	    <kor-accordion label="envelope"></kor-accordion>
	    <kor-accordion label="levels"></kor-accordion>
	    <kor-accordion label="mixers"></kor-accordion>
	    <kor-accordion label="code"></kor-accordion>
	    <kor-accordion label="commands"></kor-accordion>
	  </kor-accordion>
	  <kor-accordion label="about"></kor-accordion>
	  <kor-accordion label="colophon"></kor-accordion>
	</kor-page>
      </main>

      <p class="app-footer">
      </p>
    `;
  }
}

