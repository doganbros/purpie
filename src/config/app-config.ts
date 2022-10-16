import { base, grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { CaretDownFill, CaretRightFill } from 'grommet-icons';

export const theme: typeof grommet = deepMerge(base, {
  global: {
    font: {
      family: 'HelveticaNeue, Poppins, sans-serif',
    },
    colors: {
      brand: '#9060EB',
      'brand-alt': '#7D4CDB',
      'status-disabled': '#8F9BB3',
      'status-unknown': '#8F9BB3',
      'status-disabled-light': '#E4E9F2',
      'status-unknown-light': '#E4E9F2',
      'status-info': '#16A8DE',
      blue: '#0091FF',
      dark: '#202631',
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
        indigo: '-5px 5px 30px #3D138D26',
        peach: '0px 2px 20px 0px #FFE7E380',
        left: '-2px 0px 3px rgb(255 231 227 / 50%)',
        right: '2px 0px 3px rgb(255 231 227 / 50%)',
      },
      dark: {
        indigo: '0 5px 15px #3D138D35',
        left: '-2px 0px 3px rgb(255 231 227 / 50%)',
        right: '2px 0px 3px rgb(255 231 227 / 50%)',
      },
    },
    control: {
      border: {
        color: 'light-4',
        radius: '50px',
      },
    },
  },
  checkBox: {
    hover: {
      border: {
        color: 'accent-1',
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
  accordion: {
    icons: {
      collapse: CaretDownFill,
      expand: CaretRightFill,
      color: 'brand',
    },
    border: {
      color: 'status-disabled-light',
    },
  },
} as ThemeType);
