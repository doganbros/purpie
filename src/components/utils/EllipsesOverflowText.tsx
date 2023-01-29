import { Text, TextProps } from 'grommet';
import React, { FC } from 'react';
import styled from 'styled-components';

interface Props extends TextProps {
  maxWidth?: string;
  lineClamp?: number;
  text?: string;
}

const EllipsesOverflowTextStyled = styled(Text)`
  display: ${({ display }: { display?: string }) => display};
  max-width: ${(props: Props) => props.maxWidth || '102px'};
  -webkit-line-clamp: ${(props: Props) => props.lineClamp || 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: ${(props: Props) => props.textAlign || 'start'};
`;

const EllipsesOverflowText: FC<Props> = ({ text, ...props }) => {
  const splitText = text?.split(' ');
  if (splitText && splitText.length > 1)
    return (
      <EllipsesOverflowTextStyled {...props} display="-webkit-box">
        {text}
      </EllipsesOverflowTextStyled>
    );
  return (
    <EllipsesOverflowTextStyled {...props} display="block">
      {text}
    </EllipsesOverflowTextStyled>
  );
};
export default EllipsesOverflowText;
