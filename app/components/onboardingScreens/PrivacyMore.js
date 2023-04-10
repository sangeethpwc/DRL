import React, {useState} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
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

  const loginData = useSelector(state => state.authenticatedUser);
  const [accept, setAccept] = useState(false);

  return (
    <View style={{backgroundColor: '#F6FBFF', height: '100%'}}>
      <CustomeHeader
        back={'back'}
        title={'Privacy Policy'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {loginData.privacyData !== undefined ? (
        <WebView
          style={{width: '100%', marginBottom: 10}}
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
    width: 140,
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
