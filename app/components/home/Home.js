import React, {useState, useEffect, useRef} from 'react';
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
  SafeAreaView,
  FlatList,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  endSearch,
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  setStockStatus,
  setSearchedProductsSuccess,
  setFilters,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setProductName,
} from '../../slices/productSlices';
import {
  addToCart,
  getCartID,
  addWishlist,
  checkStockStatus,
  getProductsListConfigurable,
  getProductsSearch,
} from '../../services/operations/productApis';
import {
  setNotificationStatus,
  setInvalidUser,
} from '../../slices/authenticationSlice';
import HomeBanner from './HomeBanner';
import RecentOrders from './RecentOrders';
import FeatureProduct from './FeatureProduct';
import WishlistStatusListView from '../product/WishlistStatusListView';
import {
  intilizedToken,
  getCustomerInfoSuccess,
} from '../../slices/authenticationSlice';

//....................................
import AllProductVariants from '../product/AllProductVariants';
import Modal from 'react-native-modalbox';
import utils from '../../utilities/utils';

import {getvideo} from '../../services/operations/homeApis';
//....................................

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

var setSelectedStrengthValue = '';
var setSelectedPackValue = '';
var setQuantityValue = 0;

const images = [
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
];

const SLIDER_FEATURE_PRODUCT = 0;

