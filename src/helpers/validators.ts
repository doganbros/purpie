/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import i18n from '../config/i18n/i18n-config';

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

const requiredMsg = (field: string) =>
  i18n.t('validators.requiredMsg', { field });
const urlMsg = i18n.t('validators.urlMsg');
const emailMsg = i18n.t('validators.emailMsg');
const notEmptyStringMsg = i18n.t('validators.notEmptyStringMsg');
const numericMsg = i18n.t('validators.numericMsg');
const alphaMsg = i18n.t('validators.alphaMsg');
const regexMsg = i18n.t('validators.regexMsg');
const alphaNumericMsg = i18n.t('validators.alphaNumericMsg');
const intMsg = i18n.t('validators.intMsg');
const floatMsg = i18n.t('validators.floatMsg');
const wordsMsg = i18n.t('validators.wordsMsg');

const ruleWrapper = (
  rule: (...args: any[]) => boolean,
  defaultMsg: string,
  customMsg?: string
) => {
  return (value: any, data: any) => {
    if (rule(value, data)) return undefined;
    return customMsg || defaultMsg;
  };
};

export const validators = {
  required: (field: string, message?: string) =>
    ruleWrapper(required, requiredMsg(field), message),
  email: (message?: string) => ruleWrapper(isEmail, emailMsg, message),
  url: (message?: string) => ruleWrapper(isUrl, urlMsg, message),
  defaultRequired: (field: string, message?: string) =>
    ruleWrapper(isDefaultRequiredValue, requiredMsg(field), message),
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
    ruleWrapper(
      isLength(length),
      i18n.t('validators.lengthDefaultMsg', {
        length,
      }),
      message
    ),
  minLength: (field: string, length: number, message?: string) =>
    ruleWrapper(
      minLength(length),
      i18n.t('validators.minLengthDefaultMsg', {
        field,
        length,
      }),
      message
    ),
  maxLength: (length: number, message?: string) =>
    ruleWrapper(
      maxLength(length),
      i18n.t('validators.maxLengthDefaultMsg', {
        length,
      }),
      message
    ),
  equals: (value: any, message?: string) =>
    ruleWrapper(
      equals(value),
      i18n.t('validators.equalsDefaultMsg', {
        value,
      }),
      message
    ),
  equalsField: (field: any, fieldLabel: any, message?: string) =>
    ruleWrapper(
      equalsField(field),
      i18n.t('validators.equalsFieldDefaultMsg', {
        fieldLabel,
      }),
      message
    ),
  True: (message?: string) =>
    ruleWrapper(isTrue, i18n.t('validators.trueDefaultMsg'), message),
  False: (message?: string) =>
    ruleWrapper(isFalse, i18n.t('validators.falseDefaultMsg'), message),
  bigger: (value: number, message?: string) =>
    ruleWrapper(
      isBigger(value),
      i18n.t('validators.biggerDefaultMsg', {
        value,
      }),
      message
    ),
  biggerOrEqual: (value: number, message?: string) =>
    ruleWrapper(
      isBiggerOrEqual(value),
      i18n.t('validators.biggerOrEqualDefaultMsg', {
        value,
      }),
      message
    ),
  smaller: (value: any, message?: string) =>
    ruleWrapper(
      isSmaller(value),
      i18n.t('validators.smallerDefaultMsg', {
        value,
      }),
      message
    ),
  smallerOrEqual: (value: any, message?: string) =>
    ruleWrapper(
      isSmallerOrEqual(value),
      i18n.t('validators.smallerOrEqualDefaultMsg', {
        value,
      }),
      message
    ),
  startsWith: (value: any, message?: string) =>
    ruleWrapper(
      startsWith(value),
      i18n.t('validators.startsWithDefaultMsg', {
        value,
      }),
      message
    ),
};
