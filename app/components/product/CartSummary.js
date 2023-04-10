//................Library imports........................

import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import _ from 'lodash';

//.................Custom imports..........................

import Colors from '../../config/Colors';
// import Fonts from '../../config/Fonts';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';

const CartSummary = props => {
  //................All declarations......................

  const [cartTotal, setCartTotal] = useState({});
  const productData = useSelector(state => state.product);
  const [couponMsg, setCouponMsg] = useState('');

  //.......................................................

  //.....................UseEffects.........................

  useEffect(() => {
    //
    if (
      productData.cartPrice !== undefined &&
      !_.isEmpty(productData.cartPrice) &&
      GlobalConst.LoginToken.length > 0
    ) {
      console.log('productData.cartPrice..............', productData.cartPrice);
      setCartTotal(productData.cartPrice);
    }

    if (productData.cartPrice.total_segments !== undefined) {
      if (
        productData.cartPrice.total_segments.find(
          item => item.code === 'discount',
        ) !== undefined
      ) {
        if (
          productData.cartPrice.total_segments.find(
            item => item.code === 'discount',
          ).title !== undefined
        ) {
          setCouponMsg(
            productData.cartPrice.total_segments.find(
              item => item.code === 'discount',
            ).title,
          );
        }
      }
    }
  }, [productData.cartPrice]);

  //............................................................

  //.......................Functions.............................

  //..............................................................

  //.........................render..................................
  return (
    <View>
      {!_.isEmpty(cartTotal) && !_.isEmpty(productData.cartPrice) && (
        <View style={styles.summaryView}>
          <Text style={[styles.titleText, {fontSize: 24}]}>Summary</Text>
          <View style={styles.summaryItem}>
            <View style={{width: '60%'}}>
              <Text style={styles.summaryTextTitle}>Subtotal : </Text>
            </View>
            <Text style={styles.summaryText}>
              ${utils.formatPrice(cartTotal.subtotal)}
            </Text>
          </View>
          {cartTotal.base_discount_amount !== 0 && (
            <View style={styles.summaryItem}>
              <View style={{width: '60%'}}>
                <Text style={styles.summaryTextTitle}>Discount : </Text>
                <Text numberOfLines={2} style={styles.labeltext}>
                  {couponMsg}
                </Text>
              </View>
              <View>
                <Text style={styles.summaryText}>
                  - ${utils.formatPrice(cartTotal.discount_amount * -1)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.summaryItem}>
            <View style={{width: '60%'}}>
              <Text style={styles.summaryTextTitle}>Handling Fee : </Text>
            </View>
            <View>
              <Text style={styles.summaryText}>
                ${utils.formatPrice(cartTotal.shipping_amount)}
              </Text>
            </View>
          </View>

          {cartTotal.base_tax_amount !== 0 && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryTextTitle}>Taxes : </Text>
              <Text style={styles.summaryText}>
                ${utils.formatPrice(cartTotal.base_tax_amount)}
              </Text>
            </View>
          )}

          <View style={[styles.summaryItem, {marginTop: 20}]}>
            <View style={{width: '60%'}}>
              <Text style={[styles.summaryTextTitle, {fontSize: 18}]}>
                Total :{' '}
              </Text>
            </View>
            <Text style={[styles.summaryText, {fontSize: 18}]}>
              ${utils.formatPrice(cartTotal.grand_total)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryView: {
    marginTop: 50,
    borderWidth: 0.5,
    borderColor: Colors.textColor,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
  },

  labeltext: {
    color: Colors.textColor,
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  summaryText: {
    color: Colors.blue,
    fontSize: 16,
    fontFamily: 'DRLCircular-Book',
  },
  summaryTextTitle: {
    color: Colors.textColor,
    fontSize: 16,
    fontFamily: 'DRLCircular-Bold',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'DRLCircular-Bold',
    marginTop: 10,
  },

  titleText: {
    color: Colors.blue,

    fontFamily: 'DRLCircular-Bold',
    fontSize: 24,
  },
});
export default CartSummary;
