import api from './api';

export function createPrescription(data) {
  return api.post('/prescriptions', data);
}

export function getPrescription(id) {
  return api.get(`/prescriptions/${id}`);
}

export function getAllPrescriptions() {
  return api.get('/prescriptions');
}
