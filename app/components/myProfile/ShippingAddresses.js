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
  Linking,
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
import Toast from 'react-native-simple-toast';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import utils from '../../utilities/utils';
import {
  getCustomerInfo,
  getToken,
  getCustomerInfoAfterAddAddress,
} from '../../services/operations/getToken';
import {setNotificationStatus} from '../../slices/authenticationSlice';
import {LICENSE_BASE_URL} from '../../services/ApiServicePath';
import AsyncStorage from '@react-native-community/async-storage';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const ShippingAddresses = props => {
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const customer = useSelector(state => state.authenticatedUser);
  const loginData = useSelector(state => state.authenticatedUser);
  const profileData = useSelector(state => state.profile);

  // useEffect(() => {
  //   AsyncStorage.getItem('creds').then(creds => {
  //     if (creds !== null) {
  //       GlobalConst.creds = JSON.parse(creds);
  //       dispatch(getToken(JSON.parse(creds)));
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (loginData.notificationStatus !== '') {
      AsyncStorage.getItem('creds').then(creds => {
        if (creds !== null) {
          GlobalConst.creds = JSON.parse(creds);
          dispatch(getToken(JSON.parse(creds)));
        }
      });
      dispatch(setNotificationStatus(''));
    }
  }, [loginData.notificationStatus]);

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GlobalConst.LoginToken,
    };
    dispatch(getCustomerInfoAfterAddAddress(headers));
  }, []);

  function renderAllAddress() {
    return (
      <View style={{flex: 1, margin: 10}}>
        {loginData.customerInfo.addresses.map((item, index) => {
          if (index !== defaultBillingIndex && index !== defaultShippingIndex) {
            return (
              <View>
                {utils.getAttributeFromCustom(item, 'address_status') !==
                  'NA' &&
                loginData.addressLabels.find(
                  element =>
                    element.value ===
                    utils.getAttributeFromCustom(item, 'address_status'),
                ) !== undefined ? (
                  <View
                    style={{
                      borderColor: colors.grey,
                      borderWidth: 1,
                      backgroundColor: colors.white,
                      width: '100%',
                      paddingBottom: 10,
                    }}>
                    <View style={{marginTop: 5, paddingLeft: 20}}>
                      <Text
                        style={{fontFamily: 'DRLCircular-Bold', fontSize: 18}}>
                        {getNameFromAddressGeneral(index)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          fontSize: 16,
                          marginTop: -10,
                        }}>
                        {getAddressGeneral(index)}
                      </Text>

                      <Text
                        style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                        Status :{' '}
                        {
                          loginData.addressLabels.find(
                            element =>
                              element.value ===
                              utils.getAttributeFromCustom(
                                item,
                                'address_status',
                              ),
                          ).label
                        }
                      </Text>

                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '50%'}}>
                          {utils.getAttributeFromCustom(
                            item,
                            'state_license_upload',
                          ) !== 'NA' && (
                            <TouchableOpacity
                              style={{
                                height: 40,
                                width: '90%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderRadius: 20,
                                borderColor: colors.blue,
                              }}
                              onPress={() => {
                                Linking.openURL(
                                  LICENSE_BASE_URL +
                                    utils.getAttributeFromCustom(
                                      item,
                                      'state_license_upload',
                                    ),
                                );
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'DRLCircular-Book',
                                  fontSize: 16,
                                  color: colors.textColor,
                                }}>
                                State License
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        <View style={{width: '50%'}}>
                          {utils.getAttributeFromCustom(
                            item,
                            'dea_license_upload',
                          ) !== 'NA' && (
                            <TouchableOpacity
                              style={{
                                height: 40,
                                width: '90%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderRadius: 20,
                                borderColor: colors.blue,
                              }}
                              onPress={() => {
                                Linking.openURL(
                                  LICENSE_BASE_URL +
                                    utils.getAttributeFromCustom(
                                      item,
                                      'dea_license_upload',
                                    ),
                                );
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'DRLCircular-Book',
                                  fontSize: 16,
                                  color: colors.textColor,
                                }}>
                                DEA License
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}

                <View style={{height: 10}}></View>
              </View>
            );
          } else {
            return <View></View>;
          }
        })}
      </View>
    );
  }

  function renderDefaultAddress() {
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
                  width: 200,
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
              <View style={{marginTop: 5, paddingLeft: 20}}>
                <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 18}}>
                  {getNameFromAddress('billing')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    marginTop: -10,
                  }}>
                  {billAdd}
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
                paddingBottom: 10,
                width: '90%',
              }}>
              <View
                style={{
                  backgroundColor: colors.stepsColor,
                  width: 200,
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
              <View style={{marginTop: 5, paddingLeft: 20}}>
                {/* <Text> */}
                <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 18}}>
                  {getNameFromAddress('shipping')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    marginTop: -10,
                  }}>
                  {shipAdd}
                </Text>

                {/* </Text> */}

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    {utils.getAttributeFromCustom(
                      loginData.customerInfo.addresses[defaultShippingIndex],
                      'state_license_upload',
                    ) !== 'NA' && (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: '90%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderRadius: 20,
                          borderColor: colors.blue,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            LICENSE_BASE_URL +
                              utils.getAttributeFromCustom(
                                loginData.customerInfo.addresses[
                                  defaultShippingIndex
                                ],
                                'state_license_upload',
                              ),
                          );
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            fontSize: 16,
                            color: colors.textColor,
                          }}>
                          State License
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{width: '50%'}}>
                    {utils.getAttributeFromCustom(
                      loginData.customerInfo.addresses[defaultShippingIndex],
                      'dea_license_upload',
                    ) !== 'NA' && (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: '90%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderRadius: 20,
                          borderColor: colors.blue,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            LICENSE_BASE_URL +
                              utils.getAttributeFromCustom(
                                loginData.customerInfo.addresses[
                                  defaultShippingIndex
                                ],
                                'dea_license_upload',
                              ),
                          );
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            fontSize: 16,
                            color: colors.textColor,
                          }}>
                          DEA License
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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

  let defaultBillingIndex = 0;
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
          // if(utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status") !=="NA" && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")) !==undefined
          // && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")).label==="Approved"
          // ){
          defaultBillingIndex = i;

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
        // }
      }
    }
    return address;
  }

  let defaultShippingIndex = 0;
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
          // if(utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status") !=="NA" && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")) !==undefined
          // && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")).label==="Approved"
          // ){
          defaultShippingIndex = i;

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
          // }
        }
      }
    }
    return address;
  }

  let additionalEntriesFlag = -1;
  function getAdditionalAddresses() {
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (i !== defaultBillingIndex && i !== defaultShippingIndex) {
          additionalEntriesFlag = 1;
        }
      }
    }
  }

  function getAddressGeneral(i) {
    let address = '';
    if (loginData.customerInfo !== undefined) {
      // for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){
      // if(loginData.customerInfo.addresses[i].default_shipping===false && loginData.customerInfo.addresses[i].default_billing===false){
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
          address + loginData.customerInfo.addresses[i].region.region + ' ';
      }
      if (loginData.customerInfo.addresses[i].postcode !== undefined) {
        address = address + loginData.customerInfo.addresses[i].postcode + '\n';
        address = address + 'United States' + '\n';
      }
      if (loginData.customerInfo.addresses[i].telephone !== undefined) {
        address =
          address + loginData.customerInfo.addresses[i].telephone + '\n';
      }
      //   }
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
    if (
      loginData.customerInfo !== undefined &&
      !_.isEmpty(loginData.customerInfo)
    ) {
      renderDefaultAddress();
      renderAllAddress();
    }
  }, [loginData.customerInfo]);

  // useEffect(() => {
  //   if (profileData.isLoading && !loader) {
  //     setLoader(true);
  //   }
  //   if (!profileData.isLoading && loader) {
  //     setLoader(false);
  //   }
  // }, [profileData.isLoading]);

  return (
    <View style={{backgroundColor: '#F6FBFF'}}>
      {/* <LoaderCustome loader={loader}/> */}

      {renderDefaultAddress()}
      <View style={{flexDirection: 'row', marginLeft: 10}}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            color: colors.textColor,
            fontSize: 16,
            marginVertical: 10,
          }}>
          Need Modification?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ServiceRequest');
          }}>
          <Text
            style={{
              fontFamily: 'DRLCircular-Bold',
              color: colors.blue,
              fontSize: 16,
              marginVertical: 10,
            }}>
            Click Here
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
          marginBottom: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate("AddAddress",{isShipping:false,isBilling:false,isNew:true})
            navigation.navigate('AddAddress');
          }}
          style={[
            profStyles.addButton,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Text style={profStyles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontFamily: 'DRLCircular-Light',
          marginHorizontal: 10,
          marginBottom: 20,
        }}>
        Adding an additional Shipping address may take up to 72 hours.
      </Text>

      {getAdditionalAddresses()}

      {additionalEntriesFlag != -1 && (
        <View style={{marginLeft: 10, marginRight: 10}}>
          <Text
            style={{
              fontFamily: 'DRLCircular-Bold',
              fontSize: 18,
              marginLeft: 10,
              color: colors.textColor,
            }}>
            Additional Addresses Entries
          </Text>
          {renderAllAddress()}
        </View>
      )}
    </View>
  );
};

//const errorHandledComponent = withErrorHandler(ShippingAddresses);

export default ShippingAddresses;
