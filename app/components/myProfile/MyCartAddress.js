import React, {useEffect, useState} from 'react';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import withLoader from '../../utilities/hocs/LoaderHOC';
import styles from '../home/home_style';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import profStyles from './MyProfile_style';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {deleteAddressByAdminToken} from '../../services/operations/profileApis';
import {getCustomerInfoAfterAddAddress} from '../../services/operations/getToken';
import {setShippingAddressId} from '../../slices/authenticationSlice';
import Toast from 'react-native-simple-toast';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import utils from '../../utilities/utils';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const MyCartAddress = (props) => {
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const customer = useSelector((state) => state.authenticatedUser);
  const loginData = useSelector((state) => state.authenticatedUser);
  const profileData = useSelector((state) => state.profile);

  function setShippingIdDefault() {
    let finalAddress = {};
    let address = {};
    //dispatch(setShippingAddressId(''));
    if (
      customer.customerInfo !== undefined &&
      customer.customerInfo.addresses !== undefined
    ) {
      for (
        let i = 0;
        customer.customerInfo.addresses !== undefined &&
        i < customer.customerInfo.addresses.length;
        i++
      ) {
        if (
          customer.customerInfo.addresses[i].default_shipping &&
          utils.getAttributeFromCustom(
            customer.customerInfo.addresses[i],
            'address_status',
          ) !== 'NA' &&
          customer.addressLabels.find(
            (element) =>
              element.value ===
              utils.getAttributeFromCustom(
                customer.customerInfo.addresses[i],
                'address_status',
              ),
          ) !== undefined &&
          customer.addressLabels.find(
            (element) =>
              element.value ===
              utils.getAttributeFromCustom(
                customer.customerInfo.addresses[i],
                'address_status',
              ),
          ).label === 'Approved'
        ) {
          dispatch(setShippingAddressId(customer.customerInfo.addresses[i].id));
        }
      }
    }
  }

  function renderAllAddress() {
    return (
      <View style={{flex: 1, margin: 10}}>
        {loginData.customerInfo.addresses.map((item, index) => (
          <View>
            {utils.getAttributeFromCustom(item, 'address_status') !== 'NA' &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(item, 'address_status'),
            ) !== undefined &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(item, 'address_status'),
            ).label === 'Approved' &&
            (!item.default_billing ||
              (item.default_billing && item.default_shipping)) ? (
              <View
                style={{
                  borderColor: colors.grey,
                  borderWidth: 1,
                  backgroundColor: colors.white,
                  width: '100%',
                }}>
               
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    paddingLeft: 20,
                    width: '90%',
                  }}>
                  {/* <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize:18}}>{getNameFromAddressGeneral(index)}</Text> */}
                  <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                    {getAddressGeneral(index)}
                  </Text>
                
                </View>
                {item.id === loginData.shippingAddressId && (
                  <Image
                    style={{position: 'absolute', right: 0, top: 0}}
                    resizeMode="contain"
                    source={require('../../images/tick_large.png')}
                  />
                )}

              {item.id === loginData.shippingAddressId && (
                <TouchableOpacity
                style={{
                  width: 250,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.green,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                }}
                onPress={() => {
                  console.log('item.id' + item.id)
                  // dispatch(setShippingAddressId(item.id));
                }}>
                <Text style={{ color: colors.white }}>This is Your Default Address set</Text>
              </TouchableOpacity>

                // <TouchableOpacity
                //   style={{
                //     width: 100,
                //     height: 30,
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     backgroundColor: colors.lightBlue,
                //     position: 'absolute',
                //     right: 0,
                //     bottom: 0,
                //   }}
                //   onPress={() => {
                //     console.log('item.id'+item.id)
                //     dispatch(setShippingAddressId(item.id));
                //   }}>
                //   <Text style={{color: colors.white}}>This is Your Default Address set</Text>
                // </TouchableOpacity>  
                )
              }

              </View>
            ) : null}

            <View style={{height: 10}}></View>
          </View>
        ))}
      </View>
    );
  }

  function renderDefaultAddress() {
    if (_.isEmpty(loginData.customerInfo)) {
      return;
    }
    let billAdd = getAddressBilling();
    let shipAdd = getAddressShippingg();
    if (billAdd.length === 0 && shipAdd.length === 0) {
      return null;
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', margin: 10}}>
          {billAdd.length > 0 && (
            <View
              style={{
                borderColor: colors.grey,
                borderWidth: 1,
                backgroundColor: colors.white,
                width: '90%',
              }}>
              <View
                style={{
                  backgroundColor: colors.stepsColor,
                  width: 190,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 14,
                    color: colors.white,
                  }}>
                  Default Billing Address
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', marginTop: 5, paddingLeft: 20}}>
                <Text>
                  {/* <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize:18}}>{getNameFromAddress("billing")}</Text> */}
                  <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                    {billAdd}
                  </Text>
                </Text>
              </View>
            </View>
          )}

          <View style={{height: 10}}></View>

          {shipAdd.length > 0 && (
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.grey,
                backgroundColor: colors.white,
                width: '90%',
              }}>
              <View
                style={{
                  backgroundColor: colors.stepsColor,
                  width: 190,
                  borderWidth: 1,
                  borderColor: colors.lightGrey,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 14,
                    color: colors.white,
                  }}>
                  Default Shipping Address
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', marginTop: 5, paddingLeft: 20}}>
                <Text>
                  {/* <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize:18}}>{getNameFromAddress("shipping")}</Text> */}
                  <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                    {shipAdd}
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }
  }

  function getNameFromAddress(status) {
    let name = '';
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (status === 'billing') {
          if (loginData.customerInfo.addresses[i].default_billing) {
            name =
              loginData.customerInfo.addresses[i].firstname +
              ' ' +
              loginData.customerInfo.addresses[i].lastname +
              '\n';
          }
        } else if (status === 'shipping') {
          if (loginData.customerInfo.addresses[i].default_shipping) {
            name =
              loginData.customerInfo.addresses[i].firstname +
              ' ' +
              loginData.customerInfo.addresses[i].lastname +
              '\n';
          }
        }
      }
    }
    return name;
  }

  function getNameFromAddressGeneral(i) {
    let name = '';
    if (loginData.customerInfo !== undefined) {
      // for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){

      name =
        loginData.customerInfo.addresses[i].firstname +
        ' ' +
        loginData.customerInfo.addresses[i].lastname +
        '\n';

      // }
    }
    return name;
  }

  function getAddressBilling() {
    let address = '';
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (loginData.customerInfo.addresses[i].default_billing) {
          if (
            utils.getAttributeFromCustom(
              loginData.customerInfo.addresses[i],
              'address_status',
            ) !== 'NA' &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ) !== undefined &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ).label === 'Approved'
          ) {
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
              address =
                address + loginData.customerInfo.addresses[i].city + ' ';
            }
            if (
              loginData.customerInfo.addresses[i].region !== undefined &&
              loginData.customerInfo.addresses[i].region.region !== undefined
            ) {
              address =
                address +
                loginData.customerInfo.addresses[i].region.region +
                ' ';
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
        }
      }
    }
    return address;
  }

  function getAddressShippingg() {
    let address = '';
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (loginData.customerInfo.addresses[i].default_shipping) {
          if (
            utils.getAttributeFromCustom(
              loginData.customerInfo.addresses[i],
              'address_status',
            ) !== 'NA' &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ) !== undefined &&
            loginData.addressLabels.find(
              (element) =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ).label === 'Approved'
          ) {
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
              address =
                address + loginData.customerInfo.addresses[i].city + ' ';
            }
            if (
              loginData.customerInfo.addresses[i].region !== undefined &&
              loginData.customerInfo.addresses[i].region.region !== undefined
            ) {
              address =
                address +
                loginData.customerInfo.addresses[i].region.region +
                ' ';
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
        }
      }
    }
    return address;
  }

  function getAddressGeneral(i) {
    let address = '';
    if (loginData.customerInfo !== undefined) {
      // for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){
      // if(!loginData.customerInfo.addresses[i].default_billing){
      // address= loginData.customerInfo.addresses[i].firstname+ ' '+loginData.customerInfo.addresses[i].lastname+"\n"
      if (
        loginData.customerInfo.addresses[i].company !== undefined &&
        loginData.customerInfo.addresses[i].company.length > 0
      ) {
        address = address + loginData.customerInfo.addresses[i].company + '\n';
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
          address + loginData.customerInfo.addresses[i].region.region + '\n';
      }
      if (loginData.customerInfo.addresses[i].postcode !== undefined) {
        address = address + loginData.customerInfo.addresses[i].postcode + '\n';
        address = address + 'United States' + '\n';
      }
      if (loginData.customerInfo.addresses[i].telephone !== undefined) {
        address =
          address + loginData.customerInfo.addresses[i].telephone + '\n';
      }
      //     }
      // }
    }
    return address;
  }

  function getAddressIDShipping() {
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (loginData.customerInfo.addresses[i].default_shipping) {
          if (loginData.customerInfo.addresses[i].id !== undefined) {
            return loginData.customerInfo.addresses[i].id;
          }
        }
      }
    }
  }

  function getAddressIDBilling() {
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (loginData.customerInfo.addresses[i].default_billing) {
          if (loginData.customerInfo.addresses[i].id !== undefined) {
            return loginData.customerInfo.addresses[i].id;
          }
        }
      }
    }
  }

  useEffect(() => {
    console.log('Cart address mounted.........');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GlobalConst.LoginToken,
    };
    dispatch(getCustomerInfoAfterAddAddress(headers));
  }, []);

  useEffect(() => {
    if (
      loginData.customerInfo !== undefined &&
      !_.isEmpty(loginData.customerInfo)
    ) {
      console.log('Check............');
      setShippingIdDefault();
      renderDefaultAddress();
      renderAllAddress();
    }
  }, [loginData.customerInfo]);

  useEffect(() => {
    if (profileData.isLoading && !loader) {
      setLoader(true);
    }
    if (!profileData.isLoading && loader) {
      setLoader(false);
    }
  }, [profileData.isLoading]);

  return (
    <View style={{backgroundColor: '#F6FBFF'}}>
      {/* <LoaderCustome loader={loader}/> */}

      <View style={{padding: 5}}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 18,
            color: colors.textColor,
          }}>
          Select Delivery Address and Delivery Type
        </Text>

        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 14,
            color: colors.textColor,
          }}>
          Note : Shipping only within the contiguous United States
        </Text>
      </View>

      {!_.isEmpty(loginData.customerInfo) && renderDefaultAddress()}

      <View style={{marginLeft: 0, marginTop: 20}}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 18,
            color: colors.textColor,
          }}>
          All Approved Addresses
        </Text>
        {renderAllAddress()}
      </View>
    </View>
  );
};

// const errorHandledComponent = withErrorHandler(MyCartAddress);

export default MyCartAddress;
