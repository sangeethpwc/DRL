//................Library imports........................

import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';

//.................Custom imports..........................

import colors from '../../config/Colors';
// import Fonts from '../../config/Fonts';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';
import {applyCoupon, deleteCoupon} from '../../services/operations/productApis';
import {setCouponApplied} from '../../slices/productSlices';

const ApplyCoupon = props => {
  //................All declarations......................

  const [coupon, setCoupon] = useState({});
  const [prevDiscount, setPrevDiscount] = useState(false);
  const [editable, setEditable] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const productData = useSelector(state => state.product);

  const dispatch = useDispatch();

  //.......................................................

  //.....................UseEffects.........................

  useEffect(() => {
    console.log('Check 1...........', isApplied);
    if (isApplied) {
      console.log('Check 2...........');
      if (productData.coupon_applied.length > 0) {
        if (productData.coupon_applied === 'NA') {
          Toast.show('Discount code cannot be applied', Toast.LONG);
          dispatch(setCouponApplied(''));
        } else {
          Alert.alert(
            'Please Note',
            productData.coupon_applied +
              ' applied.To revert press Remove button.',
            [
              {
                text: 'Ok',
              },
            ],
            {cancelable: false},
          );
          // Toast.show(
          //   productData.coupon_applied +
          //     ' applied.To revert press Remove button.',
          //   Toast.LONG,
          // );
          setPrevDiscount(false);
        }
      } else {
        Toast.show('Discount code removed', Toast.LONG);
      }
      setIsApplied(false);
    }
  }, [productData.coupon_applied]);

  useEffect(() => {
    console.log('productData.cartPrice 1...........');
    if (!_.isEmpty(productData.cartPrice)) {
      if (productData.cartPrice.coupon_code !== undefined) {
        console.log('productData.cartPrice 2...........');
        setCoupon(productData.cartPrice.coupon_code);
        setEditable(false);
      } else {
        console.log('productData.cartPrice 3...........');
        setCoupon('');
        setEditable(true);
      }
      if (
        productData.cartPrice.base_discount_amount !== undefined &&
        productData.cartPrice.base_discount_amount !== 0
      ) {
        setPrevDiscount(true);
      }
    }
  }, [productData.cartPrice]);

  //............................................................

  //.......................Functions.............................
  const  showWarning = () => {
    Alert.alert(
      'Proceed',
      'Are you sure you want to apply the coupon code? If you proceed it will remove the best discount option.',
      [
        {text: 'Cancel'},
        {
          text: 'Yes',
          onPress: () => {
            apply();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const apply = () => {
    if (coupon.length > 0) {
      if (editable) {
        setIsApplied(true);
        dispatch(
          applyCoupon(
            coupon,
            productData.cartId,
            props.calledFrom,
            props.totalInfoArgs,
          ),
        );
      } else {
        setIsApplied(true);
        console.log('props.totalInfoArgs..............', props.totalInfoArgs);
        dispatch(
          deleteCoupon(
            productData.cartId,
            props.calledFrom,
            props.totalInfoArgs,
          ),
        );
      }
      setCoupon('');
    } else {
      Toast.show('Please enter a discount code', Toast.LONG);
    }
  };
  //..............................................................

  //.........................render..................................
  return (
    <View style={{marginTop: 40}}>
      <View style={{marginBottom: 10}}>
        <Text style={styles.titleText}>Apply Discount Code</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          editable={editable}
          style={{
            paddingBottom: 5,
            color: colors.textColor,
            width: '60%',
            borderBottomWidth: 0.3,
            borderColor: colors.textColor,
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            backgroundColor: editable ? 'white' : colors.lightGrey1,
          }}
          onChangeText={text => setCoupon(text)}
          value={coupon}
          placeholder={editable ? 'Enter Discount Code' : coupon}
          placeholderTextColor="grey"
        />
        <TouchableOpacity
          onPress={() => {
            if (prevDiscount && editable) {
              showWarning();
            } else {
              apply();
            }
          }}
          style={{
            width: 90,
            height: 30,
            backgroundColor: colors.blue,
            borderRadius: 15,
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={[styles.buttonText, {color: colors.white, fontSize: 14}]}>
            {editable ? 'Apply' : 'Remove'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryView: {
    marginTop: 50,
    borderWidth: 0.5,
    borderColor: colors.textColor,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
  },

  labeltext: {
    color: colors.textColor,
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  summaryText: {
    color: colors.blue,
    fontSize: 16,
    fontFamily: 'DRLCircular-Book',
  },
  summaryTextTitle: {
    color: colors.textColor,
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
    color: colors.blue,

    fontFamily: 'DRLCircular-Bold',
    fontSize: 18,
  },

  buttonText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.blue,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
export default ApplyCoupon;
