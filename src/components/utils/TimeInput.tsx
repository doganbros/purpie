import { Select } from 'grommet';
import React, { FC } from 'react';
import lodash from 'lodash';

interface Props {
  onChange: (hourMinute: [number, number], display?: string) => void;
  defaultValue?: [number, number] | null;
}

const times = lodash.flatten(
  Array(24)
    .fill(null)
    .map((_, i) => {
      const labelNumber = (() => {
        if (i === 0) return 12;
        if (i > 12) return i - 12;
        return i;
      })();

      return [
        {
          label: `${labelNumber}:00 ${i > 11 ? 'PM' : 'AM'}`,
          value: `${i}:0`,
        },
        {
          label: `${labelNumber}:30 ${i > 11 ? 'PM' : 'AM'}`,
          value: `${i}:30`,
        },
      ];
    })
);

const TimeInput: FC<Props> = ({ onChange, defaultValue }) => {
  return (
    <Select
      options={times}
      plain
      defaultValue={
        defaultValue
          ? times.find((v) => v.value === defaultValue?.join(':'))
          : undefined
      }
      labelKey="label"
      placeholder="Pick Time"
      valueKey="value"
      onChange={({ option }) =>
        onChange(option.value.split(':').map(Number), option.label)
      }
    />
  );
};

export default TimeInput;
