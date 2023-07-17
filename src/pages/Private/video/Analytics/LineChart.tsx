/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';

interface ChartValuesProps {
  label: string;
  value: number[];
}

interface LineChartProps {
  title: string;
  percentage: string;
  chartValues: ChartValuesProps[];
}

const LineChart: FC<LineChartProps> = ({ title, percentage, chartValues }) => {
  const gradient = [
    { value: 0, color: 'transparent' },
    { value: 100, color: '#9060EB' },
  ];

  return (
    <Box
      width="100%"
      height="100%"
      border={{ color: '#EFF0F6', size: 'small' }}
      round
      pad="small"
      elevation="small"
    >
      <Text size="small">{title}</Text>
      <Text size="small" weight="bold">
        {percentage}
      </Text>
      {/* <Box> */}
      {/* <Box pad={{ top: 'small' }}> */}
      <Chart
        bounds={[
          [0, 7],
          [0, 100],
        ]}
        values={[...chartValues]}
        aria-label={title}
        type="line"
        animate
        color="brand"
        thickness="xxsmall"
        round
      />
      {/* </Box> */}
      {/* <Chart
          bounds={[
            [0, 7],
            [0, 100],
          ]}
          values={[...chartValues]}
          aria-label={title}
          type="area"
          animate
          color={gradient}
          round
        /> */}
      {/* </Box> */}
    </Box>
  );
};

export default LineChart;
