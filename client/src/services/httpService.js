import axios from "axios";

export function setJwt(token) {
  axios.defaults.headers.common["x-auth-token"] = token;
}
const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
export default http;
