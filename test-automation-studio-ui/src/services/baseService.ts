import client from './AxiosInstance';
import { trackPromise } from 'react-promise-tracker';

export default class BaseService {
  headers = {};
  url_prefix: string;

  constructor(url_prefix = '') {
    this.url_prefix = url_prefix;
    this.getHeaders();
  }

  async get(url: string, queryParams: any = null) {
    return trackPromise(client.get(this.getUrl(url) + this.mapQueryParams(queryParams), {
      headers: this.headers
    }));
  }

  async post(url: string, body: any, queryParams: any = null) {
    return trackPromise(client.post(
      this.getUrl(url) + this.mapQueryParams(queryParams),
      body,
      {
        method: 'POST',
        headers: this.headers
      }
    ));
  }

  async patch(url: string, body: any, queryParams: any = null) {
    return trackPromise(client.patch(
      this.getUrl(url) + this.mapQueryParams(queryParams),
      body,
      {
        headers: this.headers
      }
    ));
  }

  async put(url: string, body: any, queryParams: any = null) {
    return trackPromise(client.put(
      this.getUrl(url) + this.mapQueryParams(queryParams),
      body,
      {
        method: 'PUT',
        headers: this.headers
      }
    ));
  }

  async remove(url: string, queryParams: any = null) {
    return trackPromise(client.delete(this.getUrl(url) + this.mapQueryParams(queryParams), {
      method: 'DELETE',
      headers: this.headers
    }));
  }

  getUrl(url: string) {
    return this.url_prefix + url;
  }

  getHeaders() {
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  mapQueryParams(queryParams: { [x: string]: string; } | null) {
    return queryParams
      ? '?' + Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&')
      : '';
  }
}
