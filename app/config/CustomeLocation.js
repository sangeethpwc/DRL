import React, { useState, useEffect, useRef } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import colors from './Colors';
import { useNavigation } from '@react-navigation/native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  setOrderId,
  setIndicatorSteps,
  refreshCartForPurchase,
} from '../slices/productSlices';
import { setShippingAddressId } from '../slices/authenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ImageBackground, } from 'react-native';
import GlobalConst from './GlobalConst';
import { getCartListGeneral } from '../services/operations/productApis';
import utils from '../utilities/utils';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';

const CustomeLocation = props => {
  const navigation = useNavigation();
  
  let nameDrawerRef = useRef(null);

  function dialogView() {
    return (
      <Modal

        style={{ height: '40%', width: '80%' }}

        swipeToClose={false}
        ref={c => (nameDrawerRef = c)}
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
            style={{ position: 'absolute', right: 10, top: 0 }}>

          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <ScrollView>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'DRLCircular-Book',
                  lineHeight: 16,
                }}>
                You are about to leave Dr.Reddy’s and affiliates website.{'\n'}
                {'\n'}
                Dr. Reddy's assumes no responsibility for the information
                presented on the external website or any further links from such
                sites. These links are presented to you only as a convenience,
                and the inclusion of any link does not imply endorsement by Dr.
                Reddy's. If you wish to continue to this external website, click
                Proceed.
              </Text>

            </ScrollView>

          </View>

          <TouchableOpacity
            onPress={() => {
              nameDrawerRef.close();
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 10,
              marginTop: 0,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 25,
            }}>

            <Text >Close</Text>

          </TouchableOpacity>

        </View>
      </Modal>
    );
  }

  const dispatch = useDispatch();

  return (
    <View>
      {props.addToLocation !== undefined &&GlobalConst.LoginToken.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
          navigation.navigate('ChangeAddress');
          }}
          style={{ marginLeft: 10, marginRight: 10 }}>
          <View style={{ height: 30, width: 30, overflow: 'hidden' }}>
            <ImageBackground
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              source={require('../images/location.png')}>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ) : null}
      {dialogView()}
    </View>

  );
};
export default CustomeLocation;
