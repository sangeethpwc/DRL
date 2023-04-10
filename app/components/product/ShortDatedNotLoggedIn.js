import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  
  TextInput,
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

//var data = undefined;

const ShortDated = props => {
  const [selectedStrength, setSelectedStrength] = useState('Strength');
  const [selectedPack, setSelectedPack] = useState('Pack size');
  const [isShortDatedExpanded, setShortDatedExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [data, setData] = useState([]);

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  let generalQuanity = 1;
  let productDetail = {};

  if (props !== undefined) {
    productDetail = props.productDetail;
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
          dropdownStyle={{width: '35%', height: 50}}
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
  //             marginRight:20, marginTop:5, flexDirection: 'row', alignItems: 'center', height:40}}>
  //         <ModalDropdown  textStyle={{fontSize:18}}
  //         style={{width: '90%',}}
  //         dropdownStyle={{width: '35%', height:50}}

  //         dropdownTextStyle={{fontSize:16}}
  //         options={strengthValues}
  //         defaultValue={strengthValues.length===1?strengthValues[0]: "Please select"}
  //         onSelect ={(value) => {setSelectedStrength(value)}}
  //         />
  //        <Image source = {require('../../images/bottom_small.png')}/>
  //         </View>
  //     )
  // }

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
    //
    //

    if (parseInt(quantity) > parseInt(data[index].quantity)) {
      Toast.show('Invaild quantity', Toast.SHORT);
    } else if (parseInt(data[index].quantity) === 0) {
      Toast.show('Out of stock', Toast.SHORT);
    } else {
      // data[index].entered_qunatity = quantity;
      let dataObject = {};
      dataObject = _.clone(data[index]);
      if (dataObject !== undefined) {
        dataObject.entered_qunatity = quantity;
        let temp = _.cloneDeep(data);
        temp.splice(index, 1, dataObject);
        setData(temp);
      }
    }
    //
  }

  function getShortDated() {
    // let data = utils.getOptions(productDetail,'Shortdated');
    // let shortDated = utils.getOptions(productDetail, 'Shortdated LOT No#');

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

    if (data.length === 0 && shortDated.length > 0) {
      //setData(utils.getOptions(productDetail, 'Shortdated LOT No#'));
      setData(shortDated);
    }

    return data.map((item, index) => (
      <View style={{marginBottom: 10}}>
        <View
          style={{
            backgroundColor: colors.shortdateBackground,
            borderRadius: 10,
          }}>
          <View style={{padding: 10}}>
            <Text style={{marginBottom: 10, fontFamily: 'DRLCircular-Book'}}>
              Batch No.{' '}
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>{item.title}</Text>
            </Text>
            <Text style={{marginBottom: 10, fontFamily: 'DRLCircular-Book'}}>
              Expiry:{' '}
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                {item.expiry_date}
              </Text>
            </Text>
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

            <View style={{flexDirection: 'row'}}></View>
          </View>
        </View>
      </View>
    ));
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
          dropdownStyle={{width: '35%', height: 50}}
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
    // let shortDated = utils.getOptions(productDetail, 'Shortdated LOT No#');

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
                <Text style={styles.boldText}>Shortdated</Text>
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
};

export default ShortDated;
