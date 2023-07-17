/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, DataChart, Text } from 'grommet';
import Dropdown from './Dropdown';
import Divider from '../../../../components/utils/Divider';

interface ChartValuesProps {
  month: string;
  amount: number;
}

interface ColumnChartProps {
  title: string;
  menuTitle: string;
  chartValues: ChartValuesProps[];
}

const ColumnChart: FC<ColumnChartProps> = ({
  title,
  menuTitle,
  chartValues,
}) => {
  return (
    <Box
      width="100%"
      height="100%"
      border={{ color: '#EFF0F6', size: 'small' }}
      round
      pad="small"
    >
      <Box direction="row" justify="between" align="center">
        <Text size="small">{title}</Text>
        <Box width="small">
          <Dropdown title={menuTitle} menuItems={[]} />
        </Box>
      </Box>
      <Box margin={{ bottom: 'small' }} />
      <Divider />
      <Box margin={{ bottom: 'small' }} />
      <DataChart
        data={chartValues}
        series={[
          {
            property: 'month',
            render: (value) => (
              <Text size="small" color="#838383">
                {value}
              </Text>
            ),
          },
          {
            property: 'amount',
            render: (value) => <Text size="small">{value}</Text>,
          },
        ]}
        chart={{
          property: 'amount',
          color: 'brand',
          thickness: 'small',
          round: true,
        }}
        axis={{
          x: { property: 'month', granularity: 'fine' },
          y: { property: 'percent', granularity: 'fine' },
        }}
      />
    </Box>
  );
};

export default ColumnChart;
