const { z } = require('zod');

const getMedicineByCodeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ code: z.string().min(1) }),
  query: z.object({}).optional(),
});

const getExpiringBatchesSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({ days: z.string().optional() }),
});

module.exports = { getMedicineByCodeSchema, getExpiringBatchesSchema };