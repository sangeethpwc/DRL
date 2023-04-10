import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import {StatusBar, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GlobalConst from '../../config/GlobalConst';
import {requestConnector} from '../../services/restApiConnector';
import CustomeHeader from '../../config/CustomeHeader';
import colors from '../../config/Colors';
import {
  BASE_URL_IMAGE,
  BASE_URL_DRL,
  productApiURLGeneratorNDCPage,
} from '../../services/ApiServicePath';
import styles from '../home/home_style';
import styles2 from './productStyles';
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
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [isCardView, setCardView] = useState(false);
  const [isListView, setListView] = useState(true);
  const [productFetchCompleted, setProductFetchCompleted] = useState(false);
  const [selectedItem, setItem] = useState(undefined);
  const [selectConfigurableItem, setConfigurablProduct] = useState(undefined);
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

  function setBrands() {}

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
      let index = _.findIndex(data, {sku: selectedItem.sku});
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
        let index = _.findIndex(data, {sku: selectedItem.sku});
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

  useEffect(function() {
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

  getData = async () => {
    setisLoading(true);
    try {
      const apiURL = productApiURLGeneratorNDCPage(
        product.dosage,
        product.theraputic,
        tempBrand,
        pageCurrent,
        product.productName,
        product.filters,
      );
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

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        if (response.data.items.length < 10) {
          setProductFetchCompleted(true);
        }
        setData(data.concat(response.data.items));
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
          style={{opacity: 1}}
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
        <TouchableOpacity
          onPress={() => {
            dispatch(getProductDetailSuccess({}));
            if (item.type_id === 'simple') {
              navigation.navigate('ProductDetail', {sku: item.sku});
            } else {
              navigation.navigate('ProductDetailConfigurable', {
                sku: item.sku,
              });
            }
          }}>
          <View
            style={{
              margin: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: colors.white,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.textBold,
                  {fontSize: 16, fontFamily: 'DRLCircular-Book'},
                ]}>
                {item.sku}
              </Text>
            </View>
            <Image
              source={require('../../images/forward_big.png')}
              style={{width: 10, height: 10}}
            />
          </View>
        </TouchableOpacity>
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
          height: 300,
          borderColor: colors.lightGrey,
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(getProductDetailSuccess({}));
            if (item.type_id === 'simple') {
              navigation.navigate('ProductDetail', {sku: item.sku});
            } else {
              navigation.navigate('ProductDetailConfigurable', {
                sku: item.sku,
              });
            }
          }}>
          <View style={{borderColor: colors.grey, margin: 5}}>
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
              <View style={{alignItems: 'center'}}>
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
                      style={{height: 150, width: 130}}
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
                      style={{height: 150, width: 150}}
                    />
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 145,
                backgroundColor: colors.white,
                padding: 10,
                borderBottomWidth: 0.5,
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
                borderColor: colors.grey,
              }}>
              <Text numberOfLines={2} style={[styles.textBold, {fontSize: 18}]}>
                {item.name}{' '}
              </Text>
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
                    hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
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
                      <Text style={[styles.textBold, {fontSize: 20}]}>
                        ${item.price}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {item.stock !== undefined &&
                    parseInt(item.stock) <= 0 &&
                    item.type_id === 'simple' && (
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.textBold,
                          {fontSize: 14, color: colors.red},
                        ]}>
                        Out of stock
                      </Text>
                    )}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>

        {GlobalConst.LoginToken.length > 0 &&
          item.type_id === 'simple' &&
          GlobalConst.customerStatus === 'Approved' && (
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
          )}

        {item.options !== undefined && item.options.length > 0 ? (
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
        ) : null}

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

  renderItem = ({item}) => {
    return (
      <View style={styles.itemRow}>
        <Image source={{uri: item.url}} style={styles.itemImage} />
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
      let att = _.find(item.custom_attributes, {attribute_code: attribute});
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
        renderItem={({item, index}) => renderFilterItems(item, index)}
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
        style={[styles.modal, {height: 400}]}
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
                    Toast.show('Please select quantity', Toast.SHORT);
                  } else if (
                    parseInt(product.stockStatus) < parseInt(setQuantityValue)
                  ) {
                    Toast.show('Invaild quantity', Toast.SHORT);
                  } else if (
                    parseInt(product.stockStatus) <
                    qty + parseInt(setQuantityValue)
                  ) {
                    Toast.show(
                      qty +
                        ' units is already added to cart. Available quantity is ' +
                        parseInt(product.stockStatus) +
                        ' units.',
                      Toast.SHORT,
                    );
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

  ////Product Variant

  function bottomSliderProductVariants() {
    return (
      <Modal
        style={[styles.modal, {height: '50%'}]}
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
                  {fontSize: 24, fontFamily: 'DRLCircular-Bold'},
                ]}>
                ${selectedItem.price}
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
                  parseInt(selectedItem.stock) < parseInt(setQuantityValue)
                ) {
                  Toast.show('Invaild quantity ', Toast.SHORT);
                  //setQuantityData(0);
                } else if (
                  parseInt(selectedItem.stock) <
                  qty + parseInt(setQuantityValue)
                ) {
                  Toast.show(
                    qty +
                      ' units is already added to cart. Available quantity is ' +
                      parseInt(selectedItem.stock) +
                      ' units.',
                    Toast.SHORT,
                  );
                  //setQuantityData(0);
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
              style={{height: 20, width: 20}}
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
        style={[styles.modal, {height: 300}]}
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
              hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
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

          <View style={{marginTop: 20, margin: 10}}>{renderFilter()}</View>
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

  const onRefresh = () => {};

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
          title={'Shop By NDC'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />

        {isCardView && (
          <FlatList
            style={{flex: 1}}
            data={data}
            numColumns={2}
            renderItem={this.renderProductItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
        {isListView && (
          <FlatList
            style={{flex: 1, margin: 10}}
            data={data}
            renderItem={this.renderProductItemsList}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}

        {data.length === 0 && !isLoading && (
          <View style={{height: '50%', alignItems: 'center'}}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
              Search returned no result
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* <LoaderCustome /> */}
    </View>
  );
};

export default AllProducts;
