import { ResponsiveContext } from 'grommet';
import React, { FC, useContext } from 'react';
import { useTitle } from '../../../../hooks/useTitle';
import Desktop from './Desktop';
import Mobile from './Mobile';

interface Props {
  title: string;
  changeTitle?: boolean;
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const PrivatePageLayout: FC<Props> = ({
  children,
  title,
  rightComponent,
  topComponent,
  changeTitle,
}) => {
  useTitle(`${title} - Octopus`, changeTitle);
  const size = useContext(ResponsiveContext);

  return size === 'small' ? (
    <Mobile topComponent={topComponent} rightComponent={rightComponent}>
      {children}
    </Mobile>
  ) : (
    <Desktop topComponent={topComponent} rightComponent={rightComponent}>
      {children}
    </Desktop>
  );
};

export default PrivatePageLayout;
