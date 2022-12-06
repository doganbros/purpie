import { Box, DropButton, Heading } from 'grommet';
import { Add, Close } from 'grommet-icons';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { CreateFolder } from './CreateFolder';
import { FolderList } from './FolderList';
import ExtendedBox from '../../../components/utils/ExtendedBox';

interface AddToFolderDropProps {
  postId: number;
  dropLabels: (isActive: boolean) => ReactNode;
}

export const AddToFolderDrop: FC<AddToFolderDropProps> = ({
  postId,
  dropLabels,
}) => {
  const {
    folder: { folderList },
  } = useSelector((state: AppState) => state);

  const [open, setOpen] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
  const [createMode, setCreateMode] = useState(false);

  useEffect(() => {
    folderList.data.forEach((f) => {
      const postFolderIndex = f.folderItems.findIndex(
        (item) => item.postId === postId
      );
      if (postFolderIndex !== -1) setSelectedFolderIds((ids) => [...ids, f.id]);
      else setSelectedFolderIds((ids) => ids.filter((id) => id !== f.id));
    });
  }, [folderList]);

  return (
    <DropButton
      plain
      label={dropLabels(selectedFolderIds.length !== 0)}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      dropProps={{ round: 'small' }}
      dropAlign={{ top: 'bottom' }}
      dropContent={
        <ExtendedBox
          pad="small"
          background={{ color: 'white' }}
          boxShadow="0px 0px 30px rgba(61, 19, 141, 0.25)"
          minWidth="220px"
          gap="small"
          onClick={(e) => e.stopPropagation()}
        >
          <Box direction="row" justify="between" align="center">
            <Heading color="dark" level={6} margin="none">
              {createMode ? 'Create New Folder' : 'Save to This Folder'}
            </Heading>
            <Box onClick={() => setCreateMode((mode) => !mode)}>
              {createMode ? <Close size="18px" /> : <Add size="18px" />}
            </Box>
          </Box>
          {createMode ? (
            <CreateFolder closeDrop={() => setCreateMode(false)} />
          ) : (
            <FolderList postId={postId} selectedFolderIds={selectedFolderIds} />
          )}
        </ExtendedBox>
      }
    />
  );
};
