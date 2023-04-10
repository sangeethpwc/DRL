import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View, TouchableOpacity } from "react-native";


import {
  SafeAreaView,
  Text,
  View,
  Linking,
  StatusBar,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import { getProductsSearch_Scan } from '../services/operations/productApis';

import colors from './Colors';
import CustomeHeader from './CustomeHeader';
import { CameraScreen } from 'react-native-camera-kit';
import { sample } from 'lodash';


const sample = () => {
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [scan_enable, setScanEnable] = useState(true);

 
  
  return (
    <View style={{ height: '100%', backgroundColor: colors.white }}>

      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <CustomeHeader
        back={'back'}
        title={'Quick Order'}
        isHome={undefined}
        addToCart={'addToCart'}
        addToWishList={'addToWishList'}
        addToLocation={'addToLocation'}
      />

      <View style={{ flex: 1 }}>
        
      </View>

    </View>
  );
};

export default sample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
});