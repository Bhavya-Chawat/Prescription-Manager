import api from "./api";

export function getMedicineByCode(code) {
  return api.get(`/inventory/medicines/${encodeURIComponent(code)}`);
}

export function getAllMedicines() {
  return api.get("/inventory/medicines");
}

export function createMedicine(data) {
  return api.post("/inventory/medicines", data);
}

export function getExpiringBatches(days) {
  const params = days ? { days } : {};
  return api.get("/inventory/batches/expiring", { params });
}

export function createBatch(data) {
  return api.post("/inventory/batches", data);
}

export function getBatchesForMedicine(medicineId) {
  return api.get(`/inventory/medicines/${medicineId}/batches`);
}

export function updateMedicine(medicineId, data) {
  return api.put(`/inventory/medicines/${medicineId}`, data);
}
