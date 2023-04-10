import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import styles from './home_style';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import { Dimensions } from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getBanner, getBannerLoggedIn } from '../../services/operations/homeApis';
import HTML from 'react-native-render-html';
import { BANNER_IMAGE_URL } from '../../services/ApiServicePath';
import { getProductDetailSuccess } from '../../slices/productSlices';
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';


const { width } = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const VideoViewone = props => {
  const navigation = useNavigation();

  const SLIDER_BANNER_FIRST_ITEM = 0;
  const [activeBanner, setActiveBanner] = useState(SLIDER_BANNER_FIRST_ITEM);
  const [bannerData, setBannerData] = useState([]);
  const homeData = useSelector(state => state.home);

  let bannerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_.isEmpty(homeData.banner)) {
      dispatch(getBanner());
    } else if (!_.isEmpty(homeData.banner)) {
      setBannerData(homeData.banner);
    }

    if (_.isEmpty(homeData.bannerLoggedIn)) {
      dispatch(getBannerLoggedIn());
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(homeData.banner)) {
      setBannerData(homeData.banner);
    }
  }, [homeData.banner]);

  function getVideoView() {
    return (
      <View style={{ backgroundColor: colors.white, marginTop: 5, marginLeft: 8, width: '95%' }}>

        {/* <Carousel
          ref={c => (bannerRef = c)}
          data={
            GlobalConst.LoginToken.length > 0
              ? homeData.bannerLoggedIn
              : homeData.banner
          }
          renderItem={getBannerCard}
          sliderWidth={parseInt(width)}
          itemWidth={parseInt(width)}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}

          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => setActiveBanner(index)}
        /> */}

<VideoPlayer
    video={{ uri: 'https://mcstaging.drreddysdirect.com/media/cms_video/DRD_Promo_12_10%20_SD360p_640x360.mp4' }}
    videoWidth={1600}
    videoHeight={900}
    thumbnail={{ uri: 'https://mcstaging.drreddysdirect.com/media/video/thumbnail_image/thumbnail_image.png' }}
/>

 {/* <Video  
           source={{ url: 'https://mcstaging.drreddysdirect.com/media/cms_video/drd_instructional_3_9_v2%20_360p.mp4'}}                // the video file
            paused={false}                  // make it start    
            style={styles.backgroundVideo}  // any style you want
            repeat={true}                   // make it a loop
        /> */}

      </View>
    );
  }



  function getBannerCard(item, index) {
    const reward = item.item;
    let sku = '';
    if (reward.click_url !== undefined && reward.click_url.length > 0) {
      sku = reward.click_url.substring(
        reward.click_url.length - 18,
        reward.click_url.length - 5,
      );
    }

    //
    return (
      <View
        style={{
          //height: 285,
          padding: 5,
          backgroundColor: colors.bannerBlue,
          marginTop: 10,
          marginRight: 10,
          marginLeft: 10,
          borderRadius: 10,
          // padding: 10,
        }}>
        <View style={{ padding: 5, flexDirection: 'row' }}>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}>
            <HTML html={reward.caption} />
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (sku.length > 0) {
                  dispatch(getProductDetailSuccess({}));
                  navigation.navigate('ProductDetail', { sku: sku });
                }
              }}>
              <Image
                key={index}
                source={{ uri: BANNER_IMAGE_URL + reward.image }}
                style={{ width: 160, height: 160, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              // Linking.openURL('https://mcstaging.drreddysdirect.com/about-us');
            }}
            style={{
              width: '50%',
              // height: 40,
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.lightBlue,
              borderRadius: 50,
              marginTop: 2,
              marginBottom: 20,
              marginLeft: 10,
              borderColor: colors.white,
              borderWidth: 1,
            }}>
            {reward.image_alt !== undefined && reward.image_alt.length > 0 ? (
              <Text
                uppercase={false}
                style={[styles.buttonText, { fontSize: 14 }]}>
                {reward.image_alt}
              </Text>
            ) : (
              <Text
                uppercase={false}
                style={[styles.buttonText, { fontSize: 14 }]}>
                Know More
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return <View style={{ marginBottom: 10 }}>{getVideoView()}</View>;
};
export default VideoViewone;
