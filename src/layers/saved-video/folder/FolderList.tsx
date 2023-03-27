import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'grommet';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { FolderListItem } from './FolderListItem';
import { AppState } from '../../../store/reducers/root.reducer';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

interface FolderListProps {
  postId: string;
  selectedFolderIds: string[];
}

export const FolderList: FC<FolderListProps> = ({
  postId,
  selectedFolderIds,
}) => {
  const {
    folder: { folderList },
  } = useSelector((state: AppState) => state);

  return (
    <ExtendedBox gap="xsmall" overflow={{ vertical: 'auto' }} maxHeight="225px">
      {folderList.loading && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
      )}
      {!folderList.loading && folderList.data.length === 0 ? (
        <Text size="small">No folder found!</Text>
      ) : (
        folderList.data.map((folder) => (
          <FolderListItem
            key={`folder-item-${folder.id}`}
            id={folder.id}
            name={folder.title}
            videoCount={folder.itemCount}
            selected={selectedFolderIds.includes(folder.id)}
            postId={postId}
          />
        ))
      )}
    </ExtendedBox>
  );
};
