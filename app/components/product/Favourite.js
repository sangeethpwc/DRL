import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, Image, FlatList, RefreshControl} from 'react-native';
import {
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';

import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import _, {add} from 'lodash';
import {
  addToCart,
  getCartID,
  getWishlist,
  deleteWishlist,
  getAdminTokenForWishListDelete,
  updateWishlist,
  getProductsListConfigurable,
  getProductDetailWishlist,
} from '../../services/operations/productApis';
import {
  setWishlistSuccess,
  setErrorMsg,
  getProductDetailSuccess,
  setConfigurableProducts,
  setStockStatus,
  getProductDetailSuccessWishlist,
} from '../../slices/productSlices';

import Counter from 'react-native-counters';
import utils from '../../utilities/utils';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import styles from '../home/home_style';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import AllProductVariants from '../product/AllProductVariants';
import Modal from 'react-native-modalbox';
import pstyles from './productStyles';

var setSelectedStrengthValue = '';
var setSelectedPackValue = '';
var setQuantityValue = 0;

const Wishlist = () => {
  const navigation = useNavigation();
  let bottomDrawerVariantRefConfigurable = useRef(null);

  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);
  const [wislist, setWishList] = useState(productData.wishlist.items);

  const [quantity, setQuantity] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [selectConfigurableItem, setConfigurablProduct] = useState(undefined);
  const [selectConfigurableItemParent, setConfigurablProductParent] = useState(
    undefined,
  );
  const [selectedItem, setItem] = useState(undefined);

  function submitting(item) {
    //
    if (quantity.length === 0) {
    } else if (parseInt(quantity) > 0 && parseInt(quantity) === item.qty) {
      //Do nothing
    }
    // else if (
    //   parseInt(quantity) === 0 ||
    //   parseInt(quantity) > item.salable_qty[0].qty
    // ) {
    //   Toast.show(
    //     'Available quantity : ' + item.salable_qty[0].qty,
    //     Toast.SHORT,
    //   );
    //   //setText("Update quantity")
    // }
    else {
      //
      dispatch(updateWishlist(item.wishlist_item_id, quantity));
      setQuantity('');
    }
  }

  function renderItemDetails(item) {
    //
    return (
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '60%', marginRight: 10}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
              }}>
              Total Content:
            </Text>
            {item.product.strength !== undefined &&
              loginData.strengthLabels.find(
                element => element.value === item.product.strength,
              ) !== undefined && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'DRLCircular-Light',
                    color: colors.textColor,
                  }}>
                  {
                    loginData.strengthLabels.find(
                      element => element.value === item.product.strength,
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
              Pack Size:
            </Text>
            {item.product.pack_size !== undefined &&
              loginData.packLabels.find(
                element => element.value === item.product.pack_size,
              ) != undefined && (
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Light',
                    color: colors.textColor,
                    width: '90%',
                  }}>
                  {
                    loginData.packLabels.find(
                      element => element.value === item.product.pack_size,
                    ).label
                  }
                </Text>
              )}
          </View>
        </View>
        {/* { item.product.case_pack!==undefined &&
 <Text style={{fontFamily:'DRLCircular-Light'}}>Case Pack: {item.product.case_pack}</Text>} */}
      </View>
    );
  }
  useEffect(() => {
    dispatch(getWishlist());
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getWishlist());
  };

  useEffect(() => {
    if (
      productData.wishlist !== undefined &&
      productData.wishlist.items !== undefined &&
      productData.wishlist.items.length > 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      setWishList(productData.wishlist.items);
    } else if (
      productData.wishlist !== undefined &&
      productData.wishlist.items !== undefined &&
      productData.wishlist.items.length === 0 &&
      wislist !== undefined &&
      wislist.length > 0 &&
      GlobalConst.LoginToken.length > 0
    ) {
      setWishList([]);
    }
    setRefreshing(false);
  }, [productData.wishlist]);

  useEffect(() => {
    if (
      !_.isEmpty(productData.productDetailWishlist) &&
      productData.productDetailWishlist.sku !== undefined
    ) {
      setItem(productData.productDetailWishlist);
      dispatch(
        getProductsListConfigurable(
          productData.productDetailWishlist.sku,
          'AllProducts',
        ),
      );
    }
  }, [productData.productDetailWishlist]);

  useEffect(() => {
    let msg = '';
    msg = productData.errorMsg;
    dispatch(setErrorMsg(''));
    if (msg.length > 0) {
      Alert.alert(
        'Error',
        productData.errorMsg,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(setErrorMsg(''));
            },
          },
        ],
        {cancelable: false},
      );
    }
    return () => {};
  }, [productData.errorMsg]);

  useEffect(() => {
    if (
      bottomDrawerVariantRefConfigurable !== undefined &&
      productData.configurableProducts.length > 0
    ) {
      setSelectedStrengthValue = loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProducts[0],
            'strength',
          ),
      ).label;
      setSelectedPackValue = loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProducts[0],
            'pack_size',
          ),
      ).label;
      setConfigurablProduct(productData.configurableProducts[0]);
      setQuantityValue = 0;
      bottomDrawerVariantRefConfigurable.open();
    } else if (bottomDrawerVariantRefConfigurable !== undefined) {
      bottomDrawerVariantRefConfigurable.close();
      dispatch(getProductDetailSuccessWishlist({}));
    }
  }, [productData.configurableProducts]);

  function sortConfigurable() {
    if (selectedItem.type_id !== 'simple') {
      let selectedStrength = undefined;
      let selectedPack = undefined;
      let item = null;
      let itemFound = false;
      for (let i = 0; i < productData.configurableProducts.length; i++) {
        item = productData.configurableProducts[i];
        selectedStrength = loginData.strengthLabels.find(
          element => element.label === setSelectedStrengthValue,
        );
        selectedPack = loginData.packLabels.find(
          element => element.label === setSelectedPackValue,
        );
        if (
          selectedStrength !== undefined &&
          selectedPack !== undefined &&
          utils.getAttributeFromCustom(item, 'strength') != 'NA' &&
          utils.getAttributeFromCustom(item, 'strength') ===
            selectedStrength.value &&
          utils.getAttributeFromCustom(item, 'pack_size') != 'NA' &&
          utils.getAttributeFromCustom(item, 'pack_size') === selectedPack.value
        ) {
          dispatch(setStockStatus(''));
          setConfigurablProduct(item);
          itemFound = true;
          break;
        }
      }

      if (itemFound === false) {
        Toast.show(
          'Selected strength and pack variants unavailable',
          Toast.SHORT,
        );
        setConfigurablProduct();

        if (selectedItem !== undefined) {
          setItem(selectedItem);
        }

        if (productData.configurableProducts.length > 0) {
          setConfigurablProduct(productData.configurableProducts[0]);
        }
      }
    }
  }

  function setSelectedStrength(value) {
    setSelectedStrengthValue = value;
    if (
      setSelectedStrengthValue !== undefined &&
      setSelectedPackValue !== undefined
    ) {
      sortConfigurable();
      //
    }
  }

  function setSelectedPack(value) {
    if (
      setSelectedStrengthValue !== undefined &&
      setSelectedPackValue !== undefined
    ) {
      setSelectedPackValue = value;
      sortConfigurable();
    }

    //
  }

  function setQuantityConfig(value) {
    setQuantityValue = value;

    //
  }

  function bottomSliderProductVariantsConfigurable() {
    return (
      <Modal
        style={[styles.modal, {height: 400}]}
        position={'bottom'}
        backdropPressToClose={false}
        swipeToClose={false}
        ref={c => (bottomDrawerVariantRefConfigurable = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white,
            borderBottomColor: colors.grey,
            borderBottomWidth: 1,
            borderStyle: 'dotted',
          }}>
          <View style={{height: 80, justifyContent: 'center', marginLeft: 10}}>
            {selectConfigurableItem !== undefined && (
              <Text style={styles.headerTextCart}>
                Select Product Variants{'\n'}NDC: {selectConfigurableItem.sku}
              </Text>
            )}

            {/* {GlobalConst.LoginToken.length>0 && selectedItem !== undefined && selectedItem.stock !== undefined &&
 <View style={[styles.labelGreen,{ height:30, alignItems: 'center'}]}>
 <Text style={[styles.greenLight,{fontSize:14, marginTop:5}, ]}>Available: {selectedItem.stock}</Text>
 </View>
 } */}
          </View>

          {GlobalConst.LoginToken.length > 0 &&
            selectedItem !== undefined &&
            GlobalConst.customerStatus === 'Approved' && (
              <AllProductVariants
                productDetail={selectedItem}
                casePack={selectConfigurableItem}
                setSelectedStrength={setSelectedStrength}
                setSelectedPack={setSelectedPack}
                setQuantity={setQuantityConfig}
              />
            )}

          <View style={styles.footer}>
            {selectConfigurableItem !== undefined && (
              <Text
                style={[
                  styles.blackTextMedium,
                  {fontSize: 24, fontFamily: 'DRLCircular-Bold'},
                ]}>
                ${selectConfigurableItem.price}
              </Text>
            )}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  if (setQuantityValue === 0) {
                    Toast.show('Please select quantity', Toast.SHORT);
                  } else if (
                    parseInt(productData.stockStatus) <
                    parseInt(setQuantityValue)
                  ) {
                    Toast.show('Invaild quantity', Toast.SHORT);
                    //setQuantityData(0);
                  } else {
                    if (_.isEmpty(productData.cartId)) {
                      dispatch(
                        getCartID(
                          selectConfigurableItem.sku,
                          setQuantityValue,
                          'general',
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                    } else {
                      dispatch(
                        addToCart(
                          selectConfigurableItem.sku,
                          setQuantityValue,
                          productData.cartId,
                        ),
                      );
                      bottomDrawerVariantRefConfigurable.close();
                    }
                    dispatch(setConfigurableProducts([]));
                    dispatch(getProductDetailSuccessWishlist({}));
                  }
                }}
                style={[styles.buttonSelected, {marginLeft: 10}]}>
                <Text style={styles.whiteTextMedium}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              right: 10,
              top: 20,
            }}
            onPress={() => {
              if (
                bottomDrawerVariantRefConfigurable !== undefined &&
                bottomDrawerVariantRefConfigurable !== null
              ) {
                bottomDrawerVariantRefConfigurable.close();
                dispatch(setConfigurableProducts([]));
                dispatch(getProductDetailSuccessWishlist({}));
              }
            }}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // useEffect(() => {
  //
  // if( productData.wishlist!==undefined && _.isEmpty(productData.wishlist.items) && GlobalConst.LoginToken.length>0
  // ){
  // dispatch(getWishlist())
  // }

  // }, []);

  function getWishlistData() {
    let count = GlobalConst.LoginToken.length;
    if (
      productData.wishlistEmpty === false &&
      _.isEmpty(productData.wishlist)
      // && productData.wishlist!==undefined && productData.wishlist.items!==undefined && productData.wishlist.items.length===0 && count>0
    ) {
      dispatch(getWishlist());
    }
  }

  // function getPackSizePickerConfigurable(){
  // let attrib = utils.getAttributeFromCustomForConfigurable(productDetail,'Pack Size');
  // let values = [];
  // let strengthValues = [];

  // if(attrib!==undefined && attrib.length>0){
  // let v="";
  // for(let i=0; i<attrib.length; i++){
  // v=attrib[i].value_index;
  // for(let p=0; p<loginData.packLabels.length; p++){
  // if( loginData.packLabels[p].value === ""+ v ){
  // strengthValues.push(loginData.packLabels[p].label);
  // }
  // }
  // }
  // }
  // return(
  // <View style={{ borderWidth: 1, borderColor: colors.textInputBorderColor, borderRadius:5, marginRight:20, marginTop:5}}>
  // <Picker style={{height:30}}
  // selectedValue={selectedStrength}
  // mode='dropdown'

  // onValueChange={(itemValue, itemIndex) => setSelectedStrength(itemValue)}>
  // {strengthValues!=undefined && strengthValues.length>0
  // ?
  // strengthValues.map((labelValue)=>
  // <Picker.Item
  // label={labelValue} value={labelValue} />
  // )
  // :
  // <Picker.Item label="NA" value="NA" />
  // }

  // </Picker>
  // </View>
  // )
  // }

  // function getPackSizePicker(){
  // return(
  // <View style={{ borderWidth: 1, borderColor: colors.textInputBorderColor, borderRadius:5, marginRight:20, marginTop:5}}>
  // <Picker style={{height:30}}
  // selectedValue={selectedPack}
  // mode='dropdown'
  // onValueChange={(itemValue, itemIndex) => setSelectedPack(itemValue)}>
  // {loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size'))!=undefined
  // ?
  // <Picker.Item label={loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')).label} value={loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')).label} />
  // :
  // <Picker.Item label="NA" value="NA" />
  // }
  // </Picker>
  // </View>
  // )
  // }

  function renderWishlist(item, index) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: colors.lightGrey,
          backgroundColor: colors.white,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            backgroundColor: colors.white,
            paddingVertical: 15,
          }}>
          {item.product.image !== undefined ? (
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={{uri: BASE_URL_IMAGE + item.product.image}}
            />
          ) : (
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={require('../../images/Group_741.png')}
            />
          )}

          <View style={{flexDirection: 'column', padding: 10, width: '70%'}}>
            {item.product.type_id === 'simple' && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.grey,
                }}>
                NDC: {item.product.sku}
              </Text>
            )}

            <TouchableOpacity
              style={{marginVertical: 5}}
              onPress={() => {
                dispatch(getProductDetailSuccess({}));

                if (item.product.type_id === 'simple') {
                  navigation.navigate('ProductDetail', {
                    sku: item.product.sku,
                  });
                } else {
                  navigation.navigate('ProductDetailConfigurable', {
                    sku: item.product.sku,
                  });
                }
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 18,
                  color: colors.textColor,
                }}>
                {item.product.name}
              </Text>
            </TouchableOpacity>
            {/* {item.product.type_id==="simple" ? getPackSizePicker(): getPackSizePickerConfigurable()} */}
          </View>
        </View>
        <View
          style={{
            borderRadius: 1,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.grey,
            marginTop: 10,
            marginHorizontal: 20,
          }}></View>

        {item.product.type_id === 'simple' && (
          <View style={{padding: 20, paddingTop: 5}}>
            {renderItemDetails(item)}

            <View style={{flexDirection: 'row'}}>
              <View style={{width: '60%'}}>
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

                {/* {item.salable_qty !== undefined &&
                  item.salable_qty.length > 0 &&
                  item.salable_qty[0] !== undefined &&
                  item.salable_qty[0].qty !== undefined &&
                  item.salable_qty[0].qty > 0 &&
                  item.product.price > 0 && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          borderWidth: 0.5,
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
                          placeholder={'Update qnt.'}
                          placeholderTextColor={colors.placeholderColor}
                          keyboardType={'number-pad'}
                          returnKeyType={'done'}
                          onChangeText={value => setQuantity(value)}
                          onSubmitEditing={() => {
                            submitting(item);
                          }}
                          blurOnSubmit={true}
                          // value={text}
                        />
                      </View>
                    </View>
                  )} */}
                   
              </View>

              {/* <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    color: colors.textColor,
                    width: '99%',
                  }}>
                  Packs Available :
                </Text>
                {item.salable_qty !== undefined &&
                  item.salable_qty.length > 0 &&
                  item.salable_qty[0] !== undefined &&
                  item.salable_qty[0].qty !== undefined && (
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        color: colors.textColor,
                      }}>
                      {item.salable_qty[0].qty}
                    </Text>
                  )}
              </View> */}

              {item.salable_qty !== undefined &&
                item.salable_qty.length > 0 &&
                item.salable_qty[0] !== undefined &&
                item.salable_qty[0].qty !== undefined && (
                  <View>
                    {item.salable_qty[0].qty > 0 ? (
                      <View
                        style={[
                          pstyles.labelGreen,
                          {
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            width: 100,
                          },
                        ]}>
                        <Text style={[pstyles.greenLight, {fontSize: 14}]}>
                          In stock
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          pstyles.labelRed,
                          {
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            width: 100,
                          },
                        ]}>
                        <Text
                          style={[
                            pstyles.greenLight,
                            {fontSize: 14, color: colors.red},
                          ]}>
                          Out of stock
                        </Text>
                      </View>
                    )}
                  </View>
                )}
            </View>

            <View
              style={{
                borderRadius: 1,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.grey,
                marginTop: 20,
              }}></View>
            {item.product.price > 0 && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 18,
                  marginTop: 10,
                  color: colors.textColor,
                }}>
                {item.product.custom_min_price} - {item.product.custom_max_price}  
              </Text>
            )}
          </View>
        )}

        <View
          style={{
            width: '100%',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopColor: colors.lightGrey,
            backgroundColor: colors.shopCategoryBackground,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: colors.lightGrey,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: '48%',
              alignItems: 'center',
            }}
            onPress={() => {
              // let temp=_.cloneDeep(wislist);
              // //
              // //
              // temp.splice(index,1);
              //
              // setWishList(temp);
              // dispatch(getWishlist());
              // dispatch(setWishlistSuccess(temp));
              // dispatch(deleteWishlist(item.id))
              dispatch(getAdminTokenForWishListDelete(item.wishlist_item_id));
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
            style={{backgroundColor: colors.blue, width: 1, margin: 5}}></View>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: '48%',
              alignItems: 'center',
            }}
            onPress={() => {
              dispatch(getProductDetailSuccess({}));

              if (item.product.type_id === 'simple') {
                navigation.navigate('ProductDetail', {
                  sku: item.product.sku,
                });
              } else {
                navigation.navigate('ProductDetailConfigurable', {
                  sku: item.product.sku,
                });
              }
              // if (GlobalConst.customerStatus === 'Approved') {
              //   if (item.product.type_id === 'simple') {
              //     let index = -1;
              //     let qty = 0;
              //     if (
              //       productData.cartList !== undefined &&
              //       productData.cartList.items !== undefined &&
              //       productData.cartList.items.length > 0
              //     ) {
              //       index = _.findIndex(productData.cartList.items, {
              //         sku: item.product.sku,
              //       });
              //     }
              //     if (index !== -1) {
              //       qty = productData.cartList.items[index].qty;
              //     }
              //     if (item.salable_qty[0].qty <= 0) {
              //       Toast.show('Out of Stock', Toast.SHORt);
              //     } else if (item.product.price <= 0) {
              //       Toast.show('Cannot be added to cart');
              //     } else if (item.salable_qty[0].qty <= item.qty) {
              //       if (
              //         qty < item.salable_qty[0].qty &&
              //         item.salable_qty[0].qty - qty !== 0
              //       ) {
              //         //Add balance qnt to cart
              //         if (_.isEmpty(productData.cartId)) {
              //           dispatch(
              //             getCartID(
              //               item.product.sku,
              //               item.salable_qty[0].qty - qty,
              //               'general',
              //               item.wishlist_item_id,
              //             ),
              //           );
              //         } else {
              //           dispatch(
              //             addToCart(
              //               item.product.sku,
              //               item.salable_qty[0].qty - qty,
              //               product.cartId,
              //               item.wishlist_item_id,
              //             ),
              //           );
              //         }
              //         //..................
              //       }

              //       Alert.alert(
              //         'Please Note',
              //         'At this time, you can add ' +
              //           (item.salable_qty[0].qty - qty) +
              //           ' qty to cart. To Order rest ' +
              //           (item.qty - (item.salable_qty[0].qty - qty)) +
              //           ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
              //         [{text: 'Ok'}, ,],
              //       );

              //       // Toast.show('Out of stock');
              //     } else {
              //       if (_.isEmpty(productData.cartId)) {
              //         dispatch(
              //           getCartID(
              //             item.product.sku,
              //             item.qty,
              //             'general',
              //             item.wishlist_item_id,
              //           ),
              //         );
              //       } else {
              //         dispatch(
              //           addToCart(
              //             item.product.sku,
              //             item.qty,
              //             product.cartId,
              //             item.wishlist_item_id,
              //           ),
              //         );
              //       }
              //     }
              //   } else {
              //     dispatch(getProductDetailWishlist(item.product.sku));
              //   }
              // } else {
              //   Toast.show(
              //     'Please complete Profile / Wait for approval',
              //     Toast.SHORT,
              //   );
              // }
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Image
                style={{height: 25, width: 25}}
                resizeMode="contain"
                source={require('../../images/cart.png')}
              /> */}
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  color: colors.blue,
                  marginLeft: 5,
                  fontSize: 14,
                }}>
                {' '}
                View Details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={undefined}
          title={undefined}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />
        {getWishlistData()}
        {bottomSliderProductVariantsConfigurable()}

        <FlatList
          style={{paddingHorizontal: 10}}
          data={wislist}
          renderItem={({item, index}) => renderWishlist(item, index)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {wislist !== undefined &&
          wislist.length === 0 &&
          !productData.isLoading && (
            <View style={{height: '50%', alignItems: 'center'}}>
              <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
                No item added
              </Text>
            </View>
          )}

        {/* <View style={{height:10}}></View> */}
      </LinearGradient>

      {/* <LoaderCustome /> */}
    </View>
  );
};
export default Wishlist;
