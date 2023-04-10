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

export function Privacy({props}) {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  function pressContinue() {
    //
    if (accept) {
      navigation.replace('EULA');
      //navigation.replace('Onboarding');
    } else {
      Toast.show('Please accept Privacy Notice', Toast.SHORT);
    }
  }

  const loginData = useSelector(state => state.authenticatedUser);
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    if (GlobalConst.tcVersionMismatch) {
      Alert.alert(
        'Please note',
        'Privacy policy and/or EULA has changed. Please accept updated terms.',
        [
          {
            text: 'OK',
            onPress: () => {
              GlobalConst.tcVersionMismatch = false;
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, []);

  return (
    <View style={{backgroundColor: '#F6FBFF', height: '100%'}}>
      <CustomeHeader
        back={undefined}
        title={'Privacy Policy'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {loginData.privacyData !== undefined ? (
        <WebView
          style={{width: '100%', marginBottom: 80}}
          source={{
            html:
              '<meta name="viewport" content="width=device-width, initial-scale=1"/>' +
              decode(loginData.privacyData),
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '70%',
          }}>
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
            I agree and accept the Privacy Notice
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            pressContinue();
          }}
          style={styles.buttonSelected}>
          <Text style={styles.whiteTextMedium}>Next</Text>
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

export default Privacy;
