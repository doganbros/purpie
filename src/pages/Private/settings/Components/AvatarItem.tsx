/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';
import { Edit } from 'grommet-icons';
import { useSelector } from 'react-redux';
import ExtendedBox from '../../../../components/utils/ExtendedBox';
import { AppState } from '../../../../store/reducers/root.reducer';
import {
  REACT_APP_API_VERSION,
  REACT_APP_SERVER_HOST,
} from '../../../../config/http';

export const AvatarItem: FC<{
  label: string;
  menuItems?: any;
  selectedIndex: number;
  changeProfilePic?: any;
  isEditable?: boolean;
  id?: number;
  medium: string;
  photoName?: string;
}> = ({
  label,
  menuItems,
  selectedIndex,
  changeProfilePic,
  isEditable,
  medium,
  photoName,
}) => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  return (
    <Box direction="row">
      <ExtendedBox align="end" justify="center" position="relative">
        {isEditable && (
          <ExtendedBox
            background="#6FFFB0"
            width="20px"
            height="20px"
            round="full"
            justify="center"
            align="center"
            left="0"
            position="relative"
            top="30px"
          >
            <Button
              onClick={changeProfilePic ? () => changeProfilePic() : () => {}}
            >
              <Edit size="small" />
            </Button>
          </ExtendedBox>
        )}
        <Box
          round="full"
          width="80px"
          height="80px"
          border={{ color: '#F2F2F2', size: 'medium' }}
          wrap
          justify="center"
          pad="5px"
        >
          <Avatar
            alignSelf="center"
            size="large"
            round="full"
            src={`${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}/${medium}/display-photo/${photoName}`}
          />
        </Box>
      </ExtendedBox>
      <Box justify="center">
        <Box>
          <Text>{label}</Text>
        </Box>

        <Text color="#8F9BB3">
          {menuItems &&
            (menuItems[selectedIndex]?.role ||
              `${menuItems[selectedIndex]?.members} Members`)}
        </Text>
        <Text color="#8F9BB3">
          {(menuItems && menuItems[selectedIndex]?.whichZone) || ''}
        </Text>
      </Box>
    </Box>
  );
};
