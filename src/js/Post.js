import moment from 'moment';
import Autolinker from 'autolinker';

export default class Post {
  constructor(data) {
    this.data = data;
    this.host = this.data.host;
    this.linkRule = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g;
    this.emailRule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  }

  template(data) {
    const div = document.createElement('div');
    div.classList.add('post');
    if (this.host) {
      div.classList.add('host');
    }
    if (data.text.match(this.linkRule)) {
      div.classList.add('link');
    }
    div.dataset.id = data.id;
    div.innerHTML = `<div class="content">${this.formatText(data.text)}</div>
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

  formatText(text) {
    if (text.match(this.linkRule) || text.match(this.emailRule)) {
      return Autolinker.link(text, { truncate: 32 });
    }
    return text;
  }
}
