import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from 'grommet';
import Divider from '../../../../utils/Divider';
import ExtendedBox from '../../../../utils/ExtendedBox';

interface TopContainerProps {
  rightComponentWidth: number;
  leftComponentWidth: number;
  height: number;
}

const TopContainer: FC<TopContainerProps> = ({
  rightComponentWidth,
  leftComponentWidth,
  height,
  children,
}) => {
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, offsetWidth } = scrollRef.current;
      setShowRightGradient(scrollWidth > offsetWidth);
    }
  }, []);

  const handleScrollCapture = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollLeft, scrollWidth, offsetWidth } = e.target as HTMLDivElement;
    setShowLeftGradient(scrollLeft > 0);
    setShowRightGradient(scrollLeft + offsetWidth !== scrollWidth);
  };

  return (
    <ExtendedBox
      position="fixed"
      top="0"
      right={`${rightComponentWidth}px`}
      left={`${leftComponentWidth}px`}
      height={`${height}px`}
      round={{ corner: 'top-left', size: 'large' }}
      background="white"
      pad={{ horizontal: 'large' }}
    >
      <Box
        fill
        justify="center"
        overflow="auto"
        onScrollCapture={handleScrollCapture}
        ref={scrollRef}
      >
        <ExtendedBox fill minWidth="min-content">
          {children}
        </ExtendedBox>
      </Box>
      {showLeftGradient && (
        <ExtendedBox
          margin={{ left: 'large' }}
          position="absolute"
          top="0"
          left="0"
          height={`${height - 3}px`}
          background="linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))"
          width="24px"
        />
      )}
      {showRightGradient && (
        <ExtendedBox
          margin={{ right: 'large' }}
          position="absolute"
          top="0"
          right="0"
          height={`${height - 3}px`}
          background="linear-gradient(to left, rgb(255, 255, 255), rgba(255, 255, 255, 0))"
          width="24px"
        />
      )}
      <Box fill="horizontal">
        <Divider />
      </Box>
    </ExtendedBox>
  );
};

export default TopContainer;
