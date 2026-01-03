const { z } = require('zod');

const processDispenseSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ prescriptionId: z.string().min(1) }),
  query: z.object({}).optional(),
});

module.exports = { processDispenseSchema };