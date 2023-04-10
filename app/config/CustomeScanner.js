import React, {useState, useEffect,useRef} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {ImageBackground,} from 'react-native';
import GlobalConst from './GlobalConst';
import Toast from 'react-native-simple-toast';
import { PermissionsAndroid } from 'react-native';


const CustomScanner = props => {
  const navigation = useNavigation();

  function onScannerPressed() {
    if (GlobalConst.customerStatus === 'Approved') {

       // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            
          );

          console.warn('Working....');

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            console.warn('Working....2 ' +granted);
            // If CAMERA Permission is granted
            // navigation.navigate('BarCodeScanner');
            navigation.navigate('ScanTest');
            
          } else {
            alert('CAMERA Permission Denied');
          }
        } catch (err) {
          alert('Camera Permission Error', err);
          console.warn('Camera Permission Error...' + err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } 
    } else {
      Toast.show('Please complete Profile / Wait for approval', Toast.SHORT);
    }
  }

  return (
    <View>
      {props.addToCart !== undefined && GlobalConst.LoginToken.length > 0 ? (
        <TouchableOpacity
          onPress={
            () => onScannerPressed()
          }
          style={{marginLeft: 0, marginRight: 0}}>
          <View style={{height: 30, width: 30, overflow: 'hidden'}}>
            <ImageBackground
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              source={require('../images/scanner_white.png')}>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ) : null}
    
    </View>
    
  );
};
export default CustomScanner;
