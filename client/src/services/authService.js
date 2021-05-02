import http from './httpService';
import { apiUrl } from '../config.json';

const tokenKey = 'token';
const authApiEndpoint = apiUrl + '/auth';

http.setJwt(getJwtWithSession());

export async function login(user, rememberMe) {
  const result = await http.post(authApiEndpoint, user);
  if (rememberMe) {
    localStorage.setItem(tokenKey, result.data.jwt);
  }
  return result.data;
}

export async function loginWithJwt() {
  const result = await http.get(apiUrl + '/users/me');
  return result.data;
}

export function logout() {
  localStorage.removeItem(tokenKey);
  sessionStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getJwtWithSession() {
  return sessionStorage.getItem(tokenKey);
}
