import React, { FC } from 'react';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { FolderListItem } from './FolderListItem';

export const FolderList: FC = () => {
  return (
    <ExtendedBox gap="xsmall" overflow={{ vertical: 'auto' }} maxHeight="225px">
      <FolderListItem id={1} name="Folder 1" videoCount={20} />
      <FolderListItem id={2} name="Folder 2" videoCount={12} />
      <FolderListItem id={3} name="Folder 3" videoCount={32} />
    </ExtendedBox>
  );
};
