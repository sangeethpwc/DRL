import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  ScrollView,
  Switch,
  RefreshControl,
} from 'react-native';
import { StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalConst from '../../config/GlobalConst';
import { requestConnector } from '../../services/restApiConnector';
import CustomeHeader from '../../config/CustomeHeader';
import colors from '../../config/Colors';
import {
  BASE_URL_IMAGE,
  BASE_URL_DRL,
  productApiURLGenerator,
} from '../../services/ApiServicePath';
import styles from '../home/home_style';
import styles2 from '../product/productStyles';
import LinearGradient from 'react-native-linear-gradient';
import {
  getProductsSuccess,
  setProductLoadInitiated,
  setErrorMsg,
  getProductDetailSuccess,
  setStockStatus,
  setConfigurableProducts,
  setFilters,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setProductName,
} from '../../slices/productSlices';
import {
  fetchingData,
  getApiAccessTokenSuccess,
  getApiAccessTokenFailure,
} from '../../slices/authenticationSlice';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-simple-toast';
import utils from '../../utilities/utils';
import API_SERVICES from '../../services/ApiServicePath';
import _ from 'lodash';
import {
  addToCart,
  getCartID,
  addWishlist,
  checkStockStatus,
  getProductsListConfigurable,
  checkStockStatusWithLoader,
} from '../../services/operations/productApis';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import CheckBox from '@react-native-community/checkbox';
import AllProductVariants from './AllProductVariants';
import WishlistStatus from './WishlistStatus';
import WishlistStatusListView from './WishlistStatusListView';

var filtercategory = undefined;
var setSelectedStrengthValue = '';
var setSelectedPackValue = '';
var setQuantityValue = 0;

var emptyArray = [];

const AllProducts = props => {
  const loginData = useSelector(state => state.authenticatedUser);
  const product = useSelector(state => state.product);

  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [pageCurrent, setpageCurrent] = useState(1);
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();
  const [isCardView, setCardView] = useState(true);
  const [isListView, setListView] = useState(false);
  const [productFetchCompleted, setProductFetchCompleted] = useState(false);
  const [selectedItem, setItem] = useState(undefined);
  const [selectConfigurableItem, setConfigurablProduct] = useState(undefined);

  const [inStock, setInStock] = useState(false);
  //const productData= useSelector((state)=>state.product);
  //  const [index,setIndex]=useState(-1)

  const [filterCategories, setFilterCategories] = useState(
    loginData.filterCategories,
  );
  const [
    filterCategoriesBeforSelection,
    setFilterCategoriesBeforeSelection,
  ] = useState(loginData.filterCategories);

  //  const stateRef = useRef();
  //  stateRef.current = data;

  let bottomDrawerRef = useRef(null);
  let bottomDrawerVariantRef = useRef(null);
  let bottomDrawerVariantRefConfigurable = useRef(null);

  const pageSize = 10;

  const dispatch = useDispatch();

  let tempTherapeutics = [];
  let tempDosageFrom = [];
  let tempBrand = [];
  let searchedName = undefined;

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
  }, [nameToShow]);

  function nameView() {
    return (
      <Modal
        onClosed={() => {
          setNameToShow('');
          setSkuToShow('');
        }}
        style={{ height: '22%', width: '80%' }}
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
            style={{ position: 'absolute', right: 5, top: 0 }}>
            <Image
              style={{ width: 10, resizeMode: 'contain' }}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ marginTop: 10, fontFamily: 'DRLCircular-Book' }}>
              {nameToShow}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (skuToShow.length > 0) {
                dispatch(getProductDetailSuccess({}));
                // if (product.type_id === 'simple') {
                navigation.navigate('ProductDetail', { sku: skuToShow });
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

  useEffect(() => {
    filtercategory = undefined;
    setSelectedStrengthValue = '';
    setSelectedPackValue = '';
    setQuantityValue = 0;
    dispatch(setConfigurableProducts([]));

    if (
      props !== undefined &&
      props.route !== undefined &&
      props.route.params !== undefined &&
      props.route.params.filters !== undefined &&
      props.route.params.filters.length > 0
    ) {
    }
  }, []);

  const clearFilter = () => {
    setFilterCategories([]);
  };

  useEffect(() => {
    return () => {
      dispatch(setCategoryApplied(false));
      dispatch(setDosageApplied([]));
      dispatch(setTherapeutic([]));
      dispatch(setFilters([]));
      dispatch(setProductName(undefined));
    };
  }, []);

  useEffect(() => {
    if (product.categoryApplied) {
      tempTherapeutics = product.theraputic;
      tempDosageFrom = product.dosage;
      setProductFetchCompleted(false);
      dispatch(setCategoryApplied(false));
      setpageCurrent(1);
      setData([]);
    }
  }, [product.categoryApplied]);

  useEffect(() => {
    if (pageCurrent > 1 && productFetchCompleted === false) {
      this.getData();
    }
  }, [pageCurrent]);

  useEffect(() => {
    if (
      data.length === 0 &&
      pageCurrent === 1 &&
      productFetchCompleted === false
    ) {
      this.getData();
    }
  }, [data]);

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
    if (
      selectedItem !== undefined &&
      selectedItem !== null &&
      selectedItem.type_id === 'simple' &&
      product.stockStatus.length > 0 &&
      parseInt(product.stockStatus) <= 0 &&
      data !== undefined &&
      data.length > 0
    ) {
      let index = _.findIndex(data, { sku: selectedItem.sku });
      let dataObject = {};
      dataObject = _.clone(data[index]);
      if (dataObject !== undefined) {
        dataObject['stock'] = product.stockStatus;
        let temp = _.cloneDeep(data);
        temp.splice(index, 1, dataObject);
        setData(temp);
        dispatch(setStockStatus(''));
        setItem(dataObject);
      }
    } else {
      if (
        selectedItem !== undefined &&
        selectedItem !== null &&
        selectedItem.type_id === 'simple' &&
        product.stockStatus.length > 0
      ) {
        let index = _.findIndex(data, { sku: selectedItem.sku });
        let dataObject = {};
        dataObject = _.clone(data[index]);
        if (dataObject !== undefined) {
          dataObject['stock'] = product.stockStatus;
          let temp = _.cloneDeep(data);
          temp.splice(index, 1, dataObject);
          setData(temp);
          dispatch(setStockStatus(''));
          setItem(dataObject);
          setQuantityValue = 0;
          if (_.isEmpty(product.cartId)) {
            bottomDrawerVariantRef.open();
          } else {
            bottomDrawerVariantRef.open();
          }
        }
      }
    }
  }, [product.stockStatus]);

  useEffect(function () {
    if (product.products !== undefined && product.products.length > 0) {
      setData(product.products);
      let page = product.products.length / pageSize;
      if (page > 0) {
        page = parseInt(page);
      }

      if (product.products.length % pageSize > 0) {
        setpageCurrent(page + 1);
      } else if (page > 0) {
        setpageCurrent(page);
      }
    }
  }, []);

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

  getData = async () => {
    setisLoading(true);
    try {
      const apiURL = productApiURLGenerator(
        product.dosage,
        product.theraputic,
        tempBrand,
        pageCurrent,
        product.productName,
        product.filters,
      );
      console.log('API URl generated.......................', apiURL);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'GET',
        apiURL,
        headers,
        null,
        null,
      );

      console.log(
        'PLP data........................',
        JSON.stringify(response.data.items),
      );

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        if (response.data.items.length < 10) {
          setProductFetchCompleted(true);
        }
        if (inStock) {
          setData(data.concat(filterInStock(response.data.items)));
        } else {
          setData(data.concat(response.data.items));
        }

        setisLoading(false);
      } else if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length === 0
      ) {
        setProductFetchCompleted(true);
        if (pageCurrent > 1) {
          setpageCurrent(pageCurrent - 1);
        }
        setisLoading(false);
      } else {
        setisLoading(false);
      }
    } catch (err) {
      setisLoading(false);
      setProductFetchCompleted(true);

      if (err.status === 401) {
        getApiAccessTokenGeneral(getData());
      }
    }
  };

  function getApiAccessTokenGeneral(functionCall) {
    return async dispatch => {
      try {
        let URL = API_SERVICES.API_ACCESS_TOKEN;
        const response = await requestConnector('POST', URL, null, null, {});

        GlobalConst.ApiAccessToken = response.data.access_token;
        dispatch(getApiAccessTokenSuccess(GlobalConst.ApiAccessToken));
        if (response.data.access_token !== undefined) {
          const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + '' + response.data.access_token + '',
          };
          utils._storeTime();
          utils._storeToken(
            response.data.access_token,
            response.data.expires_in,
          );
          functionCall(headers);
        } else {
          dispatch(getApiAccessTokenFailure());
        }
      } catch (err) {
        dispatch(getApiAccessTokenFailure());
      }
    };
  }

  handleLoadMore = () => {
    if (!isLoading) {
      setpageCurrent(pageCurrent + 1);
    }
  };

  addFavourites = item => {
    dispatch(addWishlist(item.sku));
  };

  renderFooter = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ opacity: 1 }}
          color={colors.grey}
        />
      </View>
    ) : null;
  };

  renderProductItemsList = data => {
    let item = data.item;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: colors.white,

          // marginHorizontal:5
        }}>
        {(item.type_id === 'simple' || item.type_id === 'configurable') && (
          <TouchableOpacity
            onPress={() => {
              dispatch(getProductDetailSuccess({}));
              if (item.type_id === 'simple') {
                navigation.navigate('ProductDetail', { sku: item.sku });
              } else {
                navigation.navigate('ProductDetailConfigurable', {
                  sku: item.sku,
                });
              }
            }}>
            <View
              style={{
                borderColor: colors.lightGrey,
                borderWidth: 1,
                margin: 5,
                minHeight: 175,
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop:
                  item.options !== undefined && item.options.length > 0
                    ? 15
                    : 10,
              }}>
              <View
                style={{
                  width: '60%',
                  backgroundColor: colors.white,
                  padding: 10,
                }}>
                {/* <TouchableOpacity
                  onPress={() => {
                    setNameToShow(item.name);
                    setSkuToShow(item.sku);
                  }}> */}
                <Text
                  //numberOfLines={4}
                  style={[styles.textBold, { fontSize: 15 }]}>
                  {item.name}
                </Text>
                {/* </TouchableOpacity> */}
                {item.type_id === 'simple' ? (
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textBold,
                      {
                        fontSize: 14,
                        fontFamily: 'DRLCircular-Book',
                        marginTop: 5,
                      },
                    ]}>
                    NDC: {item.sku}{' '}
                  </Text>
                ) : (
                  <Text></Text>
                )}

                {GlobalConst.LoginToken.length > 0 && (
                  <View>
                    {item.extension_attributes !== undefined &&
                      item.extension_attributes.stoct_status !== undefined &&
                      item.extension_attributes.stoct_status === '1' ? (
                      <View
                        style={[
                          styles.labelGreen,
                          {
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            marginBottom:10,
                            padding: 10,
                            width: '60%',
                            marginTop: 10,
                          },
                        ]}>
                        <Text style={[styles.greenLight, { fontSize: 14 }]}>
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
                            padding: 10,
                            marginBottom:10,
                            width: '70%',
                            marginTop: 10,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.greenLight,
                            { fontSize: 16, color: colors.red },
                          ]}>
                          Out of stock
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {item.stock !== undefined && parseInt(item.stock) <= 0 && (
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textBold,
                      { fontSize: 16, color: colors.red },
                    ]}>
                    Out of stock
                  </Text>
                )}
                

                {GlobalConst.LoginToken.length > 0 &&
                  GlobalConst.customerStatus === 'Approved' ? (

                renderPrice(item) > 0 && (
                  
                  // Render PriceList 

                  <View
                    style={[
                      styles.labelGreen,
                      {
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        width: '85%',
                        padding: 10,
                        marginTop: 15,
                        marginBottom: 10,
                      },
                    ]}>
                    <Text style={[styles.greenLight, styles.textBold, { fontSize: 18 }]}>
                      {item.extension_attributes.custom_min_price} - {item.extension_attributes.custom_max_price}
                    </Text>
                  </View>
                )

                ) : null}

                
              </View>



              <View
                style={{
                  width: '40%',
                  backgroundColor: colors.white,
                  padding: 20,
                }}>

                {GlobalConst.LoginToken.length > 0 &&
                  GlobalConst.customerStatus === 'Approved' ? (
                 
                    <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* <Text style={[styles.textBold,{fontSize:20}]}>$ {item.price}</Text> */}
                    {item.type_id !== 'simple' ? (
                      // <View style={{flexDirection:'row',marginTop:10}}>
                      <TouchableOpacity
                        hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
                        onPress={() => {
                          if (item.type_id !== 'simple') {
                            setItem(item);
                            dispatch(
                              getProductsListConfigurable(
                                item.sku,
                                'AllProducts',
                              ),
                            );
                          }
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.blue,
                            textDecorationLine: 'underline',
                            fontFamily: 'DRLCircular-Book',
                          }}
                          numberOfLines={1}>
                          Select Strengths
                        </Text>
                      </TouchableOpacity>
                    ) : null

                    

                    //     (
                    //       renderPrice(item) > 0 && (
                    //         <View
                    //           style={[
                    //             styles.labelGreen,
                    //             {
                    //               paddingVertical: 5,
                    //               paddingHorizontal: 5,
                    //               marginRight:5,
                                  
                    //               width: '100%',
                    //               marginBottom: 10,
                    //             },
                    //           ]}>
                    //           <Text style={[styles.greenLight, styles.textBold, { fontSize: 18 }]}>
                    //             {item.extension_attributes.custom_min_price} - {item.extension_attributes.custom_max_price}
                    //           </Text>
                    //         </View>
    
                    //       )
                    
                    //   // null
                    // )
                  }

                    {item.type_id === 'simple' && (
                      <View
                        style={{
                          marginTop: 10,
                          marginRight: -10,
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                          
                        {/* {renderPrice(item) > 0 &&
                          item.extension_attributes.stoct_status === '1' && (
                            <TouchableOpacity
                              onPress={() => {
                                addToCarts(item);
                              }}>
                              <Image
                                source={require('../../images/cart_new.png')}
                                style={{height: 30}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )} */}

                        <WishlistStatusListView item={item} />
                        
                      </View>
                    )}
                  </View>

                ) : null}

              </View>
              
            </View>
          </TouchableOpacity>
        )}

        {utils.getAttributeFromCustom(item, 'categorytype') !== undefined &&
          loginData.filterCategories.find(i => i.label === 'Short dated') !==
          undefined &&
          loginData.filterCategories.find(i => i.label === 'Short dated')
            .value !== undefined &&
          utils.getAttributeFromCustom(item, 'categorytype') ===
          loginData.filterCategories.find(i => i.label === 'Short dated')
            .value ? (
          <View
            style={{
              backgroundColor: '#FF7069',
              left: 5,
              top: 5,
              padding: 5,
              position: 'absolute',
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

        {/* {item.options !== undefined && item.options.length > 0 ? (
          <View
            style={{
              backgroundColor: '#FF7069',
              left: 5,
              top: 5,
              padding: 5,
              position: 'absolute',
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
        ) : null} */}
      </View>
    );
  };

  function addToCarts(selectedItem) {
    if (selectedItem !== undefined) {
      setItem(selectedItem);
      selectedItem.type_id === 'simple'
        ? dispatch(checkStockStatusWithLoader(selectedItem.sku))
        : dispatch(
          getProductsListConfigurable(selectedItem.sku, 'AllProducts'),
        );
    }
  }

  renderProductItems = data => {
    let item = data.item;
    let type = item.type_id;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          minWidth: width / 2,
          maxWidth: width / 2,
          height: 340,
          borderColor: colors.lightGrey,
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(getProductDetailSuccess({}));
            if (item.type_id === 'simple') {
              navigation.navigate('ProductDetail', { sku: item.sku });
            } else {
              navigation.navigate('ProductDetailConfigurable', {
                sku: item.sku,
              });
            }
          }}>
          <View style={{ borderColor: colors.grey, margin: 5 }}>
            <View
              style={{
                width: '100%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: colors.white,
                borderColor: colors.grey,
                borderWidth: 0.5,
                borderBottomWidth: 0.5,
              }}>
              <View style={{ alignItems: 'center' }}>
                {item !== undefined &&
                  item.custom_attributes !== undefined &&
                  item.custom_attributes.length > 0 &&
                  item.custom_attributes.find(
                    element => element.attribute_code === 'image',
                  ) ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      source={{
                        uri:
                          BASE_URL_IMAGE +
                          item.custom_attributes.find(
                            element => element.attribute_code === 'image',
                          ).value,
                      }}
                      style={{ height: 150, width: 130 }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      source={require('../../images/Group_741.png')}
                      style={{ height: 150, width: 150 }}
                    />
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 200,
                backgroundColor: colors.white,
                padding: 5,
                borderBottomWidth: 0.5,
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
                borderColor: colors.grey,
              }}>
              {/* <TouchableOpacity
                onPress={() => {
                  setNameToShow(item.name);
                  setSkuToShow(item.sku);
                }}> */}
              <Text numberOfLines={3} style={[styles.textBold, { fontSize: 14 }]}>
                {item.name}{' '}
              </Text>
              {/* </TouchableOpacity> */}
              {item.type_id === 'simple' ? (
                <Text
                  numberOfLines={2}
                  style={[
                    styles.textBold,
                    {
                      fontSize: 14,
                      fontFamily: 'DRLCircular-Book',
                      marginTop: 10,
                    },
                  ]}>
                  NDC: {item.sku}{' '}
                </Text>
              ) : (
                <Text></Text>
              )}

              {GlobalConst.LoginToken.length > 0 && (
                <View>
                  {item.extension_attributes !== undefined &&
                    item.extension_attributes.stoct_status !== undefined &&
                    item.extension_attributes.stoct_status === '1' ? (
                    <View
                      style={[
                        styles.labelGreen,
                        {
                          paddingVertical: 5,
                          paddingHorizontal: 5,
                          width: '60%',
                          marginBottom:5,
                          marginTop: 10,
                        },
                      ]}>
                      <Text style={[styles.greenLight, { fontSize: 14 }]}>
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
                          marginBottom:5,
                          marginTop: 10,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.greenLight,
                          { fontSize: 14, color: colors.red },
                        ]}>
                        Out of stock
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {GlobalConst.LoginToken.length > 0 &&
                GlobalConst.customerStatus === 'Approved' ? (
                <View
                  style={{
                    flexDirection: 'column',
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                  }}>
                  <TouchableOpacity
                    hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
                    onPress={() => {
                      if (item.type_id !== 'simple') {
                        setItem(item);
                        dispatch(
                          getProductsListConfigurable(item.sku, 'AllProducts'),
                        );
                      }
                    }}>
                    {item.type_id !== 'simple' ? (
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.blue,
                          textDecorationLine: 'underline',
                          fontFamily: 'DRLCircular-Book',
                        }}>
                        Select Strengths
                      </Text>
                    ) : (
                      renderPrice(item) > 0 && (
                        <View
                          style={[
                            styles.labelGreen,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              marginRight:5,
                              
                              width: '100%',
                              marginBottom: 10,
                            },
                          ]}>
                          <Text style={[styles.greenLight, styles.textBold, { fontSize: 18 }]}>
                            {item.extension_attributes.custom_min_price} - {item.extension_attributes.custom_max_price}
                          </Text>
                        </View>

                      )
                    )}
                  </TouchableOpacity>
                  {item.stock !== undefined &&
                    parseInt(item.stock) <= 0 &&
                    item.type_id === 'simple' && (
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.textBold,
                          { fontSize: 14, color: colors.red },
                        ]}>
                        Out of stock
                      </Text>
                    )}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>

        {/* {GlobalConst.LoginToken.length > 0 &&
          item.type_id === 'simple' &&
          GlobalConst.customerStatus === 'Approved' &&
          renderPrice(item) > 0 &&
          item.extension_attributes.stoct_status === '1' && (
            <TouchableOpacity
              style={{position: 'absolute', right: 0, bottom: 10}}
              onPress={() => {
                addToCarts(item);
              }}>
              <Image
                source={require('../../images/cart_new.png')}
                style={{height: 30}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )} */}

        {utils.getAttributeFromCustom(item, 'categorytype') !== undefined &&
          loginData.filterCategories.find(i => i.label === 'Short dated') !==
          undefined &&
          loginData.filterCategories.find(i => i.label === 'Short dated')
            .value !== undefined &&
          utils.getAttributeFromCustom(item, 'categorytype') ===
          loginData.filterCategories.find(i => i.label === 'Short dated')
            .value ? (
          <View
            style={{
              backgroundColor: '#FF7069',
              left: 5,
              top: 5,
              padding: 5,
              position: 'absolute',
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

        {/* {item.options !== undefined && item.options.length > 0 ? (
          <View
            style={{
              backgroundColor: '#FF7069',
              left: 5,
              top: 5,
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
        ) : null} */}

        {GlobalConst.LoginToken.length > 0 &&
          GlobalConst.customerStatus === 'Approved' &&
          item.type_id === 'simple' ? (
          <WishlistStatus item={item} />
        ) : null}
      </View>
    );
  };

  function apply() {
    tempTherapeutics = [];
    tempDosageFrom = [];
    tempBrand = [];
    searchedName = undefined;
    let temp = [];
    for (let i = 0; i < filterCategories.length; i++) {
      if (filterCategories[i].CHECKED) {
        temp.push(filterCategories[i].value);
      }
    }
    dispatch(setFilters(temp));
    setProductFetchCompleted(false);
    dispatch(setProductName(undefined));
    setpageCurrent(1);
    setData([]);
    if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
      bottomDrawerRef.close();
    }

    // this.getData();
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemRow}>
        <Image source={{ uri: item.url }} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemText}>{item.id}</Text>
      </View>
    );
  };
  function showFilter() {
    setFilterCategoriesBeforeSelection(filterCategories);
    if (bottomDrawerRef !== undefined && bottomDrawerRef !== null)
      bottomDrawerRef.open();
  }

  function getItemAvailableValue(item, attribute) {
    let v = 'NA';
    if (
      item !== undefined &&
      item !== null &&
      item.custom_attributes !== undefined
    ) {
      let att = _.find(item.custom_attributes, { attribute_code: attribute });
      if (att !== undefined) {
        v = att.value;
      }
    }
    return v;
  }

  function onChangeCheck(value, i) {
    let tempBrand = [];
    tempBrand = _.cloneDeep(filterCategories);
    for (let p = 0; p < tempBrand.length; p++) {
      if (p === i) {
        tempBrand[p].CHECKED = value;
      }
    }
    setFilterCategories(tempBrand);
  }

  function clear() {
    let tempBrand = [];
    tempBrand = _.cloneDeep(filterCategories);
    for (let p = 0; p < tempBrand.length; p++) {
      tempBrand[p].CHECKED = false;
    }
    setFilterCategories(tempBrand);
    dispatch(setFilters([]));
    setProductFetchCompleted(false);
    dispatch(setProductName(undefined));
  }

  function renderFilter() {
    //
    return (
      <FlatList
        data={filterCategories}
        renderItem={({ item, index }) => renderFilterItems(item, index)}
        //Setting the number of column
        keyExtractor={(item, index) => index}
      // style={styles.itemsContainer}
      // style={{width:'100%'}}
      />
    );
  }

  function renderFilterItems(item, index) {
    return item.label.trim().length === 0 ? null : (
      <View style={styles.itemsView}>
        <CheckBox
          style={styles.checkbox}
          disabled={false}
          value={filterCategories[index].CHECKED}
          onValueChange={newValue => onChangeCheck(newValue, index)}
        />
        <Text style={styles.greyTextSmall}>{item.label}</Text>
      </View>
    );
  }
  ///

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
  //PrductVariant Configurable

  function bottomSliderProductVariantsConfigurable() {
    return (
      <Modal
        style={[styles.modal, { height: 400 }]}
        position={'bottom'}
        backdropPressToClose={false}
        swipeToClose={false}
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
          <View style={{ height: 80, justifyContent: 'center', marginLeft: 10 }}>
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
                  { fontSize: 24, fontFamily: 'DRLCircular-Bold' },
                ]}>
                ${renderPrice(selectConfigurableItem)}
              </Text>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <WishlistStatusListView item={selectConfigurableItem} />

              <TouchableOpacity
                onPress={() => {
                  let index = -1;
                  let qty = 0;
                  if (
                    product.cartList !== undefined &&
                    product.cartList.items !== undefined &&
                    product.cartList.items.length > 0
                  ) {
                    index = _.findIndex(product.cartList.items, {
                      sku: selectConfigurableItem.sku,
                    });
                  }
                  if (index !== -1) {
                    qty = product.cartList.items[index].qty;
                  }

                  //////////
                  if (setQuantityValue === 0) {
                    Toast.show('Please enter quantity', Toast.SHORT);
                  } else if (
                    parseInt(product.stockStatus) < parseInt(setQuantityValue)
                  ) {
                    // Toast.show('Invaild quantity', Toast.SHORT);

                    Toast.show(
                      'At this time, you can add ' +
                      product.stockStatus +
                      ' qty to cart. To Order rest ' +
                      (setQuantityValue - product.stockStatus) +
                      ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                      Toast.LONG,
                    );
                    if (_.isEmpty(product.cartId)) {
                      dispatch(
                        getCartID(
                          selectConfigurableItem.sku,
                          product.stockStatus,
                          'general',
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                      dispatch(setConfigurableProducts([]));
                    } else {
                      dispatch(
                        addToCart(
                          selectConfigurableItem.sku,
                          product.stockStatus,
                          product.cartId,
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                      dispatch(setConfigurableProducts([]));
                    }
                  } else if (
                    parseInt(product.stockStatus) <
                    qty + parseInt(setQuantityValue)
                  ) {
                    // Toast.show(
                    //   qty +
                    //     ' units is already added to cart. Available quantity is ' +
                    //     parseInt(product.stockStatus) +
                    //     ' units.',
                    //   Toast.SHORT,
                    // );

                    Toast.show(
                      'At this time, you can add ' +
                      (product.stockStatus - qty) +
                      ' qty to cart. To Order rest ' +
                      (setQuantityValue - (product.stockStatus - qty)) +
                      ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                      Toast.LONG,
                    );
                    if (_.isEmpty(product.cartId)) {
                      dispatch(
                        getCartID(
                          selectConfigurableItem.sku,
                          product.stockStatus - qty,
                          'general',
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                      dispatch(setConfigurableProducts([]));
                    } else {
                      dispatch(
                        addToCart(
                          selectConfigurableItem.sku,
                          product.stockStatus - qty,
                          product.cartId,
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                      dispatch(setConfigurableProducts([]));
                    }
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
                      dispatch(setConfigurableProducts([]));
                    } else {
                      dispatch(
                        addToCart(
                          selectConfigurableItem.sku,
                          setQuantityValue,
                          product.cartId,
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                      dispatch(setConfigurableProducts([]));
                    }
                  }
                }}
                style={[styles.buttonSelected, { marginLeft: 10 }]}>
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
              style={{ height: 20, width: 20 }}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  ////Product Variant

  function bottomSliderProductVariants() {
    return (
      <Modal
        style={[styles.modal, { height: '45%' }]}
        position={'bottom'}
        backdropPressToClose={false}
        swipeToClose={false}
        ref={c => (bottomDrawerVariantRef = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white,
            borderBottomColor: colors.grey,
            borderBottomWidth: 1,
            borderStyle: 'dotted',
          }}>
          <View
            style={{
              height: 80,
              justifyContent: 'center',
              marginLeft: 10,
              width: '80%',
            }}>
            {selectedItem !== undefined && selectedItem.name !== undefined && (
              <Text numberOfLines={2} style={styles.headerTextCart}>
                {selectedItem.name}
              </Text>
            )}
          </View>

          {GlobalConst.LoginToken.length > 0 &&
            selectedItem !== undefined &&
            GlobalConst.customerStatus === 'Approved' && (
              <AllProductVariants
                productDetail={
                  selectedItem.type_id === 'simple'
                    ? selectedItem
                    : product.configurableProducts[0]
                }
                setSelectedStrength={setSelectedStrength}
                setSelectedPack={setSelectedPack}
                setQuantity={setQuantity}
              />
            )}

          <View style={styles.footer}>
            {selectedItem !== undefined && (
              <Text
                style={[
                  styles.blackTextMedium,
                  { fontSize: 24, fontFamily: 'DRLCircular-Bold' },
                ]}>
                ${renderPrice(selectedItem)}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                let index = -1;
                let qty = 0;
                if (
                  product.cartList !== undefined &&
                  product.cartList.items !== undefined &&
                  product.cartList.items.length > 0
                ) {
                  index = _.findIndex(product.cartList.items, {
                    sku: selectedItem.sku,
                  });
                }
                if (index !== -1) {
                  qty = product.cartList.items[index].qty;
                }

                if (setQuantityValue === 0) {
                  Toast.show('Please select quantity', Toast.SHORT);
                } else if (
                  parseInt(selectedItem.stock) <
                  qty + parseInt(setQuantityValue)
                ) {
                  Alert.alert(
                    'Please Note',
                    'At this time, you can add ' +
                    (selectedItem.stock - qty) +
                    ' qty to cart. To Order rest ' +
                    (setQuantityValue - (selectedItem.stock - qty)) +
                    ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                    [{ text: 'Ok' }, ,],
                  );

                  if (selectedItem.stock - qty <= 0) {
                    Toast.show('Cannot be added', Toast.SHORT);
                  } else {
                    if (_.isEmpty(product.cartId)) {
                      dispatch(
                        getCartID(
                          selectedItem.sku,
                          selectedItem.stock - qty,
                          'general',
                        ),
                      );
                      bottomDrawerVariantRef.close();
                    } else {
                      dispatch(
                        addToCart(
                          selectedItem.sku,
                          selectedItem.stock - qty,
                          product.cartId,
                        ),
                      );
                      bottomDrawerVariantRef.close();
                    }
                  }
                  //setQuantityData(0);
                } else if (
                  parseInt(selectedItem.stock) < parseInt(setQuantityValue)
                ) {
                  //Toast.show('Invaild quantity ', Toast.SHORT);
                  //setQuantityData(0);
                  Alert.alert(
                    'Please Note',
                    'At this time, you can add ' +
                    selectedItem.stock +
                    ' qty to cart. To Order rest ' +
                    (setQuantityValue - selectedItem.stock) +
                    ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                    [{ text: 'Ok' }, ,],
                  );

                  if (_.isEmpty(product.cartId)) {
                    dispatch(
                      getCartID(
                        selectedItem.sku,
                        selectedItem.stock,
                        'general',
                      ),
                    );
                    bottomDrawerVariantRef.close();
                  } else {
                    dispatch(
                      addToCart(
                        selectedItem.sku,
                        selectedItem.stock,
                        product.cartId,
                      ),
                    );
                    bottomDrawerVariantRef.close();
                  }
                } else {
                  if (_.isEmpty(product.cartId)) {
                    dispatch(
                      getCartID(selectedItem.sku, setQuantityValue, 'general'),
                    );
                    bottomDrawerVariantRef.close();
                  } else {
                    dispatch(
                      addToCart(
                        selectedItem.sku,
                        setQuantityValue,
                        product.cartId,
                      ),
                    );
                    bottomDrawerVariantRef.close();
                  }
                }
              }}
              style={styles.buttonSelected}>
              <Text style={styles.whiteTextMedium}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              right: 10,
              top: 30,
            }}
            onPress={() => {
              if (
                bottomDrawerVariantRef !== undefined &&
                bottomDrawerVariantRef !== null
              ) {
                bottomDrawerVariantRef.close();
              }
            }}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  /////Product Variant

  function bottomSliderView() {
    return (
      <Modal
        style={[styles.modal, { height: 300 }]}
        position={'bottom'}
        backdropPressToClose={false}
        swipeToClose={false}
        ref={c => (bottomDrawerRef = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white,
          }}>
          <View
            style={[
              styles.header,
              {
                height: 70,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
              },
            ]}>
            <View style={styles.headerCart}>
              <Text style={styles.headerTextCart}>Filter By</Text>
            </View>
            <TouchableOpacity
              hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
              onPress={() => {
                clear();
              }}
            //  style={{position:'absolute',top:10,right:10}}
            >
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  color: colors.blue,
                  fontSize: 16,
                }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View
              style={{
                marginTop: 20,
                margin: 10,
              }}>
              {renderFilter()}
            </View>

            {/* <View style={[styles.itemsView, {marginLeft: 15}]}>
              <CheckBox
                style={styles.checkbox}
                disabled={false}
                value={inStock}
                onValueChange={newValue => {
                  if (newValue) {
                    filterInStock();
                  }
                }}
              />
              <Text style={styles.greyTextSmall}>In Stock</Text>
            </View> */}
            <View style={{ height: 80 }}></View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
                  setFilterCategories(filterCategoriesBeforSelection);
                  bottomDrawerRef.close();
                }
              }}
              style={styles.buttonUnselected}>
              <Text style={styles.blackTextMedium}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                apply();
              }}
              style={styles.buttonSelected}>
              <Text style={styles.whiteTextMedium}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const onRefresh = () => { };

  const [refreshing, setRefreshing] = useState(false);
  const refreshPage = () => {
    setProductFetchCompleted(false);
    setData([]);
    setpageCurrent(1);
  };

  const filterInStock = data => {
    let temp = [];
    temp = data.filter(item => item.extension_attributes.stoct_status === '1');
    return temp;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        {bottomSliderView()}
        {bottomSliderProductVariants()}
        {bottomSliderProductVariantsConfigurable()}

        <CustomeHeader
          back={'back'}
          title={'All Products'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />

        <View style={{ flexDirection: 'row', height: 60 }}>
          <TouchableOpacity
            onPress={() => {
              setCardView(true);
              setListView(false);
            }}
            style={isCardView ? styles2.viewSelected : styles2.viewUnselected}>
            <Image
              source={require('../../images/card_view.png')}
              style={{ marginRight: 10 }}
            />
            <Text style={isCardView ? styles2.boldText : styles2.lightText}>
              Card View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCardView(false);
              setListView(true);
            }}
            style={isListView ? styles2.viewSelected : styles2.viewUnselected}>
            <Image
              source={require('../../images/list_view.png')}
              style={{ marginRight: 10 }}
            />
            <Text style={isListView ? styles2.boldText : styles2.lightText}>
              List View
            </Text>
          </TouchableOpacity>
        </View>

        {GlobalConst.LoginToken.length > 0 && (
          <View
            style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              In stock
            </Text>
            <Switch
              style={{ marginHorizontal: 10 }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={inStock ? colors.bannerBlue : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={newValue => {
                setInStock(!inStock);
                if (newValue) {
                  setData(filterInStock(data));
                } else {
                  setProductFetchCompleted(false);
                  setData([]);
                  setpageCurrent(1);
                }
              }}
              value={inStock}
            />
          </View>
        )}

        {isCardView && (
          <FlatList
            style={{ flex: 1 }}
            data={data}
            numColumns={2}
            renderItem={this.renderProductItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
            }
          />
        )}
        {isListView && (
          <FlatList
            style={{ flex: 1 }}
            data={data}
            renderItem={this.renderProductItemsList}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
            }
          />
        )}

        {data.length === 0 && !isLoading && (
          <View style={{ height: '50%', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'DRLCircular-Book', fontSize: 18 }}>
              Search returned no result
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', height: 55 }}>
          <TouchableOpacity
            onPress={() => {
              setpageCurrent(0);
              // navigation.navigate('Categories')

              navigation.navigate('Categories', { onRefresh: onRefresh });

              //  navigation.navigate('Categories',{
              //  dosage:tempDosageFrom,
              //  theraputic:tempTherapeutics,
              //  brand: tempBrand,
              //  filters:filtercategory,
              //  },
              //  )
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              borderRightWidth: 1,
              borderColor: '#80434861',
            }}>
            <Image
              source={require('../../images/list_view.png')}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: '#4F4F4F',
                lineHeight: 22,
              }}>
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}
            onPress={() => showFilter()}>
            <Image
              source={require('../../images/list_view.png')}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: '#4F4F4F',
                lineHeight: 22,
              }}>
              Filter by
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* <LoaderCustome /> */}
      {nameView()}
    </View>
  );
};

export default AllProducts;
