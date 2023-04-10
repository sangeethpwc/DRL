import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  
  TextInput,
  Alert,
} from 'react-native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import {
  addToCartWithOptions,
  getCartID,
} from '../../services/operations/productApis';
import _ from 'lodash';
import styles from './productStyles';
import utils from '../../utilities/utils';
import Counter from 'react-native-counters';
import Collapsible from 'react-native-collapsible';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import AvailableQuantityBySku from './AvailableQuantityBySku';
import Toast from 'react-native-simple-toast';
import {setStockStatus} from '../../slices/productSlices';
import {Moment} from 'moment';

//var data = undefined;

const ShortDated = forwardRef((props, ref) => {
  const [selectedStrength, setSelectedStrength] = useState('Strength');
  const [selectedPack, setSelectedPack] = useState('Pack size');
  const [isShortDatedExpanded, setShortDatedExpanded] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [data, setData] = useState([]);

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let generalQuanity = 1;
  let productDetail = {};
  //const [productDetail, setProductDetail] = useState({});
  if (props !== undefined) {
    productDetail = props.productDetail;
    // setProductDetail(props.productDetail);
  }

  let strengthValues = [];

  let packValue = [];

  // function getStrengthPickerForConfigurable (){
  //     let attrib = utils.getAttributeFromCustomForConfigurable(productDetail,'Strength');
  //     let values = [];
  //     let strengthValues = [];

  //     if(attrib!==undefined && attrib.length>0){
  //         let v="";
  //         for(let i=0; i<attrib.length; i++){
  //             v=attrib[i].value_index;
  //             for(let p=0; p<loginData.strengthLabels.length; p++){
  //                if( loginData.strengthLabels[p].value === ""+ v ){
  //                    strengthValues.push(loginData.strengthLabels[p].label);
  //                }
  //             }
  //         }
  //     }
  //     return(
  //         <View style={{ borderWidth: 1,borderColor: colors.textInputBorderColor, borderRadius:5, marginRight:20, marginTop:5}}>
  //         <Picker style={{height:30}}
  //                 selectedValue={selectedStrength}
  //                 mode='dropdown'

  //                 onValueChange={(itemValue, itemIndex) => setSelectedStrength(itemValue)}>
  //                 {strengthValues!=undefined && strengthValues.length>0
  //                 ?
  //                 strengthValues.map((labelValue)=>
  //                 <Picker.Item
  //                 label={labelValue} value={labelValue} />
  //                 )
  //                 :
  //                 <Picker.Item label="NA" value="NA" />
  //                 }

  //         </Picker>
  //         </View>
  //     )
  // }

  function checkExpiry(item) {
    let today = new Date();
    console.log('Shortdated item.................', item);
    let expStr = item.expiry_date + 'T00:00:00Z';

    let expDate = Date.parse(expStr);
    console.log('Exp date..............', expDate);
    if (expDate > today) {
      console.log('True check');
      return true;
    } else {
      console.log('False check');
      return false;
    }
  }

  const cleanShortDatedArr = () => {
    setData([]);
  };

  useImperativeHandle(ref, () => {
    return {
      cleanShortDatedArr: cleanShortDatedArr,
    };
  });

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
          textStyle={{fontSize: 18}}
          style={{width: '90%'}}
          dropdownStyle={
            strengthValues.length > 1
              ? {width: '35%', height: 80}
              : {width: '35%', height: 50}
          }
          dropdownTextStyle={{fontSize: 16}}
          options={strengthValues}
          defaultValue={
            strengthValues.length === 1 ? strengthValues[0] : 'Please select'
          }
          onSelect={value => {
            setSelectedStrength(value);
          }}
        />
      </View>
    );
  }

  // function getStrengthPicker (){
  //     strengthValues = [];
  //     if(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')) !== undefined){
  //         strengthValues.push(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')).label);
  //     }

  //     return(
  //         <View style={{ borderWidth: 1,borderColor: colors.textInputBorderColor, borderRadius:5,
  //             marginRight:20, marginTop:5, flexDirection: 'row', alignItems: 'center', height:40, }}>
  //         <ModalDropdown  textStyle={{fontSize:18}}
  //         style={{width: '90%',}}
  //         dropdownStyle={{width: '35%', height:40}}

  //         dropdownTextStyle={{fontSize:16}}
  //         options={strengthValues}
  //         defaultValue={strengthValues.length===1?strengthValues[0]: "Please select"}
  //         onSelect ={(value) => {setSelectedStrength(value)}}
  //         />
  //        <Image source = {require('../../images/bottom_small.png')}/>
  //         </View>
  //     )
  // }

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
          height: 30,
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
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 15}}>
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
        <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 14}}>
          {packValue[0]}
        </Text>
      </View>
    );
  }

  function submitting() {
    //
    //    if (productDetail.type_id === 'simple' && parseInt(productDetail.stock) < parseInt(quantity)){
    //        Toast.show("Invaild quantity", Toast.SHORT);
    //        setQuantityData(0);
    //    }
    //    if(productData.stockStatus !== undefined && parseInt(productData.stockStatus) ===0){
    //        Toast.show("Out of stock", Toast.SHORT);
    //        setQuantityData(0);
    //    }
    //    else
    //    if(productData.stockStatus !== undefined && productData.stockStatus.length>0 && parseInt(productData.stockStatus) < parseInt(quantity)){
    //        Toast.show("Invaild quantity", Toast.SHORT);
    //        setQuantityData(0);
    //    }
    // if (parseInt(quantity) > parseInt(availableQuantity)){
    //     Toast.show("Invaild quantity", Toast.SHORT);
    // }
    // if(parseInt(availableQuantity) ===0){
    //     Toast.show("Out of stock", Toast.SHORT);
    // }
  }

  function setQuantity(quantity, index) {
    // if (parseInt(quantity) > parseInt(data[index].quantity)){
    //     Toast.show("Invaild quantity", Toast.SHORT);
    // }
    // else
    // if(parseInt(data[index].quantity) ===0){
    //     Toast.show("Out of stock", Toast.SHORT);
    // }
    // else{
    // data[index].entered_qunatity = quantity;
    let dataObject = {};
    dataObject = _.clone(data[index]);
    if (dataObject !== undefined) {
      dataObject.entered_qunatity = quantity;
      let temp = _.cloneDeep(data);
      temp.splice(index, 1, dataObject);
      setData(temp);
      // }
    }
    //
  }

  function getShortDated() {
    // let data = utils.getOptions(productDetail,'Shortdated');
    //let shortDated = utils.getOptions(productDetail, 'Shortdated LOT No#');
    // let shortDated = [];
    // if (
    //   productDetail !== undefined &&
    //   productDetail.options !== undefined &&
    //   productDetail.options.length > 0 &&
    //   productDetail.options[0] !== undefined &&
    //   productDetail.options[0].values !== undefined &&
    //   productDetail.options[0].values.length > 0
    // ) {
    //   shortDated = productDetail.options[0].values;
    //
    //   // );
    // }
    // if (data.length === 0 && shortDated.length > 0) {
    //
    //   // setData(utils.getOptions(productDetail, 'Shortdated LOT No#'));
    //   setData(shortDated);
    // }

    return data.map((item, index) => {
      if (checkExpiry(item)) {
        return (
          <View style={{marginBottom: 10}}>
            <View
              style={{
                backgroundColor: colors.shortdateBackground,
                borderRadius: 10,
              }}>
              <View style={{padding: 10}}>
                <Text
                  style={{marginBottom: 10, fontFamily: 'DRLCircular-Book'}}>
                  Batch No.{' '}
                  <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                    {item.title}
                  </Text>
                </Text>
                <Text
                  style={{marginBottom: 10, fontFamily: 'DRLCircular-Book'}}>
                  Expiry:{' '}
                  <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                    {item.expiry_date}
                  </Text>
                </Text>
                <View style={{flexDirection: 'row', marginBottom: 20}}>
                  <View style={{width: '50%'}}>
                    <Text style={[styles.lightText]}>Total Content</Text>
                    {productDetail.type_id !== 'configurable'
                      ? getStrengthPicker()
                      : getStrengthPickerForConfigurable()}
                  </View>
                  <View style={{width: '50%'}}>
                    <Text style={[styles.lightText]}>Pack Size</Text>
                    {productDetail.type_id !== 'configurable'
                      ? getPackSizePicker()
                      : getPackSizePickerConfigurable()}
                  </View>
                </View>

                {/* <Text
              style={{
                color: colors.textColor,
                fontFamily: 'DRLCircular-Light',
                marginTop: 10,
                marginBottom: 5,
                fontSize: 16,
              }}>
              Available Quantity (in packs) :{' '}
              <Text style={{fontFamily: 'DRLCircular-Book'}}>
                {item.quantity}
              </Text>
            </Text> */}

                <View>
                  {item.quantity > 0 && item.price > 0 ? (
                    <View
                      style={[
                        styles.labelGreen,
                        {paddingVertical: 10, paddingHorizontal: 5, width: 120},
                      ]}>
                      <Text style={[styles.greenLight, {fontSize: 16}]}>
                        In stock
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.labelRed,
                        {paddingVertical: 10, paddingHorizontal: 5},
                      ]}>
                      <Text
                        style={[
                          styles.greenLight,
                          {fontSize: 16, color: colors.red},
                        ]}>
                        Out of stock
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item.quantity !== '0' && (
                    <View style={{width: '50%', marginTop: 8}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
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
                            //  value = {item.entered_qunatity}
                            onChangeText={value => setQuantity(value, index)}
                            onSubmitEditing={() => {
                              submitting();
                            }}
                            // blurOnSubmit={false}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                {GlobalConst.LoginToken.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Bold',
                          color: colors.darkGrey,
                          fontSize: 24,
                        }}>
                        ${utils.formatPrice(parseFloat(item.price))}
                      </Text>
                    </View>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      {item.quantity !== '0' && (
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
                            let index = -1;
                            let qty = 0;
                            // if(productDetail.type_id === 'simple' && productData.cartList !== undefined && productData.cartList.items !== undefined && productData.cartList.items.length>0){
                            //     index=_.findIndex(productData.cartList.items, {'sku': productDetail.sku, 'batchid': item.batchid});
                            // }
                            // else if(productDetail.type_id === 'configurable' && productData.cartList !== undefined && productData.cartList.items !== undefined && productData.cartList.items.length>0){
                            //     index=_.findIndex(productData.cartList.items, {'sku': productDetailChild.sku});
                            // }
                            // if(index !== -1){
                            //     qty=productData.cartList.items[index].qty;
                            // }

                            let batchId = '';
                            if (
                              productData.cartList !== undefined &&
                              productData.cartList.items !== undefined &&
                              productData.cartList.items.length > 0
                            ) {
                              for (
                                let i = 0;
                                i < productData.cartList.items.length;
                                i++
                              ) {
                                if (
                                  productData.cartList.items[i] !== undefined &&
                                  productData.cartList.items[i]
                                    .extension_attributes !== undefined &&
                                  productData.cartList.items[i]
                                    .extension_attributes.customoptions !==
                                    undefined &&
                                  productData.cartList.items[i]
                                    .extension_attributes.customoptions.length >
                                    0
                                ) {
                                  batchId = JSON.parse(
                                    productData.cartList.items[i]
                                      .extension_attributes.customoptions[0],
                                  ).value;
                                  if (
                                    productDetail.sku ===
                                      productData.cartList.items[i].sku &&
                                    batchId.trim() === item.title.trim()
                                  ) {
                                    index = i;
                                    qty = productData.cartList.items[i].qty;
                                    break;
                                  }
                                }
                              }
                            }
                            if (
                              parseInt(item.quantity) <
                              qty + parseInt(item.entered_qunatity)
                            ) {
                              Alert.alert(
                                'Please Note',
                                'At this time, you can add ' +
                                  (parseInt(item.quantity) - qty) +
                                  ' qty to cart. To Order rest ' +
                                  (parseInt(item.entered_qunatity) -
                                    (parseInt(item.quantity) - qty)) +
                                  ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                                [{text: 'Ok'}, ,],
                              );
                              if (parseInt(item.quantity) - qty <= 0) {
                                Toast.show('Cannot be added', Toast.SHORT);
                              } else {
                                //Add to cart............
                                if (_.isEmpty(productData.cartId)) {
                                  dispatch(
                                    getCartID(
                                      productDetail.sku,
                                      parseInt(item.quantity) - qty,
                                      'shortDated',
                                      '',
                                      item.option_id,
                                      
                                      item.option_type_id,
                                    ),
                                  );
                                } else {
                                  dispatch(
                                    addToCartWithOptions(
                                      productDetail.sku,
                                      parseInt(item.quantity) - qty,
                                      productData.cartId,
                                      item.option_id,
                                      item.option_type_id,
                                    ),
                                  );
                                }
                                dispatch(setStockStatus(''));
                                //.......................
                              }
                              // Toast.show(
                              //   'Available quantity is ' + parseInt(item.quantity),
                              //   Toast.SHORT,
                              // );
                            } else if (
                              parseInt(item.quantity) <
                              parseInt(item.entered_qunatity)
                            ) {
                              Alert.alert(
                                'Please Note',
                                'At this time, you can add ' +
                                  parseInt(item.quantity) +
                                  ' qty to cart. To Order rest ' +
                                  (parseInt(item.entered_qunatity) -
                                    parseInt(item.quantity)) +
                                  ' qtys, please contact customer service/sales rep or raise a service ticket from our Help & Support Portal',
                                [{text: 'Ok'}, ,],
                              );

                              //Add to cart

                              if (_.isEmpty(productData.cartId)) {
                                dispatch(
                                  getCartID(
                                    productDetail.sku,
                                    parseInt(item.quantity),
                                    'shortDated',
                                    '',
                                    item.option_id,
                                    
                                    item.option_type_id,
                                   
                                  ),
                                );
                              } else {
                                dispatch(
                                  addToCartWithOptions(
                                    productDetail.sku,
                                    parseInt(item.quantity),
                                    productData.cartId,
                                    item.option_id,
                                    item.option_type_id,
                                  ),
                                );
                              }

                              dispatch(setStockStatus(''));

                              // Toast.show(
                              //   qty +
                              //     ' units is already added to cart. Available quantity is ' +
                              //     parseInt(item.quantity) +
                              //     ' units.',
                              //   Toast.SHORT,
                              // );
                              //setQuantityData(0);
                           
                            } else if (
                              parseInt(item.entered_qunatity) > 0 &&
                              parseInt(item.entered_qunatity) <=
                                parseInt(item.quantity)
                            ) {
                              if (_.isEmpty(productData.cartId)) {
                                dispatch(
                                  getCartID(
                                    productDetail.sku,
                                    item.entered_qunatity,
                                    'shortDated',
                                    '',
                                    item.option_id,
                                   
                                    item.option_type_id,
                                    
                                  ),
                                );
                              } else {
                                dispatch(
                                  addToCartWithOptions(
                                    productDetail.sku,
                                    item.entered_qunatity,
                                    productData.cartId,
                                    item.option_id,
                                    item.option_type_id,
                                  ),
                                );
                              }
                              dispatch(setStockStatus(''));
                            } else {
                              Toast.show(
                                'Requested Quantity cannot be added',
                                Toast.SHORT,
                              );
                            }
                          }}>

                          <Text style={styles.blueText}>Add to Cart</Text>

                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        );
      } else {
        return null;
      }
    });
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
          textStyle={{fontSize: 18}}
          style={{width: '90%'}}
          dropdownStyle={
            packValue.length > 1
              ? {width: '35%', height: 80}
              : {width: '35%', height: 50}
          }
          dropdownTextStyle={{fontSize: 16}}
          options={packValue}
          defaultValue={packValue.length === 1 ? packValue[0] : 'Please select'}
          onSelect={value => {
            setSelectedPack(value);
          }}
        />
        <Image source={require('../../images/bottom_small.png')} />
      </View>
    );
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

  function renderShortDateSelection() {
    let shortDated = [];
    if (
      productDetail !== undefined &&
      productDetail.options !== undefined &&
      productDetail.options.length > 0 &&
      productDetail.options[0] !== undefined &&
      productDetail.options[0].values !== undefined &&
      productDetail.options[0].values.length > 0
    ) {
      shortDated = productDetail.options[0].values;
    }
    //let shortDated = utils.getOptions(productDetail, 'Shortdated LOT No#');
    if (data.length === 0 && shortDated.length > 0) {
      // setData(utils.getOptions(productDetail, 'Shortdated LOT No#'));
      setData(shortDated);
    }

    if (data !== undefined && data.length > 0) {
      return (
        <View style={{marginLeft: 10, marginRight: 10}}>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() => {
              if (isShortDatedExpanded) {
                setShortDatedExpanded(false);
              } else {
                setShortDatedExpanded(true);
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.5,
                borderColor: colors.lightGrey,
                paddingBottom: 20,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.boldText}>Special Buy</Text>
              </View>
              <Image source={require('../../images/bottom_big.png')} />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={!isShortDatedExpanded}>
            {getShortDated()}
          </Collapsible>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
  return <View>{renderShortDateSelection()}</View>;
});

export default ShortDated;
