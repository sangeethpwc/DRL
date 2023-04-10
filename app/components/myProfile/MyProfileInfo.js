import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Button,
  StatusBar,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import styles from './MyProfile_style';
import colors from '../../config/Colors';

const MyProfileInfo = props => {
  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;
  const height = width * 0.6;

  return (
    <ScrollView style={{backgroundColor: '#F6FBFF'}}>
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 22,
          marginTop: 25,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => props.prop(false)}>
          <Image
            source={require('../../images/back_small.png')}
            style={{marginRight: 14}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 20,
            color: '#5225B5',
          }}>
          General Information
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          paddingRight: 21,
          paddingLeft: 21,
          paddingTop: 31,
          paddingBottom: 30,
          marginTop: 25,
        }}>
        <View style={styles.Container}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 30,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 18,
                color: '#4F4F4F',
              }}>
              General Information
            </Text>
            <TouchableOpacity>
              <Image source={require('../../images/Group_764.png')} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Legal Business Name</Text>
            <Text style={styles.boldText}>Legal Business Name</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>DBA</Text>
            <Text style={styles.boldText}>DBA</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>D-U-N-S Number</Text>
            <Text style={styles.boldText}>3 5 - 3 4 5 - 6 5 4 5</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Company Website</Text>
            <Text style={styles.boldText}>companywebsite.com</Text>
          </View>
        </View>

        <View style={styles.Container}>
          <View style={{marginBottom: 30, marginTop: 33}}>
            <Text style={styles.headingLabel}>Corporate Address</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Business Address</Text>
            <Text style={styles.boldText}>
              4500 San Pablo Rd S, Jacksonville, FL 32224, United States
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>FAX Number</Text>
            <Text style={styles.boldText}>FAX Number</Text>
          </View>
        </View>

        <View style={styles.Container}>
          <View style={{marginBottom: 30, marginTop: 33}}>
            <Text style={styles.headingLabel}>Billing Address</Text>
          </View>

          <View style={[styles.infoContainer, {flexDirection: 'row'}]}>
            <Text style={[styles.lightText, {marginRight: 30}]}>
              Same as Corporate Address
            </Text>
            <Text style={styles.boldText}>Yes</Text>
          </View>
        </View>

        <View style={styles.Container}>
          <View style={{marginBottom: 30, marginTop: 33}}>
            <Text style={styles.headingLabel}>Primary shipping address</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Same as Corporate Address</Text>
            <Text style={styles.boldText}>
              4500 San Pablo Rd S, Jacksonville, FL 32224, United States
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Shipment Contact Name</Text>
            <Text style={styles.boldText}>Eric Sutherland</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>Shipment Contact Phone Number</Text>
            <Text style={styles.boldText}>+1 3 4 5 - 3 4 5 - 6 5 4 5</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.lightText}>
              Shipment Contact E-mail Address
            </Text>
            <Text style={styles.boldText}>esutherland@abc.com</Text>
          </View>
        </View>

        <View style={styles.Container}>
          <View style={{marginBottom: 30, marginTop: 33}}>
            <Text style={styles.headingLabel}>Upload Documents</Text>
          </View>

          <View style={[styles.infoContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.boldText, {marginRight: 10}]}>
                State_License.PDF
              </Text>
              <Image source={require('../../images/tick_small.png')} />
            </View>
            <Text style={[styles.lightText, {marginRight: 30}]}>
              File supported PDF & maximum file size 5MB
            </Text>
          </View>

          <View style={[styles.infoContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.boldText, {marginRight: 10}]}>
                DEA_Licence.PDF
              </Text>
              <Image source={require('../../images/tick_small.png')} />
            </View>
            <Text style={[styles.lightText, {marginRight: 30}]}>
              File supported PDF & maximum file size 5MB
            </Text>
          </View>
        </View>

        <View style={styles.Container}>
          <View style={{marginBottom: 30, marginTop: 33}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Light',
                fontSize: 13,
                color: '#9A9A9A',
                lineHeight: 19,
              }}>
              Have you been in contact with Dr.Reddy’s Team (Optional)
            </Text>
          </View>

          <View style={[styles.infoContainer, {flexDirection: 'row'}]}>
            <Text style={styles.boldText}>Andrive Sutherland</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// const errorHandledComponent = withErrorHandler(MyProfileInfo);

export default MyProfileInfo;
