import messages from "@/app/constants/messages.json";
import {
  HAS_BOTH_UPPER_AND_LOWER_CASE_REGEX,
  HAS_NUMBER_OR_SYMBOL,
  PASSWORD_MIN_LENGTH,
} from "@/app/constants/validation";

export const validateSimpleAddress = (data: any) =>
  !!data?.address || messages.validation.required;

export const validateFullAddress = (data: any) =>
  !!(
    data?.address &&
    data?.city &&
    data?.postalCode &&
    data?.subDivisionPubId
  ) || "Please enter a valid address.";

export const validateZIPCode = (value: string) =>
  (!Number.isNaN(value) && value.length === 5) || "Please enter valid zipcode.";

export const validatePasswordLength = (password: string) =>
  (password?.length ?? 0) >= PASSWORD_MIN_LENGTH;

export const validateUpperAndLowerCaseInclusion = (value: string) => {
  return HAS_BOTH_UPPER_AND_LOWER_CASE_REGEX.test(value);
};

export const validateNumberOrSymbolInclusion = (value: string) => {
  return HAS_NUMBER_OR_SYMBOL.test(value);
};

export const validatePassword = (value: string) => {
  const hasBothUpperAndLowerCase = validateUpperAndLowerCaseInclusion(value);
  const hasNumberOrSymbol = validateNumberOrSymbolInclusion(value);

  return hasBothUpperAndLowerCase && hasNumberOrSymbol;
};
