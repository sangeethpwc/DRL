import React, {useState} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import colors from '../../config/Colors';
import {TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import {
  setConfigurableProductDetail,
  setConfigurableProducts,
  getProductsSuccess,
  getProductDetailSuccess,
} from '../../slices/productSlices';
import {useSelector, useDispatch} from 'react-redux';

export function MoreComponent({props}) {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const loginData = useSelector(state => state.authenticatedUser);
  const [MedicationTypes, setMedicationTypesState] = useState(
    loginData.categoryNames,
  );

  let therapeutics = [];

  function formatData(text) {
    const publication = text;
    return publication[0].toUpperCase() + publication.substring(1);
  }

  function renderMedicationItems(item, index) {
    let value = item.value;
    return item.label.trim().length === 0 ? null : (
      <TouchableHighlight
        style={{borderRadius: 5, marginLeft: 15, marginRight: 5, height: 50}}
        underlayColor={colors.grey}
        onPress={() => {
          dispatch(getProductsSuccess([]));
          dispatch(setConfigurableProducts([]));
          dispatch(setConfigurableProductDetail([]));
          dispatch(getProductDetailSuccess({}));
          therapeutics.push(value);
          navigation.replace('AllProducts', {
            api: 'multiple',
            dosage: [],
            theraputic: therapeutics,
            brand: [],
          });
        }}>
        <View style={styles.button}>
          <Text
            style={{
              color: colors.textColor,
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
            }}>
            {formatData(item.label)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  function renderMedication() {
    return (
      <View style={{marginBottom: 50}}>
        <FlatList
          data={MedicationTypes}
          renderItem={({item, index}) => renderMedicationItems(item, index)}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }

  return (
    <View
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#F6FBFF'}}>
      <CustomeHeader
        back={'back'}
        title={'Therapeutic Class'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />
      <View
        style={{
          marginTop: 20,
          backgroundColor: colors.white,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 10,
          borderWidth: 0.1,
          borderRadius: 5,
          borderBottomWidth: 0.4,
          borderTopWidth: 0.2,
          padding: 10,
          borderColor: colors.grey,
        }}>
        {renderMedication()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    height: 35,
    justifyContent: 'center',
  },
});

export default MoreComponent;
