import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, Linking} from 'react-native';
import {Avatar, Title} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import colors from '../../config/Colors';
import {TouchableOpacity, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {resetAllInfo} from '../../services/operations/manageLogOut';
import styles2 from '../product/productStyles';
import CustomeHeader from '../../config/CustomeHeader';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  setFilters,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setProductName,
} from '../../slices/productSlices';
import {setShippingAddressId} from '../../slices/authenticationSlice';
import {
  setOrderId,
  setIndicatorSteps,
  refreshCartForPurchase,
} from '../../slices/productSlices';
import Toast from 'react-native-simple-toast';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';
import _ from 'lodash';
import crashlytics from '@react-native-firebase/crashlytics';
// import analytics from '@react-native-firebase/analytics';

export function MoreComponent({props}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isExpended, setExpaned] = useState(true);
  const [cartCount, setCartCount] = useState('');
  const productData = useSelector(state => state.product);

  // const [enabled, setEnabled] = useState(crashlytics().isCrashlyticsCollectionEnabled);

  const logAnalyticsEvent = async () => {
    console.log('Inside logEvent......');
    try {
      await analytics().logEvent('test_event', {
        description: 'Another test event log',
      });
    } catch (e) {
      console.log('Error..........', e);
    }
  };

  const setShopByCategory = () => {
    if (isExpended) {
      setExpaned(false);
    } else {
      setExpaned(true);
    }
  };
  const customer = useSelector(state => state.authenticatedUser);

  async function toggleCrashlytics() {
    await crashlytics()
      .setCrashlyticsCollectionEnabled(true)
      .then(() => {
        // setEnabled(crashlytics().isCrashlyticsCollectionEnabled)
      });
  }

  useEffect(() => {
    if (crashlytics().isCrashlyticsCollectionEnabled === false) {
      toggleCrashlytics();
    }
  }, []);

  function setShippingIdDefault() {
    let finalAddress = {};
    let address = {};
    dispatch(setShippingAddressId(''));
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
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                customer.customerInfo.addresses[i],
                'address_status',
              ),
          ) !== undefined &&
          customer.addressLabels.find(
            element =>
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

  return (
    <View
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#F6FBFF'}}>
      <CustomeHeader
        back={undefined}
        title={'More'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />
      <ScrollView>
        <View style={{flex: 1, backgroundColor: '#F6FBFF'}}>
          <View style={styles.drawerContent}>
            {!_.isEmpty(customer.customerInfo) && (
              <TouchableOpacity
                onPress={() => {
                  if (GlobalConst.customerStatus === 'Approved') {
                    navigation.navigate('MyProfile');
                    // toggleCrashlytics ()
                  } else {
                    Toast.show(
                      'Please complete Profile / Wait for approval',
                      Toast.SHORT,
                    );
                  }
                }}
                style={{marginHorizontal: 20}}>
                <View style={styles.viewHeader}>
                  <View style={styles.userInfoSection}>
                    <Avatar.Image
                      source={require('../../images/user.png')}
                      size={60}
                    />
                    <View
                      style={{
                        marginLeft: 10,

                        width: '68%',
                      }}>
                      <Title style={styles.title}>
                        {customer.customerInfo.firstname}{' '}
                        {customer.customerInfo.lastname}
                      </Title>
                      <Text style={[styles.caption, {width: '100%'}]}>
                        {customer.customerInfo.email}
                      </Text>
                      {utils.getAttributeFromCustom(
                        customer.customerInfo,
                        'organization_name',
                      ) !== 'NA' && (
                        <Text style={[styles.caption, {width: '70%'}]}>
                          {utils.getAttributeFromCustom(
                            customer.customerInfo,
                            'organization_name',
                          )}
                        </Text>
                      )}
                      {/* <Text style={[styles.caption,{marginTop:5}]}>View My Account</Text> */}
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        height: '100%',
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../images/forward_small.png')}></Image>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            <View
              style={{
                backgroundColor: colors.white,
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 10,
                borderWidth: 0.1,
                borderRadius: 5,
                borderBottomWidth: 0.3,
                padding: 10,
                borderColor: colors.grey,
              }}>
              {!_.isEmpty(customer.customerInfo) && (
                <TouchableHighlight
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      //navigation.navigate('Dashboard')
                      navigation.navigate('MyOrder');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      Dashboard
                    </Text>
                  </View>
                </TouchableHighlight>
              )}

              <View
                style={
                  isExpended
                    ? {
                        backgroundColor: colors.shopCategoryBackground,
                        borderRadius: 5,
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 5,
                      }
                    : {}
                }>
                <TouchableOpacity
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}
                  activeOpacity={0.9}
                  //  onPress= {
                  //  //  setShopByCategory

                  //    //crashlytics().crash()
                  //   }
                >
                  <View style={styles.button}>
                    <View
                      style={{
                        position: 'absolute',
                        height: '100%',
                        right: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* <Image source={isExpended? require('../../images/top_small.png'): require('../../images/bottom_small.png') }> */}
                      <Image
                        source={require('../../images/bottom_small.png')}></Image>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      Shop by Category
                    </Text>
                  </View>
                </TouchableOpacity>
                <Collapsible collapsed={!isExpended}>
                  <View style={isExpended ? {} : {height: 0}}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Medication');
                      }}
                      style={{
                        borderRadius: 5,
                        marginLeft: 15,
                        marginRight: 5,
                      }}>
                      <View style={styles.shopCategory}>
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            color: colors.darkGrey,
                            fontSize: 16,
                          }}>
                          Dosage Form
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            height: '100%',
                            right: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              isExpended
                                ? require('../../images/forward_grey_small.png')
                                : require('../../images/forward_small.png')
                            }></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // navigation.navigate('Theraputic')
                        dispatch(getProductsSuccess([]));
                        dispatch(setConfigurableProducts([]));
                        dispatch(setConfigurableProductDetail([]));
                        dispatch(getProductDetailSuccess({}));

                        dispatch(setCategoryApplied(false));
                        dispatch(setDosageApplied([]));
                        dispatch(setTherapeutic([]));
                        dispatch(setFilters([]));
                        dispatch(setProductName(undefined));
                        navigation.navigate('AllProductsNDC');
                      }}
                      style={{
                        borderRadius: 5,
                        marginLeft: 15,
                        marginRight: 5,
                      }}>
                      <View style={styles.shopCategory}>
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            color: colors.darkGrey,
                            fontSize: 16,
                          }}>
                          By NDC
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            height: '100%',
                            right: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              isExpended
                                ? require('../../images/forward_grey_small.png')
                                : require('../../images/forward_small.png')
                            }></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // navigation.navigate('Theraputic')
                        dispatch(getProductsSuccess([]));
                        dispatch(setConfigurableProducts([]));
                        dispatch(setConfigurableProductDetail([]));
                        dispatch(getProductDetailSuccess({}));

                        dispatch(setCategoryApplied(false));
                        dispatch(setDosageApplied([]));
                        dispatch(setTherapeutic([]));
                        dispatch(setFilters([]));
                        dispatch(setProductName(undefined));
                        navigation.navigate('AllProductsName');
                      }}
                      style={{
                        borderRadius: 5,
                        marginLeft: 15,
                        marginRight: 5,
                      }}>
                      <View style={styles.shopCategory}>
                        <Text
                          style={{
                            fontFamily: 'DRLCircular-Book',
                            color: colors.darkGrey,
                            fontSize: 16,
                          }}>
                          By Product
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            height: '100%',
                            right: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              isExpended
                                ? require('../../images/forward_grey_small.png')
                                : require('../../images/forward_small.png')
                            }></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Collapsible>
              </View>

              <TouchableHighlight
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
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Our Products
                  </Text>
                </View>
              </TouchableHighlight>
              {/* </Drawer.Section> */}
            </View>

            {!_.isEmpty(customer.customerInfo) && (
              <View
                style={{
                  backgroundColor: colors.white,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 10,
                  borderWidth: 0.1,
                  borderRadius: 5,
                  borderBottomWidth: 0.3,
                  padding: 10,
                  borderColor: colors.grey,
                }}>
                {/* <Drawer.Section > */}
                <TouchableHighlight
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      navigation.navigate('MyOrder');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      My Orders
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      dispatch(setOrderId(''));
                      dispatch(setIndicatorSteps(0));
                      setShippingIdDefault();
                      dispatch(refreshCartForPurchase());
                      navigation.navigate('MyCart');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      My Cart
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      navigation.navigate('WishList');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      My Wishlist
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      navigation.navigate('ShippingAddresses');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                  underlayColor={colors.grey}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        color: colors.textColor,
                        fontSize: 16,
                      }}>
                      Address Book
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}

            <View
              style={{
                backgroundColor: colors.white,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 5,
                borderWidth: 0.1,
                borderRadius: 5,
                borderBottomWidth: 0.3,
                padding: 10,
                borderColor: colors.grey,
              }}>
              {/* <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{fontFamily:'DRLCircular-Book',color:colors.textColor, fontSize:16}}>News & Media</Text>
             </View>
           </TouchableHighlight> */}

              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Resources');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Resources
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Contact Us
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Settings');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Settings
                  </Text>
                </View>
              </TouchableHighlight>

              {/* <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Subscription');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Promotional Subscription
                  </Text>
                </View>
              </TouchableHighlight> */}

              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('PrivacyMore');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Privacy Policy
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {
                  // navigation.navigate('Terms');
                  navigation.navigate('TermsGeneral');
                  //Linking.openURL('https://www.drreddys.com/terms-of-use/');
                }}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    EULA
                  </Text>
                </View>
              </TouchableHighlight>

              {/* <TouchableHighlight
                onPress={() => logAnalyticsEvent()}
                style={{borderRadius: 5, marginLeft: 15, marginRight: 5}}
                underlayColor={colors.grey}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 16,
                    }}>
                    Log Analytics event (dev feature)
                  </Text>
                </View>
              </TouchableHighlight> */}

              {/* </Drawer.Section> */}
            </View>
          </View>

          {!_.isEmpty(customer.customerInfo) && (
            <TouchableOpacity
              onPress={() => {
                dispatch(resetAllInfo());
                navigation.replace('Login');
              }}
              style={[
                styles2.buttonUnselected,
                {
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 50,
                  backgroundColor: '#F6FBFF',
                },
              ]}>
              <Text style={styles2.blackTextMedium}>Log Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    height: 35,
    justifyContent: 'center',
  },
  shopCategory: {
    marginLeft: 30,
    height: 35,
    justifyContent: 'center',
  },
  viewHeader: {
    padding: 10,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontFamily: 'DRLCircular-Bold',
  },
  caption: {
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    margin: 0,
    padding: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default MoreComponent;
