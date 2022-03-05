import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import Post from './Post';

export default class Controller {
  constructor(ui) {
    this.ui = ui;
    this.messages = new Set();
    this.URL = 'https://errand-ahj-rxjs.herokuapp.com/messages/unread';
    // this.URL = 'http://localhost:7070/messages/unread';
  }

  init() {
    this.ui.drawUi();
    // this.subscribeStream();
  }

  subscribeStream() {
    const getRequest = ajax.getJSON(this.URL);
    this.messagesStream$ = interval(2000)
      .pipe(
        switchMap(() => getRequest.pipe(
          map((response) => response.messages.filter(
            message => !this.messages.has(message.id),
          )),
          catchError(err => of(false)),
        )),
      )

      .subscribe((response) => {
        response.forEach(el => {
          const post = new Post(el);
          this.ui.chatSection.prepend(post.create());
        });
      });
  }
}
