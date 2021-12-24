import { Blank, IconProps } from 'grommet-icons';
import React, { FC } from 'react';

export const FavoriteFill: FC<IconProps> = (props) => (
  <Blank {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#000"
        stroke="#000"
        strokeWidth="2"
        d="M1,8.4 C1,4 4.5,3 6.5,3 C9,3 11,5 12,6.5 C13,5 15,3 17.5,3 C19.5,3 23,4 23,8.4 C23,15 12,21 12,21 C12,21 1,15 1,8.4 Z"
      />
    </svg>
  </Blank>
);

export const BookmarkFill: FC<IconProps> = (props) => (
  <Blank {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <polygon
        fill="#000"
        stroke="#000"
        strokeWidth="2"
        points="5 1 5 22 12 17 19 22 19 1"
      />
    </svg>
  </Blank>
);
