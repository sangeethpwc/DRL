import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
import {addToCart, getCartID} from '../../services/operations/productApis';
import _ from 'lodash';
import styles from './productStyles';
import utils from '../../utilities/utils';
import Counter from 'react-native-counters';
import Collapsible from 'react-native-collapsible';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import AvailableQuantityBySku from './AvailableQuantityBySku';
import Toast from 'react-native-simple-toast';

const GeneralProduct = props => {
  // const [selectedStrength,setSelectedStrength]=useState("Strength")
  // const [selectedPack,setSelectedPack]=useState("Pack size")

  const [selectedStrength, setSelectedStrengthData] = useState('');
  const [selectedPack, setSelectedPackData] = useState('');
  const [quantity, setQuantityData] = useState(0);

  const [isGneralExpaded, setGeneralExpanded] = useState(true);
  const [loader, setLoader] = useState(false);
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let generalQuanity = 1;

  let productDetail = {};

  let productDetailChild = {};

  let strengthValues = [];

  let packValue = [];

  if (props !== undefined && props.productDetail !== undefined) {
    productDetail = props.productDetail;
  }

  if (props !== undefined && props.productDetailChild !== undefined) {
    productDetailChild = props.productDetailChild;
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
          style={{width: '90%'}}
          textStyle={{fontSize: 18}}
          dropdownStyle={
            strengthValues.length > 1
              ? {width: '35%', height: 80}
              : {width: '35%', height: 50}
          }
          dropdownTextStyle={{fontSize: 16}}
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
          style={{width: '90%'}}
          dropdownStyle={
            packValue.length > 1
              ? {width: '35%', height: 80}
              : {width: '35%', height: 50}
          }
          dropdownTextStyle={{fontSize: 16}}
          textStyle={{fontSize: 18}}
          
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
    if (
      productDetail.type_id === 'simple' &&
      parseInt(productDetail.stock) < parseInt(quantity)
    ) {
      Toast.show('Invaild quantity', Toast.SHORT);
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
      Toast.show('Invaild quantity', Toast.SHORT);
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
            <View style={{flexDirection: 'row'}}>
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <View style={{width: '50%', flexDirection: 'row', alignItems: 'center', marginTop:25}}>
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
                                marginTop:5,
                                }}>{utils.getAttributeFromCustom(productDetailChild, 'case_pack')}</Text>
                        }

                        </View> */}
            </View>
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
