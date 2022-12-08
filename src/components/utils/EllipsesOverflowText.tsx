import { Text, TextProps } from 'grommet';
import React, { FC } from 'react';
import styled from 'styled-components';

interface Props extends TextProps {
  maxWidth?: string;
  lineClamp?: number;
}

const EllipsesOverflowTextStyled = styled(Text)`
  display: -webkit-box;
  max-width: ${(props: Props) => props.maxWidth || '102px'};
  -webkit-line-clamp: ${(props: Props) => props.lineClamp || 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: ${(props: Props) => props.textAlign || 'start'};
`;

const EllipsesOverflowText: FC<Props> = (props) => (
  <EllipsesOverflowTextStyled {...props} />
);
export default EllipsesOverflowText;
