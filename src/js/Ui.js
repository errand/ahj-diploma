import Methods from './API/Methods';

export default class Ui {
  constructor() {
    this.container = null;
    this.messages = null;
    this.chatSection = null;
    this.methods = new Methods();
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
    this.methods.getAllPosts(request => {
      console.log(request.response);
    });
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}
