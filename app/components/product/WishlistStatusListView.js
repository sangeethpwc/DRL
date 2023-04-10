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

const WishlistStatus = props => {
  const navigation = useNavigation();
  const [wishListCount, setWishListCount] = useState(0);

  const productData = useSelector(state => state.product);

  //
  let item = {};
  let index = -1;

  if (
    props.item !== undefined &&
    productData !== undefined &&
    productData.wishlist !== undefined &&
    productData.wishlist.items !== undefined
  ) {
    //
    item = props.item;
    // index= _.findIndex(productData.wishlist.items,{"sku":item.sku})

    index = productData.wishlist.items.findIndex(
      val => val !== undefined && val.product.sku === item.sku,
    );
    //
  } else {
    item = props.item;
  }

  //

  function addFavourites() {
    dispatch(addWishlist(item.sku));
  }

  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={{}}
      hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
      onPress={() => {
        if (index === -1) {
          addFavourites(item);
        } else {
          let tempID = productData.wishlist.items[index].wishlist_item_id;
          dispatch(getAdminTokenForWishListDelete(tempID));
          // Toast.show("Product is already added to wishlist")
        }
      }}>
      {index === -1 ? (
        <Image
          source={require('../../images/wishlist_blue_nofill.png')}
          resizeMode="contain"
          style={{height: 30}}
        />
      ) : (
        <Image
          source={require('../../images/wishlist_blue_fill.png')}
          resizeMode="contain"
          style={{height: 30}}
        />
      )}
    </TouchableOpacity>
  );
};
export default WishlistStatus;
