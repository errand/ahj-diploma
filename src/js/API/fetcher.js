import { ajax } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Loader from '../Loader';

const loader = new Loader('.messages');

function fetcher(options) {
  const URL = 'http://localhost:7070';
  // const URL = 'https://errand-ahj-sse-ws-chat.herokuapp.com/';
  const requestUrl = `${URL}/${options.query}`;
  loader.start();

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
    loader.stop();
  });
}

export default fetcher;