const home = props => {
  let isLoading = false;

  const navigation = useNavigation();
  let featureProductRef = useRef();

  const SLIDER_BANNER_FIRST_ITEM = 0;

  //..................... Feature Products.........................................
  const [selectedItem, setItem] = useState(undefined);
  const [selectConfigurableItem, setConfigurablProduct] = useState(undefined);
  const product = useSelector(state => state.product);

  const [isClosed, setIsClosed] = useState(true);

  let bottomDrawerVariantRefConfigurable = useRef(null);

  const [email, setEmail] = useState('');
  const [active, setActive] = useState(0);
  const [isRecentOrder, recentOrders] = useState(false);
  const [isUpcomingDelivery, upcomingDeliveries] = useState(true);

  const [recent_orders, setRecentOrders] = useState([]);

  const [featureProducts, setFeatureProductsState] = useState([]);

  const [selectedValue, setSelectedValue] = useState('Select Pack Size');

  const [productPackSize, setProductPackSize] = useState([]);
  const [productStrength, setProductStrength] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [activeFeatureProduct, setActiveFeatureProduct] = useState(
    SLIDER_FEATURE_PRODUCT,
  );

  const [activeBanner, setActiveBanner] = useState(SLIDER_BANNER_FIRST_ITEM);
  const [isApiCalled, setApiCalled] = useState(false);

  let bannerRef = useRef(null);

  const isredirectvalue = true;

  const [data, setData] = useState([]);
  const [dataDropdown, setDataDropdown] = useState([]);
  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);

  const homeData = useSelector(state => state.home);

  useEffect(() => {
    getTheme();
    dispatch(getvideo());
  }, []);

  const getTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('actsts');
      console.log('value -- ', value);
      if(value === 'active'){
        add();
        navigation.navigate('ChangeAddress');
      }
    } catch(error) {
      console.log('error -- ', error);
    };
  };

  const add = async ()=>{
    try {
      await AsyncStorage.setItem('actsts', "in_active")
      console.log('sts_changed');
    }
    catch (e){
      console.error(e);
    }
  }

  useEffect(() => {
    let status = loginData.notificationStatus;
    if (loginData.notificationStatus !== '') {
      dispatch(setNotificationStatus(''));
      setTimeout(() => {
        if (status === 'ViewRequests') {
          navigation.navigate('ViewRequests', {set: 'active'});
        } else {
          navigation.navigate(status);
        }
      }, 500);
    }
  }, [loginData.notificationStatus]);

  useEffect(() => {
    if (loginData.token === undefined) {
      dispatch(setInvalidUser(true));
      dispatch(intilizedToken());

      GlobalConst.creds = {};
      GlobalConst.LoginToken = '';
      utils._clearCartId();
      navigation.replace('Login');
    }
  }, [loginData.token]);

  function addFavourites(item) {
    dispatch(addWishlist(item.sku));
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
  //...........

  const [nameToShow, setNameToShow] = useState('');
  const [skuToShow, setSkuToShow] = useState('');

  let nameDrawerRef = useRef(null);

  useEffect(() => {
    if (nameToShow.length > 0) {
      if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
        nameDrawerRef.open();
      }
    }

    let storedVersions= utils.getVersionDetails()
    console.log("storedVersions...............",storedVersions)

  }, [nameToShow]);


  // get = async () => {
  //   try {
  //     let value = await AsyncStorage.getItem("actsts")
  //     if(value !== null) {
  //         console.log('geekstest --  ' + value)
  //       // if(value === 'actsts'){
  //       //   console.log('geekstest 1--  ' + value)
  //       //   add();
  //       // }
  //     }
  //   }  catch (e){
  //     console.error(e);
  //   }
  // }

  // const add = async ()=>{
  //   try {
  //     await AsyncStorage.setItem('actsts', "inactive")
  //   }
  //   catch (e){
  //     console.error(e);
  //   }
  // }

  function dialogView() {
    return (
      <Modal
        onClosed={() => setPopLink('')}
        style={{ height: '40%', width: '80%' }}
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
            style={{ position: 'absolute', right: 10, top: 0 }}>
            <Image
              style={{ width: 10, resizeMode: 'contain' }}
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

          <TouchableOpacity
            onPress={() => {
              nameDrawerRef.close();
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 10,
              marginTop: 0,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 25,
            }}>

            <Text style={styles.whiteTextMedium}>Close</Text>

          </TouchableOpacity>

        </View>
      </Modal>
    );
  }

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
            item.type_id === 'simple' &&
            renderPrice(item) !== 0 && (
              
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                {/* ${renderPrice(item)} */}
                
                {item.extension_attributes.custom_min_price} - {item.extension_attributes.custom_max_price}
                {/* {product.extension_attributes.custom_min_price} - {product.extension_attributes.custom_max_price} */}
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
    isLoading = true;
    dispatch(getProductsSearch(text));
  }

  //.........................feature products.................................

  function addToCartSimple(selectedItem) {
    dispatch(checkStockStatus(selectedItem.sku));
    setItem(selectedItem);
  }

  function sortConfigurable() {
    if (selectedItem.type_id !== 'simple') {
      let selectedStrength = undefined;
      let selectedPack = undefined;
      let item = null;
      let itemFound = false;
      for (let i = 0; i < product.configurableProducts.length; i++) {
        item = product.configurableProducts[i];
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
          setConfigurablProduct(item);
          itemFound = true;
          break;
        }
      }

      if (itemFound === false) {
        Toast.show(
          'Selected strength and pack variants unavailable',
          Toast.SHORT,
        );
        setConfigurablProduct();

        if (selectedItem !== undefined) {
          setItem(selectedItem);
        }

        if (product.configurableProducts.length > 0) {
          setConfigurablProduct(product.configurableProducts[0]);
        }
      }
    }
  }

  function setSelectedStrength(value) {
    setSelectedStrengthValue = value;
    if (
      setSelectedStrengthValue !== undefined &&
      setSelectedPackValue !== undefined
    ) {
      sortConfigurable();
      //
    }
  }

  function setSelectedPack(value) {
    if (
      setSelectedStrengthValue !== undefined &&
      setSelectedPackValue !== undefined
    ) {
      setSelectedPackValue = value;
      sortConfigurable();
    }

    //
  }

  function setQuantity(value) {
    setQuantityValue = value;

    //
  }

  function dialogView() {
    return (
      <Modal
        
        style={{ height: '40%', width: '80%' }}
        
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
            style={{ position: 'absolute', right: 10, top: 0 }}>
           
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

          <TouchableOpacity
            onPress={() => {
              nameDrawerRef.close();
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 10,
              marginTop: 0,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 25,
            }}>

            <Text >Close</Text>

          </TouchableOpacity>

        </View>
      </Modal>
    );
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

  function bottomSliderProductVariantsConfigurable() {
    return (
      <Modal
        style={[styles.modal, {height: 400}]}
        position={'bottom'}
        backdropPressToClose={false}
        ref={c => (bottomDrawerVariantRefConfigurable = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white,
            borderBottomColor: colors.grey,
            borderBottomWidth: 1,
            borderStyle: 'dotted',
          }}>
          <View style={{height: 80, justifyContent: 'center', marginLeft: 10}}>
            {selectConfigurableItem !== undefined && (
              <Text style={styles.headerTextCart}>
                Select Product Variants{'\n'}NDC: {selectConfigurableItem.sku}
              </Text>
            )}
          </View>

          {GlobalConst.LoginToken.length > 0 &&
            selectedItem !== undefined &&
            GlobalConst.customerStatus === 'Approved' && (
              <AllProductVariants
                productDetail={selectedItem}
                casePack={selectConfigurableItem}
                setSelectedStrength={setSelectedStrength}
                setSelectedPack={setSelectedPack}
                setQuantity={setQuantity}
              />
            )}

          <View style={styles.footer}>
            {selectConfigurableItem !== undefined && (
              <Text
                style={[
                  styles.blackTextMedium,
                  {fontSize: 24, fontFamily: 'DRLCircular-Bold'},
                ]}>
                ${selectConfigurableItem.price}
              </Text>
            )}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <WishlistStatusListView item={selectConfigurableItem} />

              <TouchableOpacity
                onPress={() => {
                  if (setQuantityValue === 0) {
                    Toast.show('Please select quantity', Toast.SHORT);
                  } else if (
                    parseInt(product.stockStatus) < parseInt(setQuantityValue)
                  ) {
                    Toast.show('Invaild quantity', Toast.SHORT);
                    //setQuantityData(0);
                  } else {
                    if (_.isEmpty(product.cartId)) {
                      dispatch(
                        getCartID(
                          selectConfigurableItem.sku,
                          setQuantityValue,
                          'general',
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                    } else {
                      dispatch(
                        addToCart(
                          selectConfigurableItem.sku,
                          setQuantityValue,
                          product.cartId,
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                    }
                    dispatch(setConfigurableProducts([]));
                  }
                }}
                style={[styles.buttonSelected, {marginLeft: 10}]}>
                <Text style={styles.whiteTextMedium}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              right: 10,
              top: 20,
            }}
            onPress={() => {
              if (
                bottomDrawerVariantRefConfigurable !== undefined &&
                bottomDrawerVariantRefConfigurable !== null
              ) {
                bottomDrawerVariantRefConfigurable.close();
                dispatch(setConfigurableProducts([]));
              }
            }}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  useEffect(() => {
    if (
      bottomDrawerVariantRefConfigurable !== undefined &&
      product.configurableProducts.length > 0
    ) {
      setSelectedStrengthValue = loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            product.configurableProducts[0],
            'strength',
          ),
      ).label;
      setSelectedPackValue = loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            product.configurableProducts[0],
            'pack_size',
          ),
      ).label;
      setConfigurablProduct(product.configurableProducts[0]);
      setQuantityValue = 0;
      bottomDrawerVariantRefConfigurable.open();
    } else if (bottomDrawerVariantRefConfigurable !== undefined) {
      bottomDrawerVariantRefConfigurable.close();
    }
  }, [product.configurableProducts]);

  useEffect(() => {
    setSelectedStrengthValue = '';
    setSelectedPackValue = '';
    setQuantityValue = 0;

    dispatch(setConfigurableProducts([]));

    dispatch(setSearchedProductsSuccess([]));
    setData([]);

    if (loginData.notificationStatus !== '') {
      setTimeout(() => {
        navigation.navigate(loginData.notificationStatus);
        dispatch(setNotificationStatus(''));
      }, 500);
    }
  }, []);

  function selectVariantsConfigurable(product) {
    if (product.type_id !== 'simple') {
      setItem(product);
      dispatch(getProductsListConfigurable(product.sku, 'AllProducts'));
    }
  }

  //......................Featured products.......................................................

  useEffect(() => {
    if (!_.isEmpty(homeData.productPackSize)) {
      setProductPackSize(homeData.productPackSize.payload);
    }
    return () => {};
  }, [homeData.productPackSize]);

  useEffect(() => {
    if (!_.isEmpty(homeData.productStrength)) {
      setProductStrength(homeData.productStrength.payload);
    }
    return () => {};
  }, [homeData.productStrength]);

  useEffect(() => {
    if (!_.isEmpty(homeData.banner)) {
      setBannerData(homeData.banner);
    }
    return () => {};
  }, [homeData.banner]);

  useEffect(() => {
    isLoading = false;
    if (!_.isEmpty(product.searchedProducts)) {
      setIsClosed(false);
      if (email.length > 0) {
        setData(product.searchedProducts);
      }
    }

    // return () =>{
    //     dispatch(setSearchedProductsSuccess([]))
    //     setData([])
    // }
  }, [product.searchedProducts]);

  function handleScroll() {
    if (data.length > 0) {
      setData([]);
    }
  }

  return (
    <ViewWithSpinner
      style={styles.container}
      // isLoading={homeData.isLoading}
    >
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
          
        <CustomeHeader
          back={undefined}
          title={undefined}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />


        {dialogView()}

        {searchView()}

        <ScrollView style={{marginTop: 60}} onScroll={handleScroll}>

          <HomeBanner />
          
          {GlobalConst.customerStatus === 'Approved' && (
            <RecentOrders handleScroll={handleScroll} />
          )}
          <FeatureProduct
            selectVariantsConfigurable={selectVariantsConfigurable}
            addToCartSimple={addToCartSimple}
            handleScroll={handleScroll}
            setNameToShow={setNameToShow}
            setSkuToShow={setSkuToShow}
          />

          <Button
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
            }}
            full
            style={styles.button}>
            <Text uppercase={false} style={[styles.buttonText, {fontSize: 14}]}>
              View All Products
            </Text>
          </Button>
        </ScrollView>

        {bottomSliderProductVariantsConfigurable()}
        {nameView()}
        {dialogView()}
      </LinearGradient>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(home);

export default home;
