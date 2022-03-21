import { ajax } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Loader from '../Loader';

const loader = new Loader('.messages');

function fetcher(options) {
  let headers = { 'Content-Type': 'application/json' };

  if (typeof options.data !== 'undefined' && typeof options.data.type !== 'undefined') {
    if (options.data.type === 'file') {
      headers = { 'Content-Type': 'multipart/form-data; multipart/form-data; boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu' };
    }
  }
  // const URL = 'http://localhost:7070';
  const URL = 'https://errand-ahj-diploma.herokuapp.com/';
  const requestUrl = `${URL}/${options.query}`;
  loader.start();

  const request = ajax({
    url: requestUrl,
    method: options.method,
    headers,
    body: options.data ? JSON.stringify(options.data) : null,
  }).pipe(
    catchError(error => of(error)),
  ).subscribe((response) => {
    loader.stop();
    options.callback(response);
  });
}

export default fetcher;
