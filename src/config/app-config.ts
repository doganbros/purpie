import { grommet, base } from 'grommet';

export const theme: typeof grommet = {
  ...grommet,
  global: {
    ...grommet.global,
    font: {
      ...grommet.global?.font,
      family: 'HelveticaNeue, Poppins, sans-serif',
    },
    colors: {
      ...base.global?.colors,
      brand: '#9060EB',
    },
    input: {
      ...grommet.global?.input,
      extend: 'color: grey;',
      padding: { vertical: '15px' },
      font: {
        weight: 'normal',
        size: 'small',
      },
    },
    elevation: {
      ...grommet.global?.elevation,
      light: {
        xlarge: '-5px 5px 30px #3D138D26',
      },
    },
  },
  button: {
    color: 'white',
    border: {
      width: '0px',
    },
    extend: 'font-size: 16px; padding: 8px 4px; font-weight: 500;',
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
      margin: { horizontal: '8px' },
      size: '14px',
      color: {
        light: '#202631',
      },
    },
  },
};
