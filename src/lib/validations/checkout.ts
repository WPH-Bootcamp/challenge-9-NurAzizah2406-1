import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Alamat pengiriman minimal 10 karakter")
    .max(255, "Alamat terlalu panjang"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["cash", "transfer", "e-wallet"], {
    errorMap: () => ({ message: "Pilih metode pembayaran" }),
  }),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
