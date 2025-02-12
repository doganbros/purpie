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
  rightComponentWithoutOverflow?: boolean;
  topComponentWithoutPadTop?: boolean;
}

const PrivatePageLayout: FC<Props> = ({
  children,
  title,
  rightComponent,
  topComponent,
  changeTitle,
  rightComponentWithoutOverflow = false,
  topComponentWithoutPadTop = false,
}) => {
  useTitle(`${title} - Pavilion`, changeTitle);
  const size = useContext(ResponsiveContext);

  return size === 'small' ? (
    <Mobile topComponent={topComponent} rightComponent={rightComponent}>
      {children}
    </Mobile>
  ) : (
    <Desktop
      topComponent={topComponent}
      rightComponent={rightComponent}
      rightComponentWithoutOverflow={rightComponentWithoutOverflow}
      topComponentWithoutPadTop={topComponentWithoutPadTop}
    >
      {children}
    </Desktop>
  );
};

export default PrivatePageLayout;
