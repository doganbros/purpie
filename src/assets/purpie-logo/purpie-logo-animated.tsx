import * as React from 'react';

interface PurpieLogoAnimatedProps {
  width?: number;
  height?: number;
  viewBox?: string;
  fill?: string;
  xmlns?: string;
  role?: string;
  color: string;
}

const PurpieLogoAnimated: React.FC<PurpieLogoAnimatedProps> = (
  props: PurpieLogoAnimatedProps
) => {
  const { color, width, height, viewBox, fill, xmlns, role } = props;
  return (
    <svg
      width={width || 217}
      height={height || 256}
      viewBox={viewBox || '0 0 217 256'}
      fill={fill || 'none'}
      xmlns={xmlns || 'http://www.w3.org/2000/svg'}
      role={role || 'img'}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.65 24.02C62.16 14.3996 74.81 7.2296 90.26 7.0696C116 6.7996 137.17 7.1796 149.55 10.6696C158.95 13.3196 164.22 15.5896 170.41 22.18C180.7 33.12 183.06 47.45 183.99 60.89C184.63 70.17 185 84.2 175.82 101.67C163.89 120.38 149.6 123.15 138.84 125.32C128.96 127.31 106.39 121.98 101.45 127.82C100.57 128.86 99.4 132.01 96.39 136.43C95.51 137.73 94.39 139.14 92.81 140.81C86.54 147.44 76.01 147.58 67.64 146.49C49.56 142.65 46.69 127.32 46.64 124.04C46.22 95.63 42.7499 62.81 45.1099 46.47C46.3799 37.54 50.22 28.07 53.65 24.02Z"
        stroke={color}
        strokeWidth={12}
      />
      <path
        d="M114.62 82.89C122.91 82.89 129.63 76.1698 129.63 67.88C129.63 59.5902 122.91 52.87 114.62 52.87C106.33 52.87 99.61 59.5902 99.61 67.88C99.61 76.1698 106.33 82.89 114.62 82.89Z"
        fill={color}
      >
        {/* circle */}
        <animate
          attributeName="fill-opacity"
          values="0;1;0.5;0;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M89.59 72.59C89.59 78.09 85.09 82.59 79.59 82.59H70C64.5 82.59 60 78.09 60 72.59V63C60 57.5 64.5 53 70 53H79.59C85.09 53 89.59 57.5 89.59 63V72.59Z"
        fill={color}
      >
        {/* square */}
        <animate
          attributeName="fill-opacity"
          values="1;0.5;0;0;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M163.09 73.88C168.81 70.58 168.81 65.18 163.09 61.88L149.23 53.88C143.51 50.58 138.84 53.28 138.84 59.88V75.89C138.84 82.49 143.52 85.19 149.23 81.89L163.09 73.88Z"
        fill={color}
      >
        {/* triangle */}
        <animate
          attributeName="fill-opacity"
          values="0;0;1;0.75;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M35.36 207.86V223.45C35.36 235.62 30.11 239.04 22.6 239.04C17.85 239.04 15.01 236.46 14.01 235.12V248.8C14.01 253.14 11.68 255.47 7.33997 255.47H6.67004C2.33004 255.47 0 253.14 0 248.8V198.85C0 194.51 2.32997 192.18 6.58997 192.18C10.17 192.18 12.39 193.84 13.01 196.95C13.87 195.12 17 192.18 22.6 192.18C30.1 192.19 35.36 195.69 35.36 207.86ZM21.1801 208.53C21.1801 205.36 19.18 204.61 17.59 204.61C16 204.61 14 205.36 14 208.53V222.79C14 225.96 16 226.71 17.59 226.71C19.18 226.71 21.1801 225.96 21.1801 222.79V208.53Z"
        fill={color}
      />
      <path
        d="M42.36 220.54V198.86C42.36 194.52 44.69 192.19 49.03 192.19H49.78C54.12 192.19 56.45 194.52 56.45 198.86V222.63C56.45 225.8 58.45 226.55 60.12 226.55C61.62 226.55 63.71 225.8 63.71 222.63V198.86C63.71 194.52 66.04 192.19 70.38 192.19H71.13C75.47 192.19 77.8 194.52 77.8 198.86V220.54C77.8 231.96 71.13 239.05 60.12 239.05C48.78 239.05 42.36 231.96 42.36 220.54Z"
        fill={color}
      />
      <path
        d="M110.4 198.02V198.52C110.4 202.94 107.65 204.52 103.9 206.11C101.15 207.28 99.73 209.95 99.73 214.62V232.38C99.73 236.72 97.4001 239.05 93.0601 239.05H92.39C88.05 239.05 85.72 236.72 85.72 232.38V198.86C85.72 194.52 88.0501 192.19 92.3101 192.19C95.8601 192.19 98.08 193.82 98.71 196.88C99.32 194.77 101.17 192.19 104.82 192.19C108.49 192.19 110.4 194.35 110.4 198.02Z"
        fill={color}
      />
      <path
        d="M151.85 207.86V223.45C151.85 235.62 146.6 239.04 139.09 239.04C134.34 239.04 131.5 236.46 130.5 235.12V248.8C130.5 253.14 128.17 255.47 123.83 255.47H123.16C118.82 255.47 116.49 253.14 116.49 248.8V198.85C116.49 194.51 118.82 192.18 123.08 192.18C126.66 192.18 128.88 193.84 129.5 196.95C130.36 195.12 133.49 192.18 139.09 192.18C146.59 192.19 151.85 195.69 151.85 207.86ZM137.67 208.53C137.67 205.36 135.67 204.61 134.08 204.61C132.49 204.61 130.49 205.36 130.49 208.53V222.79C130.49 225.96 132.49 226.71 134.08 226.71C135.67 226.71 137.67 225.96 137.67 222.79V208.53Z"
        fill={color}
      />
      <path
        d="M158.43 179.34C158.43 174.75 162.18 171 166.77 171C171.44 171 175.19 174.75 175.19 179.34C175.19 183.93 171.44 187.59 166.77 187.59C162.18 187.6 158.43 183.93 158.43 179.34ZM166.44 239.05C162.1 239.05 159.77 236.72 159.77 232.38V198.86C159.77 194.52 162.1 192.19 166.44 192.19H167.11C171.45 192.19 173.78 194.52 173.78 198.86V232.38C173.78 236.72 171.45 239.05 167.11 239.05H166.44Z"
        fill={color}
      />
      <path
        d="M199.13 239.05C187.96 239.05 181.45 231.96 181.45 220.79V210.7C181.45 199.28 187.95 192.19 199.13 192.19C210.3 192.19 216.89 198.78 216.89 210.2V213.2C216.89 217.54 214.56 219.87 210.22 219.87H195.54V223.96C195.54 226.96 197.54 227.63 199.13 227.63C202.04 227.63 202.84 226.54 203.66 225.41C204.57 224.17 205.51 222.88 209.3 222.88H210.55C214.39 222.88 216.3 224.13 216.05 226.47C215.55 233.13 209.3 239.05 199.13 239.05ZM195.54 210.28H202.79V207.53C202.79 204.36 200.79 203.69 199.12 203.69C197.45 203.69 195.53 204.36 195.53 207.53V210.28H195.54Z"
        fill={color}
      />
    </svg>
  );
};

export default PurpieLogoAnimated;
