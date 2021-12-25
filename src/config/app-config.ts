import { grommet, base, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

export const theme: typeof grommet = deepMerge(base, {
  global: {
    font: {
      family: 'HelveticaNeue, Poppins, sans-serif',
    },
    colors: {
      brand: '#9060EB',
      'brand-2': '#7D4CDB',
      'status-disabled': '#8F9BB3',
      'status-unknown': '#8F9BB3',
      'status-disabled-light': '#E4E9F2',
      'status-unkown-light': '#E4E9F2',
      'status-info': '#16A8DE',
    },
    drop: {
      background: 'white',
      extend: () => `
        font-size: ${base.text?.small?.size};
        & > * > * > *:hover {
          font-weight: bold;
          background: #E4E9F2;
        };
      `,
    },
    input: {
      extend: 'color: grey;',
      padding: { vertical: '15px' },
      font: {
        weight: 'normal',
        size: 'small',
      },
    },
    elevation: {
      light: {
        xlarge: '-5px 5px 30px #3D138D26',
      },
      dark: {
        medium: '0 5px 15px #3D138D35',
      },
    },
    control: {
      border: {
        color: 'light-4',
        radius: '50px',
      },
    },
  },
  layer: {
    border: {
      radius: '20px',
      intelligentRounding: true,
    },
  },
  button: {
    primary: {
      extend: 'color: white;',
    },
  },
  formField: {
    border: {
      side: 'all',
      color: {
        dark: base.global?.colors?.['dark-6']?.toString(),
        light: base.global?.colors?.['light-5']?.toString(),
      },
    },
    round: 'large',
    label: {
      margin: { horizontal: 'small' },
      size: 'small',
      color: {
        light: '#202631',
      },
    },
    error: {
      background: {
        color: 'status-critical',
        opacity: 'weak',
      },
      size: 'small',
    },
  },
} as ThemeType);
