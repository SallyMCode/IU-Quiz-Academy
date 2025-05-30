import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ggf. ersetzen durch Live-URL im Deployment
});

export default api;