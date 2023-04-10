import React, {useState, useEffect, useRef} from 'react';
import {Button, Card} from 'native-base';
import {
  StatusBar,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import styles from '../home/home_style';
import styles2 from '../product/productStyles';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import StepIndicator from 'react-native-step-indicator';
import {resetAllInfo} from '../../services/operations/manageLogOut';
import {useNavigation} from '@react-navigation/native';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import utils from '../../utilities/utils';
import {
  refreshCartForPurchase,
  setOrderId,
  setIndicatorSteps,
} from '../../slices/productSlices';
import AsyncStorage from '@react-native-community/async-storage';
import {getCustomerInfo, getToken} from '../../services/operations/getToken';
import {
  setNotificationStatus,
  setShippingAddressId,
} from '../../slices/authenticationSlice';

import MyProfileInfo from './MyProfileInfo';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';
import CheckBox from '@react-native-community/checkbox';
import {updateSubscription} from '../../services/operations/profileApis';
import {setIsUpdated} from '../../slices/profileSlices';

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.stepsColor,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.stepsColor,
  stepStrokeUnFinishedColor: colors.transparent,
  separatorFinishedColor: colors.stepsColor,
  separatorUnFinishedColor: colors.lightGrey,
  stepIndicatorFinishedColor: colors.stepsColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: colors.stepsColor,
  labelSize: 13,
};

//  const labels = ["General Info","Company Info","Business Identification","Trade Info", "Bank Details"];

const labels = [
  'General Info',
  'Company Info',
  'Business Identification',
  'Promotional Subscription',
];

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;
let email = '';

