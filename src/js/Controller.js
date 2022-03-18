import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import Methods from './API/Methods';
import Socket from './API/Socket';

export default class Controller {
  constructor(ui) {
    this.ui = ui;
    this.methods = new Methods();
  }

  init() {
    this.ui.drawUi();
    this.addEventListeners();
    this.draggableFunc();
  }

  draggableFunc() {
    const draggableElement = this.ui.container;

    const draggable = (el) => {
      const dragStart$ = fromEvent(draggableElement, 'mousedown');
      const moveDrag$ = fromEvent(document, 'mousemove');
      const endDrag$ = fromEvent(draggableElement, 'mouseup');

      return dragStart$.pipe(
        switchMap(event => {
          event.stopPropagation();
          const diffX = draggableElement.offsetLeft - event.clientX;
          const diffY = draggableElement.offsetTop - event.clientY;
          return moveDrag$.pipe(
            map(event => {
              const { clientX, clientY } = event;
              return {
                x: clientX + diffX,
                y: clientY + diffY,
              };
            }),
            takeUntil(endDrag$),
          );
        }),
      );
    };

    draggable(draggableElement).subscribe(coord => {
      console.log(coord);
    });
  }

  addEventListeners() {
    this.ui.texarea.addEventListener('input', e => this.onInputText(e));
    this.ui.sendButton.addEventListener('click', e => this.onSendButtonClick(e));
    this.ui.messages.addEventListener('scroll', e => this.onMessagesScroll(e));
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
      let type = 'text';
      if (this.checkTextForLinks(text)) type = 'link';
      this.methods.createTextPost({ text, type, host: true }, request => {
        this.ui.insertPostToDOM(request.response);
        this.ui.texarea.value = '';
        this.ui.texarea.style.height = 'auto';
      });
    }
  }

  onMessagesScroll(e) {
    const scroll = e.target.scrollTop;
    if (scroll === 0 && this.ui.start >= 0) {
      this.ui.start -= this.ui.messagesLimit;
      this.ui.end -= this.ui.messagesLimit;

      if (this.ui.start < 0) { this.ui.start = 0; }
      if (this.ui.end < 0) { this.ui.end = this.ui.messagesLimit; }
      this.methods.countAllPosts(request => {
        this.methods.getAllPosts(req => {
          req.response.forEach(post => {
            if (!this.ui.messages.querySelector(`[data-id="${post.id}"]`)) {
              this.ui.insertPostToDOM(post, true);
            }
          });
        }, this.ui.start, this.ui.end);
      });
    }
  }

  createUser(data) {
    this.methods.createUser(data, response => {
      this.currentUser = response;
      this.socket = new Socket(this.currentUser);
      this.socket.init();
    });
  }

  checkTextForLinks(text) {
    const linkRule = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g;
    const emailRule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    if (text.match(linkRule) || text.match(emailRule)) {
      return true;
    }
    return false;
  }
}
