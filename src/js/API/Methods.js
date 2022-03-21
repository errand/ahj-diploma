import fetcher from './fetcher';

export default class Methods {
  countAllPosts(callback) {
    const options = {
      method: 'GET',
      query: 'api/messages/count',
      callback,
    };

    return fetcher(options);
  }

  getAllPosts(callback, start = '-1', end = '-10') {
    const options = {
      method: 'GET',
      query: `api/messages/all?start=${start}&end=${end}`,
      callback,
    };

    return fetcher(options);
  }

  createUser(data, callback) {
    const options = {
      method: 'POST',
      query: 'method=createUser',
      data,
      callback,
    };

    return fetcher(options);
  }

  createPost(data, callback) {
    const options = {
      method: 'POST',
      query: 'api/messages/add',
      data,
      callback,
    };

    return fetcher(options);
  }
}
