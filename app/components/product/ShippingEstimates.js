import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, TextInput} from 'react-native';
import {
  estimateShippingMethod,
  getDeliveryDates,
} from '../../services/operations/productApis';
import colors from '../../config/Colors';
import _ from 'lodash';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {
  setShippingMethodName,
  setShippingMethods,
  setDeliveryDateForPurchase,
  setDeliveryInstructionsForPurchase,
} from '../../slices/productSlices';
import {setShippingAddressId} from '../../slices/authenticationSlice';
import utils from '../../utilities/utils';
import Toast from 'react-native-simple-toast';

const ShippingEstimates = props => {
  const labels = ['My Cart', 'Address', 'Review & \nPlace Order'];

  const [methodCode, setMethodCode] = useState('');

  const [regularDate, setRegularDate] = useState('');
  const [expressDate, setExpressDate] = useState('');
  const [coldDate, setColdDate] = useState('');

  const [regularDateObj, setRegularDateObj] = useState('');
  const [expressDateObj, setExpressDateObj] = useState('');
  const [coldDateObj, setColdDateObj] = useState('');

  const navigation = useNavigation();
  const [shippingMethods, setShippingMethodsStatus] = React.useState(true);

  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const [delInst, setDiliveryInstruction] = useState('');

  useEffect(() => {
    if (
      loginData.customerInfoUpdated &&
      getAddressShippinggWithId() !== undefined
    ) {
      // dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      getShippings();
    }
  }, [loginData.customerInfoUpdated]);

  useEffect(() => {
    getShippings();
  }, [loginData.shippingAddressId]);

  useEffect(() => {
    if (productData.shippingMethodName.length > 0) {
      setMethodCode(productData.shippingMethodName);
    } else {
      dispatch(setShippingMethodName(methodCode));
    }
  }, [productData.shippingMethodName]);

  useEffect(() => {
    if (productData.shippingMethodFetchFailed) {
      Toast.show('An error occured. Please try later.', Toast.LONG);
    }
  }, [productData.shippingMethodFetchFailed]);

  useEffect(() => {
    dispatch(getDeliveryDates());
  }, []);

  useEffect(() => {
    if (!_.isEmpty(productData.deliveryDates)) {
      // let isColdChain=coldChainChecker();

      if (productData.deliveryDates.rdd_standard_text !== undefined) {
        setRegularDate(productData.deliveryDates.rdd_standard_text);
      }

      if (productData.deliveryDates.rdd_express_text !== undefined) {
        setExpressDate(productData.deliveryDates.rdd_express_text);
      }

      if (productData.deliveryDates.rdd_cold_storage !== undefined) {
        setColdDate(productData.deliveryDates.rdd_cold_storage);
      }

      if (productData.deliveryDates.rdd_standard_max_date !== undefined) {
        setRegularDateObj(productData.deliveryDates.rdd_standard_max_date);
      }
      if (productData.deliveryDates.rdd_express_max_date !== undefined) {
        setExpressDateObj(productData.deliveryDates.rdd_express_max_date);
      }
      if (productData.deliveryDates.rdd_cold_storage_date !== undefined) {
        setColdDateObj(productData.deliveryDates.rdd_cold_storage_date);
      }
      if (productData.deliveryDates.rdd_standard_max_date !== undefined) {
        //  props.setDeliveryDate(productData.deliveryDates.rdd_standard_max_date)
        dispatch(
          setDeliveryDateForPurchase(
            productData.deliveryDates.rdd_standard_max_date,
          ),
        );
      }
    }
    //  else {
    //   dispatch(getDeliveryDates());
    // }
  }, [productData.deliveryDates]);

  function renderDateRange(d1, d2) {
    console.log('date 1 passed...................', d1);
    console.log('date 2 passed...................', d2);

    // let date1 = new Date(d1);
    // let date2 = new Date(d2);

    // let date1 = Date.parse(d1);
    // let date2 = Date.parse(d2);

    let date1 = new Date('06/03/2021');
    let date2 = new Date('06/09/2021');

    console.log('date 1...................', date1);
    console.log('date 2...................', date2);
    let temp = '';
    if (d1 === d2) {
      temp = d1;
    } else if (date1 > date2) {
      temp = d2 + ' to ' + d1;
    } else if (date1 < date2) {
      temp = d1 + ' to ' + d2;
    }
    console.log('Temp..........', temp);
    return temp;
  }

  function renderDates(date, dateObjString) {
    let isColdChain = coldChainChecker();

    console.log('Date passed........................', date);
    console.log('isColdChain.................', isColdChain);
    if (
      coldDate.length > 0 &&
      expressDate.length > 0 &&
      regularDate.length > 0
    ) {
      if (isColdChain === '1') {
        return coldDate;
        // renderDateRange(d1,d2)
      } else if (isColdChain === '2') {
        // let date1 = new Date('06/03/2021'); //colddate
        // let date2 = new Date('06/09/2021'); //passedDate

        let date1 = new Date(coldDateObj); //colddate
        let date2 = new Date(dateObjString); //passedDate

        console.log('date 1...................', date1);
        console.log('date 2...................', date2);
        let temp = '';
        if (coldDate === date) {
          temp = date;
        } else if (date1 > date2) {
          temp = date + ' - ' + coldDate;
        } else if (date1 < date2) {
          temp = coldDate + ' - ' + date;
        }
        console.log('Temp..........', temp);
        return temp;

        // renderDateRange(coldDate, date);
      } else if (isColdChain === '3') {
        return date;
      }
    }
  }

  function coldChainChecker() {
    let temp = 0;

    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined &&
      !_.isEmpty(productData.cartList.items)
    ) {
      for (let i = 0; i < productData.cartList.items.length; i++) {
        if (
          productData.cartList.items[i] !== undefined &&
          productData.cartList.items[i].extension_attributes !== undefined &&
          productData.cartList.items[i].extension_attributes.coldchain !==
            undefined
        ) {
          if (
            productData.cartList.items[i].extension_attributes.coldchain === '1'
          ) {
            temp = temp + 1;
          }
        }
      }

      console.log('Cold chain count..........', temp);

      if (temp === productData.cartList.items.length) {
        return '1';
      } else if (temp < productData.cartList.items.length && temp !== 0) {
        return '2';
      } else if (temp === 0) {
        return '3';
      }
    }
    // logic
  }

  function onTextChange(instruction) {
    setDiliveryInstruction(instruction);
    props.setDeliveryInstruction(instruction);
  }

  function getShippingsWithId() {
    if (getAddressShippinggWithId() !== undefined) {
      if (
        productData.shipping_methods !== undefined &&
        productData.shipping_methods.length === 0 &&
        !_.isEmpty(getAddressShippinggWithId())
      ) {
        dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      } else if (
        productData.shipping_methods === undefined &&
        !_.isEmpty(getAddressShippinggWithId())
      ) {
        dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      }
    }
  }

  function getShippings() {
    if (getAddressShippinggWithId() !== undefined) {
      if (
        productData.shipping_methods !== undefined &&
        !_.isEmpty(getAddressShippinggWithId())
      ) {
        dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      } else if (
        productData.shipping_methods === undefined &&
        !_.isEmpty(getAddressShippinggWithId())
      ) {
        dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      }
      // dispatch(setShippingAddressId(""))
    }
  }

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
        i < loginData.customerInfo.addresses.length &&
        _.isEmpty(address);
        i++
      ) {
        if (
          loginData.shippingAddressId === loginData.customerInfo.addresses[i].id
        ) {
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
        //
      }
    }
    if (!_.isEmpty(address)) {
      finalAddress['address'] = address;
      // dispatch(setShippingMethods([]));
    } else {
      finalAddress = undefined;
    }

    //

    return finalAddress;
  }

  function getShippingEstimates() {
    return productData.shipping_methods.map((item, index) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            key: index,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.lightGrey,
            marginBottom: 10,
          }}>
          {console.log('Estimate item................', item)}
          <CheckBox
            style={{height: 20}}
            disabled={false}
            value={item.method_code === methodCode ? true : false}
            onValueChange={newValue => {
              if (newValue) {
                setMethodCode(item.method_code);
                dispatch(setShippingMethodName(item.method_code));
              } else {
                setMethodCode('');
                dispatch(setShippingMethodName(''));
              }
            }}
          />
          {/* {index === 0 ? (
            <CheckBox
              style={{height: 20}}
              disabled={false}
              value={shippingMethods}
              onValueChange={newValue => {
                if (!shippingMethods) {
                  //props.setDeliverType("standardshipping");
                  dispatch(setShippingMethodName('standardshipping'));
                  if (
                    !_.isEmpty(productData.deliveryDates) &&
                    productData.deliveryDates.rdd_standard_max_date !==
                      undefined
                  ) {
                    dispatch(
                      setDeliveryDateForPurchase(
                        productData.deliveryDates.rdd_standard_max_date,
                      ),
                    );
                    // props.setDeliveryDate(productData.deliveryDates.rdd_standard_max_date)
                  }
                } else {
                  // props.setDeliverType("expressshipping");
                  dispatch(setShippingMethodName('expressshipping'));
                  if (
                    !_.isEmpty(productData.deliveryDates) &&
                    productData.deliveryDates.rdd_express_max_date !== undefined
                  ) {
                    dispatch(
                      setDeliveryDateForPurchase(
                        productData.deliveryDates.rdd_express_max_date,
                      ),
                    );
                    // props.setDeliveryDate(productData.deliveryDates.rdd_express_max_date)
                  }
                }

                setShippingMethodsStatus(!shippingMethods);
              }}
            />
          ) : (
            <CheckBox
              style={{height: 20}}
              disabled={false}
              value={!shippingMethods}
              onValueChange={newValue => {
                if (!shippingMethods) {
                  // props.setDeliverType("standardshipping");
                  dispatch(setShippingMethodName('standardshipping'));
                  if (
                    !_.isEmpty(productData.deliveryDates) &&
                    productData.deliveryDates.rdd_standard_max_date !==
                      undefined
                  ) {
                    dispatch(
                      setDeliveryDateForPurchase(
                        productData.deliveryDates.rdd_standard_max_date,
                      ),
                    );
                    //  props.setDeliveryDate(productData.deliveryDates.rdd_standard_max_date)
                  }
                } else {
                  // props.setDeliverType("expressshipping");
                  dispatch(setShippingMethodName('expressshipping'));
                  if (
                    !_.isEmpty(productData.deliveryDates) &&
                    productData.deliveryDates.rdd_express_max_date !== undefined
                  ) {
                    dispatch(
                      setDeliveryDateForPurchase(
                        productData.deliveryDates.rdd_express_max_date,
                      ),
                    );
                    // props.setDeliveryDate(productData.deliveryDates.rdd_express_max_date)
                  }
                }

                setShippingMethodsStatus(!shippingMethods);
              }}
            />
          )} */}
          <View style={{width: '90%'}}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
              {item.carrier_title}
            </Text>
            {item.carrier_title === 'Expedited Shipping' ? (
              <View>
                <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 14}}>
                  Note: To get next day delivery, please order before 3pm EST.
                </Text>

                <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 14}}>
                  (No weekend delivery)
                </Text>
                {expressDate !== '' && (
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.stepsColor,
                    }}>
                    {/* {expressDate} */}
                    {renderDates(expressDate, expressDateObj)}
                  </Text>
                )}
              </View>
            ) : (
              regularDate !== '' && (
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.stepsColor,
                  }}>
                  {/* {regularDate} */}
                  {renderDates(regularDate, regularDateObj)}
                </Text>
              )
            )}
            <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 18}}>
              ${utils.formatPrice(item.base_amount)}
            </Text>
          </View>
        </View>
      );
    });
  }

  function getShippingView(item, index) {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderWidth: 1,
          borderColor: colors.lightGrey,
          marginBottom: 10,
        }}>
        {index === 0 ? (
          <CheckBox
            style={{height: 20}}
            disabled={false}
            value={shippingMethods}
            onValueChange={newValue =>
              setShippingMethodsStatus(!shippingMethods)
            }
          />
        ) : (
          <CheckBox
            style={{height: 20}}
            disabled={false}
            value={!shippingMethods}
            onValueChange={newValue =>
              setShippingMethodsStatus(!shippingMethods)
            }
          />
        )}
        <View>
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
            {item.carrier_title}
          </Text>
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
            ${item.base_amount}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{padding: 20}}>
      <Text
        style={{
          color: colors.darkGrey,
          fontSize: 18,
          fontFamily: 'DRLCircular-Bold',
        }}>
        Select Delivery Type
      </Text>
      <View
        style={{
          borderColor: colors.lightGrey,
          borderRadius: 10,
          width: '100%',
          paddingLeft: 5,
          paddingRight: 5,
          marginBottom: 10,
          marginTop: 10,
        }}>
        {/* {getShippings()} */}
        {productData.shipping_methods !== undefined &&
          !_.isEmpty(productData.shipping_methods) &&
          getShippingEstimates()}
      </View>
      <Text
        style={{
          color: colors.darkGrey,
          fontSize: 18,
          fontFamily: 'DRLCircular-Bold',
        }}>
        Delivery Instructions (Optional)
      </Text>

      <TextInput
        style={{
          height: 60,
          borderWidth: 0.5,
          marginTop: 10,
          paddingHorizontal: 10,
          borderColor: colors.grey,
          borderRadius: 10,
        }}
        // onChangeText={(search) => setDiliveryInstruction(search)}
        onChangeText={search => {
          onTextChange(search);
          dispatch(setDeliveryInstructionsForPurchase(search));
        }}
        value={delInst}
        placeholder="Delivery Instructions"
      />
    </View>
  );
};
export default ShippingEstimates;
