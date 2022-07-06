import React, { FC, useMemo } from 'react';
import { Text, TextExtendedProps } from 'grommet';

interface RenderHighlightProps {
  match: string;
}

interface HighlightProps {
  text: string;
  match: RegExp;
  textProps?: TextExtendedProps;
  renderHighlight: FC<RenderHighlightProps>;
}

const Highlight: FC<HighlightProps> = ({
  text,
  textProps,
  renderHighlight,
  match,
}) => {
  const parts = useMemo(() => text.split(match), [text, match]);
  return (
    <Text {...textProps}>
      {parts.map((part: string) =>
        part.match(match) ? renderHighlight({ match: part }) : part
      )}
    </Text>
  );
};

export default Highlight;
