import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import { Dimensions } from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';

const { width } = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const VideoView = props => {
  const navigation = useNavigation();

  const SLIDER_BANNER_FIRST_ITEM = 0;
  const homeData = useSelector(state => state.home);

  let bannerRef = useRef(null);
  const dispatch = useDispatch();

  function getVideoView(item, index) {
    
    return (
      <View style={{ backgroundColor: colors.white, marginTop: 10, marginLeft: 8, width: '95%' }}>

        <VideoPlayer
          key={index}
          video={{ uri: 'https://mcstaging.drreddysdirect.com/media/cms_video/drd_instructional_3_9_v2%20_360p.mp4'}}
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{ uri: 'https://mcstaging.drreddysdirect.com/media/video/thumbnail_image/thumbnail_image.png' }}
        />

      </View>
    );
  }

  return <View style={{ marginBottom: 10 }}>{getVideoView()}</View>;
};
export default VideoView;
