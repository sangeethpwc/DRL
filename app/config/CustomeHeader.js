import React from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import colors from './Colors';
import {useNavigation} from '@react-navigation/native';
import styles from '../components/authetication/login_style';
import CustomeHeaderCart from './CustomHeaderCart';
import CustomeHeaderWishlist from './CustomeHeaderWishlist';
import CustomeLocation from './CustomeLocation';
import CustomScanner from './CustomeScanner';

const CustomeHeader = ({back, title, isHome, addToCart, addToWishList,addToLocation,}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        height: Platform.OS === 'android' ? 70 : 95,
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 0 : 30,
      }}>
        
      <View style={{flexDirection: 'row'}}>
        {back !== undefined ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{}}
            hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../images/back_white.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={{width: 20}}></View>
        )}
        {title !== undefined ? (
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'DRLCircular-Bold',
              color: colors.white,
              fontSize: 18,
              marginLeft: 5,
              width: 150,
            }}>
            {title}
          </Text>
        ) : (
          <Image
            style={{}}
            source={require('../images/logo.png')}
            resizeMode="contain"
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      
        <CustomScanner addToCart={addToCart} />  
        <CustomeLocation addToLocation={addToLocation} />  
        <CustomeHeaderCart addToCart={addToCart} />
        <CustomeHeaderWishlist addToWishList={addToWishList} />
        
        {addToLocation === undefined && addToCart === undefined && addToWishList === undefined && isHome ? (
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text
              style={[
                styles.buttonTextUnSelected,
                {color: colors.white, fontSize: 18},
              ]}>
              Login
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default CustomeHeader;
