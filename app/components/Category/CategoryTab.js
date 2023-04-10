import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../../config/Colors';
import {TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import {
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
  setTherapeutic,
  setCategoryApplied,
  setDosageApplied,
  setFilters,
  setProductName,
} from '../../slices/productSlices';
import {useSelector, useDispatch} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import {ScrollView} from 'react-native-gesture-handler';

export function CategoryTab({props}) {
  const loginData = useSelector(state => state.authenticatedUser);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [isExpendedMed, setExpanedMed] = useState(false);
  const [isExpendedTh, setExpanedTh] = useState(true);

  const [TheraputicTypes, setTheraputicTypesState] = useState(
    loginData.categoryNames,
  );
  const [MedicationTypes, setMedicationTypesState] = useState(
    loginData.medicationTypes,
  );

  let dosageFrom = [];

  function formatData(text) {
    const publication = text;
    return publication[0].toUpperCase() + publication.substring(1);
  }

  function renderMedicationItems(item, index) {
    let value = item.value;
    return item.label.trim().length === 0 ||
      item.product_count === '0' ? null : (
      <TouchableHighlight
        style={{borderRadius: 5, marginLeft: 15, marginRight: 5, height: 50}}
        underlayColor={colors.grey}
        onPress={() => {
          dispatch(getProductsSuccess([]));
          dispatch(setConfigurableProducts([]));
          dispatch(setConfigurableProductDetail([]));
          dispatch(getProductDetailSuccess({}));
          dispatch(setCategoryApplied(true));

          dispatch(setFilters([]));
          dispatch(setProductName(undefined));
          dispatch(setTherapeutic([]));

          dosageFrom = [];
          dosageFrom.push(value);
          dispatch(setDosageApplied(dosageFrom));
          navigation.navigate('AllProducts', {
            api: 'multiple',
            dosage: dosageFrom,
            theraputic: [],
            brand: [],
          });
        }}>
        <View style={styles.button}>
          <Text
            style={{
              width: '90%',
              color: colors.textColor,
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
            }}>
            {formatData(item.label)} ({item.product_count})
          </Text>
          <Image source={require('../../images/forward_small.png')} />
        </View>
      </TouchableHighlight>
    );
  }

  function renderMedicationList() {
    return (
      <FlatList
        data={MedicationTypes}
        renderItem={({item, index}) => renderMedicationItems(item, index)}
        keyExtractor={(item, index) => index}
        style={{backgroundColor: colors.shopCategoryBackground}}
      />
    );
  }

  let therapeutics = [];

  function renderTheraputicItems(item, index) {
    let value = item.value;
    return item.label.trim().length === 0 ||
      item.product_count === '0' ? null : (
      <TouchableHighlight
        style={{borderRadius: 5, marginLeft: 15, marginRight: 5, height: 50}}
        underlayColor={colors.grey}
        onPress={() => {
          dispatch(getProductsSuccess([]));
          dispatch(setConfigurableProducts([]));
          dispatch(setConfigurableProductDetail([]));
          dispatch(getProductDetailSuccess({}));

          therapeutics = [];
          therapeutics.push(value);
          dispatch(setCategoryApplied(true));
          dispatch(setDosageApplied([]));
          dispatch(setFilters([]));
          dispatch(setProductName(undefined));
          dispatch(setTherapeutic(therapeutics));
          navigation.navigate('AllProducts', {
            api: 'multiple',
            dosage: [],
            theraputic: therapeutics,
            brand: [],
          });
        }}>
        <View style={styles.button}>
          <Text
            style={{
              width: '90%',
              color: colors.textColor,
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
            }}>
            {formatData(item.label)} ({item.product_count})
          </Text>
          <Image source={require('../../images/forward_small.png')} />
        </View>
      </TouchableHighlight>
    );
  }

  function renderTheraputicList() {
    return (
      <FlatList
        data={TheraputicTypes}
        renderItem={({item, index}) => renderTheraputicItems(item, index)}
        keyExtractor={(item, index) => index}
        style={{backgroundColor: colors.shopCategoryBackground}}
      />
    );
  }

  function renderMedication() {
    return (
      <Collapsible collapsed={!isExpendedMed}>
        <View style={isExpendedMed ? {} : {height: 0}}>
          <TouchableOpacity style={{borderRadius: 5}}>
            {renderMedicationList()}
          </TouchableOpacity>
        </View>
      </Collapsible>
    );
  }

  function renderTheraputic() {
    return (
      <Collapsible collapsed={!isExpendedTh}>
        <View style={isExpendedTh ? {} : {height: 0}}>
          <TouchableOpacity style={{borderRadius: 5}}>
            {renderTheraputicList()}
          </TouchableOpacity>
        </View>
      </Collapsible>
    );
  }

  return (
    <View
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#F6FBFF'}}>
      <CustomeHeader
        back={undefined}
        title={'Categories'}
        isHome={false}
        addToCart={'cart'}
        addToWishList={'wishlist'}
        addToLocation={'location'}
      />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <View
            style={{
              marginTop: 20,
              backgroundColor: colors.white,
              borderWidth: 0.1,
              borderRadius: 5,
              borderBottomWidth: 0.4,
              borderTopWidth: 0.2,
              padding: 0,
              borderColor: colors.grey,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (isExpendedMed) {
                  setExpanedMed(false);
                } else {
                  setExpanedMed(true);
                }
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 100,
                }}>
                <Image
                  source={require('../../images/Group_956.png')}
                  style={{height: 50}}
                  resizeMode="contain"
                />

                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                  }}>
                  <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                    Dosage Form
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {renderMedication()}
          </View>

          <View
            style={{
              marginTop: 20,
              backgroundColor: colors.white,
              borderWidth: 0.1,
              borderRadius: 5,
              borderBottomWidth: 0.4,
              borderTopWidth: 0.2,
              padding: 0,
              borderColor: colors.grey,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (isExpendedTh) {
                  setExpanedTh(false);
                } else {
                  setExpanedTh(true);
                }
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 100,
                }}>
                <Image
                  source={require('../../images/Group_956.png')}
                  style={{height: 50}}
                  resizeMode="contain"
                />

                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                  }}>
                  <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                    Container Type
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {renderTheraputic()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CategoryTab;
