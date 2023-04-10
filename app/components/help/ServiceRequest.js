import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {raiseRequest} from '../../services/operations/profileApis';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {serviceRequestStatus} from '../../slices/profileSlices';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';

export default function ServiceRequest(props) {
  const loginData = useSelector(state => state.authenticatedUser);
  const profileData = useSelector(state => state.profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [subject, setSubject] = useState('');
  const [type, setType] = useState(1);
  const [describe, setDescribe] = useState('');
  const [base64Image, setImageBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  let bottomDrawerRef = useRef(null);

  const types = [
    'General Inquiries',
    'Product Complaints',
    'Product Inquiries',
    'Upcoming Order',
    'Returns/Cancellation',
    'Damage/Shortages',
    'Profile Update',
  ];

  function renderLabel() {
    if (type === 1 || type === 7) {
      return 'Subject';
    } else if (type === 2 || type === 3) {
      return 'Product Name or SKU';
    } else if (type === 4 || type === 5 || type === 6) {
      return 'Order Number';
    } else {
      return 'Subject';
    }
  }

  function add() {
    if (subject === '' || describe === '') {
      Toast.show('Enter all fields', Toast.SHORT);
    } else {
      let requestBody = {
        data: {
          customer_id: loginData.customerInfo.id,
          request_type: '' + type,
          reference_number: subject,
          request_description: describe,
          attachment: fileName,
          status: '0',
          solution_description: '',
          solution_attachment: '',
          content: {
            base64_encoded_data: base64Image,
            type: fileType,
            name: fileName,
          },
        },
      };

      dispatch(raiseRequest(requestBody));
    }
  }

  useEffect(() => {
    if (
      profileData.serviceRequest !== undefined &&
      profileData.serviceRequest === 'Success' &&
      bottomDrawerRef !== undefined &&
      bottomDrawerRef !== null
    ) {
      bottomDrawerRef.open();
    }
  }, [profileData.serviceRequest]);

  const convertFile = async uri => {
    const file = Platform.OS === 'ios' ? uri.replace('file:', '') : uri;
    await RNFetchBlob.fs.readFile(file, 'base64').then(baseCodedFile => {
      setImageBase64(baseCodedFile);
    });
  };

  const getDocuments = async () => {
    try {
      const res = await DocumentPicker.pick({
        base64: true,
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (res !== undefined && res.uri !== undefined) {
        if (
          res.type === 'application/pdf' ||
          res.type === 'image/png' ||
          res.type === 'image/jpg' ||
          res.type === 'image/jpeg'
        ) {
          setFileName(res.name);
          setFileType(res.type);
          convertFile(res.uri);
        } else {
          alert('Invalid File type selected ');
        }
      }
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('No document selected');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const downloadFile = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Storage Permission to access file locations',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //Alert.alert("Permission granted","Now you can download anything!");
        getDocuments();
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give permission to access the file',
        );
      }
    } catch (err) {}
  };

  function bottomSliderView() {
    return (
      <Modal
        style={{height: 200}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}
        backdropPressToClose={false}
        swipeToClose={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 150,
            padding: 20,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={require('../../images/tick_large.png')} />

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
              Thank you for contacting us with your inquiries. We will respond
              within 24 hrs.
            </Text>
          </View>

          <TouchableOpacity
            style={{
              height: 40,
              width: 200,
              borderWidth: 1,
              borderColor: colors.blue,
              marginTop: 15,
              backgroundColor: colors.white,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              {
                dispatch(serviceRequestStatus(''));
              }
              // navigation.replace('MenuTab')
              navigation.goBack();
            }}>
            <Text style={{color: colors.blue}}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
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
        title={'Help & Support'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />
      {bottomSliderView()}

      <ScrollView style={{padding: 20, height: '100%'}}>
        <View
          style={{
            // height: 70,
            paddingBottom: 5,
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Submit Service Request
          </Text>
          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 14,
              marginTop: 10,
            }}>
            We will respond within 1 business day.
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            Type of Request <Text style={{color: colors.red}}>*</Text>
          </Text>
          <View
            style={[
              styles.input,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <ModalDropdown
              style={{width: '95%'}}
              textStyle={{
                fontSize: 16,
                fontFamily: 'DRLCircular-Book',
                color: colors.textColor,
              }}
              dropdownStyle={{width: '80%', height: 150}}
              dropdownTextStyle={{fontSize: 16, fontFamily: 'DRLCircular-Book'}}
              defaultValue={types[0]}
              options={types}
              onSelect={value => setType(value + 1)}
            />
            <Image
              style={{position: 'absolute', right: 10, zIndex: 2}}
              source={require('../../images/bottom_small.png')}
            />
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            {renderLabel()} <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            onChangeText={text => setSubject(text)}
            value={subject}
            placeholder="Subject"
            style={styles.input}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>
            Description <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            onChangeText={text => setDescribe(text)}
            value={describe}
            placeholder="Description"
            style={[styles.input, {height: 100}]}
          />
        </View>

        <View style={styles.container}>
          {fileName.length > 0 ? (
            // <Text style={styles.label}> </Text>
            <Text
            style={{
              
              color: colors.textColor,
              fontSize: 14,
              fontFamily: 'DRLCircular-Book',
            }}>
            Attached File:{' '}
            <Text
              style={{color: colors.blue, textDecorationLine: 'underline'}}
              >
              {fileName}
            </Text>{' '}
            
          </Text>
          ) : (
            <Text style={styles.label}>Attach a File</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  getDocuments();
                } else {
                  downloadFile();
                }
              }}
              style={[styles.buttonSelected, {marginTop: 10}]}>
              <Text
                numberOfLines={1}
                style={[styles.whiteTextMedium, {fontSize: 15}]}>
                Select Attachment
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'DRLCircular-Light',
                fontSize: 14,
                color: colors.textColor,
                marginHorizontal: 10,
                width: '50%',
              }}>
              Allowed file types: PDF, JPG, JPEG and PNG
            </Text>
          </View>
        </View>

        <View style={{height: 40}}></View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonUnselected}>
          <Text style={styles.blackTextMedium}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            add();

            //  Notifications.postLocalNotification({
            //   body: "Local notification!",
            //   title: "Local Notification Title",
            //   sound: "chime.aiff",
            //   category: "SOME_CATEGORY",
            //   userInfo: { "test": "test"}
            //});
          }}
          style={styles.buttonSelected}>
          <Text numberOfLines={1} style={styles.whiteTextMedium}>
            Submit Request
          </Text>
        </TouchableOpacity>

        <LoaderCustome />
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
    textAlignVertical: 'top',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    // justifyContent:'center',
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
    padding: 5,
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
