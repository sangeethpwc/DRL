import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import styles from '../product/productStyles';
import colors from '../../config/Colors';
import _ from 'lodash';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import { Button, RadioButton } from 'react-native-paper';
import CustomeHeader from '../../config/CustomeHeader';
import CheckBox from '@react-native-community/checkbox';
import {updateSubscription} from '../../services/operations/profileApis';
import Toast from 'react-native-simple-toast';
import {setIsUpdated} from '../../slices/profileSlices';
import {useNavigation} from '@react-navigation/native';

let email = '';

export default function Subscription(props) {
  const loginData = useSelector(state => state.authenticatedUser);

  this.state = {ishidden:false}

  const navigation = useNavigation();

  const [list, setList] = useState([]);
  const [heading, setHeading] = useState('');
  const [popLink, setPopLink] = useState('');

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [checked1, setChecked1] = React.useState('');
  const [checked2, setChecked2] = React.useState('');

  const [accept, setAccept] = useState(false);

  const hidevisibil = false;

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);

  const [visible, setVisible] = React.useState(false);
  const ShowView = () => setVisible(true);
  const HideView = () => setVisible(false);
  

  useEffect(() => {
    
    if (!_.isEmpty(loginData.customerInfo)) {
      if (
        loginData.customerInfo.email !== undefined &&
        loginData.customerInfo.email.length > 0
      ) {
        email = loginData.customerInfo.email;
        
      }
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(loginData.customerInfo)) {
      if (
        loginData.customerInfo.extension_attributes !== undefined &&
        loginData.customerInfo.extension_attributes.is_subscribed !== undefined
      ) {
  
        if(loginData.customerInfo.extension_attributes.is_subscribed === true){
          this.hidevisibil = true;
        }else{
          this.hidevisibil = false;
        }

        setIsSubscribed(
          loginData.customerInfo.extension_attributes.is_subscribed,
        );

      }
    }
  }, [loginData.customerInfo]);

  useEffect(() => {
    let index = loginData.resourceCategories[0].id;
    setList(_.filter(loginData.resources, v => v.category_id === index));
    setHeading(loginData.resourceCategories[0].category);
  }, []);

  useEffect(() => {
    if (profileData.isUpdated) {
      Toast.show('Preferences saved', Toast.LONG);
      dispatch(setIsUpdated(false));
    }
  }, [profileData.isUpdated]);

  let nameDrawerRef = useRef(null);

  console.log('visible....................', visible);

  function dialogView() {
    return (
      <Modal
        onClosed={() => setPopLink('')}
        style={{ height: '40%', width: '80%' }}
        //position={'bottom'}
        swipeToClose={false}
        ref={c => (nameDrawerRef = c)}
        backdropPressToClose={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
            }}
            style={{ position: 'absolute', right: 10, top: 0 }}>
            <Image
              style={{ width: 10, resizeMode: 'contain' }}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <ScrollView>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'DRLCircular-Book',
                  lineHeight: 16,
                }}>
                {/* You are about to leave Dr.Reddy’s and affiliates website.{'\n'}
                {'\n'}
                Dr. Reddy's assumes no responsibility for the information
                presented on the external website or any further links from such
                sites. These links are presented to you only as a convenience,
                and the inclusion of any link does not imply endorsement by Dr.
                Reddy's. If you wish to continue to this external website, click
                Proceed. */}
                Dr.Reddy's Is Responsible For Implementing And Enforcing Compliance With The Applicable Data Protection Legislation. The Procedures For Third-Party Processing Of Personal Data Pursuant To A Contractual Agreement Are To Be Defined In Writing. Dr.Reddy's Shall Satisfy Itself That The Contracted Third Party Is Processing The Data Properly And That It Is Complying With The Principles Set Forth In Global Data Privacy Framework Including Any Other Document(S) Referred To And/Or Linked Thereto And This Privacy Notice. If At Any Time A Third Party Is Unable To Ensure The Adequate Security Of Personal Data, Dr.Reddy's May At Its Discretion Terminate The Contract With The Third Party. Dr.Reddy's Is Responsible For Implementing And Enforcing Compliance With The Applicable Data Protection Legislation. The Procedures For Third-Party Processing Of Personal Data Pursuant To A Contractual Agreement Are To Be Defined In Writing. Dr.Reddy's Shall Satisfy Itself That The Contracted Third Party Is Processing The Data Properly And That It Is Complying With The Principles Set Forth In Global Data Privacy Framework Including Any Other Document(S) Referred To And/Or Linked Thereto And This Privacy Notice. If At Any Time A Third Party Is Unable To Ensure The Adequate Security Of Personal Data, Dr.Reddy's May At Its Discretion Terminate The Contract With The Third Party.
              </Text>

            </ScrollView>
            
          </View>

          <TouchableOpacity
            onPress={() => {

              nameDrawerRef.close();
            }}

            style={{
              width: 90,
              height: 40,
              backgroundColor: colors.lightBlue,
              borderRadius: 10,
              marginTop: 0,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 25,
            }}>

            <Text style={styles.whiteTextMedium}>Close</Text>

          </TouchableOpacity>

        </View>
      </Modal>
    );
  }


  return (
    <View style={{ height: '100%', backgroundColor: colors.white }}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <CustomeHeader
        back={'back'}
        title={'Promotional Subscription'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      <View style={[styles.container, { marginTop: 10 }]}>
        
        <View
          style={{
            paddingTop: 30,
            paddingBottom: 30,
            borderBottomWidth: 0.0,width:'100%',
            borderColor: colors.textColor,
          }}>

         {!this.hidevisibil && <View 
            style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginBottom: 20, width: '100%' }}>
            <RadioButton 
              value='true'
              color='blue'
              // isSubscribed ={true}
              status={checked1 === 'true' ? 'checked' : 'unchecked'}
              onPress={() => setChecked1('true')}
              onValueChange={newValue => setIsSubscribed(!isSubscribed)}
            />
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                width: '100%',
                marginLeft: 10,
              }}>
              Subscribe to Promotional Emails
            </Text>
          </View>}
          
          
          {this.hidevisibil && <View 
            style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center',
             marginBottom: 20, width: '100%' }}>
            <RadioButton
              value='false'
              color='blue'
              // isSubscribed ={false}
              status={checked2 === 'false' ? 'checked' : 'unchecked'}
              onPress={() => setChecked2('false')}
              onValueChange={newValue => setIsSubscribed(!isSubscribed)}
            />
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                width: '100%',
                marginLeft: 10,
              }}>
              Unsubscribe to Promotional Emails
            </Text>
          </View>}


          {!this.hidevisibil && <View
            style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginBottom: 20,
             width: '100%' }}>
            
            <CheckBox
              onPress={() =>
                nameDrawerRef.open()
              }
              style={styles.checkbox}
              value={accept}
              onValueChange={newValue => setAccept(newValue)}
            />
            <Text
              style={{

                fontSize: 16,
                color: colors.black,
                fontFamily: 'DRLCircular-Book',
              }}
              onPress={() =>
                nameDrawerRef.open()
              }>
              I accept the{' '}
              <Text
                style={{
                  color: colors.black, fontSize: 16, lineHeight: 25, fontFamily: 'DRLCircular-Book',
                  textDecorationLine: 'underline'
                }}
                onPress={() =>
                  nameDrawerRef.open()
                }>

                Terms and Conditions of {'\n'}Promotional Subscription
              </Text>

            </Text>

          </View>}

          <View
            style={{   alignSelf: 'auto',
            alignItems: 'center',
            justifyContent:'center',
             marginTop: 50, width: '100%' }}>

            <Button
              onPress={() => {
               
                console.log('Radio checked1...................', checked1);
                console.log('Radio checked2...................', checked2);
                console.log('Check Box...................', accept);


                if(checked1 !== ''){
                  if(checked1 ==='true'){
                    if (accept) {
                      dispatch(updateSubscription(checked1, email));
                      this.hidevisibil = false;
                      // this.checked2 ='';
                      // this.checked1 ='';
                      // this.setChecked2 = '';
                      // this.setChecked1 = '';
                      this.setChecked1=''
                      this.setChecked2=''
                      this.accept=''
                      navigation.navigate('MyProfile');
                    } else{
                      Toast.show('Please accept the terms and Condition', Toast.SHORT);
                    }
                  }else{
                    Toast.show('Please select one of the options', Toast.SHORT);
                  }
                 
                }else if(checked2 !== ''){

                  if(checked2 ==='false'){
                   
                   dispatch(updateSubscription(checked2, email));
                   this.hidevisibil = true;

                   this.setChecked1=''
                   this.setChecked2=''
                   this.accept=''
                   navigation.navigate('MyProfile');
                  //  this.checked2 ='';
                  //  this.checked1 ='';
                  //  this.setChecked2 = '';
                  //  this.setChecked1 = '';
                 }else{
                  Toast.show('Please select one of the options', Toast.SHORT);
                 }
                }else{
                  Toast.show('Please select one of the options', Toast.SHORT);
                 }

                }
              }

              style={{
                width: 137,
                height: 45,
                backgroundColor: colors.lightBlue,
                borderRadius: 15,
                alignSelf: 'center',
                alignItems: 'center',
                position:'absolute',
                justifyContent: 'center',
              }}>

              <Text
                style={{
                  color: colors.white, fontSize: 16, fontFamily: 'DRLCircular-Book',    
                }}>

                Save

              </Text>

            </Button>

          </View>

        </View>

      </View>

      {dialogView()}
    </View>
  );
}
