export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^([а-яё]+|[a-z]+)$/i;
export const HAS_BOTH_UPPER_AND_LOWER_CASE_REGEX =
  /(?=.*[a-z])(?=.*[A-Z]).{1,}$/;
export const HAS_NUMBER_OR_SYMBOL = /(?=.*[0-9\W]).{1,}/;
export const CITY_NAME_VALIDATION =
  /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

export const PASSWORD_MIN_LENGTH = 8;
