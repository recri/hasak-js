import { LitElement, html, css } from 'lit';

export class HasakJson extends LitElement {

  static get properties() {
    return {
      view: { type: Object },	// the parent view, which provides style
      key: { type: String }, 	// the device property key
      property: { type: Object }, // the device property value
    };
  }

  static get styles() {
    return css`
`;
  }

  render() {
    return html`<div>${this.key} ${Object.entries(this.property).map((k,v) => html`${k}: ${v}`).join(', ')}</div>`;
  }
}

