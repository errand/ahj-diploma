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
    this.form = this.container.querySelector('.form');
    this.texarea = this.form.querySelector('.form-textarea textarea');
    this.sendButton = this.form.querySelector('[data-id="send"]');
    this.audioButton = this.form.querySelector('[data-id="audio"]');
  }

  drawUi() {
    this.checkBinding();
    this.texarea.setAttribute('style', `height:${this.texarea.scrollHeight}px;overflow-y:hidden;`);
    this.texarea.addEventListener('input', (e) => this.onInput(e));
  }

  onInput(e) {
    if (this.texarea.value.trim() === '') {
      this.sendButton.style.display = 'none';
      this.audioButton.style.display = 'block';
    } else {
      this.audioButton.style.display = 'none';
      this.sendButton.style.display = 'block';
    }
    this.texarea.style.height = 'auto';
    this.texarea.style.height = `${this.texarea.scrollHeight}px`;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}
