/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react';
import { Client4 } from 'mattermost-redux/client';
import { Box, Text } from 'grommet';
import InfiniteScroll from 'react-infinite-scroll-component';
import webSocketClient from 'mattermost-redux/client/websocket_client';
import { Post } from 'mattermost-redux/types/posts';
import { Channel } from 'mattermost-redux/types/channels';

import { UserProfile } from 'mattermost-redux/types/users';
import PrivatePageLayout from '../layouts/PrivatePageLayout/PrivatePageLayout';

let user: UserProfile;

const Chat: FC = () => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<Array<Post>>([]);

  const clientInit = async () => {
    const urlSet = Client4.getUrl();

    if (!urlSet) {
      Client4.setUrl('http://octopus.localhost:8065');

      user = await Client4.login('johndoe', 'johndoe');

      webSocketClient.setEventCallback((event) => {
        console.log(event);
      });
      webSocketClient.initialize(null, {
        connectionUrl: Client4.getWebSocketUrl().replace('http', 'ws'),
      });

      const channelId = 'aaf414xo4tbsbrfyefsftixywa';

      const channel = await Client4.getChannel(channelId);

      setCurrentChannel(channel);

      if (channel.type === 'D') {
        const channelMembers = await Client4.getProfilesInChannel(channelId);

        const toUser = channelMembers.find((m) => m.id !== user.id);
        if (toUser) setDisplayName(toUser.username);
      } else {
        setDisplayName(channel.display_name);
      }
    }
  };

  useEffect(() => {
    clientInit();
    setPosts([]);
  }, []);

  return (
    <PrivatePageLayout title="Chat">
      {currentChannel ? (
        <>
          <p>Chat here {displayName} </p>

          <Box
            id="scrollableDiv"
            style={{
              height: 300,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            <InfiniteScroll
              dataLength={currentChannel.total_msg_count}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
              inverse
              hasMore
              next={() => {}}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {posts.map((post) => (
                <Box key={post.id}>
                  <Text> {post.message} </Text>
                  <hr />
                </Box>
              ))}
            </InfiniteScroll>
          </Box>
        </>
      ) : null}
    </PrivatePageLayout>
  );
};

export default Chat;
