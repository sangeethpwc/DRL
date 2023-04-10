import React, {useState, useEffect,useRef} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import colors from './Colors';
import {useNavigation} from '@react-navigation/native';
import {
  setOrderId,
  setIndicatorSteps,
  refreshCartForPurchase,
} from '../slices/productSlices';
import {setShippingAddressId} from '../slices/authenticationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ImageBackground,} from 'react-native';
import GlobalConst from '../config/GlobalConst';
import {getCartListGeneral} from '../services/operations/productApis';
import utils from '../utilities/utils';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';

const CustomeHeaderCart = props => {
  const navigation = useNavigation();
  const [cartCount, setCartCount] = useState(0);

  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let perviousCount = 0;

  let nameDrawerRef = useRef(null);

  useEffect(() => {
    if (productData.cartAdded) {
      dispatch(getCartListGeneral());
    }
  }, [productData.cartAdded]);

  useEffect(() => {
    if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined
    ) {
      setCartCount(parseInt(productData.cartList.items.length));
    } else {
      setCartCount(0);
    }
  }, [productData.cartList]);

  function dialogView() {
    return (
      <Modal
        onClosed={() => setPopLink('')}
        style={{ height: '40%', width: '80%' }}
        //position={'bottom'}
        swipeToClose={false}
        ref={c => (nameDrawerRef = c)}
        backdropPressToClose={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
            }}
            style={{ position: 'absolute', right: 10, top: 0 }}>
           
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <ScrollView>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'DRLCircular-Book',
                  lineHeight: 16,
                }}>
                You are about to leave Dr.Reddy’s and affiliates website.{'\n'}
                {'\n'}
                Dr. Reddy's assumes no responsibility for the information
                presented on the external website or any further links from such
                sites. These links are presented to you only as a convenience,
                and the inclusion of any link does not imply endorsement by Dr.
                Reddy's. If you wish to continue to this external website, click
                Proceed.
              </Text>

            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={() => {

              nameDrawerRef.close();
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 10,
              marginTop: 0,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 25,
            }}>

            <Text style={styles.whiteTextMedium}>Close</Text>

          </TouchableOpacity>

        </View>
      </Modal>
    );
  }

  function setShippingIdDefault() {
    let finalAddress = {};
    let address = {};
    dispatch(setShippingAddressId(''));
    if (
      loginData.customerInfo !== undefined &&
      loginData.customerInfo.addresses !== undefined
    ) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (
          loginData.customerInfo.addresses[i].default_shipping &&
          utils.getAttributeFromCustom(
            loginData.customerInfo.addresses[i],
            'address_status',
          ) !== 'NA' &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ) !== undefined &&
          loginData.addressLabels.find(
            element =>
              element.value ===
              utils.getAttributeFromCustom(
                loginData.customerInfo.addresses[i],
                'address_status',
              ),
          ).label === 'Approved'
        ) {
          dispatch(
            setShippingAddressId(loginData.customerInfo.addresses[i].id),
          );
        }
      }
    }
  }

  function cartPressed() {
    if (GlobalConst.customerStatus === 'Approved') {
      dispatch(setOrderId(''));
      dispatch(setIndicatorSteps(0));
      setShippingIdDefault();
      dispatch(refreshCartForPurchase());
      navigation.navigate('MyCart');
      //ModalSubscription
    } else {
      Toast.show('Please complete Profile / Wait for approval', Toast.SHORT);
    }
  }

  const dispatch = useDispatch();

  return (
    <View>
      {props.addToCart !== undefined && GlobalConst.LoginToken.length > 0 ? (
        <TouchableOpacity
          onPress={
            () => cartPressed()
          }
          style={{}}>
          {/* <ImageBackground style={{width:20}}
         source={require('../images/cart_white.png')}
         resizeMode = "contain"
        /> */}

          <View style={{height: 30, width: 30, overflow: 'hidden'}}>
            <ImageBackground
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              source={require('../images/cart_white.png')}>
              {parseInt(cartCount) > 0 ? (
                <View
                  style={{
                    backgroundColor: colors.stepsColor,
                    width: 18,
                    height: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 12,
                      color: colors.white,
                    }}>
                    {cartCount}
                  </Text>
                </View>
              ) : null}
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ) : null}
    
    </View>
    
  );
};
export default CustomeHeaderCart;
