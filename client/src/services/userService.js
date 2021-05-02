import http from './httpService';
import { apiUrl } from '../config.json';
import { login } from './authService';

const userApiEndPoint = apiUrl + '/users';

export function register(user) {
  return http.post(userApiEndPoint, {
    email: user.email,
    name: user.name,
    password: user.password,
  });
}

export async function editProfile(profileChanges, loginInfo) {
  const loginResult = await login(loginInfo, false);
  http.setJwt(loginResult.jwt);
  const editResult = await http.post(userApiEndPoint + '/edit', profileChanges);
  return { ...editResult.data };
}

export async function changeEmail(email, loginInfo) {
  const loginResult = await login(loginInfo, false);
  http.setJwt(loginResult.jwt);
  const emailResult = await http.post(userApiEndPoint + '/change-email', {
    email,
  });
  return { ...emailResult.data };
}
export async function changePassword(password, loginInfo) {
  const loginResult = await login(loginInfo, false);
  http.setJwt(loginResult.jwt);
  const passwordResult = await http.post(userApiEndPoint + '/change-password', {
    password,
  });
  return { ...passwordResult.data };
}

export async function resetPassword(password, jwt) {
  http.setJwt(jwt);
  const passwordResult = await http.post(userApiEndPoint + '/reset-password', {
    password,
  });
  return { ...passwordResult.data };
}

export async function forgotPassword(email) {
  const forgotResult = await http.post(apiUrl + '/forgot-password', { email });

  return { ...forgotResult.data };
}
