import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {contactUs} from '../../services/operations/profileApis';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import {setContactSuccess} from '../../slices/profileSlices';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
const siteKey = '6LehiTcaAAAAAET-QDZj8h6m_X41QyHNK58-BpxZ';
const baseUrl = 'https://google.com';

export default function ServiceRequest(props) {
  const loginData = useSelector(state => state.authenticatedUser);
  const profileData = useSelector(state => state.profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [describe, setDescribe] = useState('');

  const [terms, setTermAndConditions] = useState(false);

  let bottomDrawerRef = useRef(null);
  ///..............CAPTCHA........................

  onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        //setCode(event.nativeEvent.data)
        this.captchaForm.hide();
        setTimeout(() => {
          dispatch(contactUs(name, phone, email.toLowerCase(), describe));
        }, 1000);
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

  //..............................................

  function add() {
    if (name === '' || email === '' || describe === '') {
      Toast.show('Enter all mandatory fields', Toast.SHORT);
    } else if (!terms) {
      Toast.show('Please select Privacy Notice and Terms of Use', Toast.SHORT);
    } else {
      this.captchaForm.show();
    }
  }

  useEffect(() => {
    if (
      profileData.contactSuccess !== undefined &&
      profileData.contactSuccess != '' &&
      bottomDrawerRef !== undefined &&
      bottomDrawerRef !== null
    ) {
      bottomDrawerRef.open();
    }
  }, [profileData.contactSuccess]);

  useEffect(() => {
    if (
      loginData.customerInfo !== undefined &&
      !_.isEmpty(loginData.customerInfo)
    ) {
      let name =
        loginData.customerInfo.firstname +
        ' ' +
        loginData.customerInfo.lastname;
      setName(name);
      setEmail(loginData.customerInfo.email);
    }
  }, [loginData.customerInfo]);

  function bottomSliderView() {
    return (
      <Modal
        style={{height: 200}}
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
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              {profileData.contactSuccess}
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
              dispatch(setContactSuccess(''));
              // navigation.replace('MenuTab')
              navigation.goBack();
            }}>
            <Text style={{color: colors.blue}}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
        height: '100%',
      }}>
      <CustomeHeader
        back={'back'}
        title={'Contact Us'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />
      {bottomSliderView()}

      <ScrollView style={{padding: 20, height: '100%'}}>
        <View
          style={{
            height: 70,
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Speak To Our Dr. Reddy’s Expert About
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            {' '}
            Name <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            onChangeText={text => setName(text)}
            value={name}
            placeholder="Name"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            onChangeText={text => setPhone(text)}
            value={phone}
            placeholder="Phone Number"
            keyboardType={'phone-pad'}
            maxLength={10}
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            Email ID <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder="Email ID"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            Question/Comments <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            onChangeText={text => setDescribe(text)}
            value={describe}
            placeholder="Type your Query here"
            style={[styles.input, {height: 100}]}
          />
        </View>

        <View
          style={{
            marginTop: 20,
            borderTopWidth: 0.3,
            paddingTop: 20,
            borderColor: colors.textColor,
          }}>
          <Text style={styles.titleText}>Customer Support</Text>

          <View
            style={{
              marginTop: 20,
              borderColor: colors.grey,
              borderWidth: 0.3,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
                fontSize: 16,
              }}>
              Customer Care:{' '}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/mail.png')} />
              </View>

              <View style={{justifyContent: 'center', width: '90%'}}>
                <Text
                  onPress={() => {
                    Linking.openURL('mailto:customercare@drreddys.com');
                  }}
                  style={[styles.blueText, {fontSize: 14}]}>
                  customercare@drreddys.com
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/call.png')} />
              </View>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    onPress={() => {
                      Linking.openURL('tel:=+1 866-733-3952');
                    }}
                    style={[styles.blueText, {fontSize: 14}]}>
                    +1 866-733-3952
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[
                styles.labelText,
                {fontSize: 12, marginTop: 10, marginLeft: '15%'},
              ]}>
              Business hours - 08:00AM to 05:00PM EST
            </Text>
          </View>

          <View
            style={{
              marginTop: 20,
              borderColor: colors.grey,
              borderWidth: 0.3,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
                fontSize: 16,
              }}>
              Technical Support:{' '}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/mail.png')} />
              </View>

              <View style={{justifyContent: 'center', width: '90%'}}>
                <Text
                  onPress={() => {
                    Linking.openURL('mailto:Direct@drreddys.com');
                  }}
                  style={[styles.blueText, {fontSize: 14}]}>
                  Direct@drreddys.com
                </Text>
              </View>
            </View>

            {/* <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/call.png')} />
              </View>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    //onPress={()=>{Linking.openURL('tel:866-733-3952');}}
                    style={[styles.blueText, {fontSize: 14}]}>
                    Not Available
                  </Text>
                </View>
              </View>
            </View> */}

            <Text
              style={[
                styles.labelText,
                {fontSize: 12, marginTop: 10, marginLeft: '15%'},
              ]}>
              Business hours - 08:00AM to 05:00PM EST
            </Text>
          </View>

          <View
            style={{
              marginTop: 20,
              borderColor: colors.grey,
              borderWidth: 0.3,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
                fontSize: 16,
              }}>
              Medical Inquiries:{' '}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/mail.png')} />
              </View>

              <View style={{justifyContent: 'center', width: '90%'}}>
                <Text
                  onPress={() => {
                    Linking.openURL('mailto:medinfo@drreddys.com');
                  }}
                  style={[styles.blueText, {fontSize: 14}]}>
                  medinfo@drreddys.com
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/call.png')} />
              </View>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    onPress={() => {
                      Linking.openURL('tel:+1 888-375-3784');
                    }}
                    style={[styles.blueText, {fontSize: 14}]}>
                    +1 888-375-3784
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[
                styles.labelText,
                {fontSize: 12, marginTop: 10, marginLeft: '15%'},
              ]}>
              Business hours - 08:00AM to 08:00PM EST
            </Text>
          </View>
        </View>

        <View style={{height: 180}}></View>
      </ScrollView>

      <View style={styles.footer}>
        <View
          style={{
            flexDirection: 'row',
            height: 30,
            marginTop: 10,
            alignItems: 'center',
            marginBottom: 10,
            width: '90%',
          }}>
          <CheckBox
            style={{marginRight: 10}}
            disabled={false}
            value={terms}
            onValueChange={newValue => setTermAndConditions(!terms)}
          />
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsGeneral');
            }}>
            <Text
              style={{
                color: colors.blue,
                fontSize: 16,
                fontFamily: 'DRLCircular-Book',
                textDecorationLine: 'underline',
              }}>
              I agree to the Terms and Conditions *
            </Text>
          </TouchableOpacity> */}
          <Text
            style={{
              color: colors.textColor,
              fontSize: 14,
              fontFamily: 'DRLCircular-Book',
            }}>
            I agree and accept the{' '}
            <Text
              style={{color: colors.blue, textDecorationLine: 'underline'}}
              onPress={() =>
                Linking.openURL('https://www.drreddys.com/privacy-notice.aspx')
              }>
              Privacy Notice
            </Text>{' '}
            and{' '}
            <Text
              style={{color: colors.blue, textDecorationLine: 'underline'}}
              onPress={() =>
                Linking.openURL('https://www.drreddys.com/terms-of-use/')
              }>
              Terms of Use
            </Text>
            .
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.buttonUnselected}>
            <Text style={styles.blackTextMedium}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              add();
            }}
            style={styles.buttonSelected}>
            <Text style={styles.whiteTextMedium}>Submit</Text>
          </TouchableOpacity>
        </View>

        {this.capcha()}
        <LoaderCustome />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
  },

  label: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: colors.textColor,
  },

  input: {
    textAlignVertical: 'top',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    // justifyContent:'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
  },
  footer: {
    width: '100%',
    height: 130,

    backgroundColor: colors.shopCategoryBackground,
    position: 'absolute',
    bottom: 0,

    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonSelected: {
    width: 150,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnselected: {
    width: 150,
    height: 50,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderWidth: 1,
  },
  blackTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.textColor,
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },

  checkbox: {
    height: 10,
  },
  titleText: {
    color: colors.darkGrey,
    fontFamily: 'DRLCircular-Bold',
    fontSize: 20,
  },

  labelText: {
    color: colors.textColor,
    fontFamily: 'DRLCircular-Light',
    fontSize: 16,
  },
  blueText: {
    color: colors.blue,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },
});
