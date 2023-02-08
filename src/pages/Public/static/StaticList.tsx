import React, { FC } from 'react';
import StaticText from './StaticText';

interface Props {
  tKeys: string[];
}

const StaticList: FC<Props> = ({ tKeys }) => {
  return (
    <ul style={{ margin: '0' }}>
      {tKeys.map((tKey) => (
        <li key={tKey}>
          <StaticText tKey={tKey} />
        </li>
      ))}
    </ul>
  );
};

export default StaticList;
