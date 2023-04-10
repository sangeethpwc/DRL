import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Image, Dimensions} from 'react-native';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import {getNewsData} from '../../services/operations/getToken';
import _ from 'lodash';
import colors from '../../config/Colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import GlobalConst from '../../config/GlobalConst';

const SLIDER_NEWS_FIRST_ITEM = 0;

const News = props => {
  const [webContent, setWebContent] = useState([]);
  const [activeNews, setactiveNews] = useState(SLIDER_NEWS_FIRST_ITEM);
  let newsRef = useRef(null);
  const loginData = useSelector(state => state.authenticatedUser);
  const dispatch = useDispatch();

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const height = width * 0.6;

  function getIntheNewsCarousel() {
    return (
      <View style={{height: 520, backgroundColor: '#623ABC'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={[
              styles.textBold,
              {fontSize: 22, color: colors.white, margin: 20},
            ]}>
            In the news
          </Text>
        </View>
        <View style={{width: '100%'}}>
          <Carousel
            ref={c => (newsRef = c)}
            data={webContent}
            renderItem={renderNewsItemCarousel}
            //   sliderWidth={width}
            //   itemWidth={width}
            sliderWidth={parseInt(width)}
            itemWidth={parseInt(width) - 20}
            hasParallaxImages={true}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={index => setactiveNews(index)}
          />
          {getPaginationNews(webContent, activeNews, newsRef)}
        </View>
      </View>
    );
  }
  function getPaginationNews(datas, activeSlide, sliderRef) {
    return (
      <Pagination
        dotsLength={datas.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotColor={colors.white}
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

  useEffect(() => {
    
    if (
      loginData.news !== undefined &&
      loginData.news.items !== undefined &&
      !_.isEmpty(loginData.news)
    ) {
      setWebContent(loginData.news.items);
    }
  }, [loginData.news]);

  useEffect(() => {
    
    if (_.isEmpty(loginData.news)) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      dispatch(getNewsData(headers));
    } else if (loginData.news.items !== undefined) {
      setWebContent(loginData.news.items);
    }
    return () => {};
  }, []);

  function renderNewsItemCarousel(news, index) {
    const item = news.item;
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 10,
            height: 400,
          }}>
          {/* <Text>{item.title}</Text> */}
          <Image
            source={{uri: item.news_image_url}}
            style={{
              height: 250,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}></Image>
          <Text
            style={[
              styles.textBold,
              {lineHeight: 18, marginLeft: 20, marginRight: 20, marginTop: 20},
            ]}>
            {item.description}
          </Text>
          <Text
            style={[
              styles.textLight,
              {marginLeft: 20, marginBottom: 10, marginTop: 10},
            ]}>
            {item.published_at}
          </Text>
        </View>
      </View>
    );
  }
  return <View>{!_.isEmpty(webContent) ? getIntheNewsCarousel() : null}</View>;
};

export default News;
