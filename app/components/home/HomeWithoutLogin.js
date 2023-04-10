import React, {useState, useEffect, useRef, createRef} from 'react';
import {Button, Card} from 'native-base';
import {
  StatusBar,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Picker,
  FlatList,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-simple-toast';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import utils from '../../utilities/utils';
import {useNavigation} from '@react-navigation/native';
import {
  endSearch,
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  setSearchedProductsSuccess,
  setFilters,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setProductName,
} from '../../slices/productSlices';
import {getProductsSearch} from '../../services/operations/productApis';
import News from '../../components/home/News';

import VoiceOfCustomer from './VoiceOfCustomer';
import FeatureProduct from '../../components/home/FeatureProduct';
import Awards from './Awards';
import HomeBanner from './HomeBanner';
import VideoView from './VideoView';
import VideoViewone from './VideoViewone';
import Modal from 'react-native-modalbox';

import {getvideo} from '../../services/operations/homeApis';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

// let vocs = []
// let featureProducts = [];

const SLIDER_1_FIRST_ITEM = 0;
const SLIDER_AWARDS_FIRST_ITEM = 0;
const SLIDER_BANNER_FIRST_ITEM = 0;
const SLIDER_NEWS_FIRST_ITEM = 0;
const SLIDER_VOCS = 0;
const SLIDER_FEATURE_PRODUCT = 0;

const HomeWithoutLogin = props => {
  const [isClosed, setIsClosed] = useState(true);

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isApiCalled, setApiCalled] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [awards, setAwardsData] = useState([]);
  const [webContent, setWebContent] = useState([]);
  const [vocs, setVoiceOfCustomer] = useState([]);
  const [featureProducts, setFeatureProductsState] = useState([]);
  const [activeBanner, setActiveBanner] = useState(SLIDER_BANNER_FIRST_ITEM);
  const [activeNews, setactiveNews] = useState(SLIDER_NEWS_FIRST_ITEM);
  const [activeAward, setActiveAward] = useState(SLIDER_AWARDS_FIRST_ITEM);
  const [activeVoiceOfCustomer, setActiveVoiceOfCustomer] = useState(
    SLIDER_VOCS,
  );
  const [activeFeatureProduct, setActiveFeatureProduct] = useState(
    SLIDER_FEATURE_PRODUCT,
  );
  const [selectedValue, setSelectedValue] = useState('Select Pack Size');
  //const _slider1Ref = createRef();

  let bannerRef = useRef();
  let awardRef = useRef();
  let newsRef = useRef();
  let vocRef = useRef();
  let featureProductRef = useRef();

  const loginData = useSelector(state => state.authenticatedUser);
  const dispatch = useDispatch();
  const homeData = useSelector(state => state.home);
  const product = useSelector(state => state.product);

  const [data, setData] = useState([]);
  const [dataDropdown, setDataDropdown] = useState([]);

  useEffect(() => {
    // isLoading=false;
    if (!_.isEmpty(product.searchedProducts)) {
      setIsClosed(false);
      setData(product.searchedProducts);
    }

    // return () =>{
    //     dispatch(setSearchedProductsSuccess([]))
    //     setData([])
    // }
  }, [product.searchedProducts]);

  useEffect(() => {
    dispatch(setSearchedProductsSuccess([]));
    setData([]);
    // if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
    //   console.log('Check 4..............');
    //   nameDrawerRef.close();
    // }
  }, []);

  //...........

  const [nameToShow, setNameToShow] = useState('');
  const [skuToShow, setSkuToShow] = useState('');

  let nameDrawerRef = useRef(null);

  useEffect(() => {
    console.log('Check 1..............');
    dispatch(getvideo());
    if (nameToShow.length > 0) {
      console.log('Check 2..............', nameToShow);
      if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
        console.log('Check 3..............');
        nameDrawerRef.open();
      }
    }
  }, [nameToShow]);

  function nameView() {
    return (
      <Modal
        onClosed={() => {
          setNameToShow('');
          setSkuToShow('');
        }}
        style={{height: '25%', width: '80%'}}
        //position={'bottom'}
        ref={c => (nameDrawerRef = c)}
        backdropPressToClose={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
            }}
            style={{position: 'absolute', right: 5, top: 0}}>
            <Image
              style={{width: 10, resizeMode: 'contain'}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <Text style={{marginTop: 10, fontFamily: 'DRLCircular-Book'}}>
            {nameToShow}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (skuToShow.length > 0) {
                dispatch(getProductDetailSuccess({}));
                // if (product.type_id === 'simple') {
                navigation.navigate('ProductDetail', {sku: skuToShow});
                // } else {
                //   navigation.navigate('ProductDetailConfigurable', {
                //     sku: product.sku,
                //   });
                //  }
                setSkuToShow('');
                setNameToShow('');
                if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                  nameDrawerRef.close();
                }
              }
            }}
            style={{
              width: 90,
              height: 30,
              backgroundColor: colors.lightBlue,
              borderRadius: 15,
              marginTop: 10,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 10,
            }}>
            <Text style={styles.buttonText}>View Product</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  //.........

  function renderDropdown(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          //setEmail("")
          dispatch(getProductDetailSuccess({}));

          if (item.type_id === 'simple') {
            navigation.navigate('ProductDetail', {sku: item.sku});
          } else {
            navigation.navigate('ProductDetailConfigurable', {sku: item.sku});
          }
          handleScroll();
        }}
        style={{
          paddingBottom: 10,
          borderColor: colors.grey,
          borderBottomWidth: 0.3,
          backgroundColor: colors.whiteGradient,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 10,
          paddingTop: 5,
        }}>
        <View style={{paddingHorizontal: 10}}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 14,
              color: colors.textColor,
            }}>
            {item.name}
          </Text>
          {item.type_id === 'simple' && (
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.blue,
                }}>
                {item.sku}
              </Text>
              {item.options !== undefined && item.options.length > 0 && (
                <Text
                  style={{
                    color: colors.red,
                    fontFamily: 'DRLCircular-Light',
                    fontSize: 14,
                    marginVertical: 5,
                  }}>
                  Shortdated available
                </Text>
              )}
              {loginData.strengthLabels.find(
                element =>
                  element.value ===
                  utils.getAttributeFromCustom(item, 'strength'),
              ) != undefined && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.textBold,
                    {
                      fontSize: 12,
                      marginBottom: 2,
                      fontFamily: 'DRLCircular-Light',
                      color: colors.grey,
                    },
                  ]}>
                  {
                    loginData.strengthLabels.find(
                      element =>
                        element.value ===
                        utils.getAttributeFromCustom(item, 'strength'),
                    ).label
                  }
                </Text>
              )}

              <View style={{flexDirection: 'row'}}>
                {loginData.packLabels.find(
                  element =>
                    element.value ===
                    utils.getAttributeFromCustom(item, 'pack_size'),
                ) != undefined && (
                  <Text
                    style={[
                      styles.textBold,
                      {
                        fontSize: 12,
                        marginBottom: 5,
                        fontFamily: 'DRLCircular-Light',
                        marginRight: 10,
                        color: colors.grey,
                      },
                    ]}>
                    Pack size:{' '}
                    {
                      loginData.packLabels.find(
                        element =>
                          element.value ===
                          utils.getAttributeFromCustom(item, 'pack_size'),
                      ).label
                    }
                  </Text>
                )}
                {/* {utils.getAttributeFromCustom(item,'case_pack')!=undefined &&
        <Text style={[styles.textBold,{fontSize:12,marginBottom:5,fontFamily:'DRLCircular-Light',color:colors.grey}] }>Case Pack: {utils.getAttributeFromCustom(item,'case_pack')}</Text>} */}
              </View>
            </View>
          )}

          {GlobalConst.LoginToken.length > 0 &&
            GlobalConst.customerStatus === 'Approved' &&
            item.type_id === 'simple' && (
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                ${item.price}
              </Text>
            )}
        </View>
        <Image
          source={require('../../images/forward_big.png')}
          style={{height: 10, width: 10, resizeMode: 'contain'}}
        />
      </TouchableOpacity>
    );
  }

  function loadData(text) {
    // isLoading=true;
    dispatch(getProductsSearch(text));
  }

  function searchView() {
    return (
      <View style={styles.searchInputAbsolute}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.searchInput}>
            <TextInput
              style={{marginRight: 25, fontFamily: 'DRLCircular-Book'}}
              onChangeText={text => {
                setEmail(text);
                if (text.length >= 2) {
                  loadData(text);
                } else {
                  setData([]);
                }
              }}
              value={email}
              placeholder="Search Products by name/NDC"
              placeholderTextColor={colors.placeholderColor}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                if (email !== undefined && email.length > 0) {
                  dispatch(endSearch());
                  dispatch(getProductsSuccess([]));
                  dispatch(setConfigurableProducts([]));
                  dispatch(setConfigurableProductDetail([]));
                  dispatch(getProductDetailSuccess({}));

                  dispatch(setCategoryApplied(false));
                  dispatch(setDosageApplied([]));
                  dispatch(setTherapeutic([]));
                  dispatch(setFilters([]));
                  dispatch(setProductName(email));
                  navigation.navigate('AllProducts', {name: email});
                  handleScroll();
                } else {
                  Toast.show(
                    'Please enter product name to search',
                    Toast.SHORT,
                  );
                }
              }}
            />

            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 15,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (email !== undefined && email.length > 0) {
                    dispatch(endSearch());
                    dispatch(getProductsSuccess([]));
                    dispatch(setConfigurableProducts([]));
                    dispatch(setConfigurableProductDetail([]));
                    dispatch(getProductDetailSuccess({}));

                    dispatch(setCategoryApplied(false));
                    dispatch(setDosageApplied([]));
                    dispatch(setTherapeutic([]));
                    dispatch(setFilters([]));
                    dispatch(setProductName(email));
                    navigation.navigate('AllProducts', {name: email});
                    handleScroll();
                  } else {
                    Toast.show(
                      'Please enter product name to search',
                      Toast.SHORT,
                    );
                  }
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../images/search.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          {data.length > 0 && !isClosed && (
            <View
              style={{
                maxHeight: 450,
                width: '85%',
                backgroundColor: colors.whiteGradient,
              }}>
              <FlatList
                data={data}
                renderItem={({item, index}) => renderDropdown(item, index)}
                keyExtractor={(item, index) => index}
                style={{width: '100%', marginBottom: 5}}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 40,
                  backgroundColor: colors.lightGrey1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsClosed(true);
                    setData([]);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    height: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.darkBlue,
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (email !== undefined && email.length > 0) {
                      dispatch(endSearch());
                      dispatch(getProductsSuccess([]));
                      dispatch(setConfigurableProducts([]));
                      dispatch(setConfigurableProductDetail([]));
                      dispatch(getProductDetailSuccess({}));

                      dispatch(setCategoryApplied(false));
                      dispatch(setDosageApplied([]));
                      dispatch(setTherapeutic([]));
                      dispatch(setFilters([]));
                      dispatch(setProductName(email));
                      navigation.navigate('AllProducts', {name: email});
                      handleScroll();
                    } else {
                      Toast.show(
                        'Please enter product name to search',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    height: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.darkBlue,
                    }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  //const {width} =Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  useEffect(() => {
    if (!_.isEmpty(homeData.banner)) {
      setBannerData(homeData.banner);
    }
    if (!_.isEmpty(homeData.awards)) {
      setAwardsData(homeData.awards);
    }
    if (!_.isEmpty(homeData.voiceOfCustomer)) {
      setVoiceOfCustomer(homeData.voiceOfCustomer);
    }
    if (!_.isEmpty(homeData.featureProducts)) {
      setFeatureProductsState(homeData.featureProducts);
    }
  }, [homeData]);

  useEffect(() => {
    if (!_.isEmpty(loginData.news)) {
      //{getNews()}
      setWebContent(loginData.news.items);
    }
  }, [loginData]);

  function renderNewsItemCarousel(news, index) {
    const item = news.item;
    return (
      <View key={index}>
        <View
          style={{
            width: width - 50,
            backgroundColor: colors.white,
            borderRadius: 10,
          }}>
          {/* <Text>{item.title}</Text> */}
          <Image
            source={{uri: item.news_image_url}}
            style={{
              width: width - 50,
              height: 200,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}></Image>
          <Text
            style={[
              styles.textBold,
              {
                lineHeight: 18,
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
              },
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

  function handleScroll(event) {
    if (data.length > 0) {
      setData([]);
    }
  }

  return (
    <ViewWithSpinner
      style={[styles.container, {height: '100%'}]}
      // isLoading={homeData.isLoading}
    >
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      
      {/* <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}> */}
      
      <CustomeHeader
        back={undefined}
        title={undefined}
        isHome={true}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {searchView()}
      
      <ScrollView style={{marginTop: 60}} onScroll={handleScroll}>

      <HomeBanner />
      
      <Awards />

      <VideoView />

      <VideoViewone />
        
        {/* <VoiceOfCustomer />
        <News /> */}
        <FeatureProduct
          handleScroll={handleScroll}
          setNameToShow={setNameToShow}
          setSkuToShow={setSkuToShow}
        />
        <Button
          full
          style={styles.button}
          onPress={() => {
            dispatch(getProductsSuccess([]));
            dispatch(setConfigurableProducts([]));
            dispatch(setConfigurableProductDetail([]));
            dispatch(getProductDetailSuccess({}));

            dispatch(setCategoryApplied(false));
            dispatch(setDosageApplied([]));
            dispatch(setTherapeutic([]));
            dispatch(setFilters([]));
            dispatch(setProductName(undefined));

            navigation.navigate('AllProducts');
            handleScroll();
          }}>
          <Text uppercase={false} style={[styles.buttonText, {fontSize: 14}]}>
            View All Products
          </Text>
        </Button>
      </ScrollView>
      
      {nameView()}
    
      {/* </LinearGradient> */}
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(HomeWithoutLogin);

export default HomeWithoutLogin;
