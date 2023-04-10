import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, FlatList, Alert } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import colors from '../../config/Colors';
import _, { add } from 'lodash';
import {
  getCartList,
  addToCart,
  deleteCartItemByAdminToken,
  upateCartItemByAdminToken,
  addWishlist,
  getCartListGeneral,
} from '../../services/operations/productApis';
import {
  getProductDetailSuccess, setOrderId, setErrorMsg,
  setIndicatorSteps,
  refreshCartForPurchase,
} from '../../slices/productSlices';
import Counter from 'react-native-counters';
import utils from '../../utilities/utils';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import Toast from 'react-native-simple-toast';
import { BASE_URL_IMAGE } from '../../services/ApiServicePath';
import { useNavigation } from '@react-navigation/native';
import CartWishListItem from './CartWishListItem';
import { sha256 } from 'react-native-sha256';
import { displayName as appName } from '../../../app.json';
import styles from './productStyles';
import CartSummary from './CartSummary';
import ApplyCoupon from './ApplyCoupon';


// import CountDown to show the timer
import CountDown from 'react-native-countdown-component';
import { getCustomerInfoAfterAddAddress } from '../../services/operations/getToken';


// import moment to help you play with date and time
import moment from 'moment';
import 'moment-timezone';

const CartList = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  const [cartLists, setCartLists] = useState(productData.cartList.items);
  const [text, setText] = useState('Update quantity');
  const [step, setSteps] = useState(0);

  const [quntity, setItem] = useState('');

  const [type, setType] = useState('');

  let pcr_typ;

  const [totalDuration, setTotalDuration] = useState(0);

  const [changeArr, setChangeArr] = useState([]);
  const [priceArr, setPriceArr] = useState([]);
  const [arr, setArr] = useState([]);

  function showWarning() {
    Alert.alert(
      'Alert',
      'Item was removed from your cart by expiration of reservation.',
      [
        {
          text: 'Ok',
          onPress: () => {
            console.log('onrefresh....1')
            setTimeout(() => {
              props.clearArr()
              console.log('onrefresh....2')
              dispatch(getCartListGeneral());
           },3000);
           
          },
        },
      ],
      { cancelable: false },
    );
  };

  useEffect(() => {
  
    let date =
      moment()
        .utcOffset('+05:30')
        .format('YYYY-MM-DD hh:mm:ss');

    let expirydate = '2022/11/29 08:57:51';

    let diffr =
      moment
        .duration(moment(expirydate)
          .diff(moment(date)));
    // Difference of the expiry date-time
    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());

    // Converting in seconds
    var d = hours * 60 * 60 + minutes * 60 + seconds;

    // Settign up the duration of countdown
    setTotalDuration(d);
  }, []);

  useEffect(() => {
    //props.clearForPriceCheck();
    dispatch(getCartListGeneral());
  }, []);

  useEffect(() => {
    if (
      cartLists !== undefined &&
      cartLists.length !== 0 &&
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined &&
      productData.cartList.items.length === 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      setCartLists([]);
    } else if (
      productData.cartList !== undefined &&
      productData.cartList.items !== undefined &&
      productData.cartList.items.length > 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      setCartLists(productData.cartList.items);
      // props.priceCheckChange();
    }
  }, [productData.cartList.items]);

  function isAddedToWishList(sku) {
    let index = -1;
    index = productData.wishlist.items.findIndex(
      val => val !== undefined && val.product.sku === sku,
    );
    return index;
  }

  function renderItemDetails(item) {

    console.log('dStr...' + moment().utcOffset("-05:00").format("YYYY-MM-DD HH:mm:ss"));

    let date =
      moment()
        .utcOffset('-05:00')
        .format('YYYY-MM-DD HH:mm:ss');

    let current_time = item.extension_attributes.current_store_time;
    let expirydate = item.extension_attributes.timer_expire_at;

    console.log('current_time...' + current_time);
    console.log('current_time...' + expirydate);

    // // console.log('dStr...' + moment.tz.setDefault("America/New_York"));

    //     const event = new Date();

    //   // British English uses day-month-year order and 24-hour time without AM/PM
    //   console.log(event.toLocaleString('en-IN', { timeZone: 'America/New_York' }));
    //   // expected output: 20/12/2012, 03:00:00

    //   // Korean uses year-month-day order and 12-hour time with AM/PM
    //   console.log(event.toLocaleString('en-US', { timeZone: 'Asia/kolkata' }));

    var current_date = new Date();
  
    var dStr = current_date.toLocaleString("en-IN", {timeZone: 'America/New_York'})

    console.log('dStr...' + dStr);

    let diffr =
      moment
        .duration(moment(expirydate)
          .diff(moment(date)));
          
      console.log('expirydate...' + diffr);

    // Difference of the expiry date-time
    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());

    // Converting in seconds
    var d = (hours * 60 * 60) + (minutes * 60) + (seconds + 8);

    console.log('expirydate...' + d)

    return (
      <View style={{ marginTop: 5 }}>

        <View style={{ flexDirection: 'row', marginTop: 0 }}>

          {/* <View style={{ width: '60%', marginRight: 10 }}> */}

          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 15,
              marginTop: 0,
              marginBottom: 10,
              paddingRight: 10,
              paddingBottom: 10,
              paddingTop: 10,
              color: colors.textColor,
            }}>

            Reserved For (Minutes) :

          </Text>

          {/* </View> */}

          {<CountDown
            size={15}
            until={d}

            onFinish={() => {showWarning()}}

            //   Alert.alert(
            // 'Alert',
            // 'Item '+ item.name +' was removed from your cart by expiration of reservation.',
            //   [
            //     {
            //       text: 'OK',

            //       onPress: () => {
            //         {onRefresh}
            //         dispatch(setOrderId(''));
            //         dispatch(setIndicatorSteps(0));
            //         dispatch(refreshCartForPurchase());
            //         navigation.navigate('MyCart');
            //       },




            //     },
            //   ],
            //   {cancelable: false},
            // )

            digitStyle={{ backgroundColor: '#FFF', borderColor: '#FFF' }}
            timeToShow={['M', 'S']}
            timeLabels={{ m: null, s: null }}
            showSeparator
          />}

          <View style={{ marginRight: 10 }}>

            {/* <CountDown
         size={15}
         until={500}
         onFinish={() => alert('Finished')}
         digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#FFF'}}
         timeToShow={['M', 'S']}
         timeLabels={{m: null, s: null}}
         showSeparator
       /> */}

          </View>

        </View>

        <View style={{ flexDirection: 'row' }}>

          <View style={{ width: '60%', marginRight: 10 }}>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
              }}>
              Total Content:
            </Text>

            {item.extension_attributes !== undefined &&
              item.extension_attributes.strength !== undefined &&
              loginData.strengthLabels.find(
                element => element.value === item.extension_attributes.strength,
              ) != undefined && (

                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'DRLCircular-Light',
                    color: colors.textColor,
                    width: '90%',
                  }}>
                  {
                    loginData.strengthLabels.find(
                      element =>
                        element.value === item.extension_attributes.strength,
                    ).label
                  }
                </Text>
              )}
          </View>

          <View>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
              }}>
              Pack Size:{' '}
            </Text>
            {item.extension_attributes !== undefined &&
              item.extension_attributes.packsize !== undefined &&
              loginData.packLabels.find(
                element => element.value === item.extension_attributes.packsize,
              ) != undefined && (
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Light',
                    color: colors.textColor,
                  }}>
                  {
                    loginData.packLabels.find(
                      element =>
                        element.value === item.extension_attributes.packsize,
                    ).label
                  }
                </Text>
              )}
          </View>
        </View>
        {/* {item.extension_attributes!==undefined && item.extension_attributes.casepack!==undefined &&
                <Text style={{fontFamily:'DRLCircular-Light'}}>Case Pack: {item.extension_attributes.casepack}</Text>} */}
      </View>
    );
  }

  function onChange(number, type, item) {
    //
    //
    dispatch(upateCartItemByAdminToken(item, number));
  }

  function onChanged(value, item, qnty) {

    console.log('values Changed.....');

    if (value === 1) {
      pcr_typ = 'price'; ``
    } else if (value === 2) {
      pcr_typ = 'sub_wac';
    } else {
      pcr_typ = 'phs_indirect';
    }

    console.log('values......' + item.sku, item.qty, type, productData.cartList.id,);

    console.log('quntity......' + qnty);

    dispatch(
      upateCartItemByAdminToken(
        item,
        qnty,
        productData.cartList,
        pcr_typ
      ),
    );

  }

  function getQuantityCounter(item) {
    //
    // let count=item.qty;
    return <Counter start={item.qty} min={1} item={item} onChange={onChange} />;
  }

  function submitting(item) {
    //
    if (quntity.length === 0) {
    } else if (
      (parseInt(quntity) > 0 && parseInt(quntity) === item.qty) ||
      parseInt(quntity) === 0
    ) {
      Toast.show('Please use a different quantity', Toast.SHORT);
      setItem('');
    } else if (parseInt(quntity) > item.extension_attributes.salablequantity) {
      Alert.alert(
        'Please Note',
        'To Order rest ' +
        (quntity - item.extension_attributes.salablequantity) +
        ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
        [{ text: 'Ok' }, ,],
      );

      if (item.qty !== parseInt(item.extension_attributes.salablequantity)) {
        dispatch(
          upateCartItemByAdminToken(
            item,
            item.extension_attributes.salablequantity,
            productData.cartList,
            pcr_typ
          ),
        );
      }

      setItem('');
      // setText('Update quantity');
    } else {
      props.clearArr();
      //

      dispatch(upateCartItemByAdminToken(item, quntity, productData.cartList));
      setItem('');
    }
  }

  function renderCarts(item, index) {

    console.log('......test cart get......')

    const types = [];

    if (item.extension_attributes.regular_price !== undefined) {
      types.push(item.extension_attributes.regular_price.toString());
    }

    if (item.extension_attributes.subwac_price !== undefined) {
      types.push(item.extension_attributes.subwac_price.toString());
    }

    if (item.extension_attributes.phs_price !== undefined) {
      ;
      types.push(item.extension_attributes.phs_price.toString());
    }

    return (

      <View
        style={{
          flexDirection: 'column',
          marginTop: 20,
          marginLeft: 10,
          marginRight: 10,
          borderWidth: 1,
          borderColor: colors.lightGrey,
        }}>

        <View>

          {item.extension_attributes !== undefined &&
            item.extension_attributes.customoptions !== undefined &&
            item.extension_attributes.customoptions[0] !== undefined ? (

            <View
              style={{
                backgroundColor: '#FF7069',
                left: 0,
                top: 0,
                padding: 5,
                position: 'absolute',
                zIndex: 1,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  color: colors.white,
                  fontFamily: 'DRLCircular-Light',
                }}>
                Special Buy
              </Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', backgroundColor: colors.white }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* <Image style={{height:100, width:100}} resizeMode='contain'  source={require('../../images/Group_741.png')}/>  */}
              {item.extension_attributes !== undefined &&
                item.extension_attributes.image !== undefined ? (
                <Image
                  style={{ height: 100, width: 100 }}
                  resizeMode="contain"
                  source={{
                    uri: BASE_URL_IMAGE + item.extension_attributes.image,
                  }}
                />
              ) : (
                <Image
                  style={{ height: 100, width: 100 }}
                  resizeMode="contain"
                  source={require('../../images/Group_741.png')}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                margin: 10,
                marginLeft: 10,
                justifyContent: 'center',
              }}>
              <View style={{}}>
                <View
                  style={{
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Light',
                      fontSize: 16,
                      color: colors.grey,
                      marginBottom: 5,
                    }}>
                    NDC: {item.sku}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(getProductDetailSuccess({}));
                      if (item.product_type === 'simple') {
                        console.log('Check...........');
                        navigation.navigate('ProductDetail', { sku: item.sku });
                      } else {
                        navigation.navigate('ProductDetailConfigurable', {
                          sku: item.sku,
                        });
                      }
                    }}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 18,
                        color: colors.blue,
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  {item.extension_attributes !== undefined &&
                    item.extension_attributes.customoptions !== undefined &&
                    item.extension_attributes.customoptions[0] !==
                    undefined && (
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          fontSize: 14,
                          color: colors.textColor,
                          marginVertical: 5,
                        }}
                        numberOfLines={2}>
                        {
                          JSON.parse(item.extension_attributes.customoptions[0])
                            .label
                        }{' '}
                        {
                          JSON.parse(item.extension_attributes.customoptions[0])
                            .value
                        }
                      </Text>
                    )}

                  {item.price > 0 && (
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Bold',
                        fontSize: 22,
                        color: colors.textColor,
                        marginTop: 10,
                        marginBottom: 5,
                      }}>
                      ${utils.formatPrice(item.price * item.qty)}
                    </Text>
                  )}
                </View>
                {item.extension_attributes !== undefined &&
                  item.extension_attributes.salablequantity !== undefined && (
                    <View style={{ marginTop: 5 }}>
                      {item.extension_attributes.salablequantity > 0 ? (
                        <View
                          style={[
                            styles.labelGreen,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              width: 100,
                            },
                          ]}>
                          <Text style={[styles.greenLight, { fontSize: 14 }]}>
                            In stock
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.labelRed,
                            {
                              paddingVertical: 5,
                              paddingHorizontal: 5,
                              width: 100,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.greenLight,
                              { fontSize: 14, color: colors.red },
                            ]}>
                            Out of stock
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            borderRadius: 1,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.grey,
            marginTop: 5,
            marginHorizontal: 10,
          }}>

        </View>

        <View style={{ padding: 10, paddingBottom: 20 }}>

          {/* Counter added  */}

          {renderItemDetails(item)}

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ width: '60%', marginRight: 10 }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  marginTop: 5,
                  marginBottom: 5,
                  color: colors.textColor,
                }}>
                Quantity in packs: {item.qty}
              </Text>

              {item.extension_attributes !== undefined &&
                item.extension_attributes.salablequantity !== undefined &&
                item.extension_attributes.salablequantity > 0 &&
                item.price > 0 && (
                  <View
                    style={{
                      borderWidth: 0.5,
                      width: 110,
                      padding: 0,
                      fontSize: 16,
                      borderColor: colors.grey,
                      borderRadius: 10,
                    }}>
                    <TextInput
                      style={{
                        width: 110,
                        height: 30,
                        paddingVertical: 0,
                        paddingLeft: 5,
                        paddingRight: 5,
                        fontFamily: 'DRLCircular-Book',
                      }}
                      value={quntity === '' && ''}
                      placeholder={'Edit qnt.'}
                      placeholderTextColor={colors.placeholderColor}
                      keyboardType={'number-pad'}
                      returnKeyType={'done'}
                      onChangeText={value => setItem(value)}
                      onSubmitEditing={() => {
                        submitting(item);
                      }}
                      blurOnSubmit={true}
                    />
                  </View>
                )}
            </View>

            <View style={{ marginRight: 10 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  color: colors.textColor,
                }}>
                Price per pack:
              </Text>
              {item.price !== undefined && (
                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 2,
                    fontFamily: 'DRLCircular-Light',
                    color: colors.textColor,
                    width: '90%',
                  }}>
                  ${utils.formatPrice(item.price)}
                </Text>
              )}
            </View>



            {/* <View style={{marginTop: 5}}>
              <Text
                style={{
                  width: '99%',
                  fontFamily: 'DRLCircular-Book',
                  color: colors.textColor,
                }}>
                Packs Available:
              </Text>
              {item.extension_attributes !== undefined &&
                item.extension_attributes.salablequantity !== undefined && (
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Light',
                      color: colors.textColor,
                    }}>
                    {item.extension_attributes.salablequantity}
                  </Text>
                )}
            </View> */}

          </View>
        </View>

        {/* {item.extension_attributes !== undefined &&
            item.extension_attributes.customoptions !== undefined &&
            item.extension_attributes.customoptions[0] !== undefined ? ( */}

        <View style={{ marginLeft: 10, marginBottom: 15 }}>


          {
            item.extension_attributes.customoptions !== undefined &&
              item.extension_attributes.customoptions[0] !== undefined ? (

              null

            ) :

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  color: colors.textColor,
                  marginBottom: 5,
                  marginRight: 10,
                }}>
                Price per pack:
              </Text>
          }


          {
            item.extension_attributes.customoptions !== undefined &&
              item.extension_attributes.customoptions[0] !== undefined ? (

              null

            ) : <View
              style={[
                styles.input,
                { flexDirection: 'row', marginRight: 10, alignItems: 'center' },
              ]}>

              <ModalDropdown
                style={{ width: '80%' }}
                textStyle={{
                  fontSize: 16,
                  fontFamily: 'DRLCircular-Book',
                  color: colors.textColor,
                }}
                dropdownStyle={{ width: '75%', height: 150 }}
                dropdownTextStyle={{ fontSize: 16, fontFamily: 'DRLCircular-Book' }}
                defaultValue={"$ " + utils.formatPrice(item.price)}
                options={types}
                onSelect={value => onChanged(value + 1, item, item.qty)}

              />

              <Image
                style={{ position: 'absolute', right: 10, zIndex: 2 }}
                source={require('../../images/bottom_small.png')}
              />

            </View>}

        </View>

        <View
          style={{
            width: '100%',
            height: 45,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.shopCategoryBackground,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: colors.lightGrey,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: '48%',
              alignItems: 'center',
            }}
            onPress={() => {
              props.clearArr();

              dispatch(
                deleteCartItemByAdminToken(
                  item,
                  undefined,
                  productData.cartList,
                ),
              );
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={require('../../images/delete.png')}
              />
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  color: colors.blue,
                  marginLeft: 5,
                  fontSize: 14,
                }}>
                {' '}
                Remove
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{ backgroundColor: colors.blue, width: 1, margin: 5 }}></View>

          <CartWishListItem sku={item.sku} />
        </View>

      </View>
    );
  }

  function getCartsLists() {
    console.log('...............test cart get.................')
    return (
      <FlatList
        data={cartLists}
        renderItem={({ item, index }) => renderCarts(item, index)}
      />
    );
  }

  return (
    <View>
      {/* <Text style={{marginTop:10,marginLeft:10,fontFamily:'DRLCircular-Book',color:colors.textColor,fontSize:16}}>Free Delivery on order above $500.00</Text> */}
      {getCartsLists()}

      {cartLists !== undefined &&
        cartLists.length === 0 &&
        !productData.isLoading && (
          <View style={{ height: '50%', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'DRLCircular-Book', fontSize: 18 }}>
              No item added
            </Text>
          </View>
        )}

      {cartLists !== undefined && cartLists.length > 0 && <ApplyCoupon />}

      {cartLists !== undefined && cartLists.length > 0 && <CartSummary />}

      <LoaderCustome />
    </View>
  );
};
export default CartList;
