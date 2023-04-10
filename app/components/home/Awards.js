import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import {getAwards} from '../../services/operations/homeApis';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const SLIDER_AWARDS_FIRST_ITEM = 0;

const Awards = props => {
  const [awards, setAwardsData] = useState([]);
  const [activeAward, setActiveAward] = useState(SLIDER_AWARDS_FIRST_ITEM);

  let awardRef = useRef(null);

  const dispatch = useDispatch();

  const homeData = useSelector(state => state.home);

  useEffect(() => {
    if (!_.isEmpty(homeData.awards)) {
      setAwardsData(homeData.awards);
    }
  }, [homeData.awards]);

  useEffect(() => {
    if (_.isEmpty(homeData.awards)) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      dispatch(getAwards(headers));
    } else if (!_.isEmpty(homeData.awards)) {
      setAwardsData(homeData.awards);
    }
    return () => {};
  }, []);

  function getAwardsCarousel() {
    return (
      <View style={{backgroundColor: colors.white, width: '100%'}}>
        <Carousel
          ref={c => (awardRef = c)}
          data={awards}
          renderItem={getAwardsCard}
          sliderWidth={parseInt(width) + 10}
          itemWidth={230}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => setActiveAward(index)}
        />
        {getPagination(awards, activeAward, awardRef)}
      </View>
    );
  }

  function getAwardsCard(item, index) {
    const reward = item.item;
    return (
      <View
        style={{
          width: width / 2 + 10,
          padding: 20,
          backgroundColor: colors.shaddow,
          margin: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Image
          key={index}
          source={{uri: reward.rewards_image_url}}
          style={{width: width / 4, height: width / 4, resizeMode: 'contain'}}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text
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
  return <View>{getAwardsCarousel()}</View>;
};

export default Awards;
