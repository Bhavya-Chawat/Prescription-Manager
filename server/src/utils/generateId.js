export const generatePrescriptionNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `RX-${timestamp}${random}`;
};

export const generateQueueNumber = (priority) => {
  const prefixes = { 1: "E", 2: "U", 3: "S", 4: "L" };
  const prefix = prefixes[priority] || "S";
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${number}`;
};

export const generateBillNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `BL-${timestamp}${random}`;
};

export const generatePatientNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `P-${timestamp}${random}`;
};
