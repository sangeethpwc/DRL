import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TextInput,
  StyleSheet,
} from 'react-native';
import {StatusBar, SafeAreaView, TouchableOpacity} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';
import _, {add} from 'lodash';
import {
  paymentInformation,
  getCartListGeneral,
  getCartListGeneralToProceed,
  getCartListGeneralWithLoader,
} from '../../services/operations/productApis';
import styles from '../../components/home/home_style';
import {ScrollView} from 'react-native';
import Toast from 'react-native-simple-toast';
import utils from '../../utilities/utils';
import Modal from 'react-native-modalbox';
import {useNavigation} from '@react-navigation/native';
import {
  setOrderFailed,
  emptyCartList,
  setShippingMethodName,
  setShippingInformation,
  setIndicatorSteps,
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  refreshCartForPurchase,
  setDeliveryDate,
  setDeliveryInstruction,
  setFilters,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setProductName,
  setErrorMsg,
  setcartAdded,
  setShippingTotalInformation,
  setOldCartState,
  emptyCartListAfterError,
  setOrderId,
} from '../../slices/productSlices';
import withLoader from '../../utilities/hocs/LoaderHOC';
import PONumber from './PONumber';
import MyCartStepsIndicator from './MyCartStepsStepsIndicator';
import CartList from './CartList';
import OrderTotalInformation from './OrderTotalInformation';
import MyCartAddress from '../myProfile/MyCartAddress';
import ShippingEstimates from './ShippingEstimates';
import {setShippingAddressId} from '../../slices/authenticationSlice';
import PriceDetail from './PriceDetail';
import {getCustomerInfoAfterAddAddress} from '../../services/operations/getToken';

//let arr=[];

