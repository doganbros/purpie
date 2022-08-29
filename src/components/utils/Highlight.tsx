import React, { FC } from 'react';
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

const Highlight: FC<HighlightProps> = React.memo(
  ({ text, textProps, renderHighlight, match }) => {
    return (
      <Text {...textProps}>
        {text
          .split(match)
          .map((part: string) =>
            part.match(match) ? renderHighlight({ match: part }) : part
          )}
      </Text>
    );
  }
);

export default Highlight;
