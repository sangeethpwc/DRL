import React, {useState, useEffect, useRef} from 'react';
import {Button, Card} from 'native-base';
import {
  StatusBar,
  Text,
  View,
  Image,
  BackHandler,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from '../authetication/login_style';
import {useSelector, useDispatch} from 'react-redux';
import {
  setInvalidUser,
  setSpashFetchDoneFalse,
  intilizedToken,
} from '../../slices/authenticationSlice';

import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import CheckBox from '@react-native-community/checkbox';
import WebView from 'react-native-webview';
import decode from 'decode-html';
import {Dimensions} from 'react-native';
import HTML from 'react-native-render-html';
import ErrorModal from '../../utilities/customviews/ErrorModal';
import GlobalConst from '../../config/GlobalConst';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator,
} from 'react-native-best-viewpager';
import AsyncStorage from '@react-native-community/async-storage';
// import {useHttpErrorHanlder} from '../../utilities/hooks/useHttpErrorHanlder';
import {useNavigation} from '@react-navigation/native';
import {
  getToken,
  getNewsData,
  getBrandNames,
  getApiAccessToken,
  resetPassword,
  getPrivacy,
  getDetails,
} from '../../services/operations/getToken';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import {displayName as appName} from '../../../app.json';
import md5 from 'react-native-md5';
import {sha256} from 'react-native-sha256';
// import JailMonkey from 'jail-monkey'
import RNFExitApp from 'react-native-exit-app';
import utils from '../../utilities/utils';

let ViewWithSpinner = withLoader(View);
var base64 = require('base-64');

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const images = [
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
];

