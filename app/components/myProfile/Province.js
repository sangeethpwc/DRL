import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {addAddress, updateAddress} from '../../services/operations/profileApis';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import GlobalConst from '../../config/GlobalConst';

export default function Province(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [custID, setCustID] = useState('');
  const [addID, setAddID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [province, setProvince] = useState({});
  const [country, setCountry] = useState('US');
  const [provinceArray, setProvinceArray] = useState(JSON.parse(props.prArray));

  const [regionName, setRegionName] = useState('');
  const [regionID, setRegionID] = useState('');
  const [regionCode, setRegionCode] = useState('');

  const [RegionIndex, setRegionIndex] = useState(0);

  provinceArray = props.provinceArray;

  function getRegionPicker() {
    if (provinceArray.length > 0) {
      return (
        <Picker
          selectedValue={provinceArray[RegionIndex].name}
          onValueChange={(itemValue, itemIndex) => {
            //
            //
            setRegionIndex(itemIndex);
          }}>
          {provinceArray.map(item => (
            <Picker.Item value={item} label={item.name} />
          ))}
        </Picker>
      );
    }
  }

  return <View>{getRegionPicker()}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
  },

  label: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: colors.textColor,
  },

  input: {
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    justifyContent: 'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
  },
  footer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.shopCategoryBackground,
    // position: 'absolute',
    // bottom:0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonSelected: {
    width: 150,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnselected: {
    width: 150,
    height: 50,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderWidth: 1,
  },
  blackTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.textColor,
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },

  checkbox: {
    height: 10,
  },
});
