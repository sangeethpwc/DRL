import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import withLoader from '../../utilities/hocs/LoaderHOC';
import styles from './productStyles';
import _ from 'lodash';
import {checkStockStatusPDP} from '../../services/operations/productApis';
import colors from '../../config/Colors';

var sku = '';
const AvailableQuantityBySkuPDP = props => {
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  let ViewWithSpinner = withLoader(View);
  let bottomDrawerRef = useRef(null);
  let contentRef = useRef(null);
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();

  if (props !== undefined && props.sku !== undefined) {
    sku = props.sku;
  }

  useEffect(() => {
    if (sku !== undefined && !_.isEmpty(productData.stockStatusPDP)) {
      setStock(productData.stockStatusPDP);
    }
  }, [productData.stockStatusPDP]);

  useEffect(() => {
    if (!_.isEmpty(productData.productDetail)) {
      setPrice(productData.productDetail.price);
    }
  }, [productData.productDetail]);

  useEffect(() => {
    if (sku !== undefined) {
      dispatch(checkStockStatusPDP(sku));
    }
  }, [sku]);

  return (
    <View>
      {stock > 0 ? (
        <View
          style={[
            styles.labelGreen,
            {paddingVertical: 10, paddingHorizontal: 5, width: 120},
          ]}>
          <Text style={[styles.greenLight, {fontSize: 16}]}>In stock</Text>
        </View>
      ) : (
        <View
          style={[
            styles.labelRed,
            {paddingVertical: 10, paddingHorizontal: 5, width: 120},
          ]}>
          <Text style={[styles.greenLight, {fontSize: 16, color: colors.red}]}>
            Out of stock
          </Text>
        </View>
      )}
    </View>
  );
};
export default AvailableQuantityBySkuPDP;
