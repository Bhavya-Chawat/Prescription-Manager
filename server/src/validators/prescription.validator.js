const { z } = require("zod");

const createPrescriptionSchema = z.object({
  body: z
    .object({
      patientId: z.string().min(1).optional(),
      patientName: z.string().min(1).optional(),
      doctor: z.string().min(1),
      department: z.string().optional(),
      items: z
        .array(
          z.object({
            medicineId: z.string().min(1),
            dosage: z.string().optional(),
            quantity: z.number().int().positive(),
          })
        )
        .min(1),
    })
    .refine((data) => data.patientId || data.patientName, {
      message: "Either patientId or patientName must be provided",
      path: ["patientId"],
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const getPrescriptionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

module.exports = { createPrescriptionSchema, getPrescriptionSchema };
