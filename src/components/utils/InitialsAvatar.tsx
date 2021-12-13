import React, { FC } from 'react';
import { Avatar } from 'grommet';
import { UserBasic } from '../../store/types/auth.types';

interface InitialsAvatarProps {
  user?: UserBasic;
}

const getColorFromId = (id: number): { background: string; color: string } => {
  const colors = [
    { background: '#FFD130', color: '#143D59' },
    { background: '#E2B000', color: '#355703' },
    { background: '#FF8F00', color: '#093636' },
    { background: '#DB730E', color: '#FFE8FE' },
    { background: '#AD5D11', color: '#FFFFFF' },
    { background: '#FFDD68', color: '#0180D7' },
    { background: '#7C0579', color: '#EEEEEE' },
    { background: '#FF9E68', color: '#074066' },
    { background: '#210070', color: '#6AF6DC' },
    { background: '#1B0352', color: '#FF9613' },
    { background: '#3A3A3A', color: '#8AE8E7' },
    { background: '#45428E', color: '#46F7FF' },
    { background: '#0F0994', color: '#FFC846' },
    { background: '#441576', color: '#3CE8A0' },
    { background: '#5C00C0', color: '#B0FF47' },
    { background: '#2822C1', color: '#FF8700' },
    { background: '#FFA781', color: '#5B0E2D' },
    { background: '#FFB8B1', color: '#8F0B22' },
    { background: '#FF694D', color: '#5B0E2D' },
    { background: '#FF81A1', color: '#4A172B' },
    { background: '#E92E5D', color: '#96D577' },
    { background: '#BB133E', color: '#F7DBE6' },
    { background: '#FF8181', color: '#4B0722' },
    { background: '#E96A53', color: '#FFFFFF' },
    { background: '#6AF6DC', color: '#5E001F' },
    { background: '#BDFFF6', color: '#E23C52' },
    { background: '#99EEDF', color: '#095245' },
    { background: '#BDEFFF', color: '#F60021' },
    { background: '#99EE9A', color: '#5D2DBF' },
    { background: '#095245', color: '#6AF6DC' },
    { background: '#006C0F', color: '#9AFF99' },
    { background: '#20B197', color: '#FFF000' },
    { background: '#3C0D6F', color: '#D4FF9B' },
    { background: '#966AEA', color: '#99FF69' },
    { background: '#7349C1', color: '#FFDD68' },
    { background: '#4A1CA1', color: '#6AF6DC' },
    { background: '#5C00CA', color: '#F870E6' },
    { background: '#A06FD4', color: '#100C5A' },
    { background: '#6F459B', color: '#A6FFF8' },
    { background: '#562BA7', color: '#FCD3FF' },
    { background: '#6AF6DC', color: '#562BA7' },
    { background: '#BDEFFF', color: '#2D045A' },
    { background: '#45428E', color: '#FFC600' },
    { background: '#210070', color: '#E0FF00' },
    { background: '#AA13BB', color: '#FFC2F7' },
    { background: '#D70DC0', color: '#6AF6DC' },
    { background: '#F481FF', color: '#5D200B' },
    { background: '#7648CE', color: '#38FFD0' },
    { background: '#D03DD4', color: '#DBC970' },
    { background: '#E91500', color: '#31CEFF' },
    { background: '#B6351D', color: '#9DF66C' },
    { background: '#B13051', color: '#C5F1F9' },
    { background: '#552834', color: '#96D577' },
    { background: '#139BBB', color: '#FFFFFF' },
    { background: '#F5A0A0', color: '#095245' },
    { background: '#7A4F47', color: '#99EE9A' },
    { background: '#D1584C', color: '#6AF6DC' },
    { background: '#18FFE6', color: '#8900FF' },
    { background: '#FFB4F6', color: '#1B0352' },
    { background: '#A3F27C', color: '#D70DC0' },
    { background: '#018156', color: '#FFD130' },
    { background: '#7A1186', color: '#6AF6DC' },
    { background: '#6AF6DC', color: '#552834' },
    { background: '#F870E6', color: '#FFF000' },
    { background: '#FFC600', color: '#D70DC0' },
    { background: '#6BE200', color: '#0F0994' },
    { background: '#00DAFF', color: '#ED0000' },
    { background: '#DDA876', color: '#7C0579' },
    { background: '#8581D5', color: '#FFD300' },
    { background: '#3D559E', color: '#FFB875' },
    { background: '#48AE49', color: '#EEEEEE' },
    { background: '#7FB4F6', color: '#492391' },
  ];
  return colors[id % colors.length];
};
const InitialsAvatar: FC<InitialsAvatarProps> = ({ user }) =>
  user ? (
    <Avatar round background={getColorFromId(user.id)}>
      {user?.firstName[0]}
      {user?.lastName[0]}
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
export default InitialsAvatar;
