import { Box, BoxExtendedProps, Stack } from 'grommet';
import React, { FC, useEffect, useRef, useState } from 'react';

const GradientScroll: FC<BoxExtendedProps> = (props) => {
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
    setShowRightGradient(scrollLeft + offsetWidth < scrollWidth);
  };
  const { children } = props;
  return (
    <Stack fill interactiveChild="first" anchor="right">
      <Stack fill interactiveChild="first" anchor="left">
        <Box
          overflow="auto"
          onScrollCapture={handleScrollCapture}
          ref={scrollRef}
          {...props}
        >
          <Box fill width={{ min: 'min-content' }}>
            {children}
          </Box>
        </Box>
        {showLeftGradient && (
          <Box
            height={`${scrollRef.current?.offsetHeight}px`}
            background="linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))"
            width="24px"
          />
        )}
      </Stack>

      {showRightGradient && (
        <Box
          height={`${scrollRef.current?.offsetHeight}px`}
          background="linear-gradient(to left, rgb(255, 255, 255), rgba(255, 255, 255, 0))"
          width="24px"
        />
      )}
    </Stack>
  );
};

export default GradientScroll;
