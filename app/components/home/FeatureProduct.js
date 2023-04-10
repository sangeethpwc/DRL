import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Image, Alert, TouchableOpacity} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getFeatureProducts} from '../../services/operations/homeApis';
import {useNavigation} from '@react-navigation/native';
import {
  endSearch,
  getProductDetailSuccess,
  getProductsSuccess,
  setErrorMsg,
  setStockStatus,
  setConfigurableProducts,
} from '../../slices/productSlices';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import {
  addToCart,
  getCartID,
  addWishlist,
  checkStockStatus,
  checkStockStatusWithLoader,
  getProductsListConfigurable,
} from '../../services/operations/productApis';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import utils from '../../utilities/utils';
import AllProductVariants from '../product/AllProductVariants';
import WishlistStatus from '../product/WishlistStatus';
import Modal from 'react-native-modalbox';

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const SLIDER_FEATURE_PRODUCT = 0;

const FeatureProduct = props => {
  const navigation = useNavigation();
  let featureProductRef = useRef(null);
  const product = useSelector(state => state.product);
  const [featureProducts, setFeatureProductsState] = useState([]);
  const [activeFeatureProduct, setActiveFeatureProduct] = useState(
    SLIDER_FEATURE_PRODUCT,
  );
  const [selectedItem, setItem] = useState(undefined);
  const [selectedItemParent, setItemParent] = useState(undefined);

  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);

  const homeData = useSelector(state => state.home);

  // let nameDrawerRef = useRef(null);

  useEffect(() => {
    if (product.cartSuccess) {
      Toast.show('Added to cart', Toast.LONG);
    }
  }, [product.cartSuccess]);

  useEffect(() => {
    console.log('Feature prod mounted..........');
    if (
      _.isEmpty(homeData.featureProducts) &&
      !_.isEmpty(loginData.filterCategories)
    ) {
      if (
        loginData.filterCategories !== undefined &&
        loginData.filterCategories.find(
          element =>
            element !== undefined &&
            element.label !== undefined &&
            element.label === 'Featured',
        ).value !== undefined
      ) {
        const featuredValue = loginData.filterCategories.find(
          element =>
            element !== undefined &&
            element.label !== undefined &&
            element.label === 'Featured',
        ).value;
        GlobalConst.featuredValue = featuredValue;
        dispatch(getFeatureProducts(featuredValue));
      }
    }
    // else if (!_.isEmpty(homeData.featureProducts)){
    //     setFeatureProductsState(homeData.featureProducts);
    // }
    return () => {};
  }, [loginData.filterCategories]);

  useEffect(() => {
    if (
      selectedItemParent !== undefined &&
      selectedItemParent.type_id === 'simple'
    ) {
      if (
        selectedItem !== undefined &&
        product.stockStatus.length > 0 &&
        parseInt(product.stockStatus) <= 0 &&
        featureProducts !== undefined &&
        featureProducts.length > 0
      ) {
        let index = _.findIndex(featureProducts, {sku: selectedItem.sku});

        if (index !== -1) {
          let dataObject = {};
          dataObject = _.clone(featureProducts[index]);
          dataObject['stock'] = product.stockStatus;
          let temp = _.cloneDeep(featureProducts);
          temp.splice(index, 1, dataObject);
          setFeatureProductsState(temp);
          dispatch(setStockStatus(''));
        }
      } else {
        if (
          selectedItem !== undefined &&
          product.stockStatus.length > 0
          // && parseInt(product.stockStatus)>0
        ) {
          let index = _.findIndex(featureProducts, {sku: selectedItem.sku});

          if (index !== -1) {
            let dataObject = {};
            dataObject = _.clone(featureProducts[index]);
            dataObject['stock'] = product.stockStatus;
            let temp = _.cloneDeep(featureProducts);
            temp.splice(index, 1, dataObject);
            setFeatureProductsState(temp);
            dispatch(setStockStatus(''));
            if (_.isEmpty(product.cartId)) {
              dispatch(
                getCartID(
                  selectedItem.sku,
                  1,
                  'general',
                  null,
                  null,
                  'Featured',
                ),
              );
            } else {
              dispatch(
                addToCart(
                  selectedItem.sku,
                  1,
                  product.cartId,
                  null,
                  'Featured',
                ),
              );
            }
          }
        }
      }
      setItem(undefined);
    }
  }, [product.stockStatus]);

  useEffect(() => {
    if (!_.isEmpty(homeData.featureProducts)) {
      setFeatureProductsState(homeData.featureProducts);
    }
  }, [homeData.featureProducts]);

  useEffect(() => {
    let msg = '';
    msg = product.errorMsg;
    dispatch(setErrorMsg(''));
    if (msg.length > 0) {
      Alert.alert(
        'Error',
        product.errorMsg,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(setErrorMsg(''));
            },
          },
        ],
        {cancelable: false},
      );
    }
    return () => {};
  }, [product.errorMsg]);

  // function nameView() {
  //   return (
  //     <Modal
  //       style={{height: '40%'}}
  //       //position={'bottom'}
  //       ref={c => (nameDrawerRef = c)}
  //       backdropPressToClose={false}>
  //       <View
  //         style={{
  //           flex: 1,
  //           flexDirection: 'column',
  //           padding: 20,
  //           backgroundColor: colors.white,
  //         }}>
  //         <Text>Product Name</Text>
  //       </View>
  //     </Modal>
  //   );
  // }

  function getFeaturedProductsCarousel() {
    return (
      <View style={{backgroundColor: colors.white, width: '100%'}}>
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
          Featured Products
        </Text>
        <Carousel
          ref={c => (featureProductRef = c)}
          data={featureProducts}
          renderItem={getFeaturedProductCard}
          sliderWidth={parseInt(width) + 10}
          itemWidth={250}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => setActiveFeatureProduct(index)}
        />
        {getPagination(
          featureProducts,
          activeFeatureProduct,
          featureProductRef,
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

  const addFavourites = item => {
    dispatch(addWishlist(item.sku));
  };

  function addToCarts(selectedItem) {
    dispatch(checkStockStatusWithLoader(selectedItem.sku));
    setItem(selectedItem);
  }

  function renderPrice(product) {
    if (product.tier_prices !== undefined && !_.isEmpty(product.tier_prices)) {
      if (
        product.tier_prices.find(
          element => element.customer_group_id === GlobalConst.customerGroup,
        ) !== undefined &&
        product.tier_prices.find(
          element => element.customer_group_id === GlobalConst.customerGroup,
        ).value !== undefined
      ) {
        return utils.formatPrice(
          product.tier_prices.find(
            element => element.customer_group_id === GlobalConst.customerGroup,
          ).value,
        );
      } else {
        return utils.formatPrice(product.price);
      }
    } else {
      return utils.formatPrice(product.price);
    }
  }

  function getFeaturedProductCard(item, index) {
    const product = item.item;
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(getProductDetailSuccess({}));
          if (product.type_id === 'simple') {
            navigation.navigate('ProductDetail', {sku: product.sku});
          } else {
            navigation.navigate('ProductDetailConfigurable', {
              sku: product.sku,
            });
          }
          props.handleScroll();
        }}
        key={index}>
        {(product.type_id === 'simple' ||
          product.type_id === 'configurable') && (
          <View
            style={
              GlobalConst.LoginToken.length > 0
                ? {
                    height: 450,
                    width: 250,
                    borderColor: colors.lightGrey,
                    borderWidth: 1,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    marginRight: 20,
                  }
                : {
                    height: 350,
                    width: 250,
                    borderColor: colors.lightGrey,
                    borderWidth: 1,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    marginRight: 20,
                  }
            }>
            <View
              style={{
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                height: '45%',
                width: '100%',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              {utils.getAttributeFromCustom(product, 'image') !== 'NA' ? (
                <Image
                  source={{
                    uri:
                      BASE_URL_IMAGE +
                      utils.getAttributeFromCustom(product, 'image'),
                  }}
                  style={{height: 150, width: 150}}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require('../../images/Group_741.png')}
                  style={{height: 150, width: 150}}
                  resizeMode="contain"
                />
              )}
              {GlobalConst.LoginToken.length > 0 &&
                GlobalConst.customerStatus === 'Approved' &&
                product.type_id === 'simple' && (
                  <WishlistStatus item={product} />
                )}

              {product.options !== undefined && product.options.length > 0 ? (
                <View
                  style={{
                    backgroundColor: '#FF7069',
                    left: 0,
                    top: 0,
                    padding: 5,
                    position: 'absolute',
                    borderTopLeftRadius: 10,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: colors.white,
                      fontFamily: 'DRLCircular-Light',
                    }}>
                    Special Buy Available
                  </Text>
                </View>
              ) : null}
            </View>
            <View
              style={{
                height: '60%',
                width: '100%',
                backgroundColor: colors.white,
                padding: 20,
                paddingTop: 10,
                borderTopWidth: 0.5,
                borderColor: colors.textColor,
              }}>
              {/* <TouchableOpacity
              onPress={() => {
                props.setNameToShow(product.name);
                props.setSkuToShow(product.sku);
              }}
              > */}
              <Text
                numberOfLines={3}
                style={[styles.textBold, {fontSize: 15, marginBottom: 10}]}>
                {product.name}
              </Text>
              {/* </TouchableOpacity> */}
              {product.type_id === 'simple' && (
                <View>
                  <Text
                    style={[styles.textBold, {fontSize: 14, marginBottom: 10}]}>
                    NDC: {product.sku}
                  </Text>

                  {GlobalConst.LoginToken.length > 0 && (
                    <View>
                      {product.extension_attributes !== undefined &&
                      product.extension_attributes.stoct_status !== undefined &&
                      product.extension_attributes.stoct_status === '1' ? (
                        <View
                          style={[
                            styles.labelGreen,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              width: '60%',
                              marginBottom: 10,
                            },
                          ]}>
                          <Text style={[styles.greenLight, {fontSize: 14}]}>
                            In stock
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.labelRed,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              width: '70%',
                              marginBottom: 10,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.greenLight,
                              {fontSize: 14, color: colors.red},
                            ]}>
                            Out of stock
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {loginData.strengthLabels.find(
                    element =>
                      element.value ===
                      utils.getAttributeFromCustom(product, 'strength'),
                  ) != undefined && (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textBold,
                        {
                          fontSize: 14,
                          marginBottom: 5,
                          fontFamily: 'DRLCircular-Light',
                        },
                      ]}>
                      {
                        loginData.strengthLabels.find(
                          element =>
                            element.value ===
                            utils.getAttributeFromCustom(product, 'strength'),
                        ).label
                      }
                    </Text>
                  )}

                  <View style={{flexDirection: 'row'}}>
                    {loginData.packLabels.find(
                      element =>
                        element.value ===
                        utils.getAttributeFromCustom(product, 'pack_size'),
                    ) != undefined && (
                      <Text
                        style={[
                          styles.textBold,
                          {
                            fontSize: 14,
                            marginBottom: 10,
                            fontFamily: 'DRLCircular-Light',
                            marginRight: 10,
                          },
                        ]}>
                        Pack size:{' '}
                        {
                          loginData.packLabels.find(
                            element =>
                              element.value ===
                              utils.getAttributeFromCustom(
                                product,
                                'pack_size',
                              ),
                          ).label
                        }
                      </Text>
                    )}

                    {/* {utils.getAttributeFromCustom(product,'case_pack')!=undefined &&
        <Text style={[styles.textBold,{fontSize:14,marginBottom:10,fontFamily:'DRLCircular-Light'}] }>Case Pack: {utils.getAttributeFromCustom(product,'case_pack')}</Text>} */}
                  </View>
                </View>
              )}

              {product.stock !== undefined && parseInt(product.stock) <= 0 && (
                <Text
                  style={[styles.textBold, {fontSize: 14, color: colors.red}]}>
                  Out of stock
                </Text>
              )}

              {GlobalConst.LoginToken.length > 0 &&
              GlobalConst.customerStatus === 'Approved' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>

                  {product.type_id === 'simple' ? (
                    <View>
                    
                      {renderPrice(product) > 0 && (
                        
                        // Render PriceList 
                        
                        <View
                          style={[
                            styles.labelGreen,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              width: '100%',
                              marginBottom: 10,
                            },
                          ]}>
                          <Text style={[styles.greenLight,styles.textBold, {fontSize: 18}]}>
                          {product.extension_attributes.custom_min_price} - {product.extension_attributes.custom_max_price}
                          </Text>
                        </View>
                        
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setItemParent(product);
                        props.selectVariantsConfigurable(product);
                        // if(product.type_id !== 'simple'){
                        // setItem(product)
                        // dispatch(getProductsListConfigurable(product.sku, "AllProducts"));
                        // }
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.blue,
                          textDecorationLine: 'underline',
                          fontFamily: 'DRLCircular-Book',
                        }}>
                        Select Strengths
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* {product.type_id === 'simple' &&
                    product.extension_attributes.stoct_status === '1' &&
                    renderPrice(product) > 0 && (
                      <TouchableOpacity
                        hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
                        onPress={() => {
                          if (GlobalConst.customerStatus === 'Approved') {
                            props.handleScroll();
                            setItemParent(product);
                            addToCarts(product);

                          } else {
                            Toast.show(
                              'Please complete Profile / Wait for approval',
                              Toast.SHORT,
                            );
                          }
                        }}
                        style={{
                          height: 40,
                          width: 20,
                          position: 'absolute', 
                          right: 10,
                          bottom: 5,
                        }}>
                        <Image
                          source={require('../../images/Group_1822.png')}
                        />
                      </TouchableOpacity>
                    )} */}
                    
                </View>
              ) : null}
              
            </View>
            <View
              style={{ 
                height: 0.5,
                width: '100%',
                backgroundColor: colors.grey,
                position: 'absolute',
                bottom: 0,
              }}></View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <LoaderCustome />
      {getFeaturedProductsCarousel()}
    </View>
  );
};
export default FeatureProduct;
