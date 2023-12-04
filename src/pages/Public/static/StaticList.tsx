import React, { FC } from 'react';
import StaticText from './StaticText';

interface Props {
  tKeys: string[];
  searchText?: string;
}

const StaticList: FC<Props> = ({ tKeys, searchText }) => {
  return (
    <ul style={{ margin: '0' }}>
      {tKeys.map((tKey) => (
        <li key={tKey}>
          <StaticText tKey={tKey} searchText={searchText} />
        </li>
      ))}
    </ul>
  );
};

export default StaticList;
