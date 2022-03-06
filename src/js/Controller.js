import Methods from './API/Methods';

export default class Controller {
  constructor(ui) {
    this.ui = ui;
    this.methods = new Methods();
  }

  init() {
    this.ui.drawUi();
    this.addEventListeners();
  }

  addEventListeners() {
    this.ui.texarea.addEventListener('input', e => this.onInputText(e));
    this.ui.sendButton.addEventListener('click', e => this.onSendButtonClick(e));
  }

  onInputText(e) {
    if (this.ui.texarea.value.trim() === '') {
      this.ui.sendButton.style.display = 'none';
      this.ui.audioButton.style.display = 'block';
    } else {
      this.ui.audioButton.style.display = 'none';
      this.ui.sendButton.style.display = 'block';
    }
    this.ui.texarea.style.height = 'auto';
    this.ui.texarea.style.height = `${this.ui.texarea.scrollHeight}px`;
  }

  onSendButtonClick(e) {
    e.preventDefault();
    if (this.ui.texarea.value.trim() !== '') {
      const text = this.ui.texarea.value;
      this.methods.createPost({ text: this.ui.texarea.value }, request => {
        console.log(request.response);
      });
    }
  }
}
