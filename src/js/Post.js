import moment from 'moment';

export default class Post {
  constructor(data) {
    this.data = data;
  }

  template(data) {
    const div = document.createElement('div');
    div.classList.add('post');
    div.dataset.id = data.id;
    div.innerHTML = `<div class="author">${data.from}, </div>
          <div class="content">${this.truncateText(data.body, 15)}</div>
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

  truncateText(str, n) {
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n - 1);
    return `${subString}&hellip;`;
  }
}
