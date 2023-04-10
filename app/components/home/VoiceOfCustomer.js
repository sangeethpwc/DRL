import React, {useState, useEffect, useRef, createRef} from 'react';
import {StatusBar, Text, View, Image} from 'react-native';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import {
  getAwards,
  getVoiceCustomer,
  getFeatureProducts,
  getBanner,
} from '../../services/operations/homeApis';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const SLIDER_VOCS = 0;

const VoiceOfCustomer = props => {
  const [vocs, setVoiceOfCustomer] = useState([]);
  const [activeVoiceOfCustomer, setActiveVoiceOfCustomer] = useState(
    SLIDER_VOCS,
  );

  let vocRef = useRef(null);

  const dispatch = useDispatch();
  const homeData = useSelector(state => state.home);

  function getVOCCarousel() {
    return (
      <View style={{justifyContent: 'center'}}>
        <Text
          style={[
            styles.textBold,
            {
              fontSize: 22,
              color: colors.darkGrey,
              margin: 20,
              textAlign: 'center',
            },
          ]}>
          Voice of Our Customer
        </Text>
        <View style={{backgroundColor: colors.white}}>
          <Carousel
            ref={c => (vocRef = c)}
            data={vocs}
            renderItem={getVOCSCard}
            sliderWidth={parseInt(width)}
            itemWidth={parseInt(width) - 20}
            hasParallaxImages={true}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={index => setActiveVoiceOfCustomer(index)}
          />
          {getPagination(vocs, activeVoiceOfCustomer, vocRef)}
        </View>
      </View>
    );
  }
  function getVOCSCard(item, index) {
    const reward = item.item;
    //
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: colors.shaddow,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Image
          key={index}
          source={{uri: reward.profile_image_url}}
          style={{width: width / 2, height: width / 2, resizeMode: 'contain'}}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: colors.darkGrey,
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'DRLCircular-Bold',
            }}>
            {reward.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              color: colors.darkGrey,
              fontSize: 16,
              fontFamily: 'DRLCircular-Bold',
            }}>
            {reward.description}
          </Text>
        </View>
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
  //const {width} =Dimensions.get('window');
  GlobalConst.DeviceWidth = width;

  useEffect(() => {
    if (!_.isEmpty(homeData.voiceOfCustomer)) {
      setVoiceOfCustomer(homeData.voiceOfCustomer);
    }
  }, [homeData.voiceOfCustomer]);

  useEffect(() => {
    if (_.isEmpty(homeData.voiceOfCustomer)) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      dispatch(getVoiceCustomer(headers));
    } else if (!_.isEmpty(homeData.voiceOfCustomer)) {
      setVoiceOfCustomer(homeData.voiceOfCustomer);
    }
    return () => {};
  }, []);

  return <View>{getVOCCarousel()}</View>;
};
export default VoiceOfCustomer;
