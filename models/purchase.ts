import { Purchase } from "@prisma/client";

export interface PurchaseBody {
  bankRecipientId: Purchase["bankRecipientId"];
  consultationId: Purchase["consultationId"];
  paymentNumber?: Purchase["paymentNumber"];
}
