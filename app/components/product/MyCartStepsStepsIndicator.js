import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Image, TouchableOpacity} from 'react-native';
import colors from '../../config/Colors';
import StepIndicator from 'react-native-step-indicator';
import Toast from 'react-native-simple-toast';
import {
  setIndicatorSteps,
  setShippingMethodName,
  setDeliveryDateForPurchase,
  setDeliveryInstructionsForPurchase,
  setShippingTotalInformation,
  setOldCartState,
} from '../../slices/productSlices';

import {getCartListGeneralWithLoader} from '../../services/operations/productApis';

const MyCartStepsIndicator = props => {
  const dispatch = useDispatch();

  const labels = ['My Cart', 'Address', 'Review & \nPlace Order'];
  const productData = useSelector(state => state.product);
  const [step, setSteps] = useState({props}.props.step);

  const [checker, setChecker] = useState(false);

  // function onChangeText  (po) {
  //     setPO(po)
  //     props.setPONumber(po);
  // }

  const customStyles = {
    stepIndicatorSize: 15,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 1.5,
    currentStepStrokeWidth: 0,
    stepStrokeWidth: 1,

    stepStrokeUnFinishedColor: colors.transparent,
    separatorFinishedColor: colors.blue,
    separatorUnFinishedColor: colors.lightGrey,
    stepIndicatorFinishedColor: colors.blue,
    stepIndicatorUnFinishedColor: colors.blue,
    labelSize: 12,
  };

  function checkCartStock() {
    let temp = [];

    //
    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined
    ) {
      for (let i = 0; i < productData.cartList.items.length; i++) {
        if (
          productData.cartList.items[i] !== undefined &&
          productData.cartList.items[i].qty !== undefined &&
          productData.cartList.items[i].extension_attributes !== undefined &&
          productData.cartList.items[i].extension_attributes.salablequantity !==
            undefined
        ) {
          if (
            productData.cartList.items[i].qty >
            productData.cartList.items[i].extension_attributes.salablequantity
          ) {
            if (
              productData.cartList.items[i].extension_attributes !==
                undefined &&
              productData.cartList.items[i].extension_attributes
                .customoptions !== undefined
            ) {
              temp.push(productData.cartList.items[i].name + ' (Short Dated)');
            } else {
              temp.push(productData.cartList.items[i].name);
            }
          }
        }
      }
    }

    return temp;
  }

  useEffect(() => {
    if (checker) {
      let temp1 = cartChangeChecker();
      let temp2 = priceCheckChange();
      let temp3 = checkCartStock();

      if (temp1.length > 0) {
        // setChangeArr(temp);
        props.setChangeArrFromSteps(temp1);
        Toast.show('Please review before proceeding');
      } else if (temp2.length > 0) {
        props.setPriceChangeArrFromSteps(temp2);
        Toast.show('Please review before proceeding');
      } else if (temp3.length > 0) {
        props.setArrFromSteps(temp3);
        Toast.show(
          'Some items exceed available quantity.Please remove/update the items.',
        );
      } else {
        // setChangeArr([]);
        props.setChangeArrFromSteps([]);
        props.setPriceChangeArrFromSteps([]);
        props.setArrFromSteps([]);
        setSteps(1);
        dispatch(setIndicatorSteps(1));
        // dispatch(setShippingMethodName('standardshipping'));
        dispatch(setDeliveryInstructionsForPurchase(''));
        dispatch(setDeliveryDateForPurchase(''));
        dispatch(setShippingTotalInformation({}));
        props.setSteps(1);
      }
      setChecker(false);
    }
  }, [productData.cartList.items]);

  function cartChangeChecker() {
    let temp = [];
    for (let i = 0; i < productData.oldCartState.length; i++) {
      // console.log('Cart Items old..................', productData.oldCartState);
      if (
        productData.cartList !== undefined &&
        productData.cartList.items !== undefined &&
        productData.cartList.items.find(
          item => item.item_id === productData.oldCartState[i].item_id,
        ) === undefined
      ) {
        temp.push(productData.oldCartState[i].name);
      }
    }
    return temp;
  }

  function priceCheckChange() {
    let temp = [];
    for (let i = 0; i < productData.cartList.items.length; i++) {
      //console.log('Cart Items old..................', productData.oldCartState);
      if (
        productData.oldCartState.find(
          item => item.item_id === productData.cartList.items[i].item_id,
        ) !== undefined
      ) {
        let oldItem = productData.oldCartState.find(
          item => item.item_id === productData.cartList.items[i].item_id,
        );

        if (oldItem.price !== productData.cartList.items[i].price) {
          if (
            productData.cartList.items[i].extension_attributes !== undefined &&
            productData.cartList.items[i].extension_attributes.customoptions !==
              undefined
          ) {
            temp.push(productData.cartList.items[i].name + ' (Short Dated)');
          } else {
            temp.push(productData.cartList.items[i].name);
          }
        }
      }
    }
    // setPriceArr(temp);
    // dispatch(setOldCartState([]));
    // console.log('PriceArr.....................', temp);
    return temp;
  }

  const renderStepIndicatorSteps = params => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (props.PONum.length > 0) {
              if (
                productData.cartList !== undefined &&
                productData.cartList.items !== undefined &&
                productData.cartList.items.length > 0
              ) {
                if (params.position === 0) {
                  setSteps(0);
                  dispatch(setIndicatorSteps(0));
                  props.setSteps(0);
                } else if (params.position === 1) {
                  // if (checkCartStock()) {
                  //   Toast.show(
                  //     'Some items exceed available quantity.Please remove the items.',
                  //   );
                  //   //setShowErrorMsg(true)
                  // } else {
                  setChecker(true);
                  dispatch(setOldCartState(productData.cartList.items));
                  dispatch(getCartListGeneralWithLoader());

                  // setSteps(1);
                  // dispatch(setIndicatorSteps(1));
                  // dispatch(setShippingMethodName('standardshipping'));
                  // dispatch(setDeliveryInstructionsForPurchase(''));
                  // dispatch(setDeliveryDateForPurchase(''));
                  // dispatch(setShippingTotalInformation({}));
                  // props.setSteps(1);
                  // }
                } else if (params.position === 2) {
                  // setSteps(2)
                  // props.setSteps(2);
                }
              } else {
                Toast.show('Cart is empty', Toast.SHORT);
              }
            } else {
              Toast.show('Please Enter PO Number');
            }
          }}>
          <Image
            source={
              params.stepStatus === 'current'
                ? require('../../images/bluedot2x.png')
                : params.stepStatus === 'finished'
                ? require('../../images/greenTick.png')
                : params.stepStatus === 'unfinished'
                ? require('../../images/greydot2x.png')
                : require('../../images/greydot2x.png')
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (step !== productData.indicatorSteps) {
      setSteps(productData.indicatorSteps);
    }
  }, [productData.indicatorSteps]);

  return (
    <View
      style={{
        backgroundColor: colors.white,
        marginTop: 20,
        borderColor: colors.grey,
        marginBottom: 20,
      }}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={step}
        stepCount={3}
        direction={'horizontal'}
        labels={labels}
        renderStepIndicator={renderStepIndicatorSteps}
      />
      <View
        style={{
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.grey,
          marginTop: 10,
        }}></View>
    </View>
  );
};
export default MyCartStepsIndicator;
