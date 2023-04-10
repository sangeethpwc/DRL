import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../config/Colors';
import {TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import {getProductsSuccess} from '../../slices/productSlices';
import {useSelector, useDispatch} from 'react-redux';
import {WebView} from 'react-native-webview';
import decode from 'decode-html';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';
import AsyncStorage from '@react-native-community/async-storage';

export function EULA({props}) {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  function setUserStatus() {
    AsyncStorage.setItem('FIRST_TIME_USER', JSON.stringify('FIRST_TIME_USER'));
  }

  function pressContinue() {
    //
    if (accept) {
      GlobalConst.accepted = true; //shift to async storage
      utils.setAccepted(true);
      setUserStatus();
      navigation.replace('Login');
      //navigation.replace('Onboarding');
    } else {
      Toast.show('Please accept EULA', Toast.SHORT);
    }
  }

  const loginData = useSelector(state => state.authenticatedUser);
  const [accept, setAccept] = useState(false);

  return (
    <View style={{backgroundColor: '#F6FBFF', height: '100%'}}>
      <CustomeHeader
        back={undefined}
        title={'EULA'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {loginData.genTermsData !== undefined ? (
        <WebView
          style={{width: '100%', marginBottom: 80}}
          source={{
            html:
              '<meta name="viewport" content="width=device-width, initial-scale=1"/>' +
              decode(loginData.genTermsData),
          }}
          scalesPageToFit={true}
          setTex
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
      ) : null}

      <View
        style={{
          height: 70,
          width: '100%',
          backgroundColor: colors.shopCategoryBackground,
          position: 'absolute',
          padding: 10,
          bottom: 0,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '70%'}}>
          <CheckBox
            style={styles.checkbox}
            value={accept}
            onValueChange={newValue => setAccept(newValue)}
          />
          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 14,
              width: '82%',
              marginLeft: 10,
            }}>
            I agree and accept the EULA
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            pressContinue();
          }}
          style={styles.buttonSelected}>
          <Text style={styles.whiteTextMedium}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    height: 35,
    justifyContent: 'center',
  },
  faqcard: {
    backgroundColor: colors.whiteGradient,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  checkbox: {
    height: 30,
  },
  buttonSelected: {
    width: 100,
    height: 40,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },
});

export default EULA;
