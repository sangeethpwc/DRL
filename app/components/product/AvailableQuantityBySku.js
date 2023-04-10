import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import withLoader from '../../utilities/hocs/LoaderHOC';
import styles from './productStyles';
import _ from 'lodash';
import {setStockStatus} from '../../slices/productSlices';
import {checkStockStatus} from '../../services/operations/productApis';
import colors from '../../config/Colors';

var sku = '';
const AvailableQuantityBySku = props => {
  const [stock, setStock] = useState('');
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
    if (sku !== undefined && !_.isEmpty(productData.stockStatus)) {
      setStock(productData.stockStatus);
    }
  }, [productData.stockStatus]);

  useEffect(() => {
    if (sku !== undefined) {
      dispatch(checkStockStatus(sku));
    }
  }, [sku]);

  useEffect(() => {
    return () => {
      dispatch(setStockStatus(''));
    };
  }, []);

  return (
    <View>
      {GlobalConst.LoginToken.length > 0 && (
        <Text
          style={{
            color: colors.textColor,
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            marginVertical: 5,
          }}>
          Available Quantity: {stock}
        </Text>
      )}
    </View>
  );
};
export default AvailableQuantityBySku;
