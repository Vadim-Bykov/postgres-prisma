import { AuthenticationButton } from "@/app/_components/common/AuthenticationButton";
import { Form } from "@/app/_components/common/Form";
import { Input } from "@/app/_components/common/input/Input";
import { InputSelect } from "@/app/_components/common/input/InputSelect";
import messages from "@/app/constants/messages.json";
import { PurchaseBody } from "@/models/purchase";
import {
  useCreatePurchaseMutation,
  useGetUserPurchaseQuery,
  useUpdatePurchaseMutation,
} from "@/store/features/api/subApi/purchase";
import { useBonusToPayConsultation } from "@/utils/apiUtils/bonus";
import { useAppRouter } from "@/utils/useAppRouter";
import { Banking } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OptionHTMLAttributes } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  bankRecipientId: string;
  paymentNumber?: string | null;
  paidByBonus?: number;
}

export function PaymentCheckRequest({ banking }: { banking: Banking[] }) {
  const { id: consultationId } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const { data: userPurchase } = useGetUserPurchaseQuery({
    consultationId: consultationId as string,
  });
  const { walletBallance, sumToPayByBonus } = useBonusToPayConsultation(
    consultationId as string
  );

  const { push, isTransitioning } = useAppRouter();

  const [
    purchaseConsultation,
    {
      data: createdPurchase,
      isSuccess: isPurchased,
      isLoading: isPurchasing,
      isError: isCreatePurchaseError,
      error: createPurchaseError,
    },
  ] = useCreatePurchaseMutation();
  const [
    updatePurchase,
    {
      data: updatedPurchase,
      isSuccess: isUpdated,
      isLoading: isUpdating,
      isError: isUpdatePurchaseError,
      error: updatePurchaseError,
    },
  ] = useUpdatePurchaseMutation();

  const userHasPurchase =
    !!userPurchase || !!createdPurchase || !!updatedPurchase;

  const bankOptions: OptionHTMLAttributes<HTMLOptionElement>[] =
    banking.map((bank) => ({
      value: bank.id,
      label: bank.number,
    })) ?? [];

  const defaultBankValue = userHasPurchase
    ? banking.findIndex((bank) => userPurchase?.bankRecipientId === bank.id) + 1
    : 0;

  const onSubmit = handleSubmit(
    async ({ bankRecipientId, paymentNumber, paidByBonus }: FormData) => {
      if (bankRecipientId === "0") {
        setError("bankRecipientId", { message: messages.validation.required });
        return;
      }

      const purchase: PurchaseBody = {
        bankRecipientId: +bankRecipientId,
        consultationId: +consultationId,
        paymentNumber,
        paidByBonus: paidByBonus ? +paidByBonus : undefined,
      };

      userHasPurchase
        ? await updatePurchase(purchase)
        : await purchaseConsultation(purchase);

      push("/account/purchases");
    }
  );

  return (
    <Form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="text-xs">
        <p>
          После оплаты, пожалуйста нажмите кнопку &quot;Проверить оплату&quot;.
        </p>
        <p>
          Вы также можете мне прислать копию чека об оплате в мессенджерах или
          на эл.почту.
        </p>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <p>
          Укажите пожалуйста номер карты банка получателя, на которую
          производили оплату (
          {banking?.map(({ number, id }, index) => (
            <span key={id}>
              {number}
              {index !== banking.length - 1 && ", "}
            </span>
          ))}
          ).
        </p>
        <InputSelect
          defaultValue={defaultBankValue}
          label="Номер карты банка получателя"
          error={errors.bankRecipientId?.message}
          {...register("bankRecipientId")}
          options={[
            {
              label: "Выберите номер карты банка получателя",
              value: 0,
              disabled: true,
              hidden: true,
            },
            ...bankOptions,
          ]}
        />
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <p>
          По возможности укажите пожалуйста последние 4 цифры номер счета, с
          которого производилась оплата.
        </p>
        <Input
          label="Номер счета оплаты"
          {...register("paymentNumber")}
          defaultValue={
            userPurchase ? userPurchase.paymentNumber || "" : undefined
          }
        />
      </div>

      {walletBallance > 0 && !userHasPurchase && (
        <div className="flex flex-col gap-1 text-xs">
          <p>
            Укажите пожалуйста количество бонусных баллов, которыми хотите
            оплатить консультацию (не более {sumToPayByBonus}).
          </p>
          <Input
            label="Количество бонусных баллов для оплаты"
            error={errors.paidByBonus?.message}
            {...register("paidByBonus", {
              validate: (sum) => {
                if (sumToPayByBonus && sum) {
                  return (
                    sumToPayByBonus >= +sum ||
                    `Вы можете оплатить бонусными баллами только  ${sumToPayByBonus}.`
                  );
                }
              },
            })}
          />
        </div>
      )}

      <AuthenticationButton
        authenticationForActionRequired
        type="submit"
        className="self-start"
        disabled={isPurchasing || isUpdating || isTransitioning}
        loading={isPurchasing || isUpdating || isTransitioning}
      >
        {userHasPurchase ? "Исправить данные об оплате" : "Проверить оплату"}
      </AuthenticationButton>
      <span
        className={clsx(
          "overflow-hidden text-green-600",
          "transition-max-height duration-500 ease-in-out",
          isPurchased || isUpdated ? "max-h-28" : "max-h-0"
        )}
      >
        {
          messages.payments[
            createdPurchase?.paymentStatus ||
              updatedPurchase?.paymentStatus ||
              "CHECKING"
          ]
        }
      </span>
      <Link
        className={clsx(
          "text-purple font-semibold overflow-hidden",
          isPurchased || isUpdated ? "max-h-28" : "max-h-0"
        )}
        href={"/account/purchases"}
      >
        Перейти в личный кабинет
      </Link>
      <span
        className={clsx(
          "overflow-hidden text-pink",
          "transition-max-height duration-500 ease-in-out",
          isCreatePurchaseError || isUpdatePurchaseError
            ? "max-h-28"
            : "max-h-0"
        )}
      >
        {/* @ts-ignore */}
        {createPurchaseError?.data?.message ||
          // @ts-ignore
          updatePurchaseError?.data?.message}
      </span>
    </Form>
  );
}