const MyProfile = props => {
  const navigation = useNavigation();

  const customer = useSelector(state => state.authenticatedUser);
  const [loader, setLoader] = useState(false);

  const [showProfile, setShowProfile] = useState(true);
  const [isApplicationPending, setIsApplicationPending] = useState(false);
  const [isApprovalPending, setIsApprovalPending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);

  //

  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);
  const profileData = useSelector(state => state.profile);

  //

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;

  useEffect(() => {
    if (!_.isEmpty(loginData.customerInfo)) {
      if (
        loginData.customerInfo.email !== undefined &&
        loginData.customerInfo.email.length > 0
      ) {
        email = loginData.customerInfo.email;
        console.log('Email....................', email);
      }
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(loginData.customerInfo)) {
      if (
        loginData.customerInfo.extension_attributes !== undefined &&
        loginData.customerInfo.extension_attributes.is_subscribed !== undefined
      ) {
        console.log('Check.....Here................');
        setIsSubscribed(
          loginData.customerInfo.extension_attributes.is_subscribed,
        );
      }
    }
  }, [loginData.customerInfo]);

  useEffect(() => {
    if (profileData.isUpdated) {
      Toast.show('Preferences saved', Toast.LONG);
      dispatch(setIsUpdated(false));
    }
  }, [profileData.isUpdated]);

  // useEffect(() => {
  //   if (loginData.notificationStatus !== '') {
  //     AsyncStorage.getItem('creds').then(creds => {
  //       if (creds !== null) {
  //         GlobalConst.creds = JSON.parse(creds);
  //         dispatch(getToken(JSON.parse(creds)));
  //       }
  //     });
  //     dispatch(setNotificationStatus(''));
  //   }
  // }, [loginData.notificationStatus]);

  function setShippingIdDefault() {
    let finalAddress = {};
    let address = {};
    dispatch(setShippingAddressId(''));
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

  const renderStepIndicatorSteps = params => {
    return (
      <Image
        source={
          params.stepStatus === 'current'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'finished'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'unfinished'
            ? require('../../images/unselected_large.png')
            : null
        }
      />
    );
  };

  const renderCustomeLabel = params => {
    return params.position === 0 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        General Info
      </Text>
    ) : params.position === 1 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Company Info
      </Text>
    ) : params.position === 2 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Business Identification
      </Text>
    ) : (
      <View></View>
    );
    //  :
    //  params.position === 3?
    //  <Text style={params.stepStatus === 'finished' ? {marginLeft:20, width: 400, fontFamily: 'DRLCircular-Book', color: colors.stepsColor, textAlign: 'left', width: 400, } : { width: 400, marginLeft:20, fontFamily: 'DRLCircular-Book', marginLeft:20, textAlign: 'left', } }>Trade Info</Text>
    //  :
    //  <Text style={params.stepStatus === 'finished' ? {marginLeft:20, width: 400, fontFamily: 'DRLCircular-Book', color: colors.stepsColor, textAlign: 'left', width: 400, } : { width: 400, marginLeft:20, fontFamily: 'DRLCircular-Book', marginLeft:20, textAlign: 'left', } }>Bank Details</Text>
    //  )
  };

  //..........................................................
  let promoDrawerRef = useRef(null);
  const [terms, setTermAndConditions] = useState(false);

  function acceptView() {
    return (
      <Modal
        style={{height: '30%'}}
        position={'bottom'}
        ref={c => (promoDrawerRef = c)}
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
              if (promoDrawerRef !== undefined && promoDrawerRef !== null) {
                promoDrawerRef.close();
              }
            }}
            style={{position: 'absolute', right: 10, top: 5}}>
            <Image
              style={{width: 10, resizeMode: 'contain'}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              //height: 30,
              marginTop: 10,
              alignItems: 'center',
              marginBottom: 10,
              width: '90%',
            }}>
            <CheckBox
              style={{marginRight: 10}}
              disabled={false}
              value={isSubscribed}
              onValueChange={newValue => setIsSubscribed(!isSubscribed)}
            />

            <Text
              style={{
                lineHeight: 18,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
              }}>
              Subscribe to promotional emails
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              //height: 30,
              marginTop: 10,
              alignItems: 'center',
              marginBottom: 10,
              width: '90%',
            }}>
              
            <CheckBox
              style={{marginRight: 10}}
              disabled={false}
              value={!isSubscribed}
              onValueChange={newValue => setIsSubscribed(!isSubscribed)}
            />

            <Text
              style={{
                lineHeight: 18,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
              }}>
              Unsubscribe from promotional emails
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('IsSubscribed...................', isSubscribed);

              //API call

              if (
                isSubscribed ===
                loginData.customerInfo.extension_attributes.is_subscribed
              ) {
                // Do nothing
              } else {
                dispatch(updateSubscription(isSubscribed, email));
              }

              if (promoDrawerRef !== undefined && promoDrawerRef !== null) {
                promoDrawerRef.close();
              }
              
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 15,
              marginTop: 10,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 15,
            }}>
            <Text
              style={[styles.buttonText, {color: colors.white, fontSize: 16}]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  //..............................................................

  return (
    <ViewWithSpinner style={styles.container}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'My Profile'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />
        {!showProfile && !showInfo && (
          <ScrollView style={{backgroundColor: '#F6FBFF'}}>
            <View style={{width: '100%', height: 250}}>
              <View style={{height: 150, paddingTop: 30}}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    marginLeft: 21,
                    marginRight: 21,
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_791.png')}
                      style={{height: 70, width: 70}}></Image>
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Bold',
                        color: '#4F4F4F',
                        fontSize: 18,
                      }}>
                      {customer.customerInfo.firstname}{' '}
                      {customer.customerInfo.lastname}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        color: '#4F4F4F',
                        fontSize: 14,
                        lineHeight: 21,
                      }}>
                      Company Name{'\n'}
                      {customer.customerInfo.email}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 25, marginLeft: 21, marginRight: 21}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Light',
                      color: '#4F4F4F',
                      fontSize: 16,
                      lineHeight: 24,
                    }}>
                    <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                      Complete your profile{' '}
                    </Text>
                    Hub To access our 10,000+ Branded & Generic medicines
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
                marginLeft: 21,
                marginRight: 21,
              }}>
              <View
                style={{flex: 1, height: 250, marginLeft: 20, marginTop: 5}}>
                <StepIndicator
                  customStyles={customStyles}
                  currentPosition={2}
                  stepCount={5}
                  direction={'vertical'}
                  labels={labels}
                  renderStepIndicator={renderStepIndicatorSteps}
                  renderLabel={renderCustomeLabel}
                />
              </View>

              <Button
                full
                style={styles.button}
                onPress={() => setShowInfo(true)}>
                <Text uppercase={false} style={styles.buttonText}>
                  Complete Profile
                </Text>
              </Button>
            </View>
            <Text
              style={{
                marginTop: 30,
                marginLeft: 21,
                fontFamily: 'DRL Circular',
                color: '#4F4F4F',
                fontSize: 16,
              }}>
              Looking for help?
            </Text>
            <View
              style={{
                backgroundColor: colors.white,
                width: '100%',
                flexDirection: 'row',
                padding: 17,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 4,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../images/mail.png')}
                  style={{height: 26, width: 26, marginRight: 7}}
                />
                <Text
                  style={{
                    color: '#5225B5',
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 12,
                  }}>
                  xxxxx1234@drreddy.com
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 30,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../images/call.png')}
                  style={{height: 26, width: 26, marginRight: 7}}
                />
                <Text
                  style={{
                    color: '#5225B5',
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 12,
                  }}>
                  1.866.207.3333
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {showProfile && (isApplicationPending || isApprovalPending) && (
          <ScrollView style={{backgroundColor: '#F6FBFF'}}>
            <View style={{width: '100%', paddingTop: 30}}>
              <View
                style={{
                  backgroundColor: '#E6F4FF',
                  marginLeft: 21,
                  marginRight: 21,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 25,
                    alignItems: 'center',
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_791.png')}
                      style={{height: 70, width: 70}}></Image>
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Bold',
                        color: '#4F4F4F',
                        fontSize: 18,
                      }}>
                      {customer.customerInfo.firstname}{' '}
                      {customer.customerInfo.lastname}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        color: '#4F4F4F',
                        fontSize: 14,
                      }}>
                      {customer.customerInfo.email}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 23,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../images/mail.png')}
                    style={{height: 26, width: 26, marginRight: 7}}
                  />
                  <Text
                    style={{
                      color: '#5225B5',
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 12,
                    }}>
                    {customer.customerInfo.email}
                  </Text>
                </View>

                {isApprovalPending && !isApplicationPending && (
                  <View
                    style={{
                      alignItems: 'center',
                      borderStyle: 'dashed',
                      borderColor: '#80707070',
                      borderBottomWidth: 2,
                      borderTopWidth: 2,
                      marginTop: 27,
                      paddingTop: 30,
                      paddingBottom: 22,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(255,80,70,0.2)',
                        width: 258,
                        height: 38,
                        borderRadius: 19,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#FF5046'}}>Approval Pending</Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        color: '#434861',
                        fontSize: 12,
                        marginTop: 15,
                        width: 258,
                      }}>
                      Do the changes indicated in red and submit the form again
                    </Text>
                  </View>
                )}

                {!isApprovalPending && isApplicationPending && (
                  <View
                    style={{
                      alignItems: 'center',
                      borderStyle: 'dashed',
                      borderColor: '#80707070',
                      borderBottomWidth: 2,
                      borderTopWidth: 2,
                      marginTop: 27,
                      paddingTop: 30,
                      paddingBottom: 22,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(255,80,70,0.2)',
                        width: 258,
                        height: 38,
                        borderRadius: 19,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#FF5046'}}>
                        Application Pending
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        color: '#434861',
                        fontSize: 12,
                        marginTop: 15,
                        width: 258,
                      }}>
                      Do the changes indicated in red and submit the form again
                    </Text>
                  </View>
                )}

                <SafeAreaView>
                  <FlatList
                    contentContainerStyle={{
                      marginLeft: 30,
                      marginTop: 20,
                      marginBottom: 30,
                    }}
                    data={labels}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (item === 'General Info') {
                              navigation.navigate('AccountInfo');
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 17,
                            paddingTop: 14,
                            borderBottomColor: 'rgba(67, 72, 97,0.2)',
                            borderStyle: 'dashed',
                            borderBottomWidth: 1,
                          }}>
                          <Text
                            style={{
                              color: '#434861',
                              fontFamily: 'DRLCircular-Book',
                              fontSize: 14,
                            }}>
                            {item}
                          </Text>
                          <Image
                            source={require('../../images/Group_673.png')}
                            style={{height: 12, width: 12}}></Image>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </SafeAreaView>
              </View>
              <Text
                style={{
                  marginTop: 30,
                  marginLeft: 21,
                  fontFamily: 'DRL Circular',
                  color: '#4F4F4F',
                  fontSize: 16,
                }}>
                Looking for help?
              </Text>
              <View
                style={{
                  backgroundColor: colors.white,
                  width: '100%',
                  flexDirection: 'row',
                  padding: 17,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 4,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../images/mail.png')}
                    style={{height: 26, width: 26, marginRight: 7}}
                  />
                  <Text
                    style={{
                      color: '#5225B5',
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 12,
                    }}>
                    xxxxx1234@drreddy.com
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 30,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../images/call.png')}
                    style={{height: 26, width: 26, marginRight: 7}}
                  />
                  <Text
                    style={{
                      color: '#5225B5',
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 12,
                    }}>
                    1.866.207.3333
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {showProfile && !isApplicationPending && !isApprovalPending && (
          <ScrollView style={{backgroundColor: '#F6FBFF'}}>
            {/* <LoaderCustome loader={loader}/> */}
            <View style={{width: '100%', paddingVertical: 30}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  marginLeft: 21,
                  alignItems: 'center',
                }}>
                <View>
                  <Image
                    source={require('../../images/Group_791.png')}
                    style={{height: 70, width: 70}}></Image>
                </View>
                <View style={{marginLeft: 20, width: '55%'}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      color: '#4F4F4F',
                      fontSize: 18,
                    }}>
                    {customer.customerInfo.firstname}{' '}
                    {customer.customerInfo.lastname}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Light',
                      color: '#4F4F4F',
                      fontSize: 16,
                      lineHeight: 21,
                    }}>
                    {customer.customerInfo.email}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: colors.white,
                  marginLeft: 21,
                  marginRight: 21,
                  marginTop: 30,
                  marginBottom: 21,
                  shadowColor: '#0000000D',
                  shadowOffset: {width: 0, height: 4},
                  padding: 30,
                }}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 18,
                    color: '#4F4F4F',
                    marginBottom: 26,
                  }}>
                  Overview
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (GlobalConst.customerStatus === 'Approved') {
                      navigation.navigate('MyOrder');
                    } else {
                      Toast.show(
                        'Please complete Profile / Wait for approval',
                        Toast.SHORT,
                      );
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_956.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={{width: 200}}>
                    <Text
                      style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                      Orders <Text style={{fontWeight: 'bold'}}></Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        fontSize: 14,
                        lineHeight: 18,
                        color: '#4F4F4F',
                      }}>
                      Order Status
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../images/Group_673.png')}
                      style={{width: 12, height: 12}}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dotted',
                    borderColor: '#80707070',
                  }}></View>

                <TouchableOpacity
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                    paddingTop: 20,
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_1822.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={{width: 200}}>
                    <Text
                      style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                      Cart <Text style={{fontWeight: 'bold'}}></Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        fontSize: 14,
                        lineHeight: 18,
                        color: '#4F4F4F',
                      }}>
                      Ready to Checkout
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../images/Group_673.png')}
                      style={{width: 12, height: 12}}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dotted',
                    borderColor: '#80707070',
                  }}></View>

                <TouchableOpacity
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                    paddingTop: 20,
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_1823.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={{width: 200}}>
                    <Text
                      style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                      My Wishlist <Text style={{fontWeight: 'bold'}}></Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        fontSize: 14,
                        lineHeight: 18,
                        color: '#4F4F4F',
                      }}>
                      Products You are Interested In
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../images/Group_673.png')}
                      style={{width: 12, height: 12}}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dotted',
                    borderColor: '#80707070',
                  }}></View>

                <TouchableOpacity
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                    paddingTop: 20,
                  }}>
                  <View>
                    <Image
                      source={require('../../images/Group_1827.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={{width: 200}}>
                    <Text
                      style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                      Address Book
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        fontSize: 14,
                        lineHeight: 18,
                        color: '#4F4F4F',
                      }}>
                      Shipping Addresses
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../images/Group_673.png')}
                      style={{width: 12, height: 12}}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dotted',
                    borderColor: '#80707070',
                  }}></View>
              </View>

              <View
                style={{
                  backgroundColor: '#E6F4FF',
                  marginLeft: 21,
                  marginRight: 21,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                <SafeAreaView>
                  <FlatList
                    contentContainerStyle={{
                      marginLeft: 30,
                      marginTop: 20,
                      marginBottom: 30,
                    }}
                    data={labels}
                    renderItem={({item}, index) => {
                      return (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              if (item === 'General Info') {
                                navigation.navigate('AccountInfo');
                              }
                              if (item === 'Business Identification') {
                                navigation.navigate('BusinessInfo');
                              }
                              if (item === 'Company Info') {
                                navigation.navigate('CompanyInfo');
                              }
                              if (item === 'Trade Info') {
                                navigation.navigate('TradeInfo');
                              }
                              if (item === 'Bank Details') {
                                navigation.navigate('BankInfo');
                              }
                              if (item === 'Promotional Subscription') {
                                navigation.navigate('Subscription');
                              }
                             
                              // if (item === 'Promotional Subscription_test') {
                              //   if (!_.isEmpty(loginData.customerInfo)) {
                              //     if (
                              //       loginData.customerInfo
                              //         .extension_attributes !== undefined &&
                              //       loginData.customerInfo.extension_attributes
                              //         .is_subscribed !== undefined
                              //     ) {
                              //       setIsSubscribed(
                              //         loginData.customerInfo
                              //           .extension_attributes.is_subscribed,
                              //       );
                              //     }
                              //   }
                              //   if (
                              //     promoDrawerRef !== undefined &&
                              //     promoDrawerRef !== null
                              //   ) {
                              //     promoDrawerRef.open();
                              //   }
                              // }
                            }}
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingBottom: 17,
                              paddingTop: 14,
                            }}>
                            <Text
                              style={{
                                color: '#434861',
                                fontFamily: 'DRLCircular-Book',
                                fontSize: 16,
                              }}>
                              {item === 'General Info'
                                ? 'Account Information'
                                : item}
                            </Text>
                            <Image
                              source={require('../../images/Group_673.png')}
                              style={{height: 12, width: 12}}></Image>
                          </TouchableOpacity>
                          <View
                            style={{
                              borderRadius: 1,
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderColor: '#80707070',
                            }}></View>
                        </View>
                      );
                    }}
                  />
                </SafeAreaView>
              </View>

              <TouchableOpacity
                onPress={() => {
                  dispatch(resetAllInfo());
                  navigation.navigate('Login');
                }}
                style={[
                  styles2.buttonUnselected,
                  {
                    alignSelf: 'center',
                    marginTop: 20,
                    backgroundColor: '#F6FBFF',
                  },
                ]}>
                <Text style={styles2.blackTextMedium}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {!showProfile && showInfo && <MyProfileInfo prop={setShowInfo} />}
      </LinearGradient>
      {acceptView()}
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(MyProfile);

export default MyProfile;
