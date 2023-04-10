import {setPasswordWrong} from '../../slices/authenticationSlice';

import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from './login_style';
import {useSelector, useDispatch} from 'react-redux';
import {resetPassword} from '../../services/operations/getToken';
import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
import Colors from '../../config/Colors';
import {useNavigation} from '@react-navigation/native';

import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
const siteKey = '6LehiTcaAAAAAET-QDZj8h6m_X41QyHNK58-BpxZ';
const baseUrl = 'https://google.com';

let ViewWithSpinner = withLoader(View);

const ForgotPasswordNew = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);
  const [code, setCode] = useState(null);

  onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        setCode(event.nativeEvent.data);
        setTimeout(() => {
          this.captchaForm.hide();
          // do what ever you want here
          //showDialog();
          dispatch(resetPassword(email, loginData.apiAccessToken.access_token));
        }, 1500);
      }
    }
  };

  capcha = () => {
    return (
      <ConfirmGoogleCaptcha
        ref={_ref => (this.captchaForm = _ref)}
        siteKey={siteKey}
        baseUrl={baseUrl}
        languageCode="en"
        onMessage={this.onMessage}
      />
    );
  };

  onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        setCode(event.nativeEvent.data);
        setTimeout(() => {
          this.captchaForm.hide();
          // do what ever you want here
          //showDialog();
          dispatch(resetPassword(email, loginData.apiAccessToken.access_token));
        }, 1500);
      }
    }
  };

  // capcha = () =>{
  //     return (

  //         <ConfirmGoogleCaptcha
  //           ref={_ref => (this.captchaForm = _ref)}
  //           siteKey={siteKey}
  //           baseUrl={baseUrl}
  //           languageCode="en"
  //           onMessage={this.onMessage}
  //         />)

  // }

  const reset = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (_.isEmpty(email)) {
      Toast.show('Please enter Email', Toast.SHORT);
    } else if (reg.test(email) === false) {
      Toast.show('Please enter valid Email format', Toast.SHORT);
    } else {
      this.captchaForm.show();
      //showDialog();
    }
  };
  showDialog = () => {
    dispatch(setPasswordWrong(false));
    Alert.alert(
      'Forgot Password',
      'Do you want to reset your password?',
      [
        {text: 'No'},
        {
          text: 'Yes',
          onPress: () => {
            dispatch(
              resetPassword(email, loginData.apiAccessToken.access_token),
            );
          },
        },
      ],
      {cancelable: false},
    );
  };
  useEffect(() => {
    if (loginData.isPasswordReset) {
      navigation.replace('PasswordResetComplete', {email: email});
    }
  }, [loginData.isPasswordReset]);

  onLoadRecaptcha = () => {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  };
  verifyCallback = recaptchaToken => {
    // Here you will get the final recaptchaToken!!!
  };

  return (
    <ViewWithSpinner
      style={{backgroundColor: Colors.lightBlue, height: '100%'}}
      isLoading={loginData.isLoading}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <View
        style={{
          padding: 10,
          marginTop: 30,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../images/back_white.png')}
            style={{height: 30, width: 30}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 20,
            color: colors.white,
            marginLeft: 20,
          }}>
          Forgot Password
        </Text>
      </View>

      <View
        style={{
          margin: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '70%',
          justifyContent: 'center',
        }}>
        <Text style={[styles.textStyle, {fontSize: 18, marginBottom: 40}]}>
          Enter the Company Email ID associated with your account
        </Text>
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
            style={{height: 20, width: 20}}
          />
          <TextInput
            style={{color: colors.textColor, width: '90%', marginLeft: 10}}
            onChangeText={email => setEmail(email)}
            value={email}
            keyboardType={'email-address'}
            placeholder="Enter Company Email ID"
            placeholderTextColor="grey"
          />
        </View>

        {loginData.isPasswordWrong.payload ? (
          <Text style={{marginTop: 10, fontSize: 15, color: '#f0848f'}}>
            Email ID not found. Please try with registered email ID
          </Text>
        ) : (
          <Text style={{marginTop: 10, fontSize: 15, color: '#f0848f'}}> </Text>
        )}
        <TouchableOpacity onPress={reset} full style={styles.loginButton}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        {this.capcha()}
      </View>

      {/* <ExampleComponent /> */}
    </ViewWithSpinner>
  );
};

export default ForgotPasswordNew;
