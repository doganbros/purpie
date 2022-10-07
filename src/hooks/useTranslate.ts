import { useTranslation } from 'react-i18next';

export const useTranslate = (
  page: string
): ((key: string, isCommon?: boolean) => string) => {
  const { t } = useTranslation();
  return (key: string, isCommon?: boolean) =>
    t(`${isCommon ? 'common' : page}.${key}`);
};
