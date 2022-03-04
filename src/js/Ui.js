export default class Ui {
  constructor() {
    this.container = null;
    this.messages = null;
    this.chatSection = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUi() {
    this.checkBinding();
    const chatSection = document.createElement('div');
    chatSection.classList.add('tickets');
    this.container.appendChild(chatSection);
    this.chatSection = chatSection;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}
