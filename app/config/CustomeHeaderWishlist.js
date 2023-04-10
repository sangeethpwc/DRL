import React, {useState, useEffect} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import colors from './Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ImageBackground} from 'react-native';
import GlobalConst from '../config/GlobalConst';
import {getWishlist} from '../services/operations/productApis';
import Toast from 'react-native-simple-toast';

const CustomeHeaderWishlist = props => {
  const navigation = useNavigation();
  const [wishListCount, setWishListCount] = useState(0);

  const productData = useSelector(state => state.product);

  //

  useEffect(() => {
    if (
      productData.wishlist !== undefined &&
      productData.wishlist.items_count !== undefined
    ) {
      //
      setWishListCount(parseInt(productData.wishlist.items_count));
    }
  }, [productData.wishlist]);

  useEffect(() => {
    //
    if (productData.wishlistAdded) {
      //
      dispatch(getWishlist());
    }
  }, [productData.wishlistAdded]);

  const dispatch = useDispatch();

  return (
    <View>
      {props.addToWishList !== undefined &&
      GlobalConst.LoginToken.length > 0 ? (
        <TouchableOpacity
          // style={{}}
          style={{marginLeft: 10, marginRight: 30}}
          onPress={() => {
            if (GlobalConst.customerStatus === 'Approved') {
              navigation.navigate('WishList');
            } else {
              Toast.show(
                'Please complete Profile / Wait for approval',
                Toast.SHORT,
              );
            }
          }}>
          {/* <Image 
          source={require('../images/wishlist_white.png')}
          resizeMode = "contain"
         /> */}
          <View style={{height: 30, width: 30, overflow: 'hidden'}}>
            <ImageBackground
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              source={require('../images/wishlist_white.png')}>
              {wishListCount > 0 ? ( 
                <View
                  style={{
                    backgroundColor: colors.stepsColor,
                    width: 18,
                    height: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 12,
                      color: colors.white,
                    }}>
                    {wishListCount}
                  </Text>
                </View>
              ) : null}
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default CustomeHeaderWishlist;
