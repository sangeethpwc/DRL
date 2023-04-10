import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import colors from '../../config/Colors';
import _ from 'lodash';
import {getCartPrice} from '../../services/operations/productApis';
import utils from '../../utilities/utils';
import {useNavigation} from '@react-navigation/native';

const PriceDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  let bottomDrawerRef = useRef(null);

  // let ViewWithSpinner = withLoader(View);

  const [price, setPrice] = useState({});

  useEffect(() => {
    //
    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined &&
      productData.cartList.items.length > 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      dispatch(getCartPrice());
    }
  }, []);

  useEffect(() => {
    //
    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined &&
      productData.cartList.items.length > 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      dispatch(getCartPrice());
    }
  }, [productData.cartList]);

  useEffect(() => {
    //
    if (
      productData.cartPrice !== undefined &&
      GlobalConst.LoginToken.length > 0
    ) {
      setPrice(productData.cartPrice);
    }
  }, [productData.cartPrice]);

  return (
    <View
      style={{
        marginLeft: 5,
        justifyContent: 'center',
        width: 130,
      }}>
      {!_.isEmpty(price) && (
        <Text
          textColor={colors.darkGrey}
          style={{fontSize: 24, fontFamily: 'DRLCircular-Bold'}}>
          {' '}
          ${utils.formatPrice(price.grand_total)}
        </Text>
      )}
    </View>
  );
};
export default PriceDetail;
