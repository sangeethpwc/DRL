import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {editProfile} from '../../services/operations/profileApis';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import utils from '../../utilities/utils';

export default function AccountInfo(props) {
  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //    let profile={
  //     "customer":
  //       {
  //       "id":loginData.customerInfo.id,
  //       "email": email,
  //       "firstname" : firstName,
  //       "lastname" : lastName,
  //       "storeId" : loginData.customerInfo.store_id,
  //       "websiteId" : loginData.customerInfo.website_id,
  //       "custom_attributes": [

  //       ]
  //           }
  //   }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
        height: '100%',
      }}>
      <CustomeHeader
        back={'back'}
        title={'Bank Information'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      <ScrollView style={{padding: 20, height: '100%'}}>
        <View
          style={{
            height: 70,
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                color: colors.textColor,
                fontSize: 16,
                marginVertical: 10,
              }}>
              Need Modification?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ServiceRequest');
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  color: colors.blue,
                  fontSize: 16,
                  marginVertical: 10,
                }}>
                Click Here
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Bank Information
          </Text>
        </View>

        <View style={[styles.box, {paddingTop: 0}]}>
          <View style={styles.container}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Contact Person Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_contactname',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_account',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_phone',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Fax Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_fax',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_contact_email_address',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Bank Address
          </Text>

          <View style={styles.container}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_address',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>City</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_city',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>State/Province</Text>
            <TextInput
              editable={false}
              value={utils.getRegion(
                utils.getAttributeFromCustom(
                  loginData.customerInfo,
                  'bank_country',
                ),
                utils.getAttributeFromCustom(
                  loginData.customerInfo,
                  'bank_state',
                ),
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              editable={false}
              value={utils.getCountry(
                utils.getAttributeFromCustom(
                  loginData.customerInfo,
                  'bank_country',
                ),
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Zip / Postal Code</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'bank_zip',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={{height: 40}}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
  },
  box: {
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.textColor,
    paddingBottom: 30,
    paddingTop: 20,
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
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonSelected: {
    width: 100,
    height: 30,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonUnselected: {
    width: 100,
    height: 30,
    marginRight: 10,
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
