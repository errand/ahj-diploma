import { ajax } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

function fetcher(options) {
  const URL = 'http://localhost:7070';
  // const URL = 'https://errand-ahj-sse-ws-chat.herokuapp.com/';
  const requestUrl = `${URL}/${options.query}`;

  const request = ajax({
    url: requestUrl,
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    body: options.data ? JSON.stringify(options.data) : null,
  }).pipe(
    catchError(error => {
      console.log('error: ', error);
      return of(error);
    }),
  ).subscribe((response) => {
    options.callback(response);
  });
}

export default fetcher;
