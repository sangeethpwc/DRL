import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
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

  const [firstName, setFirstName] = useState(loginData.customerInfo.firstname);
  const [lastName, setLastName] = useState(loginData.customerInfo.lastname);
  const [email, setEmail] = useState(loginData.customerInfo.email);

  let BusinessName = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'legal_business_name',
  );
  let DBA = utils.getAttributeFromCustom(loginData.customerInfo, 'dba');
  let DUNS = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'duns_number',
  );
  let CompanyWebsite = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'company_website',
  );
  let contactPerson = utils.getAttributeFromCustom(
    loginData.customerInfo,
    'contact_person',
  );

  let profile = {
    customer: {
      id: loginData.customerInfo.id,
      email: email,
      firstname: firstName,
      lastname: lastName,
      storeId: loginData.customerInfo.store_id,
      websiteId: loginData.customerInfo.website_id,
      custom_attributes: [],
    },
  };

  function update() {
    if (firstName === '' || lastName === '' || email === '') {
      Toast.show('Please enter all fields', Toast.SHORT);
    } else {
      dispatch(editProfile(profile));
      Toast.show('Profile Updated', Toast.SHORT);
      navigation.goBack();
    }
  }

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
        title={'Account Information'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      <ScrollView style={{padding: 20, height: '100%'}}>
        <View
          style={{
            height: 40,
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Account Information
          </Text>
          {/* <TouchableOpacity onPress={()=>{
    navigation.navigate('EditProfile')
      }}

      ><Image source={require('../../images/edit.png')}/></TouchableOpacity> */}
        </View>

        <View
          style={{
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
            paddingBottom: 30,
          }}>
          <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              editable={false}
              // onChangeText={(text) =>setFirstName(text)}
              value={firstName}
              placeholder="Enter First Name"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              editable={false}
              // onChangeText={(text) =>setLastName(text)}
              value={lastName}
              placeholder="Enter Last Name"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              editable={false}
              // onChangeText={(text) =>setEmail(text)}
              value={email}
              placeholder="Enter Email"
              style={styles.input}
            />
          </View>
        </View>

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
            General Information
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Legal Business Name</Text>
          <TextInput
            style={styles.textUnselected}
            editable={false}
            // onChangeText={(text) =>setFirstName(text)}
            value={BusinessName}
            placeholder="Legal Business Name"
            // style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>DBA</Text>
          <TextInput
            editable={false}
            // onChangeText={(text) =>setLastName(text)}
            value={DBA}
            placeholder="DBA"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>D-U-N-S Number</Text>
          <TextInput
            editable={false}
            value={DUNS}
            placeholder="D-U-N-S Number"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Company Website</Text>
          <TextInput
            editable={false}
            value={CompanyWebsite}
            placeholder="Company Website"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            Person you have been in contact with at Dr. Reddy's?
          </Text>
          <TextInput
            editable={false}
            value={contactPerson}
            placeholder="Person you have been in contact with at Dr. Reddy's?"
            style={styles.input}
          />
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

  textUnselected: {
    fontFamily: 'DRLCircular-Bold',
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
