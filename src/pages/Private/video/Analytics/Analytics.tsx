/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dislike, Like } from 'grommet-icons';
import LogoWhite from '../../../../assets/purpie-logo/logo-white.svg';
import SearchBar from '../../../../components/utils/SearchBar';
import { VideoPost } from '../../../../components/post/VideoPost';
import Divider from '../../../../components/utils/Divider';
import Dropdown from './Dropdown';
import LineChart from './LineChart';
import ColumnChart from './ColumnChart';
import MeterComponent from './Meter';
import DeviceCategory from './DeviceCategory';
import TopCountries from './TopCountries';
import Payment from '../../payments';

interface StateType {
  data: any;
  videoName: string;
  id: string;
  slug: string;
  live: boolean;
  videoDescription: string;
  title: string;
  disliked: boolean;
  postReaction: any;
}
const Analytics: FC = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { data } = state as { data: StateType };
  const {
    videoName,
    id,
    slug,
    live,
    videoDescription,
    title,
    disliked,
    postReaction,
  } = data;
  const { likesCount, dislikesCount, viewsCount } = postReaction;
  const { t } = useTranslation();

  return (
    <Box>
      <Box direction="row" pad="medium" background="brand" height="100px">
        <Box
          onClick={() => history.push('/')}
          width="300px"
          align="start"
          justify="center"
          focusIndicator={false}
        >
          <Avatar round="0" src={LogoWhite} />
        </Box>
        <Box fill="horizontal" justify="center">
          <Box
            fill="horizontal"
            width={{ max: '1440px' }}
            alignSelf="center"
            pad={{ horizontal: 'medium' }}
          >
            <SearchBar />
          </Box>
        </Box>
      </Box>
      <Payment />
      <Box direction="row" pad="medium">
        <Box width="medium" gap="medium">
          <Text weight="bold" size="large">
            {title}
          </Text>
          <Divider />
          <VideoPost id={id} videoName={videoName} slug={slug} live={live} />
          <Box direction="row" justify="between">
            <Text size="small" color="status-disabled">
              {viewsCount >= 0 && t('Video.viewsCount', { count: viewsCount })}
              {viewsCount < 2 && t('Video.viewCount', { count: viewsCount })}
            </Text>
            <Box direction="row" gap="small">
              <Box direction="row" gap="xsmall">
                <Like color="status-disabled" size="17px" />
                <Text size="small" color="status-disabled">
                  {likesCount}
                </Text>
              </Box>
              {disliked && (
                <Box direction="row" gap="xsmall">
                  <Dislike color="status-disabled" size="17px" />
                  <Text size="small" color="status-disabled">
                    {dislikesCount}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Text>{videoDescription}</Text>
        </Box>
        <Box flex={{ grow: 1 }} margin={{ horizontal: 'medium' }}>
          <Text>{t('Analytics.title')}</Text>
          {/* <Box
            border={{ color: 'rgba(0,0,0,0.1)', size: 'xxsmall', }}
            width="100%"
          /> */}
          <Divider />
          <Box direction="row" width="100%" gap="small">
            <Dropdown
              title={t('Analytics.title')}
              menuItems={[
                { label: 'First Action', onClick: () => {} },
                { label: 'Second Action', onClick: () => {} },
              ]}
            />
            <Dropdown title={t('Analytics.title')} menuItems={[]} />
            <Dropdown title={t('Analytics.title')} menuItems={[]} />
          </Box>
          <Box direction="row">
            <Box direction="row">
              <Box width="small" height="small">
                <LineChart
                  title={t('Analytics.title')}
                  chartValues={[
                    { value: [7, 5], label: 'one hundred' },
                    { value: [6, 70], label: 'seventy' },
                    { value: [5, 60], label: 'sixty' },
                    { value: [4, 0], label: 'eighty' },
                    { value: [3, 40], label: 'forty' },
                    { value: [2, 0], label: 'zero' },
                    { value: [1, 30], label: 'thirty' },
                    { value: [0, 60], label: 'sixty' },
                  ]}
                  percentage="100%"
                />
              </Box>
              <Box width="small" height="small">
                <LineChart
                  title={t('Analytics.title')}
                  chartValues={[
                    { value: [7, 100], label: 'one hundred' },
                    { value: [6, 70], label: 'seventy' },
                    { value: [5, 60], label: 'sixty' },
                    { value: [4, 80], label: 'eighty' },
                    { value: [3, 40], label: 'forty' },
                    { value: [2, 0], label: 'zero' },
                    { value: [1, 30], label: 'thirty' },
                    { value: [0, 60], label: 'sixty' },
                  ]}
                  percentage="100%"
                />
              </Box>
            </Box>
            <Box width="medium">
              <ColumnChart
                chartValues={[
                  { month: 'JAN', amount: 2 },
                  { month: 'FEB', amount: 47 },
                  { month: 'MAR', amount: 33 },
                  { month: 'APR', amount: 50 },
                  { month: 'JUN', amount: 33 },
                  { month: 'JUL', amount: 70 },
                  { month: 'AUG', amount: 33 },
                ]}
                title={t('Analytics.title')}
                menuTitle={t('Analytics.title')}
              />
            </Box>
          </Box>
          <Box direction="row">
            <Box
              border={{ color: '#EFF0F6', size: 'small' }}
              round
              width="medium"
              pad="small"
              gap="small"
            >
              <Text>{t('Analytics.title')}</Text>
              <MeterComponent
                title={t('Analytics.title')}
                label="Views"
                value={60}
                onClick={() => {}}
              />
              <MeterComponent
                title={t('Analytics.title')}
                label="Likes"
                value={30}
                onClick={() => {}}
              />
              <MeterComponent
                title={t('Analytics.title')}
                label="Dislikes"
                value={90}
                onClick={() => {}}
              />
            </Box>
            <Box width="small">
              <DeviceCategory
                deviceRates={{ phoneRate: 30, tabletRate: 60, desktopRate: 10 }}
              />
            </Box>
            <Box width="small">
              <TopCountries
                topCountries={[
                  { name: 'USA', rate: 20 },
                  { name: 'UK', rate: 10 },
                  { name: 'Other', rate: 70 },
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
