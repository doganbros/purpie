import React from 'react';
import { Text } from 'grommet';

const Highlight: ({
  text,
  render,
  startsWith,
  match,
  includes,
}: {
  text: any;
  render: any;
  startsWith?: any;
  match?: any;
  includes?: any;
}) => JSX.Element = ({
  text,
  render,
  startsWith = null,
  match = '[a-z]+',
  includes = null,
}) => {
  const parts = text.split(
    new RegExp(startsWith ? `(${startsWith}${match})` : `(${includes})`, 'gi')
  );
  return (
    <Text style={{ whiteSpace: 'break-spaces' }}>
      {parts.map((part: string) =>
        (startsWith ? part.startsWith(startsWith) : part.includes(includes))
          ? render(part)
          : part
      )}
    </Text>
  );
};

export default Highlight;
