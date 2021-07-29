import { ResponsiveContext } from 'grommet';
import { Icon } from 'grommet-icons';
import React, { FC, useContext } from 'react';
import { useTitle } from '../../../../hooks/useTitle';
import Desktop from './Desktop';
import Mobile from './Mobile';

interface Props {
  title: string;
  changeTitle?: boolean;
  icon?: Icon;
  rightSideItem?: React.ReactNode;
}

const PrivatePageLayout: FC<Props> = ({
  children,
  title,
  rightSideItem: RightSideItem,
  changeTitle,
}) => {
  useTitle(title, changeTitle);
  const size = useContext(ResponsiveContext);

  return size === 'small' ? (
    <Mobile title={title} rightSideItem={RightSideItem}>
      {children}
    </Mobile>
  ) : (
    <Desktop title={title} rightSideItem={RightSideItem}>
      {children}
    </Desktop>
  );
};

export default PrivatePageLayout;
