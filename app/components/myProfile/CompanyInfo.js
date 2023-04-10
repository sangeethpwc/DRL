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
        title={'Company Information'}
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
            Company Information
          </Text>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Corporate
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>Corporate Contact Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'corporate_contact_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Corporate Contact Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'corporate_contact_phone_number',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Corporate Contact E-mail Address </Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'corporate_contact_email_address',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Purchasing
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>Purchasing Contact Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'purchasing_contact_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Purchasing Contact Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'purchasing_contact_phone_number',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Purchasing Contact E-mail Address </Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'purchasing_contact_email_address',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Account payable
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>Accounts Payable Contact Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'accounts_payable_contact_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>AP Contact Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'ap_contact_phone_number',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>AP E-mail Address</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'ap_email_address',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Electronic Data Interchange (EDI)
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>EDI Contact Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'edi_contact_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>EDI Contact Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'edi_contact_phone',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>EDI Contact E-mail Address</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'edi_contact_email',
              )}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Shipment Contact
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>Shipment Contact Name</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'ship_contact_name',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Shipment Contact Phone Number</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'ship_contact_phone',
              )}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Shipment Contact E-mail Address</Text>
            <TextInput
              editable={false}
              value={utils.getAttributeFromCustom(
                loginData.customerInfo,
                'ship_contact_email',
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
