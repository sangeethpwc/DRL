import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  Button,
  View,
  StatusBar,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  
  Linking,
  RefreshControl,
  
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import homeStyles from '../home/home_style';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
import {
  checkStockStatusPDP,
  getProductDetail,
  getRelatedProducts,
} from '../../services/operations/productApis';
import _ from 'lodash';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import HTML from 'react-native-render-html';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator,
} from 'react-native-best-viewpager';
import styles from './productStyles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  getFeatureProducts,
  getBrandNames,
  getCategoryNames,
} from '../../services/operations/homeApis';
import {
  endSearch,
  getProductDetailSuccess,
  setErrorMsg,
  setItemAddedToCart,
} from '../../slices/productSlices';
import utils from '../../utilities/utils';
import ShortDated from './ShortDated';
import ShortDatedNotLoggedIn from './ShortDatedNotLoggedIn';
import GeneralProduct from './GeneralProduct';
import GeneralProductNotLoggedIn from './GeneralProductNotLoggedIn';
import LoaderProduct from '../../utilities/hocs/LoaderHOCProduct';
import RelatedProducts from './RelatedProduct';
import Modal from 'react-native-modalbox';
import AvailableQuantity from './AvailableQuantity';
import Toast from 'react-native-simple-toast';

var setSelectedStrengthValue = '';
var setSelectedPackValue = '';
var setQuantityValue = 0;