const MyCart = () => {
  const labels = ['My Cart', 'Address', 'Review & \nPlace Order'];
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const [step, setSteps] = useState(0);
  // const [poNumberState, setPONumberState] = useState("");
  const [value, setPOState] = React.useState('');

  let bottomDrawerRef = useRef(null); 
  let bottomDrawerErrorRef = useRef(null);

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [arr, setArr] = useState([]);

  const [changeArr, setChangeArr] = useState([]);

  const [checker, setChecker] = useState(false);
  const [priceArr, setPriceArr] = useState([]);

  const [finalCheck, setFinalCheck] = useState(false);

  let deliveryType = 'standardshipping';
  let deliveryInstruction = '';
  let deliveryDate = '';
  let terms = false;
  let termsRead = false;

  let ViewWithSpinner = withLoader(View);

  const onRefresh = React.useCallback(() => {
    setChangeArr([]);
    setPriceArr([]);
    setArr([]);
    dispatch(setIndicatorSteps(0));
    setSteps(0);
    setRefreshing(true);
    // setPriceArr([]);
    // dispatch(setOldCartState(productData.cartList.items));
    dispatch(getCartListGeneral());
    //......................
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GlobalConst.LoginToken,
    };
    dispatch(getCustomerInfoAfterAddAddress(headers));
    //......................
  }, []);

  const renderDiscountMsg = x => {
    if (x.total_segments !== undefined) {
      if (
        x.total_segments.find(item => item.code === 'discount') !== undefined
      ) {
        if (
          x.total_segments.find(item => item.code === 'discount').title !==
          undefined
        ) {
          return x.total_segments.find(item => item.code === 'discount').title;
        }
      }
    }
  };

  function setShippingIdDefault() {
    let finalAddress = {};
    let address = {};
    // dispatch(setShippingAddressId(''));
    if (
      loginData.customerInfo !== undefined &&
      loginData.customerInfo.addresses !== undefined
    ) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (
          loginData.customerInfo.addresses[i].default_shipping &&
          utils.getAttributeFromCustom(
            loginData.customerInfo.addresses[i],
            'address_status',
          ) !== 'NA' &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ) !== undefined &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ).label === 'Approved'
        ) {
          dispatch(
            setShippingAddressId(loginData.customerInfo.addresses[i].id),
          );
        }
      }
    }
  }

  // function clearForPriceCheck() {
  //   console.log('Check 1..........');
  //   setPriceArr([]);
  //   dispatch(setOldCartState(productData.cartList.items));
  // }

  function finalCartStockCheck() {
    let temp = [];
    for (
      let i = 0;
      i < productData.shippingTotalInfromation.items.length;
      i++
    ) {
      console.log(
        'Order items..................',
        productData.shippingTotalInfromation.items,
      );
      if (
        productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.find(
          item =>
            item.item_id ===
            productData.shippingTotalInfromation.items[i].item_id,
        ) !== undefined
      ) {
        let oldItem = productData.cartList.items.find(
          item =>
            item.item_id ===
            productData.shippingTotalInfromation.items[i].item_id,
        );

        if (
          oldItem.extension_attributes !== undefined &&
          oldItem.extension_attributes.salablequantity !== undefined
        ) {
          if (
            parseInt(oldItem.extension_attributes.salablequantity) <
            parseInt(productData.shippingTotalInfromation.items[i].qty)
          ) {
            if (oldItem.extension_attributes.customoptions !== undefined) {
              temp.push(oldItem.name + ' (Short Dated)');
            } else {
              temp.push(oldItem.name);
            }
          }
        }
      }
    }
    return temp;
  }

  function finalCartPriceCheck() {
    let temp = [];
    for (
      let i = 0;
      i < productData.shippingTotalInfromation.items.length;
      i++
    ) {
      console.log(
        'Order items..................',
        productData.shippingTotalInfromation.items,
      );
      if (
        productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.find(
          item =>
            item.item_id ===
            productData.shippingTotalInfromation.items[i].item_id,
        ) !== undefined
      ) {
        let oldItem = productData.cartList.items.find(
          item =>
            item.item_id ===
            productData.shippingTotalInfromation.items[i].item_id,
        );

        if (
          oldItem.extension_attributes !== undefined &&
          oldItem.extension_attributes.salablequantity !== undefined
        ) {
          if (
            parseInt(oldItem.price) !==
            parseInt(productData.shippingTotalInfromation.items[i].price)
          ) {
            if (oldItem.extension_attributes.customoptions !== undefined) {
              temp.push(oldItem.name + ' (Short Dated)');
            } else {
              temp.push(oldItem.name);
            }
          }
        }
      }
    }
    return temp;
  }

  function finalCartChangeCheck() {
    let temp = [];
    for (
      let i = 0;
      i < productData.shippingTotalInfromation.items.length;
      i++
    ) {
      console.log(
        'Order items..................',
        productData.shippingTotalInfromation.items,
      );
      if (
        productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.find(
          item =>
            item.item_id ===
            productData.shippingTotalInfromation.items[i].item_id,
        ) === undefined
      ) {
        if (
          productData.shippingTotalInfromation.items[i].options !== undefined &&
          !_.isEmpty(productData.shippingTotalInfromation.items[i].options)
        ) {
          temp.push(
            productData.shippingTotalInfromation.items[i].name +
              ' (Short Dated)',
          );
        } else {
          temp.push(productData.shippingTotalInfromation.items[i].name);
        }
      }
    }
    return temp;
  }

  function setPO(po) {
    setPOState(po);
  }
  //

  function setStepData(st) {
    setSteps(st);
  }

  function setDeliveryType(type) {
    deliveryType = type;
  }

  function setDeliveryInstruction(instruction) {
    deliveryInstruction = instruction;
  }

  function setDeliveryDate(date) {
    deliveryDate = date;
  }

  function clearArr() {
    setArr([]);
    dispatch(setErrorMsg(''));
  }

  function priceCheckChange() {
    let temp = [];
    for (let i = 0; i < productData.cartList.items.length; i++) {
      console.log('Cart Items old..................', productData.oldCartState);
      console.log(
        'Cart Items new..................',
        productData.cartList.items,
      );
      if (
        productData.oldCartState.find(
          item => item.item_id === productData.cartList.items[i].item_id,
        ) !== undefined
      ) {
        let oldItem = productData.oldCartState.find(
          item => item.item_id === productData.cartList.items[i].item_id,
        );

        if (oldItem.price !== productData.cartList.items[i].price) {
          if (
            productData.cartList.items[i].extension_attributes !== undefined &&
            productData.cartList.items[i].extension_attributes.customoptions !==
              undefined
          ) {
            temp.push(productData.cartList.items[i].name + ' (Short Dated)');
          } else {
            temp.push(productData.cartList.items[i].name);
          }
        }
      }
    }
    // setPriceArr(temp);
    // dispatch(setOldCartState([]));
    // console.log('PriceArr.....................', temp);
    return temp;
  }

  useEffect(() => {
    if (
      productData.orderId.length > 0 &&
      bottomDrawerRef !== undefined &&
      bottomDrawerRef !== null
    ) {
      bottomDrawerRef.open();
    }
  }, [productData.orderId]);

  useEffect(() => {
    if (
      productData.errorMsg.length > 0 &&
      bottomDrawerErrorRef !== undefined &&
      bottomDrawerErrorRef !== null
    ) {
      bottomDrawerErrorRef.open();
      dispatch(setErrorMsg(''));
    }
  }, [productData.errorMsg]);

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
    }
    if (checker) {
      let temp1 = cartChangeChecker();
      let temp2 = priceCheckChange();
      let temp3 = checkCartStock();

      if (temp1.length > 0) {
        setChangeArr(temp1);
        Toast.show('Please review before proceeding');
      } else if (temp2.length > 0) {
        Toast.show('Please review before proceeding');
        setPriceArr(temp2);
      } else if (temp3.length > 0) {
        setArr(temp3);
        Toast.show(
          'Some items exceed available quantity.Please remove/update the items.',
        );
        // setShowErrorMsg(true);
      } else {
        setChangeArr([]);
        setPriceArr([]);
        setArr([]);
        dispatch(setShippingTotalInformation({}));

        if (step === 0 && productData.cartList.length === 0) {
          navigation.goBack();
        } else if (step === 0) {
          // dispatch(setShippingMethodName(deliveryType));
          setSteps(step + 1);
          dispatch(setIndicatorSteps(step + 1));
        }
      }

      setChecker(false);
    }
    if (finalCheck) {
      console.log(
        'New Cart list...................' +
          JSON.stringify(productData.cartList.items),
      );
      let temp1 = finalCartStockCheck();
      let temp2 = finalCartPriceCheck();
      let temp3 = finalCartChangeCheck();

      if (temp1.length === 0 && temp2.length === 0 && temp3.length === 0) {
        Toast.show('Placing Order...Please wait.');
        // Proceed code

        if (
          _.isEmpty(productData.cartId) &&
          !_.isEmpty(getAddressShippinggWithId())
        ) {
          dispatch(
            paymentInformation(
              GlobalConst.cartId,
              getAddressBillingWithId(),
              value,
            ),
          );
        } else if (!_.isEmpty(getAddressShippinggWithId())) {
          dispatch(
            paymentInformation(
              productData.cartId,
              getAddressBillingWithId(),
              value,
            ),
          );
        }
      } else {
        if (temp1.length > 0) {
          setArr(temp1);
        }
        if (temp2.length > 0) {
          setPriceArr(temp2);
        }
        if (temp3.length > 0) {
          setChangeArr(temp3);
        }
        dispatch(setOrderId(''));
        dispatch(setIndicatorSteps(0));
        setShippingIdDefault();
        dispatch(refreshCartForPurchase());
        setStepData(0);
        Toast.show('Please Review');
      }
      setFinalCheck(false);
    }
  }, [productData.cartList.items]);

  function cartChangeChecker() {
    let temp = [];
    for (let i = 0; i < productData.oldCartState.length; i++) {
      // console.log('Cart Items old..................', productData.oldCartState);
      if (
        productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.find(
          item => item.item_id === productData.oldCartState[i].item_id,
        ) === undefined
      ) {
        if (
          productData.oldCartState[i].extension_attributes !== undefined &&
          productData.oldCartState[i].extension_attributes.customoptions !==
            undefined
        ) {
          temp.push(productData.oldCartState[i].name + ' (Short Dated)');
        } else {
          temp.push(productData.oldCartState[i].name);
        }
      }
    }
    return temp;
  }

  useEffect(() => {
    setChangeArr([]);
    setPriceArr([]);
    setArr([]);
  }, []);

  function getAddressShippinggWithId() {
    let finalAddress = {};
    let address = {};
    if (
      loginData.customerInfo !== undefined &&
      loginData.customerInfo.addresses !== undefined
    ) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (
          loginData.shippingAddressId === loginData.customerInfo.addresses[i].id
        ) {
          if (loginData.customerInfo.addresses[i].id !== undefined) {
            address['customerAddressId'] =
              loginData.customerInfo.addresses[i].id;
          }
          if (
            loginData.customerInfo.addresses[i].street !== undefined &&
            loginData.customerInfo.addresses[i].street.length > 0
          ) {
            address['street'] = loginData.customerInfo.addresses[i].street;
          }
          if (
            loginData.customerInfo.addresses[i].city !== undefined &&
            loginData.customerInfo.addresses[i].city.length > 0
          ) {
            address['city'] = loginData.customerInfo.addresses[i].city;
          }
          if (
            loginData.customerInfo.addresses[i].region !== undefined &&
            loginData.customerInfo.addresses[i].region.region !== undefined
          ) {
            address['region_id'] =
              loginData.customerInfo.addresses[i].region.region_id;
            address['region'] =
              loginData.customerInfo.addresses[i].region.region;
            address['country_id'] =
              loginData.customerInfo.addresses[i].country_id;
          }
          if (loginData.customerInfo.addresses[i].postcode !== undefined) {
            address['postcode'] = loginData.customerInfo.addresses[i].postcode;
          }
          if (loginData.customerInfo.addresses[i].firstname !== undefined) {
            address['firstname'] =
              loginData.customerInfo.addresses[i].firstname;
          }
          if (loginData.customerInfo.addresses[i].lastname !== undefined) {
            address['lastname'] = loginData.customerInfo.addresses[i].lastname;
          }
          if (loginData.customerInfo.addresses[i].telephone !== undefined) {
            address['telephone'] =
              loginData.customerInfo.addresses[i].telephone;
          }
          address['customer_id'] =
            loginData.customerInfo.addresses[i].customer_id;
        }
      }
    }
    if (!_.isEmpty(address)) {
      finalAddress['address'] = address;
    } else {
      finalAddress = undefined;
    }

    //

    return finalAddress;
  }

  function getAddressBillingWithId() {
    let finalAddress = {};
    let address = {};
    let streetArray = [];

    if (
      loginData.customerInfo !== undefined &&
      loginData.customerInfo.addresses !== undefined
    ) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (
          loginData.customerInfo.addresses[i].default_billing &&
          utils.getAttributeFromCustom(
            loginData.customerInfo.addresses[i],
            'address_status',
          ) !== 'NA' &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ) !== undefined &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ).label === 'Approved'
        ) {
          if (loginData.customerInfo.addresses[i].id !== undefined) {
            address['customerAddressId'] =
              loginData.customerInfo.addresses[i].id;
          }

          if (
            loginData.customerInfo.addresses[i].street !== undefined &&
            loginData.customerInfo.addresses[i].street.length > 0
          ) {
            address['street'] = loginData.customerInfo.addresses[i].street;
          }
          if (
            loginData.customerInfo.addresses[i].city !== undefined &&
            loginData.customerInfo.addresses[i].city.length > 0
          ) {
            address['city'] = loginData.customerInfo.addresses[i].city;
          }
          if (
            loginData.customerInfo.addresses[i].region !== undefined &&
            loginData.customerInfo.addresses[i].region.region !== undefined
          ) {
            address['regionId'] =
              loginData.customerInfo.addresses[i].region.region_id;
            address['regionCode'] =
              loginData.customerInfo.addresses[i].region.region_code;
            address['region'] =
              loginData.customerInfo.addresses[i].region.region;
            address['countryId'] =
              loginData.customerInfo.addresses[i].country_id;
          }
          if (loginData.customerInfo.addresses[i].postcode !== undefined) {
            address['postcode'] = loginData.customerInfo.addresses[i].postcode;
          }
          if (loginData.customerInfo.addresses[i].firstname !== undefined) {
            address['firstname'] =
              loginData.customerInfo.addresses[i].firstname;
          }
          if (loginData.customerInfo.addresses[i].lastname !== undefined) {
            address['lastname'] = loginData.customerInfo.addresses[i].lastname;
          }
          if (loginData.customerInfo.addresses[i].telephone !== undefined) {
            address['telephone'] =
              loginData.customerInfo.addresses[i].telephone;
          }
          address['customerId'] =
            loginData.customerInfo.addresses[i].customer_id;
        }
      }
    }

    //
    return address;
  }

  function setTermAndConditions(t) {
    terms = t;
  }

  function setTermAndConditionsRead(t) {
    termsRead = t;
  }

  function checkCartStock() {
    let temp = [];

    //
    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined
    ) {
      for (let i = 0; i < productData.cartList.items.length; i++) {
        if (
          productData.cartList.items[i] !== undefined &&
          productData.cartList.items[i].qty !== undefined &&
          productData.cartList.items[i].extension_attributes !== undefined &&
          productData.cartList.items[i].extension_attributes.salablequantity !==
            undefined
        ) {
          if (
            productData.cartList.items[i].qty >
            productData.cartList.items[i].extension_attributes.salablequantity
          ) {
            if (
              productData.cartList.items[i].extension_attributes !==
                undefined &&
              productData.cartList.items[i].extension_attributes
                .customoptions !== undefined
            ) {
              temp.push(productData.cartList.items[i].name + ' (Short Dated)');
            } else {
              temp.push(productData.cartList.items[i].name);
            }
          }
        }
      }
    }

    return temp;
  }

  function setChangeArrFromSteps(temp) {
    setChangeArr(temp);
  }

  function setPriceChangeArrFromSteps(temp) {
    setPriceArr(temp);
  }

  function setArrFromSteps(temp) {
    setArr(temp);
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{height: 250}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}
        backdropPressToClose={false}
        swipeToClose={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 150,
            padding: 20,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={require('../../images/tick_large.png')} />

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={styles.headerTextCart}>
              Thank You For Your Purchase!
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.blue,
                fontSize: 14,
                fontFamily: 'DRLCircular-Bold',
              }}>
              Your Order Number Is: {productData.orderId}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
                marginTop: 10,
              }}>
              We'll Email You An Order Confirmation With Details And Tracking
              Info.
            </Text>
          </View>

          <TouchableOpacity
            style={{
              height: 40,
              width: 200,
              borderWidth: 1,
              borderColor: colors.blue,
              marginTop: 15,
              backgroundColor: colors.white,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              {
                dispatch(setOrderFailed());
              }
              {
                dispatch(emptyCartList());
              }
              // navigation.replace('MenuTab')
              navigation.goBack();
            }}>
            <Text style={{color: colors.blue}}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  {
    _.isEmpty(productData.cartId) ? utils.getCartID() : null;
  }
  //

  return (
    <View
      style={styles.container}
      // isLoading={productData.isLoading}
    >
      <View style={{flex: 1, backgroundColor: colors.white}}>

        <CustomeHeader
          back="back"
          title="My Cart"
          addToCart="addToCart"
          addToWishList="addToWishList"
          addToLocation="addToLocation"
        />

        {bottomSliderView()}

        {bottomSliderErrorView()}

        {productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View>
              <View
                style={{flex: 1, backgroundColor: colors.white, margin: 20}}>
                <View style={{marginTop: 20}}>
                  <MyCartStepsIndicator
                    setSteps={setStepData}
                    step={step}
                    PONum={value}
                    setChangeArrFromSteps={setChangeArrFromSteps}
                    setPriceChangeArrFromSteps={setPriceChangeArrFromSteps}
                    setArrFromSteps={setArrFromSteps}
                  />
                  {/* <PONumber setPONumber={setPO} poValue={poNumber}/> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        width: '90%',
                        borderColor: colors.lightGrey,
                        borderRadius: 10,
                        marginLeft: 10,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}>
                      <TextInput
                        style={{
                          marginRight: 25,
                          height: 40,
                          fontFamily: 'DRLCircular-Book',
                        }}
                        // onChangeText={(po) => onChangeText(po)}
                        onChangeText={po => setPO(po)}
                        value={value}
                        placeholder="Enter PO No."
                        placeholderTextColor={colors.placeholderColor}
                      />
                    </View>
                    <Text style={{color: 'red', fontSize: 24, marginRight: 10}}>
                      {' '}
                      *
                    </Text>
                  </View>
                  {/*  */}
                </View>
                {/* {step===0?renderCart():step===1?renderAddress():null} */}
                {step === 0 ? (
                  <View>
                    {arr.length > 0 && (
                      <View
                        style={{
                          backgroundColor: '#f7cdcd',
                          padding: 10,
                          marginVertical: 10,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            marginBottom: 5,
                          }}>
                          Following items exceed available quantity:
                        </Text>
                        {arr.map(item => {
                          return (
                            <Text
                              style={{
                                fontFamily: 'DRLCircular-Light',
                                marginBottom: 2,
                              }}>
                              {item}
                            </Text>
                          );
                        })}
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            marginTop: 5,
                          }}>
                          Please update/remove the items
                        </Text>
                      </View>
                    )}

                    {priceArr.length > 0 && (
                      <View
                        style={{
                          backgroundColor: '#fce7a2',
                          padding: 10,
                          marginVertical: 10,
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 5,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'DRLCircular-Book',
                              marginBottom: 5,
                            }}>
                            Price has changed for the following items :
                          </Text>
                          <TouchableOpacity onPress={() => setPriceArr([])}>
                            <Image
                              source={require('../../images/cross.png')}
                              style={{height: 10}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        {priceArr.map(item => {
                          return (
                            <Text
                              style={{
                                fontFamily: 'DRLCircular-Light',
                                marginBottom: 2,
                              }}>
                              {item}
                            </Text>
                          );
                        })}
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            marginTop: 5,
                          }}>
                          Please review before placing order
                        </Text>
                      </View>
                    )}

                    {changeArr.length > 0 && (
                      <View
                        style={{
                          backgroundColor: '#fce7a2',
                          padding: 10,
                          marginVertical: 10,
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 5,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'DRLCircular-Book',
                              marginBottom: 5,
                            }}>
                            Following items have been removed from cart:
                          </Text>
                          <TouchableOpacity onPress={() => setChangeArr([])}>
                            <Image
                              source={require('../../images/cross.png')}
                              style={{height: 10}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        {changeArr.map(item => {
                          return (
                            <Text
                              style={{
                                fontFamily: 'DRLCircular-Light',
                                marginBottom: 2,
                              }}>
                              {item}
                            </Text>
                          );
                        })}
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            marginTop: 5,
                          }}>
                          Please review before placing order
                        </Text>
                      </View>
                    )}

                    {/* <CartList
                      clearArr={clearArr}
                      priceCheckChange={priceCheckChange}
                      clearForPriceCheck={clearForPriceCheck}
                    /> */}

                    <CartList clearArr={clearArr} />

                    <View style={{height: 50}}></View>
                    
                  </View>
                ) : step === 1 ? ( 
                  // <CartAddresses />
                  <MyCartAddress
                    setDeliveryInstruction={setDeliveryInstruction}
                  />
                ) : null}
              </View>
              {step == 1 ? (
                <View>
                  <ShippingEstimates
                    setDeliverType={setDeliveryType}
                    setDeliveryInstruction={setDeliveryInstruction}
                    setDeliveryDate={setDeliveryDate}
                  />
                  <View style={{height: 60}}></View>
                </View>
              ) : null}
              {step === 2 ? (
                <View>
                  {!_.isEmpty(productData.shippingTotalInfromation) && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.lightGrey,
                        margin: 20,
                        padding: 10,
                      }}>
                      <Text
                        style={{
                          color: colors.green,
                          fontSize: 14,
                          fontFamily: 'DRLCircular-Book',
                          marginBottom: 10,
                        }}>
                        Please review before placing order!!{' '}
                      </Text>
                      <Text
                        style={{
                          color: colors.darkGrey,
                          fontSize: 18,
                          fontFamily: 'DRLCircular-Bold',
                          marginBottom: 10,
                        }}>
                        Order Summary{' '}
                      </Text>
                      {productData.shippingTotalInfromation.base_subtotal !==
                        undefined && (
                        <View style={SummStyles.summaryItem}>
                          <View style={{width: '70%'}}>
                            <Text style={SummStyles.summaryTextTitle}>
                              Cart Subtotal :{' '}
                            </Text>
                          </View>
                          <Text style={SummStyles.summaryText}>
                            $
                            {utils.formatPrice(
                              productData.shippingTotalInfromation
                                .base_subtotal,
                            )}
                          </Text>
                        </View>
                      )}

                      {productData.shippingTotalInfromation.discount_amount !==
                        undefined &&
                        productData.shippingTotalInfromation.discount_amount !==
                          0 && (
                          <View style={SummStyles.summaryItem}>
                            <View style={{width: '70%'}}>
                              <Text style={SummStyles.summaryTextTitle}>
                                Discount:{' '}
                              </Text>
                              <Text
                                style={SummStyles.labeltext}
                                numberOfLines={2}>
                                {renderDiscountMsg(
                                  productData.shippingTotalInfromation,
                                )}
                              </Text>
                            </View>
                            <Text style={SummStyles.summaryText}>
                              - $
                              {utils.formatPrice(
                                productData.shippingTotalInfromation
                                  .discount_amount * -1,
                              )}
                            </Text>
                          </View>
                        )}
                      {productData.shippingTotalInfromation.shipping_amount !==
                        undefined && (
                        <View style={SummStyles.summaryItem}>
                          <View style={{width: '70%'}}>
                            {/* <Text style={SummStyles.summaryTextTitle}>
                              Shipping:{' '}
                            </Text>
                            <Text style={SummStyles.labeltext}>
                              {
                                productData.shippingTotalInfromation
                                  .shipping_method
                              }
                            </Text> */}

                            {productData.shippingTotalInfromation
                              .total_segments !== undefined &&
                            productData.shippingTotalInfromation.total_segments.find(
                              item => item.code === 'shipping',
                            ) !== undefined &&
                            productData.shippingTotalInfromation.total_segments.find(
                              item => item.code === 'shipping',
                            ).title !== undefined ? (
                              <View>
                                <Text style={SummStyles.summaryTextTitle}>
                                  {productData.shippingTotalInfromation.total_segments
                                    .find(item => item.code === 'shipping')
                                    .title.substring(0, 20)}
                                </Text>
                                <Text style={SummStyles.labeltext}>
                                  {productData.shippingTotalInfromation.total_segments
                                    .find(item => item.code === 'shipping')
                                    .title.substring(
                                      20,
                                      productData.shippingTotalInfromation.total_segments.find(
                                        item => item.code === 'shipping',
                                      ).title.length,
                                    )
                                    .split('-')[0]
                                    .slice(0, -1)}
                                  
                                </Text>
                              </View>
                            ) : (
                              <Text style={SummStyles.summaryTextTitle}>
                                'Shipping:'
                              </Text>
                            )}
                          </View>
                          <Text style={SummStyles.summaryText}>
                            $
                            {utils.formatPrice(
                              productData.shippingTotalInfromation
                                .shipping_amount,
                            )}
                          </Text>
                        </View>
                      )}

                      {productData.shippingTotalInfromation.grand_total !==
                        undefined && (
                        <View style={[SummStyles.summaryItem, {marginTop: 20}]}>
                          <Text
                            style={[
                              SummStyles.summaryTextTitle,
                              {fontSize: 18},
                            ]}>
                            Order Total :{' '}
                          </Text>
                          <Text
                            style={[SummStyles.summaryText, {fontSize: 20}]}>
                            $
                            {utils.formatPrice(
                              productData.shippingTotalInfromation.grand_total,
                            )}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  <Text
                    style={{
                      color: colors.darkGrey,
                      fontSize: 18,
                      fontFamily: 'DRLCircular-Bold',
                      marginLeft: 20,
                      marginBottom: 10,
                    }}>
                    Cart Items-
                  </Text>
                  <OrderTotalInformation
                    setTermAndConditionsRead={setTermAndConditionsRead}
                    setTermAndConditions={setTermAndConditions}
                    deliveryInstruction={deliveryInstruction}
                    deliveryDate={deliveryDate}
                  />
                </View>
              ) : null}
            </View>

            <View style={{height: 100}}></View>
          </ScrollView>
        ) : (
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
              No item added
            </Text>
            {changeArr.length > 0 && (
              <View
                style={{
                  backgroundColor: '#fce7a2',
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 10,
                  marginHorizontal: 10,
                }}>
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      marginBottom: 5,
                    }}>
                    Following items have been removed from cart:
                  </Text>
                  <TouchableOpacity onPress={() => setChangeArr([])}>
                    <Image
                      source={require('../../images/cross.png')}
                      style={{height: 10}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {changeArr.map(item => {
                  return (
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        marginBottom: 2,
                      }}>
                      {item}
                    </Text>
                  );
                })}
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    marginTop: 5,
                  }}>
                  Please review before placing order
                </Text>
              </View>
            )}
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            height: 70,
            width: '100%',
            bottom: 0,
            backgroundColor: colors.lightGrey,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              //alignItems: 'center',
            }}>
            {step === 0 && !_.isEmpty(productData.cartList.items) && (
              // <Text textColor={colors.darkGrey} style={{fontSize: 20}}>

              // ${productData.cartList.base_grand_total}
              // </Text>
              <PriceDetail />
            )}
            {/* <Text style={{fontSize: 14, color: colors.blue}}> */}
            {/* View details */}
            {/* </Text> */}
          </View>
          <TouchableOpacity
            style={{
              height: 50,
              width: 200,
              backgroundColor: colors.blue,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (
                productData.cartList !== undefined &&
                productData.cartList.items !== undefined &&
                productData.cartList.items.length > 0
              ) {
                //
                //

                if (_.isEmpty(value)) {
                  Toast.show('Please enter PO Number', Toast.SHORT);
                }

                // else if (step === 0 && checkCartStock()) {
                //   // dispatch(getCartListGeneralToProceed());

                //   Toast.show(
                //     'Some items exceed available quantity.Please remove/update the items.',
                //   );
                //   setShowErrorMsg(true);
                // }
                else if (step === 0) {
                  setChecker(true);
                  console.log(
                    'Old cart..............' +
                      JSON.stringify(productData.cartList.items),
                  );
                  dispatch(setOldCartState(productData.cartList.items));
                  dispatch(getCartListGeneralWithLoader());
                } else if (step < 2) {
                  dispatch(setShippingTotalInformation({}));
                  // dispatch(setShippingMethodName('standardshipping'))
                  // dispatch(refreshCartForPurchase());

                  // dispatch(setShippingDeliveryDate( '16/01/2021'))
                  // dispatch(setShippingDeliveryInstruction( 'Test'));
                  // let data={};
                  // data['deliveryType'] = deliveryType;
                  // data['deliveryDate'] = deliveryDate;
                  // data['deliveryInstrction'] = deliveryInstruction;

                  if (step === 0 && productData.cartList.length === 0) {
                    navigation.goBack();
                  } else if (step === 0) {
                    // dispatch(setShippingMethodName(deliveryType));
                    setSteps(step + 1);
                    dispatch(setIndicatorSteps(step + 1));
                    //  setPONumberState(poNumber);
                  } else if (loginData.shippingAddressId.length === 0) {
                    Toast.show('Select shipping address', Toast.SHORT);
                  } else if (productData.shippingMethodName.length === 0) {
                    Toast.show('Select delivery type', Toast.SHORT);
                  } else if (!_.isEmpty(getAddressBillingWithId())) {
                    setSteps(step + 1);
                    dispatch(setIndicatorSteps(step + 1));
                    //  setPONumberState(poNumber);
                  } else {
                    Toast.show('Billing address unavailable', Toast.SHORT);
                  }

                  // else{
                  // setSteps(step+1);
                  // dispatch(setIndicatorSteps(step+1))
                  // setPONumberState(poNumber);
                  // }
                } else if (step == 2) {
                  if (GlobalConst.LoginToken.length > 0) {
                    if (_.isEmpty(value)) {
                      Toast.show('Please enter PO Number', Toast.SHORT);
                    } else if (deliveryType.length === 0) {
                      Toast.show('Plase select the delivery type', Toast.SHORT);
                    } else if (!terms) {
                      Toast.show(
                        'Please select Terms and Conditions',
                        Toast.SHORT,
                      );
                    } else if (!termsRead) {
                      Toast.show(
                        'Please read Terms and Conditions',
                        Toast.SHORT,
                      );
                    } else {
                      if (
                        !_.isEmpty(productData.shippingTotalInfromation) &&
                        !_.isEmpty(productData.shippingTotalInfromation.items)
                      ) {
                        setFinalCheck(true);
                        dispatch(getCartListGeneralWithLoader());
                      } else {
                        dispatch(setOrderId(''));
                        dispatch(setIndicatorSteps(0));
                        setShippingIdDefault();
                        dispatch(refreshCartForPurchase());
                        setStepData(0);
                        Toast.show('Please Review');
                      }
                    }

                    // else {
                    //   if (
                    //     _.isEmpty(productData.cartId) &&
                    //     !_.isEmpty(getAddressShippinggWithId())
                    //   ) {
                    //     //
                    //     //

                    //     dispatch(
                    //       paymentInformation(
                    //         GlobalConst.cartId,
                    //         getAddressBillingWithId(),
                    //         value,
                    //       ),
                    //     );
                    //   } else if (!_.isEmpty(getAddressShippinggWithId())) {
                    //     //
                    //     //

                    //     dispatch(
                    //       paymentInformation(
                    //         productData.cartId,
                    //         getAddressBillingWithId(),
                    //         value,
                    //       ),
                    //     );
                    //   }
                    // }
                  }

                  // dispatch(productData.cartId, paymentInformation(prod, getAddressBillingWithId(),poNumber))
                }
              } else {
                //Toast.show("Cart is Empty", Toast.SHORT);
                // dispatch(getProductsSuccess([]));
                // dispatch(setConfigurableProducts([]));
                // dispatch(setConfigurableProductDetail([]));
                // dispatch(getProductDetailSuccess({}));
                // dispatch(setCategoryApplied(false));
                // dispatch(setDosageApplied([]));
                // dispatch(setTherapeutic([]));
                // dispatch(setFilters([]));
                // dispatch(setProductName(undefined));
                // navigation.navigate('AllProducts');
                navigation.goBack();
              }
            }}>
            <Text style={{color: colors.white}}>
              {step === 0 && _.isEmpty(productData.cartList.items)
                ? 'Continue Shopping'
                : step === 0
                ? 'Proceed to Checkout'
                : step === 1
                ? 'Continue'
                : 'Place Order'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  function bottomSliderErrorView() {
    return (
      <Modal
        style={{height: 250}}
        position={'bottom'}
        ref={c => (bottomDrawerErrorRef = c)}
        backdropPressToClose={false}
        swipeToClose={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 150,
            padding: 20,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image />

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={styles.headerTextCart}>
              Error: Purchase Order Failure. {'\n'}Please review availability of
              products
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.blue,
                fontSize: 14,
                fontFamily: 'DRLCircular-Bold',
              }}>
              {' '}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
                marginTop: 10,
              }}>
              {' '}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              height: 40,
              width: 200,
              borderWidth: 1,
              borderColor: colors.blue,
              marginTop: 15,
              backgroundColor: colors.white,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              {
                dispatch(setOrderFailed());
              }
              {
                dispatch(emptyCartListAfterError());
              }
              {
                dispatch(setcartAdded());
              }
              if (
                bottomDrawerErrorRef !== undefined &&
                bottomDrawerErrorRef !== null
              ) {
                bottomDrawerErrorRef.close();
              }
              setSteps(0);
              dispatch(setIndicatorSteps(0));
            }}>
            <Text style={{color: colors.blue}}>Please Review</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
};

const SummStyles = StyleSheet.create({
  summaryView: {
    marginTop: 50,
    borderWidth: 0.5,
    borderColor: Colors.textColor,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
  },

  labeltext: {
    color: Colors.textColor,
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  summaryText: {
    color: Colors.blue,
    fontSize: 16,
    fontFamily: 'DRLCircular-Book',
  },
  summaryTextTitle: {
    color: Colors.textColor,
    fontSize: 16,
    fontFamily: 'DRLCircular-Bold',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'DRLCircular-Bold',
    marginTop: 10,
  },

  titleText: {
    color: Colors.blue,

    fontFamily: 'DRLCircular-Bold',
    fontSize: 24,
  },
});

export default MyCart;
