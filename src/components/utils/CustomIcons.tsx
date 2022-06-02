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

export const At: FC<IconProps> = (props) => (
  <Blank {...props}>
    <svg
      width="20"
      height="20"
      viewBox="-4 -4 20 20"
      fill="#000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.124 1.598C11.0787 1.08467 9.83267 0.828003 8.386 0.828003C6.78067 0.828003 5.341 1.164 4.067 1.836C2.793 2.508 1.79667 3.44834 1.078 4.657C0.359333 5.86567 0 7.24 0 8.78C0 10.2267 0.284667 11.461 0.854 12.483C1.42333 13.505 2.24933 14.2843 3.332 14.821C4.41467 15.3577 5.71667 15.6353 7.238 15.654L7.546 14.324C5.614 14.3147 4.13467 13.8363 3.108 12.889C2.08133 11.9417 1.568 10.572 1.568 8.78C1.568 7.52934 1.82467 6.40234 2.338 5.399C2.85133 4.39567 3.605 3.60234 4.599 3.019C5.593 2.43567 6.78067 2.144 8.162 2.144C9.34733 2.144 10.3553 2.35634 11.186 2.781C12.0167 3.20567 12.642 3.80067 13.062 4.566C13.482 5.33134 13.692 6.22734 13.692 7.254C13.692 7.97267 13.5987 8.59567 13.412 9.123C13.2253 9.65034 12.9803 10.0493 12.677 10.32C12.3737 10.5907 12.0493 10.726 11.704 10.726C11.4613 10.726 11.2747 10.6677 11.144 10.551C11.0133 10.4343 10.948 10.236 10.948 9.956C10.948 9.89067 10.9573 9.774 10.976 9.606L11.242 7.912C11.27 7.688 11.284 7.478 11.284 7.282C11.284 6.666 11.1533 6.12234 10.892 5.651C10.6307 5.17967 10.2527 4.81334 9.758 4.552C9.26333 4.29067 8.67533 4.16 7.994 4.16C7.19133 4.16 6.46333 4.35834 5.81 4.755C5.15667 5.15167 4.64333 5.7 4.27 6.4C3.89667 7.1 3.71 7.88867 3.71 8.766C3.71 9.42867 3.836 10.0143 4.088 10.523C4.34 11.0317 4.69 11.426 5.138 11.706C5.586 11.986 6.09933 12.126 6.678 12.126C7.97533 12.126 8.96 11.51 9.632 10.278C9.64133 10.9313 9.821 11.4027 10.171 11.692C10.521 11.9813 10.9993 12.126 11.606 12.126C12.2593 12.126 12.873 11.909 13.447 11.475C14.021 11.041 14.4783 10.4483 14.819 9.697C15.1597 8.94567 15.33 8.11267 15.33 7.198C15.33 5.89134 15.057 4.75967 14.511 3.803C13.965 2.84634 13.1693 2.11134 12.124 1.598ZM8.456 10.362C8.07333 10.6047 7.658 10.726 7.21 10.726C6.63133 10.726 6.16233 10.5323 5.803 10.145C5.44367 9.75767 5.264 9.23267 5.264 8.57C5.264 7.96334 5.37367 7.43367 5.593 6.981C5.81233 6.52834 6.10867 6.18067 6.482 5.938C6.85533 5.69534 7.27067 5.574 7.728 5.574C8.344 5.574 8.82933 5.756 9.184 6.12C9.53867 6.484 9.716 6.988 9.716 7.632C9.716 8.26667 9.60167 8.81967 9.373 9.291C9.14433 9.76234 8.83867 10.1193 8.456 10.362Z"
        fill="#000"
      />
    </svg>
  </Blank>
);
