import axios from 'axios';
import qs from 'querystring';
import url from 'url';
import { getAuthToken } from './authentication';
import app from '../../src/app';

export const port = app.get('port') || 8998;
export const makeGetRequest = async (path: string, params: any = {}, header: any = {}) => {
  const url = getUrl(path);
  return await axios.get(url, {
    params: {
      ...params
    },
    headers: {
      ...header,
      'Authorization': await getAuthToken()
    }
  });
};
export const makePostRequest = async (path: string, body: any, header: any = {}) => {
  const url = getUrl(path);
  return await axios.post(url, body, {
    headers: {
      ...header,
      'Authorization': await getAuthToken()
    }
  });
};
export const makePatchRequest = async (path: string, body: any, header: any = {}) => {
  const url = getUrl(path);
  return await axios.patch(url, body, {
    headers: {
      ...header,
      'Authorization': await getAuthToken()
    }
  });
};

export const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});