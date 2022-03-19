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

  let body = null;
  if (options.type === 'file') {
    body = options.data;
  } else {
    body = JSON.stringify(options.data);
  }

  const request = ajax({
    url: requestUrl,
    method: options.method,
    headers: options.type === 'file' ? { 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu' } : { 'Content-Type': 'application/json' },
    body,
  }).pipe(
    catchError(error => {
      console.log('error: ', error);
      return of(error);
    }),
  ).subscribe((response) => {
    loader.stop();
    options.callback(response);
  });
}

export default fetcher;
