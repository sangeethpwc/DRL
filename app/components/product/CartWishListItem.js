import React, {useState, useEffect} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import colors from '../../config/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getWishlist,
  addWishlist,
  getAdminTokenForWishListDelete,
} from '../../services/operations/productApis';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';

const CartWishListItem = props => {
  const navigation = useNavigation();
  const [wishListCount, setWishListCount] = useState(0);

  const productData = useSelector(state => state.product);

  let item = {};
  let index = -1;

  let sku = '';

  sku = props.sku;

  function isAddedToWishList(sku) {
    index = -1;
    index = productData.wishlist.items.findIndex(
      val => val !== undefined && val.product.sku === sku,
    );
    return index;
  }

  function addFavourites() {
    dispatch(addWishlist(sku));
  }

  useEffect(() => {
    isAddedToWishList(sku);
  }, []);

  const dispatch = useDispatch();

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (index === -1) {
            dispatch(addWishlist(sku));
          } else {
            //Toast.show("Product is already added to Wishlist")
            let tempID = productData.wishlist.items[index].wishlist_item_id;
            dispatch(getAdminTokenForWishListDelete(tempID));
          }
        }}
        style={{justifyContent: 'center', height: '100%'}}>
        {isAddedToWishList(sku) !== -1 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 5,
            }}>
            <Image
              resizeMode="contain"
              style={{height: 35, width: 35}}
              source={require('../../images/filled_heart.png')}
            />
            <Text
              style={{
                width: '55%',
                fontFamily: 'DRLCircular-Book',
                color: colors.blue,
                marginLeft: 5,
                fontSize: 14,
                marginLeft: -2,
              }}>
              Added to Wishlist
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              resizeMode="contain"
              style={{height: 30, width: 30}}
              source={require('../../images/wish.png')}
            />
            <Text
              style={{
                width: '55%',
                fontFamily: 'DRLCircular-Book',
                color: colors.blue,
                marginLeft: 5,
                fontSize: 14,
              }}>
              Add to Wishlist
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default CartWishListItem;
