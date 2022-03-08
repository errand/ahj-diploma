import fetcher from './fetcher';

export default class Methods {
  getAllPosts(callback, start = '1', limit = '10') {
    const options = {
      method: 'GET',
      query: `api/messages/all?start=${start}&limit=${limit}`,
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

  createTextPost(data, callback) {
    const options = {
      method: 'POST',
      query: 'api/messages/add',
      data,
      callback,
    };

    return fetcher(options);
  }

  getIndex(name, callback) {
    const options = {
      method: 'GET',
      query: `method=getUserByName&name=${name}`,
      callback,
    };

    return fetcher(options);
  }
}
