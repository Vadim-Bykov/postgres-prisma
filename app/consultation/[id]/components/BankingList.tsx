import { IconButton } from "@/app/components/atoms/common/IconButton";
import { Banking } from "@prisma/client";
import Image from "next/image";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const PAYMENT_SYSTEM_LOGO: { [key in Banking["paymentSystem"]]: string } = {
  MASTERCARD: require("@/public/icons/payment/mastercard.svg"),
  VISA: require("@/public/icons/payment/visa.svg"),
  MIR: require("@/public/icons/payment/mir.png"),
};

function BankingItem({
  bankName,
  number,
  ownerName,
  currency,
  paymentSystem,
}: Banking) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <p>{bankName} </p>
        <Image
          alt="Payment system logo"
          className="w-8 h-auto"
          src={PAYMENT_SYSTEM_LOGO[paymentSystem]}
        />
      </div>

      <CopyToClipboard text={number.split(" ").join("")}>
        <div className="flex gap-3 cursor-pointer">
          <p>{number}</p>
          <IconButton
            iconProps={{ name: "file-copy-line.svg", color: "purple" }}
          />
        </div>
      </CopyToClipboard>

      <p>Валюта - {currency}</p>

      {ownerName && <p>{ownerName}</p>}
    </div>
  );
}

export function BankingList({ banking }: { banking: Banking[] }) {
  return banking?.map((bankingData) => (
    <BankingItem key={bankingData.id} {...bankingData} />
  ));
}
