import moment from 'moment';
import Autolinker from 'autolinker';

export default class Post {
  constructor(data) {
    this.data = data;
    this.host = this.data.host;
  }

  template(data) {
    const div = document.createElement('div');
    let { body } = data;
    div.classList.add('post');
    div.classList.add(data.type);
    if (this.host) {
      div.classList.add('host');
    }
    if (data.type === 'link') {
      body = Autolinker.link(body, { truncate: 32 });
    }
    div.dataset.id = data.id;
    div.innerHTML = `<div class="content">${body}</div>
          <div class="datetime">${moment(data.received).format('hh:mm DD.MM.YYYY')}</div> `;
    return div;
  }

  create() {
    if (this.data) {
      const result = this.template(this.data);
      setTimeout(() => result.classList.add('show'), 0);

      return result;
    }
    return false;
  }
}
