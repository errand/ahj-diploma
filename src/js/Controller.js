import { defer, fromEvent, merge } from 'rxjs';
import {
  switchMap, takeUntil, mergeMap, tap, first,
} from 'rxjs/operators';
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
    const draggableElement = this.ui.container.querySelector('[data-id="dropzone"]');
    this._placeholder = document.createElement('div');
    this._placeholder.id = 'draggablePlaceholder';
    this._placeholder.innerText = 'Drop files here';

    const dragEnter$ = defer(() => fromEvent(draggableElement, 'dragenter').pipe(
      tap(event => {
        draggableElement.classList.add('dragenter');
        draggableElement.appendChild(this._placeholder);
      }),
    ));
    const dragLeave$ = defer(() => fromEvent(draggableElement, 'dragleave').pipe(
      tap(event => {
        draggableElement.classList.remove('dragenter');
        this._placeholder.remove();
      }),
    ));
    const dragEnd$ = defer(() => fromEvent(draggableElement, 'dragend').pipe(
      tap(event => {
        this._placeholder.remove();
        draggableElement.classList.remove('dragenter');
      }),
    ));

    const dragOver$ = defer(() => fromEvent(draggableElement, 'dragover').pipe(
      tap(event => {
        event.preventDefault();
        draggableElement.classList.add('dragenter');
        draggableElement.appendChild(this._placeholder);
      }),
    ));

    const drop$ = defer(() => fromEvent(draggableElement, 'drop').pipe(
      tap(event => {
        event.preventDefault();
        this._placeholder.remove();
        draggableElement.classList.remove('dragenter');
      }),
    ));

    const dragAndDrop$ = dragEnter$.pipe(
      mergeMap(() => dragOver$),
      switchMap(() => merge(
        dragLeave$.pipe(first()),
        drop$.pipe(takeUntil(dragEnd$)),
      )),
    );

    dragAndDrop$.subscribe(e => {
      const dt = e.dataTransfer;
      const { files } = dt;
      this.handleFiles(files);
    });
  }

  handleFiles(files) {
    // console.log(files);
    const formData = new FormData();
    ([...files]).forEach(file => {
      formData.append(file.name, file);
    });
    this.methods.createPost({ text: formData, type: 'file', host: true }, request => {
      // console.log(request.response);
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
      this.methods.createPost({ text, type, host: true }, request => {
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
