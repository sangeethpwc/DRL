import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Dimensions } from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import { Button, RadioButton } from 'react-native-paper';
import withLoader from '../../utilities/hocs/LoaderHOC';
import {
  addToCart,
  getCartID,
  setStockStatus,
} from '../../services/operations/productApis';
import _ from 'lodash';
import styles from './productStyles';
import utils from '../../utilities/utils';
import Counter from 'react-native-counters';
import Collapsible from 'react-native-collapsible';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import AvailableQuantityBySku from './AvailableQuantityBySkuPDP';
import Toast from 'react-native-simple-toast';

const GeneralProduct = props => {
  // const [selectedStrength,setSelectedStrength]=useState("Strength")
  // const [selectedPack,setSelectedPack]=useState("Pack size")

  const [selectedStrength, setSelectedStrengthData] = useState('');
  const [selectedPack, setSelectedPackData] = useState('');
  const [quantity, setQuantityData] = useState(0);

  const [pricetype, setChecked] = React.useState('');

  const [isGneralExpaded, setGeneralExpanded] = useState(true);
  const [loader, setLoader] = useState(false);
  const { width } = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let generalQuanity = 1;

  let productDetail = {};

  let productDetailChild = {};

  let strengthValues = [];

   hidesubwac = true;
   hide_phs = true;

  let packValue = [];

  if (props !== undefined && props.productDetail !== undefined) {
    productDetail = props.productDetail;
  }

  if (props !== undefined && props.productDetail !== undefined) {
    productDetail = props.productDetail;
  }

  if (props !== undefined && props.productDetailChild !== undefined) {
    productDetailChild = props.productDetailChild;
  }

  if (props !== undefined && props.productDetail !== undefined) {
    console.log('productDetail.extension_attributes.sub_wac_price'+props.productDetail.extension_attributes.sub_wac_price);
    console.log('productDetail.extension_attributes.sub_wac_price'+JSON.stringify(props.productDetail));
    if(props.productDetail.extension_attributes.sub_wac_price == ""){
      hidesubwac = false;
    }
  }

  if (props !== undefined && props.productDetail !== undefined) {
    if(props.productDetail.extension_attributes.phs_indirect_price === ""){
      hide_phs = false;
    }
  }

  function setSelectedStrength(value) {
    setSelectedStrengthData(value);
    props.setSelectedStrength(value);
  }

  function setSelectedPack(value) {
    setSelectedPackData(value);
    props.setSelectedPack(value);
  }

  function setQuantity(value) {
    setQuantityData(value);
    if (parseInt(value) > 0) {
      props.setQuantity(value);
    }
  }
  let defautlStrength = '';
  let defautlPack = '';
  useEffect(() => {
    if (productData.configurableProductsProductDetail.length > 0) {
      defautlStrength = loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProductsProductDetail[0],
            'strength',
          ),
      ).label;
      defautlPack = loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProductsProductDetail[0],
            'pack_size',
          ),
      ).label;

      setSelectedPackData(defautlPack);
      setSelectedStrengthData(defautlStrength);
    }
  }, [productData.configurableProductsProductDetail]);

  ///.....................................Old pickers...........................

  // function getStrengthPicker (){
  //
  //     strengthValues = [];
  //     if(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')) !== undefined){
  //         strengthValues.push(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')).label);
  //     }

  //     return(
  //         <View style={{ borderWidth: 1,borderColor: colors.textInputBorderColor, borderRadius:5,
  //             marginRight:20, marginTop:5, flexDirection: 'row', alignItems: 'center', height: 40}}>
  //         {loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength'))!=undefined &&
  //         <ModalDropdown   style={{width: '90%',}} textStyle={{fontSize:18}}
  //         dropdownStyle={{width: '35%', height:50,}}
  //         dropdownTextStyle={{fontSize:16}}

  //         options={strengthValues}
  //         defaultValue={strengthValues.length===1?strengthValues[0]: strengthValues[0]}
  //         onSelect ={(value) => {setSelectedStrength(strengthValues[value])}}
  //         />}
  //         <Image source = {require('../../images/bottom_small.png')}/>
  //         </View>
  //     )
  // }

  // function getPackSizePicker(){
  //     packValue = [];
  //     if(loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')) !== undefined){
  //         packValue.push(loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')).label)

  //     }
  //     return(
  //         <View style={{ borderWidth: 1,borderColor: colors.textInputBorderColor, borderRadius:5,
  //             marginRight:20, marginTop:5, flexDirection: 'row', alignItems: 'center', height: 40}}>
  //         <ModalDropdown
  //         style={{width: '90%',}}
  //         textStyle={{fontSize:18}}
  //         dropdownStyle={{width: '35%', height:40}}

  //         dropdownTextStyle={{fontSize:16}}

  //         options={packValue}
  //         defaultValue={packValue.length===1?packValue[0]: packValue[0]}
  //         onSelect ={(value) => {setSelectedPack(packValue[value])}}
  //         />
  //        <Image source = {require('../../images/bottom_small.png')}/>
  //         </View>
  //     )
  // }

  //....................................................................................

  function getStrengthPickerForConfigurable() {
    let attrib = utils.getAttributeFromCustomForConfigurable(
      productDetail,
      'Strength',
    );
    let values = [];
    strengthValues = [];
    packValue = [];

    if (attrib !== undefined && attrib.length > 0) {
      let v = '';
      for (let i = 0; i < attrib.length; i++) {
        v = attrib[i].value_index;
        for (let p = 0; p < loginData.strengthLabels.length; p++) {
          if (
            loginData.strengthLabels[p] !== undefined &&
            loginData.strengthLabels[p].value === '' + v
          ) {
            strengthValues.push(loginData.strengthLabels[p].label);
          }
        }
      }
    }
    let index = strengthValues.indexOf(selectedStrength);

    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.textInputBorderColor,
          borderRadius: 5,
          marginRight: 20,
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
        }}>
        <ModalDropdown
          style={{ width: '90%' }}
          textStyle={{ fontSize: 18 }}
          dropdownStyle={
            strengthValues.length > 1
              ? { width: '35%', height: 80 }
              : { width: '35%', height: 50 }
          }
          dropdownTextStyle={{ fontSize: 16 }}
          defaultValue={index !== -1 ? strengthValues[index] : 'Please Select'}
          onSelect={value => {
            setSelectedStrength(strengthValues[value]);
          }}
          options={strengthValues}
        />
        <Image source={require('../../images/bottom_small.png')} />
      </View>
    );
  }

  // function submitting (){
  //
  //        if(productData.stockStatus !== undefined && parseInt(productData.stockStatus) ===0){
  //            Toast.show("Out of stock", Toast.SHORT);
  //            setQuantityData(0);
  //        }
  //        else
  //        if(productData.stockStatus !== undefined && productData.stockStatus.length>0 && parseInt(productData.stockStatus) < parseInt(quantity)){
  //            Toast.show("Invaild quantity", Toast.SHORT);
  //            setQuantityData(0);
  //        }

  //    }

  function getStrengthPicker() {
    strengthValues = [];
    if (
      loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(productDetail, 'strength'),
      ) !== undefined
    ) {
      strengthValues.push(
        loginData.strengthLabels.find(
          element =>
            element.value ===
            utils.getAttributeFromCustom(productDetail, 'strength'),
        ).label,
      );
    }

    return (
      <View
        style={{
          // height: 30,
          borderRadius: 5,
          width: '90%',
          marginRight: 20,
          marginTop: 5,
          justifyContent: 'center',
        }}>
        {loginData.strengthLabels.find(
          element =>
            element.value ===
            utils.getAttributeFromCustom(productDetail, 'strength'),
        ) != undefined && (
            <Text style={{ fontFamily: 'DRLCircular-Book', fontSize: 15 }}>
              {strengthValues[0]}
            </Text>
          )}
      </View>
    );
  }

  function getPackSizePicker() {
    packValue = [];
    if (
      loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(productDetail, 'pack_size'),
      ) !== undefined
    ) {
      packValue.push(
        loginData.packLabels.find(
          element =>
            element.value ===
            utils.getAttributeFromCustom(productDetail, 'pack_size'),
        ).label,
      );
    }
    return (
      <View
        style={{
          height: 30,
          marginRight: 20,
          marginTop: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: '40%',
          borderRadius: 30,
          borderWidth: 1,
          borderColor: colors.blue,
        }}>
        <Text style={{ fontFamily: 'DRLCircular-Book', fontSize: 14 }}>
          {packValue[0]}
        </Text>
      </View>
    );
  }

  function getPackSizePickerConfigurable() {
    let attrib = utils.getAttributeFromCustomForConfigurable(
      productDetail,
      'Pack Size',
    );
    let values = [];
    packValue = [];
    if (attrib !== undefined && attrib.length > 0) {
      let v = '';
      for (let i = 0; i < attrib.length; i++) {
        v = attrib[i].value_index;
        for (let p = 0; p < loginData.packLabels.length; p++) {
          if (
            loginData.packLabels[p] !== undefined &&
            loginData.packLabels[p].value === '' + v
          ) {
            packValue.push(loginData.packLabels[p].label);
          }
        }
      }
    }
    let index = packValue.indexOf(selectedPack);

    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.textInputBorderColor,
          borderRadius: 5,
          marginRight: 20,
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
        }}>
        <ModalDropdown
          style={{ width: '90%' }}
          dropdownStyle={
            packValue.length > 1
              ? { width: '35%', height: 80 }
              : { width: '35%', height: 50 }
          }
          dropdownTextStyle={{ fontSize: 16 }}
          textStyle={{ fontSize: 18 }}

          options={packValue}
          defaultValue={index !== -1 ? packValue[index] : 'Please Select'}
          onSelect={value => {
            setSelectedPack(packValue[value]);
          }}
        />
        <Image source={require('../../images/bottom_small.png')} />
      </View>
    );
  }

  function submitting() {
    //
    //

    if (
      productDetail.type_id === 'simple' &&
      parseInt(productDetail.stock) < parseInt(quantity)
    ) {
      Toast.show(
        'Available quantity is ' + parseInt(productData.stockStatusPDP),
        Toast.SHORT,
      );
      setQuantityData(0);
    }
    if (
      productData.stockStatusPDP !== undefined &&
      parseInt(productData.stockStatusPDP) === 0
    ) {
      Toast.show('Out of stock', Toast.SHORT);
      setQuantityData(0);
    } else if (
      productData.stockStatusPDP !== undefined &&
      productData.stockStatusPDP.length > 0 &&
      parseInt(productData.stockStatusPDP) < parseInt(quantity)
    ) {
      Toast.show(
        'Available quantity is ' + parseInt(productData.stockStatusPDP),
        Toast.SHORT,
      );
      setQuantityData(0);
    }
  }

  function onChange(number, type) {
    if (type == '+') {
      // setGeneralQuantity(generalQuanity+1);
      generalQuanity = generalQuanity + 1;
    } else if (generalQuanity > 1) {
      // setGeneralQuantity(generalQuanity-1);
      generalQuanity = generalQuanity - 1;
    }
  }

  function getQuantityCounter(count) {
    //
    return (
      <Counter start={generalQuanity} min={1} max={count} onChange={onChange} />
    );
  }

  //..............................

  function renderPrice(product) {
    if (product.tier_prices !== undefined && !_.isEmpty(product.tier_prices)) {
      if (
        product.tier_prices.find(
          element => element.customer_group_id === GlobalConst.customerGroup,
        ) !== undefined &&
        product.tier_prices.find(
          element => element.customer_group_id === GlobalConst.customerGroup,
        ).value !== undefined
      ) {
        return utils.formatPrice(
          product.tier_prices.find(
            element => element.customer_group_id === GlobalConst.customerGroup,
          ).value,
        );
      } else {
        return utils.formatPrice(product.price);
      }
    } else {
      return utils.formatPrice(product.price);
    }
  }
  //..............................

  function renderGeneralSection() {
    return (
      <View style={styles.generalSection}>
        <TouchableOpacity
          onPress={() => {
            if (isGneralExpaded) {
              setGeneralExpanded(false);
            } else {
              setGeneralExpanded(true);
            }
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 0.5,
              borderColor: colors.lightGrey,
              paddingBottom: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.boldText}>General</Text>
            <Image source={require('../../images/bottom_big.png')} />
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={!isGneralExpaded}>
          <View
            style={{
              backgroundColor: colors.shortdateBackground,
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}>

            <View style={{ flexDirection: 'row' }}>   
              <View style={{ width: '100%' }}>
                <Text style={[styles.lightText]}>Only 1 price for a product may be selected per order. Please select the appropriate price to add the product to Cart</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '50%', marginTop: 15 }}>
                <Text style={[styles.lightText]}>Total Content</Text>
                {productDetail.type_id !== 'configurable'
                  ? getStrengthPicker()
                  : getStrengthPickerForConfigurable()}
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.lightText]}>Pack Size</Text>
                {productDetail.type_id !== 'configurable'
                  ? getPackSizePicker()
                  : getPackSizePickerConfigurable()}
              </View>
            </View>

            {/* <View style={{width: '50%', flexDirection: 'row', alignItems: 'center', marginTop:10}}>
                        <Text style={{
                             color: colors.textColor,
                             fontFamily: 'DRLCircular-Light',    
                             fontSize:16, 
                          
                            }}>Case Pack: </Text>

                            {productDetail.type_id === 'simple'?
                        
                        <Text style={{
                            color: colors.textColor,
                            fontFamily: 'DRLCircular-Light',    
                            fontSize:18, 
                            }}>{utils.getAttributeFromCustom(productDetail, 'case_pack')}</Text>
                            :
                            <Text style={{
                                color: colors.textColor,
                                fontFamily: 'DRLCircular-Light',    
                                fontSize:16, 
                                
                                }}>{utils.getAttributeFromCustom(productDetailChild, 'case_pack')}</Text>
                        }

                        </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginTop: 20 }}>
                {productDetail.type_id === 'simple' ? (
                  <AvailableQuantityBySku sku={productDetail.sku} />
                ) : (
                  <AvailableQuantityBySku sku={productDetailChild.sku} />
                )}

                {productData.stockStatusPDP > 0 &&
                  renderPrice(productDetail) > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          color: colors.textColor,
                          fontFamily: 'DRLCircular-Book',
                          fontSize: 16,
                          marginVertical: 5,
                          marginRight: 5,
                        }}>
                        Quantity {'\n'}in packs:
                      </Text>

                      <View
                        style={{
                          borderWidth: 0.5,
                          padding: 0,
                          height: 35,
                          borderColor: colors.grey,
                          borderRadius: 10,
                        }}>
                        <TextInput
                          style={{
                            height: 30,
                            width: 80,
                            paddingVertical: 0,
                            paddingLeft: 5,
                            paddingRight: 5,
                          }}
                          placeholder={'Enter qnt.'}
                          placeholderTextColor={colors.placeholderColor}
                          numberOfLines={1}
                          keyboardType={'number-pad'}
                          returnKeyType={'done'}
                          value={quantity}
                          onChangeText={value => setQuantity(value)}
                          onSubmitEditing={() => {
                            // submitting();
                          }}
                        // blurOnSubmit={false}
                        />
                      </View>
                    </View>
                  )}
              </View>
            </View>


            <View style={{ flexDirection: 'row', marginTop: 15 }}>

              <View style={{ width: '50%' }}>
                <Text style={[styles.lightText]}>Price</Text>

                <View
                  style={{
                    width: '100%'
                  }}>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center', marginBottom: 10,
                      width: '100%'
                    }}>

                    <RadioButton
                      value='true'
                      color='blue'
                      // isSubscribed ={true}
                      status={pricetype === 'price' ? 'checked' : 'unchecked'}
                      onPress={() => setChecked('price')}
                      onValueChange={newValue => setIsSubscribed(!isSubscribed)}
                    />

                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 20,
                        width: '100%',
                        marginLeft: 0,
                      }}>
                      {/* ${renderPrice(productDetail)} */}
                      {productDetail.extension_attributes.custom_price}
                    </Text>

                  </View>

                </View>
              </View>

              {/* Sub WAC Price */}

              
              {this.hidesubwac &&
                
              <View style={{ width: '50%' }}>
                <Text style={[styles.lightText]}>Sub-WAC Price</Text>


                <View
                  style={{  
                    flexDirection: 'row',

                    alignItems: 'center', marginBottom: 10,
                    width: '100%'
                  }}>

                  <RadioButton
                    value='true'
                    color='blue'

                    status={pricetype === 'sub_wac' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('sub_wac')}
                    onValueChange={newValue => setIsSubscribed(!isSubscribed)}
                  />

                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 20,
                      width: '100%',
                      marginLeft: 0,
                    }}>
                    {/* ${renderPrice(productDetail)} */}
                    {productDetail.extension_attributes.sub_wac_price}
                  </Text>

                </View>

              </View>}

            </View>

            {hide_phs &&
            <View style={{ flexDirection: 'row' }}>

              <View style={{ width: '50%' }}>
                <Text style={[styles.lightText]}>Phs indirect price
                </Text>

                <View
                  style={{
                    width: '100%'
                  }}>

                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center', marginBottom: 10,
                      width: '100%'
                    }}>


                    <RadioButton
                      value='true'
                      color='blue'
                      // isSubscribed ={true}
                      status={pricetype === 'phs_indirect' ? 'checked' : 'unchecked'}
                      onPress={() => setChecked('phs_indirect')}
                      onValueChange={newValue => setIsSubscribed(!isSubscribed)}
                    />

                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 20,
                        width: '100%',
                        marginLeft: 0,
                      }}>
                      {productDetail.extension_attributes.phs_indirect_price}
                    </Text>

                  </View>

                </View>
              </View>


            </View>}


            {GlobalConst.LoginToken.length > 0 &&
              productData.stockStatusPDP > 0 &&
              renderPrice(productDetail) > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {/* {productDetail.type_id === 'simple' ? (
                    <Text
                      style={[
                        styles.blueText,
                        {
                          fontSize: 24,
                          color: colors.darkGrey,
                          fontFamily: 'DRLCircular-Bold',
                        },
                      ]}>
                      $1{renderPrice(productDetail)}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.blueText,
                        {
                          fontSize: 24,
                          color: colors.darkGrey,
                          fontFamily: 'DRLCircular-Bold',
                        },
                      ]}>
                      ${renderPrice(productDetailChild)}
                    </Text>
                  )} */}
                </View>

                {/* add to cart design */}

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {productData.stockStatusPDP !== '0' && (
                    <TouchableOpacity
                      style={[
                        styles.buttonUnselected,
                        {
                          height: 40,
                          borderWidth: 1,
                          borderColor: colors.grey,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={() => {

                        console.log('Radio checked...................', pricetype);

                        if (pricetype === '') {
                          console.log('Radio checked check...................', pricetype);
                          Toast.show('Please select the appropriate price to add the product to Cart', Toast.SHORT);

                        } else {

                          console.log('Radio checked...................', pricetype);

                          let index = -1;
                          let qty = 0;
                          if (
                            productDetail.type_id === 'simple' &&
                            productData.cartList !== undefined &&
                            productData.cartList.items !== undefined &&
                            productData.cartList.items.length > 0
                          ) {
                            index = _.findIndex(productData.cartList.items, {
                              sku: productDetail.sku,
                            });
                          } else if (
                            productDetail.type_id === 'configurable' &&
                            productData.cartList !== undefined &&
                            productData.cartList.items !== undefined &&
                            productData.cartList.items.length > 0
                          ) {
                            index = _.findIndex(productData.cartList.items, {
                              sku: productDetailChild.sku,
                            });
                          }
                          if (index !== -1) {
                            qty = productData.cartList.items[index].qty;
                          }

                          if (parseInt(quantity) === 0) {
                            Toast.show('Please enter quanity', Toast.SHORT);
                          } else if (
                            productData.stockStatusPDP !== undefined &&
                            parseInt(productData.stockStatusPDP) === 0
                          ) {
                            Toast.show('Out of stock', Toast.SHORT);
                            setQuantityData(0);
                          } else if (
                            parseInt(productData.stockStatusPDP) <
                            qty + parseInt(quantity)
                          ) {
                            Alert.alert(
                              'Please Note',
                              'At this time, you can add ' +
                              (productData.stockStatusPDP - qty) +
                              ' qty to cart. To Order rest ' +
                              (parseInt(quantity) -
                                (productData.stockStatusPDP - qty)) +
                              ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                              [{ text: 'Ok' }, ,],
                            );
                            if (productData.stockStatusPDP - qty <= 0) {
                              Toast.show('Cannot be added', Toast.SHORT);
                            } else {
                              //Add to cart...
                              setLoader(true);
                              if (_.isEmpty(productData.cartId)) {
                                if (productDetail.type_id === 'simple') {
                                  dispatch(
                                    getCartID(
                                      productDetail.sku,
                                      productData.stockStatusPDP - qty,
                                      'general',
                                      pricetype,
                                    ),
                                  );
                                } else {
                                  dispatch(
                                    getCartID(
                                      productDetailChild.sku,
                                      productData.stockStatusPDP - qty,
                                      'general',
                                      pricetype,
                                    ),
                                  );
                                }
                              } else {
                                if (productDetail.type_id === 'simple') {
                                  dispatch(
                                    addToCart(
                                      productDetail.sku,
                                      productData.stockStatusPDP - qty,
                                      productData.cartId,
                                      pricetype,
                                    ),
                                  );
                                } else {
                                  dispatch(
                                    addToCart(
                                      productDetailChild.sku,
                                      productData.stockStatusPDP - qty,
                                      productData.cartId,
                                      pricetype,
                                    ),
                                  );
                                }
                                dispatch(setStockStatus(''));
                              }
                            }
                          }
                          else if (
                            productDetail.type_id === 'simple' &&
                            productData.stockStatusPDP !== undefined &&
                            productData.stockStatusPDP.length > 0 &&
                            parseInt(productData.stockStatusPDP) <
                            parseInt(quantity)
                          ) {
                            Alert.alert(
                              'Please Note',
                              'At this time, you can add ' +
                              parseInt(productData.stockStatusPDP) +
                              ' qty to cart. To Order rest ' +
                              (parseInt(quantity) -
                                parseInt(productData.stockStatusPDP)) +
                              ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                              [{ text: 'Ok' }, ,],
                            );
                            //Add to cart...
                            setLoader(true);
                            if (_.isEmpty(productData.cartId)) {
                              if (productDetail.type_id === 'simple') {
                                dispatch(
                                  getCartID(
                                    productDetail.sku,
                                    productData.stockStatusPDP,
                                    'general',
                                    pricetype,
                                  ),
                                );
                              } else {
                                dispatch(
                                  getCartID(
                                    productDetailChild.sku,
                                    productData.stockStatusPDP,
                                    'general',pricetype,
                                  ),
                                );
                              }
                            } else {
                              if (productDetail.type_id === 'simple') {
                                dispatch(
                                  addToCart(
                                    productDetail.sku,
                                    productData.stockStatusPDP,
                                    productData.cartId,
                                    pricetype,
                                  ),
                                );
                              } else {
                                dispatch(
                                  addToCart(
                                    productDetailChild.sku,
                                    productData.stockStatusPDP,
                                    productData.cartId,
                                    pricetype,
                                  ),
                                );
                              }
                              dispatch(setStockStatus(''));
                            }
                            setQuantityData(0);
                          } else {
                            setLoader(true);
                            if (_.isEmpty(productData.cartId)) {
                              if (productDetail.type_id === 'simple') {
                                dispatch(
                                  getCartID(
                                    productDetail.sku,
                                    quantity,
                                    'general',
                                    pricetype,
                                  ),
                                );
                              } else {
                                dispatch(
                                  getCartID(
                                    productDetailChild.sku,
                                    quantity,
                                    'general',
                                    pricetype,
                                  ),
                                );
                              }
                            } else {
                              if (productDetail.type_id === 'simple') {
                                dispatch(
                                  addToCart(
                                    productDetail.sku,
                                    quantity,
                                    productData.cartId,
                                    pricetype,
                                  ),
                                );
                              } else {
                                dispatch(
                                  addToCart(
                                    productDetailChild.sku,
                                    quantity,
                                    productData.cartId,
                                    pricetype,
                                  ),
                                );
                              }
                              dispatch(setStockStatus(''));
                            }
                          }
                        }
                      }
                      }>
                      <Text style={styles.blueText}>Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            ) : null}
          </View>
        </Collapsible>
      </View>
    );
  }
  return (
    <View>
      <LoaderCustome />

      {renderGeneralSection()}
    </View>
  );
};

export default GeneralProduct;
