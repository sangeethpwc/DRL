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
  Alert,
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
  addToCart,
  addToCartWithOptions,
  getCartID,
  getProductDetail,
  getProductsListConfigurable,
  getRelatedProducts,
  getProductDetailConfigurable,
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
  setConfigurableProducts,
  setConfigurableProductDetail,
  setStockStatus,
  getProductDetailConfigurableSuccess,
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

const ProductDetailConfigurable = props => {
  const [info1, setInfo1] = useState(true);
  const [info2, setInfo2] = useState(false);

  const [productDetailParent, setProductDetail] = useState({});
  const [productDetail, setProductDetailConfigurable] = useState({});
  let ViewWithSpinner = withLoader(View);
  let bottomDrawerRef = useRef(null);
  let contentRef = useRef(null);
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);

  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();

  function renderShortdatedRange() {
    //  let data = utils.getOptions(productDetail, 'Shortdated LOT No#');
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
      let max = parseFloat(data[0].price);
      let min = parseFloat(data[0].price);
      for (let i = 0; i < data.length; i++) {
        if (parseFloat(data[i].price) > max) {
          max = parseFloat(data[i].price);
        }
        if (parseFloat(data[i].price) < min) {
          min = parseFloat(data[i].price);
        }
      }
      // let maxRounded=max.toFixed(2)
      // let minRounded=min.toFixed(2)
      // return(""+minRounded+"-"+maxRounded+"")
      if (max !== min) {
        return '' + min + '-' + max + '';
      } else {
        return '' + min;
      }
    }
  }

  function renderAdditionalInfo() {
    return (
      <View style={{margin: 10, marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
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
            <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 14}}>
              Wholesaler item number
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInfo2(true);
              setInfo1(false);
            }}
            style={
              info2
                ? {marginLeft: 10, borderBottomWidth: 0.5, paddingBottom: 5}
                : {marginLeft: 10, paddingBottom: 5}
            }>
            <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 14}}>
              Supportive documents
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
            ) !== undefined && (
              <Text
                style={[styles.boldText, {color: colors.blue, fontSize: 14}]}
                onPress={() =>
                  Linking.openURL(
                    productDetail.custom_attributes.find(
                      element => element.attribute_code === 'link_dailymed',
                    ).value,
                  )
                }>
                Allergen Statement
              </Text>
            )}

            {productDetail.custom_attributes.find(
              element => element.attribute_code === 'link_msds',
            ) !== undefined && (
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
          </View>
        )}
      </View>
    );
  }

  function renderProductDetailsSection() {
    return (
      // <BottomDrawer
      // containerHeight={100}
      // offset={TAB_BAR_HEIGHT}
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
                    <Text style={styles.lightText}>Refrigerated</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'cold_chain',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'cold_chain',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'cold_chain',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Latex Free</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
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
                        : 'NA'}
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
                        : 'NA'}
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
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Short Description</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element =>
                          element.attribute_code === 'short_description',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element =>
                          element.attribute_code === 'short_description',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element =>
                              element.attribute_code === 'short_description',
                          ).value
                        : 'NA'}
                    </Text>
                  </View>
                </View>

                <View style={{width: '50%', paddingLeft: 5}}>
                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>NDC No.</Text>
                    <Text numberOfLines={1} style={styles.boldText}>
                      {productDetail.sku}
                    </Text>
                  </View>

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
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Gluten Free</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'gluten_free',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'gluten_free',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'gluten_free',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Preservative Free</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
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
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Dye Free</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'dye_free',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'dye_free',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element => element.attribute_code === 'dye_free',
                          ).value === '1'
                          ? 'Yes'
                          : 'No'
                        : 'NA'}
                    </Text>
                  </View>

                  <View style={styles.productDetailViews}>
                    <Text style={styles.lightText}>Total Content</Text>
                    <Text style={styles.boldText}>
                      {productDetail.custom_attributes.find(
                        element => element.attribute_code === 'drl_division',
                      ) !== undefined &&
                      productDetail.custom_attributes.find(
                        element => element.attribute_code === 'drl_division',
                      ).value !== undefined
                        ? productDetail.custom_attributes.find(
                            element =>
                              element.attribute_code === 'drl_division',
                          ).value
                        : 'NA'}
                    </Text>
                  </View>
                </View>
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
            </View>
          )}
      </View>
      // </BottomDrawer>
    );
  }

  function setAllProducts() {
    if (
      productData.isLoading === false &&
      productData.configurableProductsProductDetail.length === 0
    ) {
      dispatch(getProductDetail(props.route.params.sku));
      dispatch(
        getProductsListConfigurable(
          props.route.params.sku,
          'ProductDetailConfigurable',
        ),
      );
    }
  }

  useEffect(() => {
    if (!_.isEmpty(productData.productDetail)) {
      setProductDetail(productData.productDetail);
    }
  }, [productData.productDetail]);

  useEffect(() => {
    if (!_.isEmpty(productData.productDetailConfigurable)) {
      setProductDetailConfigurable(productData.productDetailConfigurable);
    }
  }, [productData.productDetailConfigurable]);

  useEffect(() => {
    if (productData.configurableProductsProductDetail.length > 0) {
      setSelectedStrengthValue = loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProductsProductDetail[0],
            'strength',
          ),
      ).label;
      setSelectedPackValue = loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProductsProductDetail[0],
            'pack_size',
          ),
      ).label;
      // setProductDetailConfigurable(productData.configurableProductsProductDetail[0]);
      dispatch(
        getProductDetailConfigurable(
          productData.configurableProductsProductDetail[0].sku,
        ),
      );
    }
  }, [productData.configurableProductsProductDetail]);

  //..............

  function setSelectedStrength(value) {
    setSelectedStrengthValue = value;
    sortConfigurable();
  }

  function setSelectedPack(value) {
    setSelectedPackValue = value;
    sortConfigurable();
  }

  function setQuantity(value) {
    setQuantityValue = value;
  }

  useEffect(() => {
    {
      setAllProducts();
    }

    return () => {
      ////Unmount called

      dispatch(setConfigurableProducts([]));
      dispatch(setConfigurableProductDetail([]));
      dispatch(getProductDetailSuccess({}));
      dispatch(getProductDetailConfigurableSuccess({}));
    };
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

  function sortConfigurable() {
    let selectedStrength = undefined;
    let selectedPack = undefined;
    let item = null;
    let itemFound = false;
    for (
      let i = 0;
      i < productData.configurableProductsProductDetail.length;
      i++
    ) {
      item = productData.configurableProductsProductDetail[i];
      selectedStrength = loginData.strengthLabels.find(
        element => element.label === setSelectedStrengthValue,
      );
      selectedPack = loginData.packLabels.find(
        element => element.label === setSelectedPackValue,
      );
      if (
        selectedStrength !== undefined &&
        selectedPack !== undefined &&
        utils.getAttributeFromCustom(item, 'strength') != 'NA' &&
        utils.getAttributeFromCustom(item, 'strength') ===
          selectedStrength.value &&
        utils.getAttributeFromCustom(item, 'pack_size') != 'NA' &&
        utils.getAttributeFromCustom(item, 'pack_size') === selectedPack.value
      ) {
        dispatch(setStockStatus(''));
        // setProductDetailConfigurable(item);
        dispatch(getProductDetailConfigurable(item.sku));

        itemFound = true;
        break;
      }
    }

    if (itemFound === false) {
      Toast.show(
        'Selected strength and pack variants unavailable',
        Toast.SHORT,
      );
    }
  }

  function renderImage() {
    if (
      productDetail !== undefined &&
      productDetail.media_gallery_entries !== undefined &&
      productDetail.media_gallery_entries.length > 0
    ) {
      return (
        <IndicatorViewPager
          style={{height: 250}}
          indicator={_renderDotIndicator(
            productDetail.media_gallery_entries.length,
          )}>
          {productDetail.media_gallery_entries.map((image, index) => (
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
          ))}
        </IndicatorViewPager>
      );
    } else if (
      productDetail !== undefined &&
      productDetail.custom_attributes !== undefined &&
      utils.getAttributeFromCustom(productDetail, 'image') !== 'NA'
    ) {
      return (
        // <IndicatorViewPager
        // style={{height:250}}
        // indicator={_renderDotIndicator(1)}>

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
                utils.getAttributeFromCustom(productDetail, 'image'),
            }}
            style={{height: 200, width: 200}}
            resizeMode="contain"
          />
        </View>
        // </IndicatorViewPager>
      );
    }
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

              <ScrollView style={homeStyles.homeScrollView}>
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
                    {GlobalConst.LoginToken.length > 0 &&
                    GlobalConst.customerStatus === 'Approved' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        {GlobalConst.LoginToken.length > 0 &&
                          GlobalConst.customerStatus === 'Approved' && (
                            <Text
                              style={[styles.titleText, {marginRight: 100}]}>
                              $ {productDetail.price}
                            </Text>
                          )}
                        <Text style={styles.boldText}>
                          {loginData.brandNames.find(
                            element =>
                              element.value ==
                              utils.getAttributeFromCustom(
                                productDetail,
                                'brand_name',
                              ).value,
                          ) !== undefined
                            ? loginData.brandNames.find(
                                element =>
                                  element.value ==
                                  utils.getAttributeFromCustom(
                                    productDetail,
                                    'brand_name',
                                  ).value,
                              ).label
                            : ''}
                        </Text>
                      </View>
                    ) : null}
                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {GlobalConst.LoginToken.length > 0 &&
                        GlobalConst.customerStatus === 'Approved' && (
                          <AvailableQuantity sku={productDetail.sku} />
                        )}
                      {productDetail !== undefined &&
                        productDetail.options !== undefined &&
                        productDetail.options.length > 0 &&
                        GlobalConst.LoginToken.length > 0 &&
                        GlobalConst.customerStatus === 'Approved' && (
                          <Text
                            style={[
                              styles.greenLight,
                              {fontSize: 16, marginLeft: 20},
                            ]}>
                            $ {renderShortdatedRange()} {'\n'} (For Shortdated) 
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
                      productDetail={productDetailParent}
                      productDetailChild={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  ) : (
                    <GeneralProductNotLoggedIn
                      productDetail={productDetailParent}
                      productDetailChild={productDetail}
                      setSelectedStrength={setSelectedStrength}
                      setSelectedPack={setSelectedPack}
                      setQuantity={setQuantity}
                    />
                  )}

                  {GlobalConst.LoginToken.length > 0 &&
                  GlobalConst.customerStatus === 'Approved' &&
                  productDetail.options.length > 0 ? (
                    <ShortDated
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
    </View>
  );
};
export default ProductDetailConfigurable;
