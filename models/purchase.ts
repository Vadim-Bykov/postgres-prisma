import { Consultation, Purchase } from "@prisma/client";

export interface PurchaseBody {
  bankRecipientId: Purchase["bankRecipientId"];
  consultationId: Purchase["consultationId"];
  paymentNumber?: Purchase["paymentNumber"];
}

export interface UserPurchase extends Purchase {
  consultation: Consultation;
}
