import api from './api';

export function processDispense(prescriptionId) {
  return api.post(`/dispense/${prescriptionId}`);
}
