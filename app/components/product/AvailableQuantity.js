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

var pdp = '';
const AvailableQuantity = props => {
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

  if (props !== undefined && props.pdp !== undefined) {
    pdp = props.pdp;
  }

  // useEffect(() => {
  //   if (sku !== undefined && !_.isEmpty(productData.stockStatusPDP)) {
  //     setStock(productData.stockStatusPDP);
  //   }
  //   console.log('Stock set................', productData.stockStatusPDP);
  // }, [productData.stockStatusPDP]);

  useEffect(() => {
    console.log('pdp..................', pdp);
    if (
      pdp.extension_attributes !== undefined &&
      pdp.extension_attributes.stoct_status !== undefined
    ) {
      setStock(pdp.extension_attributes.stoct_status);
    }
  }, []);

  // useEffect(() => {
  //   if (sku !== undefined && !_.isEmpty(productData.productDetail)) {
  //     setPrice(productData.productDetail.price);
  //   }
  // }, [productData.productDetail]);

  return (
    <View>
      {stock === '1' ? (
        <View
          style={[
            styles.labelGreen,
            {paddingVertical: 10, paddingHorizontal: 5},
          ]}>
          <Text style={[styles.greenLight, {fontSize: 16}]}>In stock</Text>
        </View>
      ) : (
        <View
          style={[
            styles.labelRed,
            {paddingVertical: 10, paddingHorizontal: 5},
          ]}>
          <Text style={[styles.greenLight, {fontSize: 16, color: colors.red}]}>
            Out of stock
          </Text>
        </View>
      )}
    </View>
  );
};
export default AvailableQuantity;
