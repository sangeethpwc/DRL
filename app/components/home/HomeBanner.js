import React, {useState, useEffect, useRef} from 'react';
import {View, Image, Text, TouchableOpacity, Linking} from 'react-native';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getBanner, getBannerLoggedIn} from '../../services/operations/homeApis';
import HTML from 'react-native-render-html';
import {BANNER_IMAGE_URL} from '../../services/ApiServicePath';
import {getProductDetailSuccess} from '../../slices/productSlices';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const HomeBanner = props => {
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

  function getBannerCarousel() {
    return (
      <View style={{backgroundColor: colors.white, width: '100%'}}>
        <Carousel
          ref={c => (bannerRef = c)}
          data={
            GlobalConst.LoginToken.length > 0
              ? homeData.bannerLoggedIn
              : homeData.banner
          }
          renderItem={getBannerCard}
          //sliderWidth={410}
          sliderWidth={parseInt(width)}
          //  itemWidth={400}
          itemWidth={parseInt(width)}
          hasParallaxImages={true}
          //   firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          //    inactiveSlideShift={20}
          //   containerCustomStyle={styles.slider}
          //   contentContainerCustomStyle={styles.sliderContentContainer}
          //  loop={true}
          //   loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => setActiveBanner(index)}
        />
        {getPagination(
          GlobalConst.LoginToken.length > 0
            ? homeData.bannerLoggedIn
            : homeData.banner,
          activeBanner,
          bannerRef,
        )}
      </View>
    );
  }

  function getPagination(datas, activeSlide, sliderRef) {
    return (
      <Pagination
        dotsLength={datas.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotColor={colors.blue}
        dotStyle={styles.activeIndicatorRewards}
        inactiveDotStyle={styles.paginationDot}
        inactiveDotColor={colors.grey}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={sliderRef}
        tappableDots={!!sliderRef}
      />
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
        <View style={{padding: 5, flexDirection: 'row'}}>
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
                  navigation.navigate('ProductDetail', {sku: sku});
                }
              }}>
              <Image
                key={index}
                source={{uri: BANNER_IMAGE_URL + reward.image}}
                style={{width: 160, height: 160, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://mcstaging.drreddysdirect.com/about-us');
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
                style={[styles.buttonText, {fontSize: 14}]}>
                {reward.image_alt}
              </Text>
            ) : (
              <Text
                uppercase={false}
                style={[styles.buttonText, {fontSize: 14}]}>
                Know More
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return <View style={{marginBottom: 10}}>{getBannerCarousel()}</View>;
};
export default HomeBanner;
