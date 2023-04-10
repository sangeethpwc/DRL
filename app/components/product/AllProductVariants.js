import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  Image,
  
  
  TextInput,
} from 'react-native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import _ from 'lodash';
import styles from './productStyles';
import utils from '../../utilities/utils';
import Counter from 'react-native-counters';
import Collapsible from 'react-native-collapsible';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import AvailableQuantityBySku from './AvailableQuantityBySku';
import Toast from 'react-native-simple-toast';

const AllProductVariants = props => {
  const [selectedStrength, setSelectedStrengthData] = useState('');
  const [selectedPack, setSelectedPackData] = useState('');

  const [quantity, setQuantityData] = useState(0);
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let productDetail = {};

  let productDetailConfigurable = {};

  let strengthValues = [];

  let packValue = [];

  if (props !== undefined && props.productDetail !== undefined) {
    productDetail = props.productDetail;
  }

  if (props !== undefined && props.casePack !== undefined) {
    productDetailConfigurable = props.casePack;
  }

  function setSelectedStrength(value) {
    setSelectedStrengthData(value);
    props.setSelectedStrength(value);
    setQuantityData(0);
  }

  function setSelectedPack(value) {
    setSelectedPackData(value);
    props.setSelectedPack(value);
    setQuantityData(0);
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
    if (productData.configurableProducts.length > 0) {
      defautlStrength = loginData.strengthLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProducts[0],
            'strength',
          ),
      ).label;
      defautlPack = loginData.packLabels.find(
        element =>
          element.value ===
          utils.getAttributeFromCustom(
            productData.configurableProducts[0],
            'pack_size',
          ),
      ).label;

      setSelectedPackData(defautlPack);
      setSelectedStrengthData(defautlStrength);
    }
  }, [productData.configurableProducts]);

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
          borderWidth: 0.5,
          borderColor: colors.lightBlue,
          borderRadius: 5,
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          height: 35,
        }}>
        {strengthValues !== undefined && strengthValues.length > 0 && (
          <ModalDropdown
            style={{width: '95%'}}
            textStyle={{fontSize: 18}}
            dropdownStyle={
              strengthValues.length > 1
                ? {width: '50%', height: 80}
                : {width: '50%', height: 50}
            }
            dropdownTextStyle={{fontSize: 16}}
            options={strengthValues}
            // defaultValue={strengthValues.length===1?strengthValues[0]: "Please Select"}
            defaultValue={
              index !== -1 ? strengthValues[index] : 'Please Select'
            }
            onSelect={value => {
              setSelectedStrength(strengthValues[value]);
            }}
          />
        )}
        <Image source={require('../../images/bottom_small.png')} />
      </View>
    );
  }

  // function getStrengthPicker (){

  //     strengthValues = [];
  //     if(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')) !== undefined){
  //         strengthValues.push(loginData.strengthLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'strength')).label);
  //     }

  //     return(
  //         <View style={{  height:30, borderWidth: 0.5,borderColor: colors.lightBlue, justifyContent: 'center',
  //         borderRadius:5,  marginTop:5, flexDirection: 'row', alignItems: 'center', height:35}}>

  //         { strengthValues !== undefined && strengthValues.length>0 &&
  //         <ModalDropdown  style={{width: '95%',}} textStyle={{fontSize:18}} dropdownStyle={{width: '70%', height:50, color: colors.red}}
  //         dropdownTextStyle={{fontSize:16}}
  //         options={strengthValues}
  //         // defaultValue={strengthValues.length===1?strengthValues[0]: "Please Select"}
  //         defaultValue={strengthValues[0]}
  //         onSelect ={(value) => {setSelectedStrength(strengthValues[value])}}
  //         />}
  //         <Image source={require('../../images/bottom_small.png')}  />
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
        {strengthValues !== undefined && strengthValues.length > 0 && (
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
            {strengthValues[0]}
          </Text>
        )}
        {/* <Image source={require('../../images/bottom_small.png')}  /> */}
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
          height: 30,
          borderWidth: 0.5,
          borderColor: colors.lightBlue,
          justifyContent: 'center',
          borderRadius: 5,
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          height: 35,
        }}>
        {packValue !== undefined && packValue.length > 0 && (
          <ModalDropdown
            style={{width: '93%'}}
            textStyle={{fontSize: 18}}
            dropdownStyle={
              packValue.length > 1
                ? {width: '50%', height: 70}
                : {width: '50%', height: 40}
            }
            dropdownTextStyle={{fontSize: 16}}
            options={packValue}
            // defaultValue={packValue.length===1?packValue[0]: "Please Select"}
            defaultValue={index !== -1 ? packValue[index] : 'Please Select'}
            onSelect={value => {
              setSelectedPack(packValue[value]);
            }}
          />
        )}
        <Image source={require('../../images/bottom_small.png')} />
      </View>
    );
  }

  // function getPackSizePicker(){
  //     packValue = [];
  //     if(loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')) !== undefined){
  //         packValue.push(loginData.packLabels.find(element=>element.value===utils.getAttributeFromCustom(productDetail,'pack_size')).label)

  //     }
  //     return(
  //         <View style={{ height:30, borderWidth: 0.5,borderColor: colors.lightBlue, justifyContent: 'center',
  //         borderRadius:5,  marginTop:5, flexDirection: 'row', alignItems: 'center', height:35}}>
  //          {packValue !== undefined && packValue.length>0 &&
  //         <ModalDropdown  style={{width: '95%',}} textStyle={{fontSize:18}} dropdownStyle={{width: '70%', height:50, color: colors.red}}
  //         dropdownTextStyle={{fontSize:16}}
  //         options={packValue}
  //         // defaultValue={packValue.length===1?packValue[0]: "Please Select"}
  //         defaultValue={packValue[0]}
  //         onSelect ={(value) => {setSelectedPack(packValue[value])}} />}
  //         <Image source={require('../../images/bottom_small.png')}  />
  //         </View>
  //     )
  // }

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
    if (
      productDetail.type_id === 'simple' &&
      parseInt(productDetail.stock) < parseInt(quantity)
    ) {
      Toast.show(
        'Available quantity : ' + parseInt(productDetail.stock),
        Toast.SHORT,
      );
      setQuantityData(0);
    }
    if (
      productData.stockStatus !== undefined &&
      parseInt(productData.stockStatus) === 0
    ) {
      Toast.show('Out of stock', Toast.SHORT);
      setQuantityData(0);
    } else if (
      productData.stockStatus !== undefined &&
      productData.stockStatus.length > 0 &&
      parseInt(productData.stockStatus) < parseInt(quantity)
    ) {
      Toast.show(
        'Available quantity : ' + productData.stockStatus,
        Toast.SHORT,
      );
      setQuantityData(0);
    }
  }

  function renderGeneralSection() {
    return (
      <View
        style={{
          borderColor: colors.grey,
          borderStyle: 'dashed',
          borderTopWidth: 0.5,
          borderRadius: 1,

          marginHorizontal: 10,
        }}>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginVertical: 5, width: '50%'}}>
              <Text
                style={[styles.lightText, {fontFamily: 'DRLCircular-Book'}]}>
                Total Content
              </Text>
              {productDetail.type_id !== 'configurable'
                ? getStrengthPicker()
                : getStrengthPickerForConfigurable()}
            </View>

            <View style={{marginVertical: 5, width: '50%'}}>
              <Text
                style={[styles.lightText, {fontFamily: 'DRLCircular-Book'}]}>
                Pack Size
              </Text>
              {productDetail.type_id !== 'configurable'
                ? getPackSizePicker()
                : getPackSizePickerConfigurable()}
            </View>
          </View>

          {/* {productDetail.type_id === 'simple'?
                    <Text style={{
                            color: colors.textColor,
                            fontFamily: 'DRLCircular-Light',    
                            fontSize:16, 
                            marginVertical:5,
                            }}>Case Pack: {utils.getAttributeFromCustom(productDetail, 'case_pack')}
                    </Text>
                    :
                    <Text style={{
                        color: colors.textColor,
                        fontFamily: 'DRLCircular-Book',    
                        fontSize:16, 
                        marginVertical:5,
                        }}>Case Pack: {utils.getAttributeFromCustom(productDetailConfigurable, 'case_pack')}
                    </Text>
                    } */}
          <View style={{marginTop: 10}}>
            {productDetail.type_id === 'simple' ? (
              <View>
                {/* {quantity>0?
                        <Text style={{
                            color: colors.textColor,
                            fontFamily: 'DRLCircular-Book',    
                            fontSize:16,
                            marginVertical:5 
                            }}>Selected Quantity: {quantity}</Text>
                        :
                        <Text style={{
                            color: colors.textColor,
                            fontFamily: 'DRLCircular-Book',    
                            fontSize:16, 
                            marginVertical:5
                            }}>Available Quantity: {productDetail.stock}</Text>
                        } */}

                {productDetail.stock > 0 ? (
                  <View
                    style={[
                      styles.labelGreen,
                      {paddingVertical: 10, paddingHorizontal: 5},
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

                {/* <Text
                  style={{
                    color: colors.textColor,
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    marginVertical: 5,
                  }}>
                  Available Quantity (in packs): {productDetail.stock}
                </Text> */}
              </View>
            ) : (
              <AvailableQuantityBySku sku={productDetailConfigurable.sku} />
            )}

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.textColor,
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  marginVertical: 5,
                  marginRight: 20,
                }}>
                Quantity in packs:
              </Text>

              <View
                style={{
                  borderWidth: 0.5,
                  padding: 0,
                  borderColor: colors.grey,
                  borderRadius: 10,
                }}>
                <TextInput
                  style={{
                    height: 30,
                    paddingVertical: 0,
                    paddingLeft: 5,
                    paddingRight: 5,
                    width: 100,
                  }}
                  placeholder={'Enter quantity'}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  value={quantity}
                  onChangeText={value => setQuantity(value)}
                  onSubmitEditing={() => {
                    //submitting();
                  }}
                  // blurOnSubmit={false}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View>
      {renderGeneralSection()}
      {/* {selectedStrength !== undefined && selectedStrength.length ===0 && setSelectedStrength(selectedStrength[0])}
        {selectedPack !== undefined && selectedPack.length === 0 && setSelectedPack(selectedPack[0])} */}
    </View>
  );
};

export default AllProductVariants;
