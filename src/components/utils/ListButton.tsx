import React, { FC, useState } from 'react';
import { Box, BoxExtendedProps } from 'grommet';

const ListButton: FC<BoxExtendedProps & { selected?: boolean }> = (props) => {
  const [hover, setHover] = useState(false);
  const setBackgroundColor = () => {
    if (hover) return 'status-disabled-light';
    if (props.selected) return 'brand';
    return 'white';
  };

  return (
    <Box
      fill
      background={setBackgroundColor()}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      pad="small"
      {...props}
    />
  );
};

export default ListButton;
