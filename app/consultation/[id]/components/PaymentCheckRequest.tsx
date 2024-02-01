import Button from "@/app/components/atoms/common/Button";
import { Input } from "@/app/components/atoms/common/Input";
import { InputSelect } from "@/app/components/atoms/common/InputSelect";
import { Form } from "@/app/components/common/Form";
import { PurchaseBody } from "@/models/purchase";
import { useCreatePurchaseMutation } from "@/store/features/api/subApi/purchase";
import { Banking } from "@prisma/client";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormData {
  bankRecipientId: number;
  paymentNumber: string | null;
}

export function PaymentCheckRequest({ banking }: { banking: Banking[] }) {
  const { register, handleSubmit } = useForm<FormData>();
  const bankOptions = banking.map((bank) => ({
    value: bank.id,
    label: bank.bankName,
  }));

  const { id: consultationId } = useParams();

  const [purchaseConsultation, { isLoading, isError, error }] =
    useCreatePurchaseMutation();

  const onSubmit = handleSubmit(
    async ({ bankRecipientId, paymentNumber }: FormData) => {
      const purchase: PurchaseBody = {
        bankRecipientId: +bankRecipientId,
        consultationId: +consultationId,
        paymentNumber,
      };

      purchaseConsultation(purchase);
    }
  );

  return (
    <Form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1 text-xs">
        <InputSelect
          label="Банк"
          {...register("bankRecipientId")}
          options={bankOptions}
        />
        <p>
          Укажите пожалуйста банк получатель, на который производили оплату (
          {banking?.map(({ bankName }, index) => (
            <span key={bankName}>
              {bankName}
              {index !== banking.length - 1 && ", "}
            </span>
          ))}
          ).
        </p>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <Input label="Номер счета оплаты" {...register("paymentNumber")} />
        <p>
          По возможности укажите пожалуйста последние 4 цифры номер счета, с
          которого производилась оплата.
        </p>
      </div>

      <Button
        type="submit"
        className="self-start"
        disabled={isLoading}
        loading={isLoading}
      >
        Проверить оплату
      </Button>
      <span
        className={clsx(
          "overflow-hidden text-pink",
          "transition-max-height duration-500 ease-in-out",
          isError ? "max-h-28" : "max-h-0"
        )}
      >
        {/* @ts-ignore */}
        {error?.data?.message}
      </span>
    </Form>
  );
}
