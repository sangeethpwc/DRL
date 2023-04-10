import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import {getTotalInformation} from '../../services/operations/productApis';
import colors from '../../config/Colors';
import CheckBox from '@react-native-community/checkbox';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {setOldCartState, setTotalInfoArgs} from '../../slices/productSlices';
import utils from '../../utilities/utils';
import ApplyCoupon from './ApplyCoupon';

const OrderTotalInformation = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  const [terms, setTermAndConditions] = React.useState(false);
  const [termsRead, setTermsRead] = React.useState(false);

  const [priceArr, setPriceArr] = React.useState([]);

  let shippingMethod = '';
  let totalInfoArgs = [];

  function setTerms(terms) {
    setTermAndConditions(terms);
    props.setTermAndConditions(terms);
  }

  function setTermsConditionsRead(terms) {
    setTermsRead(terms);
    props.setTermAndConditionsRead(terms);
  }

  function renderOrders(item, index) {
    let shortDated = '';
    if (
      item !== undefined &&
      item.options !== undefined &&
      item.options.length > 0
    ) {
      let optionArray = JSON.parse(item.options);

      if (
        optionArray.length > 0 &&
        optionArray[0].label !== undefined &&
        // optionArray[0].label === 'Shortdated LOT No#' &&
        optionArray[0].value !== undefined
      ) {
        shortDated = optionArray[0].value;
      }
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGrey,
            backgroundColor: colors.whiteGradient,
            width: '100%',
            padding: 5,
          }}>
          {shortDated !== undefined && shortDated.length > 0 ? (
            <Text
              style={{
                fontFamily: 'DRLCircular-Light',
                fontSize: 16,
                color: colors.stepsColor,
              }}>
              Short Dated Batch No.- {shortDated}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: 'DRLCircular-Light',
                fontSize: 16,
                color: colors.stepsColor,
              }}></Text>
          )}

          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
              color: colors.blue,
            }}>
            {item.name}
          </Text>
          {/* <Text numberOfLines= {2} style={{  fontFamily: 'DRLCircular-Light', width:150, justifyContent: 'center', 
                alignItems: 'center', 
                fontSize:12,marginTop:10, color: colors.stepsColor, padding:5,
                 backgroundColor: colors.dashboardCard1BackgroundColor}}>{item.name}</Text> */}
          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
              marginVertical: 5,
              color: colors.grey,
            }}>
            Quantity: {item.qty}
          </Text>
          <Text
            style={{
              fontFamily: 'DRLCircular-Bold',
              fontSize: 22,
              marginBottom: 5,
              color: colors.grey,
            }}>
            ${utils.formatPrice(item.base_row_total)}
          </Text>
        </View>
      </View>
    );
  }

  function getOrderLists() {
    return (
      <FlatList
        data={productData.shippingTotalInfromation.items}
        renderItem={({item, index}) => renderOrders(item, index)}
      />
    );
  }

  function getAddressShippingWithId() {
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
          address['customerAddressId'] = loginData.shippingAddressId;

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
        //
      }
    }
    // if(!_.isEmpty(address)){
    //     finalAddress['address'] = address;
    //    // dispatch(setShippingMethods([]));
    // }
    // else{
    //     finalAddress= undefined;
    // }
    return address;
  }

  function renderShippingAddress() {
    //
    let finalAddress = {};
    let address = '';
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
          // if(loginData.customerInfo.addresses[i].firstname !== undefined && loginData.customerInfo.addresses[i].lastname!=undefined ){
          //     address = address + loginData.customerInfo.addresses[i].firstname+" "+loginData.customerInfo.addresses[i].lastname+ "\n"
          // }
          if (
            loginData.customerInfo.addresses[i].company !== undefined &&
            loginData.customerInfo.addresses[i].company.length > 0
          ) {
            address =
              address + loginData.customerInfo.addresses[i].company + '\n';
          }

          if (
            loginData.customerInfo.addresses[i].street !== undefined &&
            loginData.customerInfo.addresses[i].street.length > 0
          ) {
            address =
              address + loginData.customerInfo.addresses[i].street[0] + '\n';
          }
          if (
            loginData.customerInfo.addresses[i].city !== undefined &&
            loginData.customerInfo.addresses[i].city.length > 0
          ) {
            address = address + loginData.customerInfo.addresses[i].city + ' ';
          }
          if (
            loginData.customerInfo.addresses[i].region !== undefined &&
            loginData.customerInfo.addresses[i].region.region !== undefined
          ) {
            address =
              address + loginData.customerInfo.addresses[i].region.region + ' ';
          }
          if (loginData.customerInfo.addresses[i].postcode !== undefined) {
            address =
              address + loginData.customerInfo.addresses[i].postcode + '\n';
            address = address + 'United States' + '\n';
          }
          if (loginData.customerInfo.addresses[i].telephone !== undefined) {
            address =
              address + loginData.customerInfo.addresses[i].telephone + '\n';
          }
        }
        //
      }
    }
    // if(!_.isEmpty(address)){
    //     finalAddress['address'] = address;
    //    // dispatch(setShippingMethods([]));
    // }
    // else{
    //     finalAddress= undefined;
    // }
    return address;
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
        if (loginData.customerInfo.addresses[i].default_billing) {
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

  function getIdFromAddress(tagId) {
    let id = '';
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
        if (loginData.customerInfo.addresses[i].default_shipping) {
          if (
            loginData.customerInfo.addresses[i].region !== undefined &&
            loginData.customerInfo.addresses[i].region.region !== undefined
          ) {
            if (tagId === 'country_id') {
              id = loginData.customerInfo.addresses[i].country_id;
            }
            if (tagId === 'region') {
              id = loginData.customerInfo.addresses[i].region.region;
            }
            if (tagId === 'region_id') {
              id = loginData.customerInfo.addresses[i].region.region_id;
            }
            if (
              tagId === 'postcode' &&
              loginData.customerInfo.addresses[i].postcode !== undefined
            ) {
              id = loginData.customerInfo.addresses[i].postcode;
            }
          }
        }
      }
    }

    return id;
  }

  useEffect(() => {
    // if(productData.shippingMethodName.length>0 && _.isEmpty(productData.shippingTotalInfromation)  && !_.isEmpty(getAddressShippinggWithId())){
    if (
      productData.shippingMethodName.length > 0 &&
      _.isEmpty(productData.shippingTotalInfromation)
    ) {
      shippingMethod = productData.shippingMethodName;
      dispatch(setOldCartState(productData.cartList.items));
      getTotalInfo();
    }
  }, [productData.shippingMethodName]);

  useEffect(() => {
    if (!_.isEmpty(productData.shippingTotalInfromation)) {
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
          productData.oldCartState.find(
            item =>
              item.item_id ===
              productData.shippingTotalInfromation.items[i].item_id,
          ) !== undefined
        ) {
          let oldItem = productData.oldCartState.find(
            item =>
              item.item_id ===
              productData.shippingTotalInfromation.items[i].item_id,
          );

          if (
            oldItem.price !==
            productData.shippingTotalInfromation.items[i].price
          ) {
            if (
              productData.shippingTotalInfromation.items[i].options !==
                undefined &&
              !_.isEmpty(
                JSON.parse(
                  productData.shippingTotalInfromation.items[i].options,
                ),
              )
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
      }
      setPriceArr(temp);
      dispatch(setOldCartState([]));
    }
  }, [productData.shippingTotalInfromation]);

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

  function getTotalInfo() {
    if (GlobalConst.LoginToken.length > 0) {
      dispatch(
        getTotalInformation(
          getIdFromAddress('country_id'),
          getIdFromAddress('region'),
          getIdFromAddress('region_id'),
          getIdFromAddress('postcode'),
          productData.shippingMethodName,
          getAddressShippingWithId(),
          getAddressBillingWithId(),
          productData.shippingMethodName,
          productData.deliveryDateForPurchase,
          productData.deliveryInstructionsForPurchase,
        ),
      );
      // totalInfoArgs.push(getIdFromAddress('country_id'));
      // totalInfoArgs.push(getIdFromAddress('region'));
      // totalInfoArgs.push(getIdFromAddress('region_id'));
      // totalInfoArgs.push(getIdFromAddress('postcode'));
      // totalInfoArgs.push(productData.shippingMethodName);
      // totalInfoArgs.push(getAddressShippingWithId());
      // totalInfoArgs.push(getAddressBillingWithId());
      // totalInfoArgs.push(productData.shippingMethodName);
      // totalInfoArgs.push(productData.deliveryDateForPurchase);
      // totalInfoArgs.push(productData.deliveryInstructionsForPurchase);

      // console.log('Total Info Args..................', totalInfoArgs);
      // if (!_.isEmpty(totalInfoArgs)) {
      //   dispatch(setTotalInfoArgs(totalInfoArgs));
      // }
    }
  }
  return (
    <View>
      {priceArr.length > 0 && (
        <View
          style={{
            backgroundColor: '#fce7a2',
            padding: 10,
            marginVertical: 10,
            borderRadius: 10,
            margin: 20,
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
      {getOrderLists()}

      <View
        style={{
          // height: 100,
          marginLeft: 30,
          marginTop: 20,
          marginRight: 30,
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            color: colors.textColor,
            fontSize: 16,
            // paddingBottom: 10,
            borderBottomWidth: 0.5,
          }}>
          Ship To
        </Text>
        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            color: colors.textColor,
            fontSize: 16,
            // paddingBottom: 10,
            marginTop: 5,
          }}>
          {renderShippingAddress()}
        </Text>
      </View>

      <View
        style={{
          // height: 60,
          marginLeft: 30,
          marginTop: 10,
          marginRight: 30,
        }}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            color: colors.textColor,
            fontSize: 16,
            paddingBottom: 10,
            borderBottomWidth: 0.5,
          }}>
          Shipping Method
        </Text>
        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            color: colors.textColor,
            fontSize: 16,
            paddingBottom: 10,
            marginTop: 5,
          }}>
          {productData.shippingMethodName === 'standardshipping'
            ? 'Standard Shipping'
            : 'Expedited Shipping'}
        </Text>

        {/* <ApplyCoupon
          calledFrom={'checkout'}
          totalInfoArgs={productData.totalInfoArgs}
        /> */}
      </View>

      <View style={{marginLeft: 20}}>
        <View
          style={{
            flexDirection: 'row',
            height: 30,
            marginTop: 20,
            alignItems: 'center',
          }}>
          <CheckBox
            style={{marginRight: 10}}
            disabled={false}
            value={terms}
            onValueChange={newValue => setTerms(!terms)}
          />
          <View style={{width: '80%'}}>
            <TouchableOpacity
              onPress={() => {
                // setTermsRead(true)
                setTermsConditionsRead(true);
                navigation.navigate('Terms');
              }}>
              <Text
                style={{
                  width: '99%',
                  color: colors.blue,
                  fontSize: 16,
                  fontFamily: 'DRLCircular-Book',
                  textDecorationLine: 'underline',
                }}>
                I agree to the Terms and Conditions *
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            marginTop: 10,
            color: colors.textColor,
            fontSize: 14,
            fontFamily: 'DRLCircular-Light',
          }}>
          Reading Terms and Conditions is mandatory before placing order
        </Text>
      </View>
    </View>
  );
};
export default OrderTotalInformation;