const splashScreen = props => {
  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const circularProgress = useRef(null);

  // useEffect(() => {
  //     if(loginData.splashFetch){
  //         if(this !== undefined){
  //             this.getUserStatus();
  //         }
  //     }
  // }, [loginData.splashFetch])

  useEffect(() => {
    if (loginData.apiAccessTokenFailed) {
      Toast.show('Please try later', Toast.SHORT);
      BackHandler.exitApp();
    }
  }, [loginData.apiAccessTokenFailed]),
    useEffect(() => {
      if (!_.isEmpty(loginData.customerInfo)) {
        props.navigation.replace('MenuTab');
      }
    }, [loginData.customerInfo]);

  useEffect(() => {
    if (loginData.token === undefined) {
      dispatch(intilizedToken());

      dispatch(setInvalidUser(false));
      navigation.replace('Login');
    }
  }, [loginData.token]);

  useEffect(() => {
    dispatch(intilizedToken());
    // const jailbroken=JailMonkey.isJailBroken();
    // if(jailbroken === false){
    getAccessToken();
    // }
    // else{
    //     Toast.show("Can not run on Rooted Device", Toast.SHORT);
    //

    //     RNFExitApp.exitApp();
    // }

    getCurrentDate();

    utils.getAccepted();
  }, []);

  getUserStatus = () => {
    dispatch(setInvalidUser(false));

    AsyncStorage.getItem('FIRST_TIME_USER').then(firstTimeUser => {
      if (firstTimeUser !== null) {
        try {
          AsyncStorage.getItem('creds').then(creds => {
            if (creds !== null) {
              GlobalConst.creds = JSON.parse(creds);
              dispatch(getToken(JSON.parse(creds)));
            } else {
              navigation.replace('Login');
            }
          });
        } catch (error) {
          navigation.replace('Login');
        }
      } else {
        //
        navigation.replace('Privacy');
        // navigation.replace('Onboarding');
      }
    });
  };

  const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    GlobalConst.today = yyyy + '-' + mm + '-' + dd;
  };

  function getAccessToken() {
    console.log('c1........');
    sha256(appName).then(hash => {
      GlobalConst.AppToken = hash;
      console.log('c2........');
      dispatch(getApiAccessToken(hash));
    });
  }

  return (
    <ViewWithSpinner
      style={[styles.container, {height: '100%'}]}
      //  isLoading={loginData.isLoading}
    >
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      {/* {loginData !== undefined && _.isEmpty(loginData.apiAccessToken) ?getAccessToken(): null} */}
      {/* {getAccessToken()} */}

      {/* {loginData !== undefined && _.isEmpty(loginData.apiAccessToken) ?getAccessToken(): null} */}

      <View
        style={{
          margin: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}>
        <View style={{alignItems: 'center', marginBottom: 50}}>
          <Image
            source={require('../../images/logo_big.png')}
            style={{height: 80}}
            resizeMode="contain"
          />
        </View>

        <View style={{alignItems: 'center', marginBottom: 20}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              width: 200,
            }}>
            <View
              style={{
                zIndex: 2,
                width: 200,
                height: 200,
                position: 'absolute',
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 190, width: 190}}
                source={require('../../images/Splash/splash_big.png')}
              />
            </View>
            <View
              style={{
                zIndex: 0,
                width: 200,
                height: 200,
                position: 'absolute',
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AnimatedProgressWheel
                size={230}
                fill={98}
                color={colors.white}
                progress={98}
                backgroundColor={colors.darkBlue}
                animateFromValue={0}
                duration={10000}
                onAnimationComplete={() => {
                  if (loginData.apiAccessTokenFailed) {
                    Toast.show('Please try later', Toast.SHORT);
                    BackHandler.exitApp();
                  } else {
                    if (!GlobalConst.appVerisonMismatch) {
                      // const jailbroken=JailMonkey.isJailBroken();
                      // if(jailbroken === false){
                      this.getUserStatus();
                      // }
                      // else{
                      //     Toast.show("Can not run on Rooted Device", Toast.SHORT);
                      //

                      //     RNFExitApp.exitApp();
                      // }
                    } else {
                      Alert.alert(
                        'App version update',
                        'Please update the app to latest version',
                        [
                          {
                            text: 'Close App',
                            onPress: () => {
                              RNFExitApp.exitApp();
                            },
                          },
                          {
                            text: 'Update',
                            onPress: () => {
                              //code to redirect to playstore or app store
                              if (Platform.OS === 'android') {
                                //Linking.openURL("market://details?id=com.drreddysdirect")
                                // Linking.openURL(
                                //   'market://details?id=com.whatsapp',
                                // );
                              } else {
                                //  Linking.openURL("itms-apps://itunes.apple.com/us/app/apple-store/id${APP_STORE_LINK_ID}?mt=8")
                                // Linking.openURL("itms-apps://itunes.apple.com/us/app/apple-store/id310633997?mt=8") //whatsapp
                              }
                              //.............................................
                              Toast.show(
                                'Will redirect to playstore/appstore after live',
                              );
                              //  RNFExitApp.exitApp();
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }
                  }
                }}
              />
            </View>

            <View
              style={{
                zIndex: 1,
                width: 200,
                height: 200,
                position: 'absolute',
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AnimatedProgressWheel
                size={210}
                fill={100}
                backgroundColor={colors.blue}
              />
            </View>
          </View>
        </View>

        <View style={[{fontSize: 30, textAlign: 'center'}]}>
          <Text
            style={[
              {
                fontSize: 24,
                textAlign: 'center',
                color: colors.white,
                marginTop: 20,
                marginBottom: 5,
                fontFamily: 'DRLCircular-Light',
              },
            ]}>
            Welcome to{' '}
          </Text>

          <Text
            style={[
              {
                fontSize: 28,
                textAlign: 'center',
                color: colors.white,
                fontFamily: 'DRLCircular-Bold',
              },
            ]}>
            {' '}
            Dr.Reddy's {'\n'} ECommerce Platform
          </Text>

          <Text
            style={[
              {
                fontSize: 18,
                textAlign: 'center',
                color: colors.white,
                fontFamily: 'DRLCircular-Bold',
              },
            ]}>
            {' '}
            V-{GlobalConst.AppVersion}
          </Text>
        </View>
      </View>
      <View
        style={{position: 'absolute', right: 0, bottom: 0, marginBottom: -50}}>
        <Image source={require('../../images/groups.png')} />
      </View>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(splashScreen);

// errorHandledComponent.navigationOptions = ({navigation}) => {
//
//     return {headerShown: false}
// };
export default splashScreen;
