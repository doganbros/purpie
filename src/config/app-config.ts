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
    },
    drop: {
      background: 'white',
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
    round: 'medium',
    label: {
      margin: { horizontal: '8px' },
      size: '14px',
      color: {
        light: '#202631',
      },
    },
  },
} as ThemeType);
