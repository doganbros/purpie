import React, { FC } from 'react';
import { useTitle } from '../../../hooks/useTitle';

interface Props {
  title: string;
  changeTitle?: boolean;
}

const PublicPageLayout: FC<Props> = ({ children, title, changeTitle }) => {
  useTitle(`${title} - Pavilion`, changeTitle);

  return <> {children} </>;
};

export default PublicPageLayout;
