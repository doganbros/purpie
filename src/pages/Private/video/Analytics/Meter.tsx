/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, Chart, Text, Meter } from 'grommet';

interface MeterProps {
  value: number;
  title: string;
  label: string;
  onClick: () => void;
}

const MeterComponent: FC<MeterProps> = ({ title, value, onClick, label }) => {
  return (
    <Box width="100%">
      <Text>{label}</Text>
      <Meter
        value={value}
        aria-label="meter"
        color="brand"
        background="#9060EB85"
        round
      />
    </Box>
  );
};

export default MeterComponent;