const ProductDetail = props => {
  const [info1, setInfo1] = useState(false);
  const [info2, setInfo2] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [productDetail, setProductDetail] = useState({});
  let ViewWithSpinner = withLoader(View);
  let bottomDrawerRef = useRef(null);
  let contentRef = useRef(null);
  let shortDatedRef = useRef(null);
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();

  const [popLink, setPopLink] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getProductDetail(props.route.params.sku));
    dispatch(checkStockStatusPDP(props.route.params.sku));
  }, []);

  //..................................................
  let nameDrawerRef = useRef(null);

  function dialogView() {
    return (
      <Modal
        onClosed={() => setPopLink('')}
        style={{height: '40%', width: '70%'}}
        //position={'bottom'}
        swipeToClose={false}
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
            style={{position: 'absolute', right: 10, top: 0}}>
            <Image
              style={{width: 10, resizeMode: 'contain'}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <ScrollView>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'DRLCircular-Book',
                  lineHeight: 16,
                }}>
                You are about to leave Dr.Reddy’s and affiliates website.{'\n'}
                {'\n'}
                Dr. Reddy's assumes no responsibility for the information
                presented on the external website or any further links from such
                sites. These links are presented to you only as a convenience,
                and the inclusion of any link does not imply endorsement by Dr.
                Reddy's. If you wish to continue to this external website, click
                Proceed.
              </Text>
            </ScrollView>
          </View>
          <Text
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
              if (popLink !== '') {
                Linking.openURL(popLink);
              }
            }}
            style={{
              marginTop: 20,
              fontFamily: 'DRLCircular-Book',
              color: colors.blue,
              alignSelf: 'center',
            }}>
            Proceed
          </Text>
        </View>
      </Modal>
    );
  }
  //...................................................
  function checkExpiry(item) {
    let today = new Date();
    console.log('Shortdated item.................', item);
    let expStr = item.expiry_date + 'T00:00:00Z';

    let expDate = Date.parse(expStr);
    console.log('Exp date..............', expDate);
    if (expDate > today) {
      console.log('True check');
      return true;
    } else {
      console.log('False check');
      return false;
    }
  }

  function renderShortdatedRange() {
    // let data = utils.getOptions(productDetail, 'Shortdated LOT No#');

    let data = [];
    if (
      productDetail !== undefined &&
      productDetail.options !== undefined &&
      productDetail.options.length > 0 &&
      productDetail.options[0] !== undefined &&
      productDetail.options[0].values !== undefined &&
      productDetail.options[0].values.length > 0
    ) {
      data = productDetail.options[0].values;
    }

    if (data !== undefined && data.length > 0) {
      let priceArrShortDated = [];
      for (let i = 0; i < data.length; i++) {
        if (checkExpiry(data[i])) {
          priceArrShortDated.push(data[i].price);
          // if (parseFloat(data[i].price) > max) {
          //   max = parseFloat(data[i].price);
          // }
          // if (parseFloat(data[i].price) < min) {
          //   min = parseFloat(data[i].price);
          // }
        }
      }
      let max = 0;
      let min = 0;
      if (!_.isEmpty(priceArrShortDated)) {
        max = Math.max(...priceArrShortDated);
        min = Math.min(...priceArrShortDated);
      }
      console.log('Max,min.................', max, min);
      if (max !== min) {
        return '' + utils.formatPrice(min) + '-' + utils.formatPrice(max) + '';
      } else {
        return '' + utils.formatPrice(min);
      }
    }
  }

  function renderProductDetailsSection() {

    console.log('productDetail...' + JSON.stringify(productDetail.custom_attributes))

    return (
      // <BottomDrawer
      //     containerHeight={100}
      //     offset={TAB_BAR_HEIGHT}
      // >
      <View>
        {productDetail.custom_attributes !== undefined &&
          productDetail.custom_attributes.length > 0 &&
          loginData.brandNames !== undefined &&
          loginData.categoryNames !== undefined && (
            <View style={styles.paddedView}>
              <Text style={[homeStyles.textBold, {fontSize: 20}]}>
                Product Details
              </Text>

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{width: '50%'}}>
                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>NDC #</Text>
                    <Text numberOfLines={1} style={styles.boldText}>
                      {productDetail.sku}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Concentration</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'concentration',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'concentration',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element =>
                              element.attribute_code === 'concentration',
                          ).value
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Latex Free</Text>
                    <Text style={styles.boldText}>
                      {/* {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'latex_free',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'latex_free',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'latex_free',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : ''} */}
                      {productDetail.extension_attributes !== undefined &&
                        productDetail.extension_attributes.latex_free !==
                          undefined &&
                        productDetail.extension_attributes.latex_free}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Bar Coded</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'bar_coded',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'bar_coded',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'bar_coded',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : ''}
                    </Text>
                  </View>
                </View>

                <View style={{width: '50%', paddingLeft: 5}}>
                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Rating</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'fda_rating',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'fda_rating',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'fda_rating',
                          ).value
                        : ''}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Container Type</Text>
                    <Text style={styles.boldText}>
                      {loginData.categoryNames.find(
                        element =>
                          element.value ===
                          utils.getAttributeFromCustom(
                            productDetail,
                            'drl_division',
                          ),
                      ) != undefined && (
                        <Text style={styles.boldText}>
                          {
                            loginData.categoryNames.find(
                              element =>
                                element.value ===
                                utils.getAttributeFromCustom(
                                  productDetail,
                                  'drl_division',
                                ),
                            ).label
                          }
                        </Text>
                      )}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Preservative Free</Text>
                    <Text style={styles.boldText}>
                      {/* {productDetail.custom_attributes.find(
                        element =>
                          element.attribute_code === 'preservative_free',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element =>
                          element.attribute_code === 'preservative_free',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element =>
                              element.attribute_code === 'preservative_free',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : ''} */}

                      {productDetail.extension_attributes !== undefined &&
                        productDetail.extension_attributes.preservative_free !==
                          undefined &&
                        productDetail.extension_attributes.preservative_free}
                    </Text>
                  </View>

                  {/* Closure UI */}

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Closure</Text>
                    <Text style={styles.boldText}>
                     
                    {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'closure',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'closure',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'closure',
                          ).value
                        : ''}
                    </Text>
                  </View>


                </View>
              </View>
              <View style={styles.productDetailViews}>
                <Text style={styles.lightText}>Short Description</Text>

                {productDetail.custom_attributes.find(
                  element => element.attribute_code === 'short_description',
                ) !== undefined &&
                productDetail.custom_attributes.find(
                  element => element.attribute_code === 'short_description',
                ).value !== undefined ? (
                  productDetail.custom_attributes
                    .find(
                      element => element.attribute_code === 'short_description',
                    )
                    .value.charAt(0) === '<' ? (
                    <View>
                      <HTML
                        html={
                          productDetail.custom_attributes.find(
                            element =>
                              element.attribute_code === 'short_description',
                          ).value
                        }
                      />
                    </View>
                  ) : (
                    <Text style={styles.boldText}>
                      {
                        productDetail.custom_attributes.find(
                          element =>
                            element.attribute_code === 'short_description',
                        ).value
                      }
                    </Text>
                  )
                ) : (
                  <Text style={styles.boldText}>'NA'</Text>
                )}
              </View>

              <View style={[styles.productDetailViews, {paddingRight: 20}]}>
                <Text style={styles.lightText}>Storage</Text>
                <Text style={styles.boldText}>
                  {productDetail.custom_attributes.find(
                    element =>
                      element.attribute_code === 'special_handling_storage',
                  ) !== undefined &&
                  productDetail.custom_attributes.find(
                    element =>
                      element.attribute_code === 'special_handling_storage',
                  ).value !== undefined
                    ? productDetail.custom_attributes.find(
                        element =>
                          element.attribute_code === 'special_handling_storage',
                      ).value
                    : 'NA'}
                </Text>
              </View>
              {productDetail.custom_attributes.find(
                element => element.attribute_code === 'black_box',
              ) !== undefined &&
                productDetail.custom_attributes.find(
                  element => element.attribute_code === 'black_box',
                ).value !== undefined &&
                productDetail.custom_attributes.find(
                  element => element.attribute_code === 'black_box',
                ).value === '1' && (
                  <Text style={{marginTop: 20, fontFamily: 'DRLCircular-Bold'}}>
                    Please read the package insert for full prescribing
                    information including boxed warning and important safety
                    considerations
                  </Text>
                )}
            </View>
          )}
      </View>
      // </BottomDrawer>
    );
  }

  function renderAdditionalInfo() {
    return (
      <View style={{margin: 10, marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              setInfo2(true);
              setInfo1(false);
            }}
            style={
              info2
                ? {marginLeft: 5, borderBottomWidth: 0.5, paddingBottom: 5}
                : {marginLeft: 10, paddingBottom: 5}
            }>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 14,
                width: '99%',
              }}>
              Supportive documents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInfo1(true);
              setInfo2(false);
            }}
            style={
              info1
                ? {borderBottomWidth: 0.5, paddingBottom: 5}
                : {paddingBottom: 5}
            }>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 14,
                width: '99%',
              }}>
              Wholesaler item number
            </Text>
          </TouchableOpacity>
        </View>

        {info1 && (
          <View style={{maxHeight: 80, marginTop: 10}}>
            {utils.getAttributeFromCustom(
              productDetail,
              'amerisource_bergen',
            ) !== 'NA' && (
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Amerisource Bergen (8):{' '}
                {utils.getAttributeFromCustom(
                  productDetail,
                  'amerisource_bergen',
                )}{' '}
              </Text>
            )}
            {utils.getAttributeFromCustom(productDetail, 'cardinal') !==
              'NA' && (
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Cardinal:{' '}
                {utils.getAttributeFromCustom(productDetail, 'cardinal')}{' '}
              </Text>
            )}
            {utils.getAttributeFromCustom(productDetail, 'mckesson') !==
              'NA' && (
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                McKesson:{' '}
                {utils.getAttributeFromCustom(productDetail, 'mckesson')}{' '}
              </Text>
            )}
            {utils.getAttributeFromCustom(productDetail, 'm_d') !== 'NA' && (
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                M & D: {utils.getAttributeFromCustom(productDetail, 'm_d')}
              </Text>
            )}
          </View>
        )}

        {info2 && (
          <View style={{maxHeight: 80, marginTop: 10}}>
            {productDetail.custom_attributes.find(
              element => element.attribute_code === 'link_prescribing',
            ) !== undefined && (
              <Text
                style={[styles.boldText, {color: colors.blue, fontSize: 14}]}
                onPress={() =>
                  Linking.openURL(
                    productDetail.custom_attributes.find(
                      element => element.attribute_code === 'link_prescribing',
                    ).value,
                  )
                }>
                Prescribing Information   
              </Text>
            )}

            {productDetail.custom_attributes.find(
              element => element.attribute_code === 'link_dailymed',
            ) !== undefined &&
              GlobalConst.LoginToken.length > 0 && (
                <Text
                  style={[styles.boldText, {color: colors.blue, fontSize: 14}]}
                  onPress={() =>
                    Linking.openURL(
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'link_dailymed',
                      ).value,
                    )
                  }>
                  HDMA
                </Text>
              )}

            {productDetail.custom_attributes.find(
              element => element.attribute_code === 'link_msds',
            ) !== undefined &&
              GlobalConst.LoginToken.length > 0 && (
                <Text
                  style={[styles.boldText, {color: colors.blue, fontSize: 14}]}
                  onPress={() =>
                    Linking.openURL(
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'link_msds',
                      ).value,
                    )
                  }>
                  SDS
                </Text>
              )}

            {productDetail.extension_attributes !== undefined &&
              !_.isEmpty(productDetail.extension_attributes) &&
              productDetail.extension_attributes.supportdocument !==
                undefined &&
              !_.isEmpty(productDetail.extension_attributes.supportdocument) &&
              productDetail.extension_attributes.supportdocument.map(item => {
                console.log('Supporting docs.............', JSON.parse(item));
                let parsedItem = JSON.parse(item);

                if (parsedItem.is_logged_in === '1') {
                  if (GlobalConst.LoginToken.length > 0) {
                    return (
                      <Text
                        style={[
                          styles.boldText,
                          {color: colors.blue, fontSize: 14},
                        ]}
                        onPress={() => {
                          if (parsedItem.link !== '') {
                            if (parsedItem.hide_leave_popup === '0') {
                              Linking.openURL(parsedItem.link);
                            } else {
                              setPopLink(parsedItem.link);
                              if (
                                nameDrawerRef !== undefined &&
                                nameDrawerRef !== null
                              ) {
                                nameDrawerRef.open();
                              }
                            }
                          } else {
                            Linking.openURL(parsedItem.attachment);
                          }
                        }}>
                        {parsedItem.link_title}
                      </Text>
                    );
                  } else {
                    return null;
                  }
                } else {
                  return (
                    <Text
                      style={[
                        styles.boldText,
                        {color: colors.blue, fontSize: 14},
                      ]}
                      onPress={() => {
                        if (parsedItem.link !== '') {
                          if (parsedItem.hide_leave_popup === '0') {
                            Linking.openURL(parsedItem.link);
                          } else {
                            setPopLink(parsedItem.link);
                            if (
                              nameDrawerRef !== undefined &&
                              nameDrawerRef !== null
                            ) {
                              nameDrawerRef.open();
                            }
                          }
                        } else {
                          Linking.openURL(parsedItem.attachment);
                        }
                      }}>
                      {parsedItem.link_title}
                    </Text>
                  );
                }
              })}
          </View>
        )}
      </View>
    );
  }

  function setAllProducts() {
    if (
      productData.isLoading === false &&
      _.isEmpty(productData.productDetail)
    ) {
      dispatch(getProductDetail(props.route.params.sku));
    }
  }

  useEffect(() => {
    if (
      shortDatedRef !== null &&
      shortDatedRef.current !== null &&
      setRefreshing
    ) {
      shortDatedRef.current.cleanShortDatedArr();
    }
    setRefreshing(false);
    // if (!_.isEmpty(productData.productDetail)) {
    setProductDetail(productData.productDetail);
    // }
  }, [productData.productDetail]);

  function setSelectedStrength(value) {
    setSelectedStrengthValue = value;
  }

  function setSelectedPack(value) {
    setSelectedPackValue = value;
  }

  function setQuantity(value) {
    setQuantityValue = value;
  }

  ///.............
  // useEffect(() => {
  //     if(productData.cartSuccess){
  //     Toast.show("Item added to cart")
  //     }

  // }, [productData.cartSuccess])

  //..............

  useEffect(() => {
    dispatch(getProductDetailSuccess({}));
    {
      setAllProducts();
    }
  }, []);

  function _renderDotIndicator(count) {
    return (
      <PagerDotIndicator
        pageCount={count}
        dotStyle={{
          backgroundColor: colors.grey,
          width: 10,
          height: 10,
          borderRadius: 10 / 2,
        }}
        selectedDotStyle={{
          width: 15,
          height: 8,
          backgroundColor: 'red',
          backgroundColor: colors.blue,
        }}
        style={{width: '100%'}}
      />
    );
  }
  function bottomSliderView() {
    return (
      <Modal
        style={{height: 220}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white,
            padding: 10,
            alignItems: 'center',
          }}>
          <Image source={require('../../images/tick_large.png')} />

          <View style={{flexDirection: 'column', marginTop: 10}}>
            <Text style={styles.headerTextCart}>
              Items added to cart successfully
            </Text>
          </View>

          <TouchableOpacity
            style={{
              height: 30,
              width: 150,
              borderWidth: 1,
              borderColor: colors.blue,
              marginTop: 10,
              backgroundColor: colors.white,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.replace('MyCart');
            }}>
            <Text style={{color: colors.blue}}>My Cart</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <View
      style={homeStyles.container}
      // isLoading={productData.isLoading}
    >
      {/* { setAllProducts()} */}

      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={homeStyles.homeLinearGradient}>
        {productDetail !== undefined &&
          productDetail.custom_attributes !== undefined &&
          productDetail.custom_attributes.length > 0 && (
            <View>
              <CustomeHeader
                back={'back'}
                title={productDetail.name}
                isHome={true}
                addToCart={'addToCart'}
                addToWishList={'addToWishList'}
                addToLocation={'addToLocation'}
              />
              {bottomSliderView()}

              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                style={homeStyles.homeScrollView}>
                <View ref={c => (contentRef = c)}>
                  {productDetail !== undefined &&
                  productDetail.media_gallery_entries !== undefined &&
                  productDetail.media_gallery_entries.length > 0 ? (
                    <IndicatorViewPager
                      style={{height: 250}}
                      indicator={_renderDotIndicator(
                        productDetail.media_gallery_entries.length,
                      )}>
                      {productDetail.media_gallery_entries.map(
                        (image, index) => (
                          <View
                            key={index}
                            style={{
                              width: '100%',
                              backgroundColor: colors.white,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={{uri: BASE_URL_IMAGE + image.file}}
                              style={{height: 200, width: 200}}
                              resizeMode="contain"
                            />
                          </View>
                        ),
                      )}
                    </IndicatorViewPager>
                  ) : (
                    productDetail !== undefined &&
                    productDetail.custom_attributes !== undefined &&
                    utils.getAttributeFromCustom(productDetail, 'image') !==
                      'NA' && (
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: colors.white,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{
                            uri:
                              BASE_URL_IMAGE +
                              utils.getAttributeFromCustom(
                                productDetail,
                                'image',
                              ),
                          }}
                          style={{height: 200, width: 200}}
                          resizeMode="contain"
                        />
                      </View>
                    )
                  )}
                  <View style={styles.paddedView}>
                    <Text style={[homeStyles.textBold, {marginBottom: 10}]}>
                      {productDetail.sku}
                    </Text>
                    <Text style={styles.titleText}>{productDetail.name}</Text>

                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {GlobalConst.LoginToken.length > 0 &&
                        GlobalConst.customerStatus === 'Approved' && (
                          <AvailableQuantity pdp={productDetail} />
                        )}
                      {productDetail !== undefined &&
                        productDetail.options !== undefined &&
                        productDetail.options.length > 0 &&
                        GlobalConst.LoginToken.length > 0 &&
                        GlobalConst.customerStatus === 'Approved' &&
                        renderShortdatedRange() !== '0.00' && (
                          <Text
                            style={[
                              styles.greenLight,
                              {fontSize: 16, marginLeft: 20},
                            ]}>
                            $ {renderShortdatedRange()} {'\n'}(For Shortdated) -
                              $ {renderShortdatedRange()} {'\n'}(For Shortdated)
                          </Text>
                        )}
                    </View>
                  </View>

                  {!_.isEmpty(productDetail)
                    ? renderProductDetailsSection()
                    : null}

                  {renderAdditionalInfo()}

                  {GlobalConst.LoginToken.length > 0 ? null : (
                    <View
                      style={{
                        marginTop: 20,
                        marginLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                          fontSize: 16,
                        }}>
                        Please{' '}
                      </Text>
                      <TouchableOpacity
                        style={{marginRight: 2}}
                        onPress={() => {
                          navigation.navigate('Login');
                        }}>
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            color: colors.blue,
                            fontSize: 16,
                          }}>
                          Login
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                          fontSize: 16,
                        }}>
                        to buy this product!
                      </Text>
                    </View>
                  )}

                  {GlobalConst.LoginToken.length > 0 &&
                  GlobalConst.customerStatus === 'Approved' ? (
                    <GeneralProduct
                      productDetail={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  ) : (
                    <GeneralProductNotLoggedIn
                      productDetail={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  )}
                  {GlobalConst.LoginToken.length > 0 &&
                  GlobalConst.customerStatus === 'Approved' ? (
                    <ShortDated
                      ref={shortDatedRef}
                      productDetail={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  ) : (
                    <ShortDatedNotLoggedIn
                      productDetail={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  )}

                  <View style={{height: 100}}></View>
                  {/* <RelatedProducts productDetail = {productDetail} /> */}
                </View>
              </ScrollView>
            </View>
          )}
      </LinearGradient>
      {dialogView()}
    </View>
  );
};
export default ProductDetail;
