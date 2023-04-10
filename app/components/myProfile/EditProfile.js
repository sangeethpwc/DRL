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

export default function EditProfile(props) {
  const loginData = useSelector(state => state.authenticatedUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(loginData.customerInfo.firstname);
  const [lastName, setLastName] = useState(loginData.customerInfo.lastname);
  const [email, setEmail] = useState(loginData.customerInfo.email);

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
        title={'Edit Profile'}
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
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Edit Profile
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            onChangeText={text => setFirstName(text)}
            value={firstName}
            placeholder="Enter First Name"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            onChangeText={text => setLastName(text)}
            value={lastName}
            placeholder="Enter Last Name"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder="Enter Last Name"
            style={styles.input}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonUnselected}>
          <Text style={styles.blackTextMedium}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            update();
          }}
          style={styles.buttonSelected}>
          <Text style={styles.whiteTextMedium}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
