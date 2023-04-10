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

export default function TermsGeneral({props}) {
  const loginData = useSelector(state => state.authenticatedUser);

  return (
    <View style={{backgroundColor: '#F6FBFF', height: '100%'}}>
      <CustomeHeader
        back={'back'}
        title={'EULA'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {loginData.genTermsData !== undefined ? (
        <WebView
          style={{width: '100%', marginBottom: 20}}
          source={{
            html:
              '<meta name="viewport" content="width=device-width, initial-scale=1"/>' +
              decode(loginData.genTermsData),
          }}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
      ) : null}
    </View>
  );
}
