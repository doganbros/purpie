import { useTranslation } from 'react-i18next';

export const useTranslate = (
  page: string
): ((key: string, isCommon?: boolean, options?: any) => string) => {
  const { t } = useTranslation();
  return (key, isCommon, options) =>
    t(`${isCommon ? 'common' : page}.${key}`, options);
};
