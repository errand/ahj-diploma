export default class Loader {
  constructor(container) {
    this.container = document.querySelector(container);
  }

  start() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    this.container.appendChild(loader);
  }

  stop() {
    const loader = document.getElementById('loader');
    loader.classList.add('hide');
    setTimeout(() => {
      loader.remove();
    }, 0);
  }
}
