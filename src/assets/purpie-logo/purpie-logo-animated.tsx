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
      height={height || 200}
      viewBox={viewBox || '0 0 217 200'}
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
    </svg>
  );
};

export default PurpieLogoAnimated;
