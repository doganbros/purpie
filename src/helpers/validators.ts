/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const isExisty = (value: any) => value !== null && value !== undefined;
const isEmpty = (value: any) => value === '';
const isDefaultRequiredValue = (value: any) =>
  value === undefined || value === '';
const required = (value: any) => isExisty(value) && !isEmpty(value);
const matchRegexp = (value: any, regexp: RegExp) =>
  !isExisty(value) || isEmpty(value) || regexp.test(value);
const notEmptyString = (value: any) => !isEmpty(value);
const isEmail = (value: any) =>
  matchRegexp(value, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
const isUrl = (value: any) =>
  matchRegexp(
    value,
    /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)|\/|\?)*)?$/i
  );
const isTrue = (value: any) => value === true;
const isFalse = (value: any) => value === false;
const isNumeric = (value: any) =>
  typeof value === 'number'
    ? true
    : matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
const isAlpha = (value: any) => matchRegexp(value, /^[A-Z]+$/i);
const matches = (regex: RegExp) => (value: string) => matchRegexp(value, regex);
const isAlphanumeric = (value: any) => matchRegexp(value, /^[0-9A-Z]+$/i);
const isInt = (value: any) => matchRegexp(value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
const isFloat = (value: any) =>
  matchRegexp(value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE]?(?:\d+))?$/);
const isWords = (value: any) => matchRegexp(value, /^[A-Z\s]+$/i);
const startsWith = (str: string) => (value: any) =>
  !isEmpty(value) && value.startsWith(str);
const isLength = (length: number) => (value: any) =>
  !isExisty(value) || isEmpty(value) || value.length === length;
const equals = (eql: any) => (value: any) =>
  !isExisty(value) || isEmpty(value) || value === eql;
const equalsField = (field: any) => (value: any, values: any) =>
  value === values[field];
const maxLength = (length: number) => (value: any) =>
  !isExisty(value) || value.length <= length;
const minLength = (length: number) => (value: any) =>
  !isExisty(value) || isEmpty(value) || value.length >= length;
const isBigger = (n: number) => (value: any) => !isExisty(value) || value > n;
const isSmaller = (n: number) => (value: any) => !isExisty(value) || value < n;
const isBiggerOrEqual = (n: number) => (value: any) =>
  !isExisty(value) || value >= n;
const isSmallerOrEqual = (n: number) => (value: any) =>
  !isExisty(value) || value <= n;

const requiredMsg = 'This field is required';
const urlMsg = 'Please enter a valid url';
const emailMsg = 'Please enter a valid email';
const notEmptyStringMsg = "This field can't be empty";
const numericMsg = 'Please enter a numeric value';
const alphaMsg = 'Please enter only alphabets';
const regexMsg = 'Value is invalid';
const alphaNumericMsg = 'Please enter only alphabets and numbers';
const intMsg = 'Please enter only numbers';
const floatMsg = 'Please enter only decimal numbers';
const wordsMsg = 'Please enter a collection of words';

const ruleWrapper = (
  rule: (...args: any[]) => boolean,
  defaultMsg: string,
  customMsg?: string
) => {
  return (value: any, data: any) => {
    if (rule(value, data)) return undefined;
    return defaultMsg || customMsg;
  };
};

export const validators = {
  required: (message?: string) => ruleWrapper(required, requiredMsg, message),
  email: (message?: string) => ruleWrapper(isEmail, emailMsg, message),
  url: (message?: string) => ruleWrapper(isUrl, urlMsg, message),
  defaultRequired: (message?: string) =>
    ruleWrapper(isDefaultRequiredValue, requiredMsg, message),
  notEmptyString: (message?: string) =>
    ruleWrapper(notEmptyString, notEmptyStringMsg, message),
  numeric: (message?: string) => ruleWrapper(isNumeric, numericMsg, message),
  alpha: (message?: string) => ruleWrapper(isAlpha, alphaMsg, message),
  matches: (pattern: RegExp, message?: string) =>
    ruleWrapper(matches(pattern), message || regexMsg),
  alphaNumeric: (message?: string) =>
    ruleWrapper(isAlphanumeric, alphaNumericMsg, message),
  int: (message?: string) => ruleWrapper(isInt, intMsg, message),
  float: (message?: string) => ruleWrapper(isFloat, floatMsg, message),
  words: (message?: string) => ruleWrapper(isWords, wordsMsg, message),
  length: (length: number, message?: string) =>
    ruleWrapper(isLength(length), `must be ${length} characters long`, message),
  minLength: (length: number, message?: string) =>
    ruleWrapper(
      minLength(length),
      `Please enter at least ${length} characters long`,
      message
    ),
  maxLength: (length: number, message?: string) =>
    ruleWrapper(
      maxLength(length),
      `Please enter up to ${length} characters long`,
      message
    ),
  equals: (value: any, message?: string) =>
    ruleWrapper(equals(value), `This field must be equal to ${value}`, message),
  equalsField: (field: any, fieldLabel: any, message?: string) =>
    ruleWrapper(
      equalsField(field),
      `This field does not match ${fieldLabel}`,
      message
    ),
  True: (message?: string) =>
    ruleWrapper(isTrue, `This field must be True`, message),
  False: (message?: string) =>
    ruleWrapper(isFalse, `This field must be False`, message),
  bigger: (value: number, message?: string) =>
    ruleWrapper(isBigger(value), `must be bigger than ${value}`, message),
  biggerOrEqual: (value: number, message?: string) =>
    ruleWrapper(
      isBiggerOrEqual(value),
      `This field must be bigger or equal to ${value}`,
      message
    ),
  smaller: (value: any, message?: string) =>
    ruleWrapper(
      isSmaller(value),
      `This field must be smaller than ${value}`,
      message
    ),
  smallerOrEqual: (value: any, message?: string) =>
    ruleWrapper(
      isSmallerOrEqual(value),
      `This field must be smaller or equal to ${value}`,
      message
    ),
  startsWith: (value: any, message?: string) =>
    ruleWrapper(
      startsWith(value),
      `This field must start with ${value}`,
      message
    ),
};
