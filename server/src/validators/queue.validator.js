const { z } = require('zod');

const enqueueSchema = z.object({
  body: z.object({
    prescriptionId: z.string().min(1),
    priority: z.number().int().min(0).max(3),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = { enqueueSchema };