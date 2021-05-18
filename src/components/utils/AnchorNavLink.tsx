import { Anchor, AnchorProps } from 'grommet';
import React from 'react';
import { NavLink, LinkProps } from 'react-router-dom';

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  return (
    <Anchor
      as={({ colorProp, hasIcon, hasLabel, focus, ...p }) => <NavLink {...p} />}
      {...props}
    />
  );
};

export type AnchorLinkProps = LinkProps &
  AnchorProps &
  Omit<JSX.IntrinsicElements['a'], 'color'>;
