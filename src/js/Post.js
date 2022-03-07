import moment from 'moment';

export default class Post {
  constructor(data) {
    this.data = data;
    this.host = this.data.host;
  }

  template(data) {
    const div = document.createElement('div');
    div.classList.add('post');
    if (this.host) {
      div.classList.add('host');
    }
    div.dataset.id = data.id;
    div.innerHTML = `<div class="content">${data.text}</div>
          <div class="datetime">${moment(data.received).format('hh:mm DD.MM.YYYY')}</div> `;
    return div;
  }

  create() {
    if (this.data) {
      const result = this.template(this.data);
      setTimeout(() => result.classList.add('show'), 350);

      return result;
    }
    return false;
  }
}
