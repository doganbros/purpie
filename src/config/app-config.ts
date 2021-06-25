import { grommet, base } from 'grommet';

export const theme: typeof grommet = {
  ...grommet,
  global: {
    ...grommet.global,
    font: {
      ...grommet.global?.font,
      family: 'HelveticaNeue',
    },
    input: {
      ...grommet.global?.input,
      extend: 'color: grey;',
      font: {
        weight: 'normal',
      },
    },
  },
  formField: {
    ...grommet.formField,
    border: {
      side: 'all',
      color: {
        dark: base.global?.colors?.['dark-6']?.toString(),
        light: base.global?.colors?.['light-5']?.toString(),
      },
    },
    round: 'medium',
    label: {
      margin: { horizontal: 'none' },
    },
  },
};
