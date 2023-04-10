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
import {getAdminTokenForLabels} from '../../services/operations/profileApis';
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

  const [businessLabel, setBusinessLabel] = useState('');
  const [orgLabel, setOrgLabel] = useState('');
  const profile = useSelector(state => state.profile);

  let Type = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'business_type',
  );
  let other = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'business_other',
  );
  let FedTaxID = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'federal_taxid',
  );
  let w9 = utils.getAttributeFromCustom(loginData.customerInfo, 'w9_form');
  let financials = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'financial',
  );
  let isEDI = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'edi_capabilities',
  );
  let EDIdetails = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'fill_edi_capabilities',
  );
  let GLN = utils.getAttributeFromCustom(loginData.customerInfo, 'gln_no');
  let IDN = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'idn_affiliation',
  );
  let GPO = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'partof_organization',
  );
  let GPO_other = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'gpo_others',
  );
  let isDisproportianate = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'disproportionate_hospital',
  );
  let monthly = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'monthly_purchase',
  );

  useEffect(() => {
    if (
      _.isEmpty(profile.businessLabels) ||
      _.isEmpty(profile.organizationLabels)
    ) {
      dispatch(getAdminTokenForLabels());
    } else {
      let businessLabelTemp = profile.businessLabels.find(
        item => item.value === Type,
      ).label;
      setBusinessLabel(businessLabelTemp);

      let orgLabelTemp = profile.organizationLabels.find(
        item => item.value === GPO,
      ).label;
      setOrgLabel(orgLabelTemp);
    }
  }, [profile.organizationLabels]);

  useEffect(() => {
    if (
      _.isEmpty(profile.businessLabels) ||
      _.isEmpty(profile.organizationLabels)
    ) {
      dispatch(getAdminTokenForLabels());
    } else {
      let businessLabelTemp = profile.businessLabels.find(
        item => item.value === Type,
      ).label;
      setBusinessLabel(businessLabelTemp);

      let orgLabelTemp = profile.organizationLabels.find(
        item => item.value === GPO,
      ).label;
      setOrgLabel(orgLabelTemp);
    }
  }, []);

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
        title={'Business Identification'}
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
            Business Identification
          </Text>
        </View>

        <View style={styles.box}>
          <View style={styles.container}>
            <Text style={styles.label}>Type of Business</Text>
            <TextInput
              editable={false}
              value={businessLabel}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              If Type of Business is “Other”, Please Provide Information
            </Text>
            <TextInput editable={false} value={other} style={styles.input} />
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.container}>
            <Text style={styles.label}>
              Does Your Company Have EDI Capabilities
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity
                style={
                  isEDI === '1'
                    ? styles.buttonSelected
                    : styles.buttonUnselected
                }>
                <Text
                  style={
                    isEDI === '1'
                      ? styles.whiteTextMedium
                      : styles.blackTextMedium
                  }>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  isEDI === '0'
                    ? styles.buttonSelected
                    : styles.buttonUnselected
                }>
                <Text
                  style={
                    isEDI === '0'
                      ? styles.whiteTextMedium
                      : styles.blackTextMedium
                  }>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Please fill the EDI Capabilities</Text>
            <TextInput
              editable={false}
              value={EDIdetails}
              style={[styles.input, {height: 80}]}
            />
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.container}>
            <Text style={styles.label}>IDN Affiliation</Text>
            <TextInput editable={false} value={IDN} style={styles.input} />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              If Part of a GPO, Please Select GPO Name
            </Text>
            <TextInput editable={false} value={orgLabel} style={styles.input} />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Other GPO Name</Text>
            <TextInput
              editable={false}
              value={GPO_other}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Are you disproportionate hospital?</Text>
            <TextInput
              editable={false}
              value={isDisproportianate === '1' ? 'Yes' : 'No'}
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Expected Monthly Purchases</Text>
            <TextInput editable={false} value={monthly} style={styles.input} />
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
