import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import homeStyles from '../home/home_style';
import colors from '../../config/Colors';
import {getRelatedProducts} from '../../services/operations/productApis';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import styles from './productStyles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  getProductDetailSuccess,
  setStockStatus,
} from '../../slices/productSlices';
import utils from '../../utilities/utils';
import {
  addToCart,
  getCartID,
  addWishlist,
  checkStockStatus,
} from '../../services/operations/productApis';
import WishlistStatus from './WishlistStatus';

const RelatedProducts = props => {
  const navigation = useNavigation();
  const RELATED_PRODUCT_FIRST_ITEM = 0;
  const product = useSelector(state => state.product);

  const [relatedProducts, setRelatedProductsState] = useState([]);
  let relatedProductRef = useRef();
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const [activeRelatedProduct, setActiveRelatedProduct] = useState(
    RELATED_PRODUCT_FIRST_ITEM,
  );
  const [selectedItem, setItem] = useState(undefined);

  let productDetail = {};

  if (props !== undefined) {
    productDetail = props.productDetail;
  }

  function setRelatedProducts() {
    if (
      _.isEmpty(productData.relatedProducts) &&
      productDetail !== undefined &&
      productDetail.custom_attributes !== undefined
    ) {
      const dosage = utils.getAttributeFromCustom(productDetail, 'dosage_form');
      dispatch(getRelatedProducts(dosage));
    }
  }

  useEffect(() => {
    {
      setRelatedProducts();
    }
  }, []);

  useEffect(() => {
    if (
      productData.relatedProducts !== undefined &&
      productData.relatedProducts.payload !== undefined &&
      !_.isEmpty(productData.relatedProducts.payload)
    ) {
      setRelatedProductsState(productData.relatedProducts.payload);
    }
  }, [productData.relatedProducts]);

  useEffect(() => {
    if (
      selectedItem !== undefined &&
      product.stockStatus.length > 0 &&
      parseInt(product.stockStatus) <= 0 &&
      relatedProducts !== undefined &&
      relatedProducts.length > 0
    ) {
      let index = _.findIndex(relatedProducts, {sku: selectedItem.sku});

      if (index !== -1) {
        let dataObject = {};
        dataObject = _.clone(relatedProducts[index]);
        dataObject['stock'] = product.stockStatus;
        let temp = _.cloneDeep(relatedProducts);
        temp.splice(index, 1, dataObject);
        setRelatedProductsState(temp);
        dispatch(setStockStatus(''));
      }
    } else {
      if (
        selectedItem !== undefined &&
        product.stockStatus.length > 0
        // && parseInt(product.stockStatus)>0
      ) {
        let index = _.findIndex(relatedProducts, {sku: selectedItem.sku});

        if (index !== -1) {
          let dataObject = {};
          dataObject = _.clone(relatedProducts[index]);
          dataObject['stock'] = product.stockStatus;
          let temp = _.cloneDeep(relatedProducts);
          temp.splice(index, 1, dataObject);
          setRelatedProductsState(temp);
          dispatch(setStockStatus(''));
          if (_.isEmpty(product.cartId)) {
            dispatch(getCartID(selectedItem.sku, 1, 'general'));
          } else {
            dispatch(addToCart(selectedItem.sku, 1, product.cartId));
          }
        }
      }
    }
  }, [product.stockStatus]);

  function getRelatedProductsCarousel() {
    return (
      <View style={{backgroundColor: colors.white, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Text style={[homeStyles.textBold, {fontSize: 24}]}>
            Related Products
          </Text>
        </View>
        <Carousel
          ref={c => (relatedProductRef = c)}
          data={relatedProducts}
          renderItem={getRelatedProductCard}
          sliderWidth={parseInt(width) + 10}
          itemWidth={300}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          //   autoplay={false}
          //   autoplayDelay={500}
          //   autoplayInterval={3000}
          onSnapToItem={index => setActiveRelatedProduct(index)}
        />
        {getPagination(
          relatedProducts,
          activeRelatedProduct,
          relatedProductRef,
        )}
      </View>
    );
  }

  addFavourites = item => {
    dispatch(addWishlist(item.sku));
  };

  function addToCarts(selectedItem) {
    //
    dispatch(checkStockStatus(selectedItem.sku));
    setItem(selectedItem);
  }

  function getPagination(datas, activeSlide, sliderRef) {
    return (
      <Pagination
        dotsLength={datas.length}
        activeDotIndex={activeSlide}
        containerStyle={homeStyles.paginationContainer}
        dotColor={colors.blue}
        dotStyle={homeStyles.activeIndicatorRewardsSmalll}
        inactiveDotStyle={homeStyles.paginationDotSmall}
        inactiveDotColor={colors.grey}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={sliderRef}
        tappableDots={!!sliderRef}
      />
    );
  }

  function getRelatedProductCard(item, index) {
    const product = item.item;
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(getProductDetailSuccess({}));
          navigation.replace('ProductDetail', {sku: product.sku});
        }}
        key={index}>
        {(product.type_id === 'simple' ||
          product.type_id === 'configurable') && (
          <View
            style={{
              height: 390,
              width: 300,
              borderColor: colors.lightGrey,
              borderWidth: 1,
              borderRadius: 10,
              marginRight: 20,
            }}>
            <View
              style={{
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                height: '50%',
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
                    Short Dated Available
                  </Text>
                </View>
              ) : null}
            </View>
            <View
              style={{
                height: '40%',
                width: '100%',
                backgroundColor: colors.white,
                padding: 30,
                paddingTop: 10,
                borderTopWidth: 0.5,
                borderColor: colors.textColor,
              }}>
              <Text
                numberOfLines={2}
                style={[homeStyles.textBold, {fontSize: 20, marginBottom: 10}]}>
                {product.name}
              </Text>
              <Text
                numberOfLines={2}
                style={[homeStyles.textBold, {fontSize: 14, marginBottom: 10}]}>
                NDC: {product.sku}
              </Text>
              {/* {product.custom_attributes.find(element=>element.attribute_code==='theraputic_cat') !==undefined &&
           <Text numberOfLines={1} style={[styles.textLight,{fontSize:16}] }>{(loginData.categoryNames.find(element=>element.value==(utils.getAttributeFromCustom(product, 'theraputic_cat')))).label}</Text>} */}
              {product.stock !== undefined && parseInt(product.stock) <= 0 && (
                <Text
                  style={[
                    homeStyles.textBold,
                    {fontSize: 14, color: colors.red},
                  ]}>
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
                 
                  {/* <Text style={[homeStyles.textBold, {fontSize: 36}]}>
                    $ {product.price}
                  </Text> */}

                   {/* // Render PriceList  */}

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
                          $ {product.price} -  $ {product.price}
                          </Text>
                        </View>

                  {/* <TouchableOpacity
                    hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
                    onPress={() => {
                      addToCarts(product);
                    }}
                    style={{height: 40, width: 20}}>
                    <Image source={require('../../images/Group_1822.png')} />
                  </TouchableOpacity> */}
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/*  */}

        {GlobalConst.LoginToken.length > 0 &&
          GlobalConst.customerStatus === 'Approved' && (
            <WishlistStatus item={product} />
          )}

        {/*  */}
      </TouchableOpacity>
    );
  }

  return (
    <View>
      {getRelatedProductsCarousel()}
      <View style={{height: 70}}></View>
    </View>
  );
};
export default RelatedProducts;
