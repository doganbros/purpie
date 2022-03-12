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

export const LikeFill: FC<IconProps> = (props) => (
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
        d="M1,23 L20,23 C22,23 23,22 23,20 L23,10 L16,10 L16,4 C16,2 15,1 13,1 L11,1 C11,1 10.9842682,7 10.9842677,8.32575545 C10.9842672,9.65151089 10,11 8,11 L1,11 L1,23 Z M6,23 L6,11"
      />
    </svg>
  </Blank>
);
