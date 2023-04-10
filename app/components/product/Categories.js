import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  Button,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import styles from './productStyles';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import homeStyles from '../home/home_style';
import colors from '../../config/Colors';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import {FlatList} from 'react-native-gesture-handler';
import {
  endSearch,
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setFilters,
  setProductName,
} from '../../slices/productSlices';

let tempFilters = [];

export default function Categories(props) {
  let tempBrand = [];
  let tempDosageFrom = [];
  let tempTherapeutics = [];

  //  let tempFilters=[]
  const product = useSelector(state => state.product);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);
  const [Brands, setBrandsState] = useState(loginData.brandNames);
  const [TherapeuticClass, setTherapeuticClassState] = useState(
    loginData.categoryNames,
  );
  const [MedicationTypes, setMedicationTypesState] = useState(
    loginData.medicationTypes,
  );

  const [isBrands, setBrands] = useState(false);
  const [isTherapeuticClass, setTherapeuticClass] = useState(true);
  const [isMedicationType, setMedicationType] = useState(false);

  function formatData(text) {
    const publication = text;
    return publication[0].toUpperCase() + publication.substring(1);
  }

  function clear() {
    let tempBrand = [];
    tempBrand = _.cloneDeep(Brands);
    tempBrand.map(item => {
      item.CHECKED = false;
    });
    setBrandsState(tempBrand);

    let therapeutics = [];
    therapeutics = _.cloneDeep(TherapeuticClass);
    therapeutics.map(item => {
      item.CHECKED = false;
    });
    setTherapeuticClassState(therapeutics);

    let medications = [];
    medications = _.cloneDeep(MedicationTypes);
    medications.map(item => {
      item.CHECKED = false;
    });
    setMedicationTypesState(medications);
    // dispatch(setCategoryApplied(true))
    // dispatch(setDosageApplied ([]))
    // dispatch(setTherapeutic([]))
    //dispatch(setProductName(undefined))
  }

  function apply() {
    const selectedBrands = [];
    const selectedTherapeuticClass = [];
    const selectedMedicationType = [];
    Brands.map(item => {
      if (item.CHECKED === true) {
        selectedBrands.push(item.value);
      }
    });

    TherapeuticClass.map(item => {
      if (item.CHECKED === true) {
        selectedTherapeuticClass.push(item.value);
      }
    });

    MedicationTypes.map(item => {
      if (item.CHECKED === true) {
        selectedMedicationType.push(item.value);
      }
    });

    dispatch(endSearch());
    dispatch(getProductsSuccess([]));
    dispatch(setConfigurableProducts([]));
    dispatch(setConfigurableProductDetail([]));
    dispatch(getProductDetailSuccess({}));

    //
    //props.onRefresh()
    dispatch(setCategoryApplied(true));
    dispatch(setDosageApplied(selectedMedicationType));
    dispatch(setTherapeutic(selectedTherapeuticClass));

    dispatch(setProductName(undefined));
    navigation.goBack();
    // navigation.replace('AllProducts',
    // {api:"multiple",
    // dosage:selectedMedicationType,
    // theraputic:selectedTherapeuticClass,
    // brand: selectedBrands,
    // filters:tempFilters
    // }
    // )
  }

  function onChangeCheck(i) {
    let tempBrand = [];
    tempBrand = _.cloneDeep(Brands);
    if (tempBrand[i].CHECKED === true) {
      tempBrand[i].CHECKED = false;
    } else {
      tempBrand[i].CHECKED = true;
    }
    setBrandsState(tempBrand);
  }

  function onChangeCheck2(i) {
    let tempTheraputic = [];
    tempTheraputic = _.cloneDeep(TherapeuticClass);
    if (tempTheraputic[i].CHECKED === true) {
      tempTheraputic[i].CHECKED = false;
    } else {
      tempTheraputic[i].CHECKED = true;
    }
    setTherapeuticClassState(tempTheraputic);
  }

  function setDosageFromParent() {
    let temp = [];
    temp = _.cloneDeep(MedicationTypes);

    for (let j = 0; j < product.dosage.length; j++) {
      let index = _.findIndex(temp, {value: product.dosage[j]});
      if (index != -1) {
        temp[index].CHECKED = true;
      }
    }

    setMedicationTypesState(temp);
  }

  function setTheraputicFromParent() {
    let temp = [];
    temp = _.cloneDeep(TherapeuticClass);

    for (let j = 0; j < product.theraputic.length; j++) {
      let index = _.findIndex(temp, {value: product.theraputic[j]});
      if (index != -1) {
        temp[index].CHECKED = true;
      }
    }

    setTherapeuticClassState(temp);
  }

  function setBrandFromParent() {
    let temp = [];
    temp = _.cloneDeep(Brands);

    for (let j = 0; j < tempBrand.length; j++) {
      let index = _.findIndex(temp, {value: tempBrand[j]});
      if (index != -1) {
        temp[index].CHECKED = true;
      }
    }

    setBrandsState(temp);
  }

  function onChangeCheck3(i) {
    let tempMedication = [];
    tempMedication = _.cloneDeep(MedicationTypes);
    if (tempMedication[i].CHECKED === true) {
      tempMedication[i].CHECKED = false;
    } else {
      tempMedication[i].CHECKED = true;
    }
    setMedicationTypesState(tempMedication);
  }

  function renderBrandItems(item, index) {
    return item.label.trim().length === 0 ? null : (
      <View style={styles.itemsView}>
        <CheckBox
          style={styles.checkbox}
          disabled={false}
          value={Brands[index].CHECKED}
          onValueChange={newValue => onChangeCheck(index)}
        />
        <Text style={[styles.greyTextSmall, {width: 170}]}>
          {formatData(item.label)}
        </Text>
      </View>
    );
  }

  function renderTheraputicItems(item, index) {
    return item.label.trim().length === 0 ||
      item.product_count === '0' ? null : (
      <View style={styles.itemsView}>
        <CheckBox
          style={styles.checkbox}
          disabled={false}
          value={TherapeuticClass[index].CHECKED}
          onValueChange={newValue => onChangeCheck2(index)}
        />
        <Text style={[styles.greyTextSmall, {width: 170}]}>
          {formatData(item.label)} ({item.product_count})
        </Text>
      </View>
    );
  }

  function renderMedicationItems(item, index) {
    return item.label.trim().length === 0 ||
      item.product_count === '0' ? null : (
      <View style={styles.itemsView}>
        <CheckBox
          style={styles.checkbox}
          disabled={false}
          value={MedicationTypes[index].CHECKED}
          onValueChange={newValue => onChangeCheck3(index)}
        />
        <Text style={[styles.greyTextSmall, {width: 170}]}>
          {formatData(item.label)} ({item.product_count})
        </Text>
      </View>
    );
  }

  useEffect(() => {
    ////////////////////

    setTheraputicFromParent();
    setDosageFromParent();

    /////////////////
  }, []);

  useEffect(() => {
    renderBrands();
    return () => {};
  }, [Brands]);

  useEffect(() => {
    renderTheraputicList();
    return () => {};
  }, [TherapeuticClass]);

  useEffect(() => {
    renderMedication();
    return () => {};
  }, [MedicationTypes]);

  function renderBrands() {
    //
    return (
      <View style={{marginBottom: 150}}>
        <FlatList
          data={Brands}
          renderItem={({item, index}) => renderBrandItems(item, index)}
          //Setting the number of column
          keyExtractor={(item, index) => index}
          // style={styles.itemsContainer}
          // style={{width:'100%'}}
        />
      </View>
    );
  }

  function renderTheraputicList() {
    //
    return (
      <View style={{marginBottom: 150}}>
        <FlatList
          data={TherapeuticClass}
          renderItem={({item, index}) => renderTheraputicItems(item, index)}
          //Setting the number of column
          keyExtractor={(item, index) => index}
          // style={styles.itemsContainer}
        />
      </View>
    );
  }

  function renderMedication() {
    //
    return (
      <View style={{marginBottom: 150}}>
        <FlatList
          data={MedicationTypes}
          renderItem={({item, index}) => renderMedicationItems(item, index)}
          //Setting the number of column
          keyExtractor={(item, index) => index}
          // style={styles.itemsContainer}
        />
      </View>
    );
  }

  return (
    <View style={{height: '100%', backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Category</Text>
        <TouchableOpacity
          onPress={() => {
            clear();
          }}>
          <Text style={styles.mediumText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => {
              setMedicationType(true);
              setTherapeuticClass(false);
              setBrands(false);
            }}>
            <View
              style={
                isMedicationType
                  ? styles.categoriesViewSelected
                  : styles.categoriesViewUnselected
              }>
              <Text
                style={
                  isMedicationType
                    ? styles.whiteTextMediumSelected
                    : styles.blackTextMedium
                }>
                Dosage Form
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMedicationType(false);
              setTherapeuticClass(true);
              setBrands(false);
            }}>
            <View
              style={
                isTherapeuticClass
                  ? styles.categoriesViewSelected
                  : styles.categoriesViewUnselected
              }>
              <Text
                style={
                  isTherapeuticClass
                    ? styles.whiteTextMediumSelected
                    : styles.blackTextMedium
                }>
                Container Type
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.itemsContainer}>
          {isBrands && renderBrands()}
          {isTherapeuticClass && renderTheraputicList()}
          {isMedicationType && renderMedication()}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            //navigation.replace('AllProducts')
            navigation.goBack()
          }
          style={styles.buttonUnselected}>
          <Text style={styles.blackTextMedium}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            apply();
          }}
          style={styles.buttonSelected}>
          <Text style={styles.whiteTextMedium}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
