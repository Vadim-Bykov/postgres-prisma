"use client";

import Icon from "@/app/_components/common/Icon/Icon";
import { cn } from "@/utils/css";
import { validatePasswordLength } from "@/utils/validation";
import { HTMLAttributes } from "react";

const requirements = [
  // {
  //   label: "Upper and lowercase letters",
  //   validationRule: validateUpperAndLowerCaseInclusion,
  // },
  {
    label: "Минимум 8 символов",
    validationRule: validatePasswordLength,
  },
  // {
  //   label: "Contains a number or symbol",
  //   validationRule: validateNumberOrSymbolInclusion,
  // },
];

function PasswordRequirement({
  label,
  fulfilled,
}: {
  label: string;
  fulfilled: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-xs font-medium mb-1",
        fulfilled ? "text-green-500" : "text-purple-light"
      )}
    >
      <Icon
        name="checkmark.svg"
        size={14}
        color={fulfilled ? "green" : "purple-light"}
      />
      {label}
    </li>
  );
}

export function PasswordRequirements({
  password,
  containerClassName,
}: {
  password: string;
  containerClassName?: HTMLAttributes<HTMLUListElement>["className"];
}) {
  return (
    <ul className={containerClassName}>
      {requirements.map(({ label, validationRule }) => (
        <PasswordRequirement
          key={label}
          label={label}
          fulfilled={validationRule(password)}
        />
      ))}
    </ul>
  );
}
