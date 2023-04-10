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
import {StatusBar, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import colors from '../../config/Colors';
import {
  BASE_URL_IMAGE,
  BASE_URL_DRL,
  productApiURLGenerator,
} from '../../services/ApiServicePath';
import StepIndicator from 'react-native-step-indicator';
import _ from 'lodash';
import {getCartList} from '../../services/operations/productApis';

import styles from '../../components/home/home_style';

const ShippingInformation = () => {
  const labels = ['My Cart', 'Address', 'Review & \nPlace Order'];

  const [Carts, setCarts] = useState([]);
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const [searchCart, setSearchCart] = useState('');

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.stepsColor,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: colors.stepsColor,
    stepStrokeUnFinishedColor: colors.transparent,
    separatorFinishedColor: colors.stepsColor,
    separatorUnFinishedColor: colors.lightGrey,
    stepIndicatorFinishedColor: colors.stepsColor,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: colors.stepsColor,
    labelSize: 13,
  };

  const renderStepIndicatorSteps = params => {
    return (
      <Image
        source={
          params.stepStatus === 'current'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'finished'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'unfinished'
            ? require('../../images/unselected_large.png')
            : null
        }
      />
    );
  };

  const renderCustomeLabel = params => {
    return params.position === 0 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Order Placed
      </Text>
    ) : params.position === 1 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Processing
      </Text>
    ) : params.position === 2 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Packed
      </Text>
    ) : params.position === 3 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Shipped
      </Text>
    ) : (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Arriving
      </Text>
    );
  };
  function search() {}

  useEffect(() => {
    if (productData.cartList.length > 0) {
      getCartsLists();
    }
    return () => {};
  }, [productData.cartList]);

  function renderCarts(item, index) {
    return (
      // <View>
      //     <Text>{item.name}</Text>
      // </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGrey,
            backgroundColor: colors.whiteGradient,
            width: '100%',
            height: 100,
            padding: 10,
          }}>
          {/* <Image source ={{uri: item.url}}  /> */}
          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
              margin: 10,
              color: colors.blue,
            }}>
            {item.name}
          </Text>

          <Text
            style={{
              fontFamily: 'DRLCircular-Light',
              width: 150,
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 12,
              margin: 10,
              color: colors.stepsColor,
              backgroundColor: colors.dashboardCard1BackgroundColor,
            }}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  }

  function getCartsLists() {
    return (
      <FlatList
        data={productData.cartList.items}
        renderItem={({item, index}) => renderCarts(item, index)}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <CustomeHeader
        backt="back"
        title="My Cart"
        addToWishList="addToWishList"
        addToLocation={'addToLocation'}
      />
      <View style={{marginTop: 20}}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={3}
          stepCount={3}
          direction={'horizontal'}
          labels={labels}
          renderStepIndicator={renderStepIndicatorSteps}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGrey,
            borderRadius: 10,
            width: '85%',
            padding: 5,
          }}>
          <TextInput
            style={{
              marginRight: 25,
              height: 35,
              fontFamily: 'DRLCircular-Book',
            }}
            onChangeText={search => searrch(search)}
            value={searchCart}
            placeholder="Enter PO No."
            placeholderTextColor={colors.placeholderColor}
          />
        </View>

        <View style={{}}>
          <TouchableOpacity
            onPress={() => {
              dispatch(endSearch());
              dispatch(getProductsSuccess([]));
              //    navigation.navigate('AllProducts',{name:email})
            }}>
            <Image
              resizeMode="contain"
              source={require('../../images/tick_s.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* {getCarts()} */}

      {getCartsLists()}

      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 200,
            backgroundColor: colors.blue,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {}}>
          <Text style={{color: colors.white}}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ShippingInformation;
