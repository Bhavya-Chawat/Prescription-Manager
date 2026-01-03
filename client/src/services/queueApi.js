import api from './api';

export function snapshot() {
  return api.get('/queue');
}

export function enqueue(data) {
  return api.post('/queue', data);
}

export function callNext() {
  return api.post('/queue/next');
}
