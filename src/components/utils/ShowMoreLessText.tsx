import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

export const ShowMoreLessTextContainer = styled(Box)<{ $lineNumber?: number }>`
  .text {
    -webkit-line-clamp: ${(props) => props.$lineNumber};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
  }

  .full-text {
    -webkit-line-clamp: unset;
    overflow: unset;
  }
`;

interface ShowMoreLessTextProps {
  children: string | ReactNode;
  lineNumber?: number;
  color?: string;
}

const ShowMoreLessText: FC<ShowMoreLessTextProps> = ({
  children,
  lineNumber = 3,
  color,
}) => {
  const { t } = useTranslation();
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const [isFullTextShown, setIsFullTextShown] = useState(false);
  const [isTextLong, setIsTextLong] = useState(false);

  useEffect(() => {
    const checkTextLength = () => {
      if (textRef.current) {
        setIsTextLong(
          textRef.current.scrollHeight > textRef.current.clientHeight + 5
        );
      }
    };
    checkTextLength();
  }, [children]);

  const style: any = { '-webkit-line-clamp': lineNumber };
  return (
    <ShowMoreLessTextContainer $lineNumber={lineNumber}>
      <Text
        ref={textRef}
        color={color}
        style={style}
        className={`text ${isFullTextShown ? 'full-text' : ''}`}
      >
        {children}
      </Text>
      {!isFullTextShown && isTextLong && (
        <Button onClick={() => setIsFullTextShown(true)}>
          <Text color="brand-alt" size="12px">
            {t('common.showMore')}
          </Text>
        </Button>
      )}
      {isFullTextShown && (
        <Button onClick={() => setIsFullTextShown(false)}>
          <Text color="brand-alt" size="12px">
            {t('common.showLess')}
          </Text>
        </Button>
      )}
    </ShowMoreLessTextContainer>
  );
};

export default ShowMoreLessText;
