import api from "./api";

export function processDispense(prescriptionId) {
  return api.post(`/dispense/${prescriptionId}`);
}

export function getAllDispenses() {
  return api.get("/dispense/history");
}

export function getAllBills() {
  return api.get("/dispense/bills");
}
