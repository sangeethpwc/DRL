import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import withLoader from '../../utilities/hocs/LoaderHOC';
import styles from './productStyles';
import _ from 'lodash';
import {checkStockStatus} from '../../services/operations/productApis';
import {setStockStatus} from '../../slices/productSlices';

const AvailableQuantity = props => {
  const [productDetail, setProductDetail] = useState({});
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

  useEffect(() => {
    if (
      productData.productDetail !== undefined &&
      productData.productDetail.sku !== undefined &&
      !_.isEmpty(productData.stockStatus)
    ) {
      setStock(productData.stockStatus);
    }
  }, [productData.stockStatus]);

  useEffect(() => {
    if (
      productData.productDetail !== undefined &&
      productData.productDetail.sku !== undefined
    ) {
      dispatch(checkStockStatus(productData.productDetail.sku));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setStockStatus(''));
    };
  }, []);

  return (
    <View>
      {GlobalConst.LoginToken.length > 0 && (
        <View style={[styles.labelGreen, {height: 30}]}>
          <Text style={[styles.greenLight, {fontSize: 14}]}>
            Packs Available: {stock}
          </Text>
        </View>
      )}
    </View>
  );
};
export default AvailableQuantity;
