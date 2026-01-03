import api from './api';

export function getMedicineByCode(code) {
  return api.get(`/inventory/medicines/${encodeURIComponent(code)}`);
}

export function getAllMedicines() {
  return api.get('/inventory/medicines');
}

export function createMedicine(data) {
  return api.post('/inventory/medicines', data);
}

export function getExpiringBatches(days) {
  const params = days ? { days } : {};
  return api.get('/inventory/batches/expiring', { params });
}
