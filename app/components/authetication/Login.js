import {
  setPasswordWrong,
  passwordResetFailure,
  getTokenFailure,
} from '../../slices/authenticationSlice';
import CheckBox from '@react-native-community/checkbox';
import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from './login_style';
import {useSelector, useDispatch} from 'react-redux';
import {getToken} from '../../services/operations/getToken';
import {
  setInvalidUser,
  fetchingDataDone,
  fetchingData,
} from '../../slices/authenticationSlice';

import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modalbox';
import {BASE_URL_DELIVERY_DATE} from '../../services/ApiServicePath';
import utils from '../../utilities/utils';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
const siteKey = '6LehiTcaAAAAAET-QDZj8h6m_X41QyHNK58-BpxZ';
const baseUrl = 'https://google.com';

var body = {};

const login = (props) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.authenticatedUser);
  const productData = useSelector((state) => state.product);

  ///......................

  let nameDrawerRef = useRef(null);

  function dialogView() {
    return (
      <Modal
        style={{height: '18%', width: '70%'}}
        //position={'bottom'}
        ref={(c) => (nameDrawerRef = c)}
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
            style={{position: 'absolute', right: 10, top: 0}}>
            <Image
              style={{width: 10, resizeMode: 'contain'}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'DRLCircular-Book',
                lineHeight: 16,
              }}>
              Please complete Onboarding from Web Portal.
            </Text>
            <Text
              onPress={() => {
                if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                  nameDrawerRef.close();
                }
                Linking.openURL(
                  BASE_URL_DELIVERY_DATE + 'register-landing-page',
                );
              }}
              style={{
                marginTop: 10,
                fontFamily: 'DRLCircular-Book',
                color: colors.blue,
              }}>
              Click here
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  //........................

  ///......................
  const [terms, setTermAndConditions] = useState(false);

  let acceptDrawerRef = useRef(null);

  function acceptView() {
    return (
      <Modal
        style={{height: '20%', width: '80%'}}
        //position={'bottom'}
        ref={(c) => (acceptDrawerRef = c)}
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
              if (acceptDrawerRef !== undefined && acceptDrawerRef !== null) {
                acceptDrawerRef.close();
              }
            }}
            style={{position: 'absolute', right: 5, top: 0}}>
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
              value={terms}
              onValueChange={(newValue) => setTermAndConditions(newValue)}
            />

            <Text
              style={{
                lineHeight: 18,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
              }}>
              I agree and accept the{' '}
              <Text
                style={{color: colors.blue, textDecorationLine: 'underline'}}
                onPress={
                  () => navigation.navigate('PrivacyMore')
                  // Linking.openURL(
                  //   'https://www.drreddys.com/privacy-notice.aspx',
                  // )
                }>
                Privacy Notice
              </Text>{' '}
              and{' '}
              <Text
                style={{color: colors.blue, textDecorationLine: 'underline'}}
                onPress={() =>
                  //Linking.openURL('https://www.drreddys.com/terms-of-use/')
                  navigation.navigate('TermsGeneral')
                }>
                EULA
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (terms) {
                if (acceptDrawerRef !== undefined && acceptDrawerRef !== null) {
                  acceptDrawerRef.close();
                }
                GlobalConst.accepted = true;
                this.captchaForm.show();
              } else {
                Toast.show(
                  'Please accept the Privacy Notice and EULA',
                  Toast.SHORT,
                );
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
            <Text
              style={[styles.buttonText, {color: colors.white, fontSize: 14}]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  //........................

  onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        //setCode(event.nativeEvent.data)
        this.captchaForm.hide();
        setTimeout(() => {
          dispatch(getToken(body));
        }, 1000);
      }
    }
  };


  add = async ()=>{
    try {
      await AsyncStorage.setItem('actsts', "active")
    }
    catch (e){
      console.error(e);
    }
  }

  const login = () => {
    dispatch(setInvalidUser(false));
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (_.isEmpty(email)) {
      Toast.show('Please enter Email', Toast.SHORT);
    } else if (_.isEmpty(password)) {
      Toast.show('Please enter password', Toast.SHORT);
    } else if (reg.test(email) === false) {
      Toast.show('Please enter valid Email format', Toast.SHORT);
    } else {
      // dispatch(getTokenFailure(false))
      //   dispatch(getToken(email, password))
      body = {
        username: email,
        password: password,
      };

      {this.add()}

      GlobalConst.accepted = true;
      this.captchaForm.show();
    }
  };

 
  useEffect(() => {
    if (!_.isEmpty(loginData.customerInfo) && loginData.invalidUser === false) {
      dispatch(fetchingDataDone());
      props.navigation.replace('MenuTab');
      
    }
  }, [loginData.customerInfo]);

  useEffect(() => {
    if (!_.isEmpty(GlobalConst.LoginToken) && loginData.invalidUser === false) {
      props.navigation.replace('MenuTab');
      
    }
  }, [GlobalConst.LoginToken]);

  const [showPass, setShowPass] = useState(true);

  return (
    <ViewWithSpinner
      style={[styles.container, {height: '100%'}]}
      isLoading={loginData.isLoading}>
     
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      
      <View
        style={{
          margin: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}>

        <View style={{alignItems: 'center'}}>
          <Image source={require('../../images/logo_big.png')} />
        </View>

        <View style={styles.loginView}>
          <Text style={styles.textStyle}>Company Email ID</Text>
          <View
            style={{
              borderWidth: 0.5,
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: colors.white,
              color: colors.white,
              backgroundColor: colors.white,
              borderRadius: 10,
              paddingLeft: 5,
              marginTop: 25,
              marginBottom: 5,
              paddingBottom: 5,
              height: 50,
              fontFamily: 'DRLCircular-Light',
            }}>
            <Image
              source={require('../../images/mail_login.png')}
              style={{height: 25, width: 25}}
            />

            <TextInput
              style={{color: colors.textColor, width: '90%', marginLeft: 10}}
              onChangeText={(email) => setEmail(email)}
              value={email}
              keyboardType={'email-address'}
              placeholder="Enter Company Email Id"
              placeholderTextColor="grey"
            />
          </View>
          <Text style={styles.textStyle}>Password</Text>
          <View
            style={{
              borderWidth: 0.5,
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: colors.white,
              color: colors.white,
              backgroundColor: colors.white,
              borderRadius: 10,
              paddingLeft: 5,
              marginTop: 25,
              marginBottom: 5,
              paddingBottom: 5,
              height: 50,
              fontFamily: 'DRLCircular-Light',
            }}>
            <Image
              source={require('../../images/pass_login.png')}
              style={{height: 25, width: 25}}
            />

            <TextInput
              style={{color: colors.textColor, width: '75%', marginLeft: 10}}
              onChangeText={(password) => setPassword(password)}
              value={password}
              secureTextEntry={showPass}
              placeholder="Enter Password"
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              onPress={() => {
                if (showPass) {
                  setShowPass(false);
                } else {
                  setShowPass(true);
                }
              }}>
              <Image
                source={require('../../images/toggle_login.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>
          </View>
          {loginData.invalidUser ? (
            <Text style={{marginTop: 10, fontSize: 15, color: '#f0848f'}}>
              Invalid Email ID/Password. Please try again.
            </Text>
          ) : (
            <Text style={{marginTop: 10, fontSize: 15, color: '#f0848f'}}>
              {' '}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => {
              dispatch(setInvalidUser(false));
              setEmail('');
              setPassword('');
              dispatch(passwordResetFailure());
              dispatch(setPasswordWrong(false));
              navigation.navigate('ForgotPaassword');
            }}>
            {loginData.invalidUser ? (
              <Text
                style={{
                  color: colors.white,
                  textAlign: 'right',
                  fontFamily: 'DRLCircular-Book',
                  marginTop: 10,
                }}>
                Forgot Password?
              </Text>
            ) : (
              <Text
                style={{
                  color: colors.white,
                  textAlign: 'right',
                  fontFamily: 'DRLCircular-Book',
                  marginTop: -10,
                }}>
                Forgot Password?
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity full style={styles.loginButton} onPress={login}>
            <Text uppercase={false} style={styles.buttonText}>
              Login
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
                 style={{marginBottom:20}}> 
                <Text style={{color: colors.white, textAlign: 'center', fontFamily: 'DRLCircular-Book'}}>Having troubles signing in?</Text>
                </TouchableOpacity>  */}

          <TouchableOpacity
            onPress={() => {
              // props.navigation.navigate('MenuTabWithoutLogin')
              // props.navigation.navigate('HomeWithoutLogin');
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.open();
              }
            }}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                fontFamily: 'DRLCircular-Book',
              }}>
              Don't have an account?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => {
              // props.navigation.navigate('MenuTabWithoutLogin')
              props.navigation.navigate('HomeWithoutLogin');
            }}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                fontFamily: 'DRLCircular-Book',
              }}>
              Proceed without Login
            </Text>
          </TouchableOpacity>
        </View>

        {this.capcha()}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PrivacyMore');
          }}
          style={{
            position: 'absolute',
            bottom: 15,
            right: 1,
          }}>
          <Text style={{color: colors.white, fontFamily: 'DRLCircular-Book'}}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TermsGeneral');
          }}
          style={{
            position: 'absolute',
            bottom: 15,
            left: 1,
          }}>
          <Text style={{color: colors.white, fontFamily: 'DRLCircular-Book'}}>
            EULA
          </Text>
        </TouchableOpacity>
      </View>
      {dialogView()}
      {acceptView()}
    </ViewWithSpinner>
  );
};

capcha = () => {
  return (
    <ConfirmGoogleCaptcha
      ref={(_ref) => (this.captchaForm = _ref)}
      siteKey={siteKey}
      baseUrl={baseUrl}
      languageCode="en"
      onMessage={this.onMessage}
    />
  );
};

// const errorHandledComponent = withErrorHandler(login);

// errorHandledComponent.navigationOptions = ({navigation}) => {
//   return {headerShown: false};
// };
// export default errorHandledComponent;

export default login;
