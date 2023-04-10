import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
  PermissionsAndroid,
  Alert,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {
  addAddress,
  updateAddress,
  getStateLicenseInfo,
  getTokenForAddress,
  uploadAddressDoc,
} from '../../services/operations/profileApis';
import {
  setStateLicenseInfo,
  setIsAdded,
  setIsUploadSuccessDEA,
  setIsUploadSuccessState,
} from '../../slices/profileSlices';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import GlobalConst from '../../config/GlobalConst';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {ModalDatePicker} from 'react-native-material-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoaderCustome from '../../utilities/customviews/LoaderCustome';

//    var RegionIndex=-1;
let tempProvinceArray = [];

export default function AddAddress(props) {
  var deaName = '';
  var stateName = '';

  const productData = useSelector(state => state.product);
  const loginData = useSelector(state => state.authenticatedUser);

  const profileData = useSelector(state => state.profile);

  let bottomDrawerRef = useRef(null);

  const [base64ImageDEA, setImageBase64DEA] = useState('');
  const [fileNameDEA, setFileNameDEA] = useState('');
  const [fileTypeDEA, setFileTypeDEA] = useState('');

  const [base64ImageState, setImageBase64State] = useState('');
  const [fileNameState, setFileNameState] = useState('');
  const [fileTypeState, setFileTypeState] = useState('');

  const [fetchStated, setFetchStarted] = useState(false);

  const [fileNameDEAFinal, setFileNameDEAFinal] = useState('');
  const [fileNameStateFinal, setFileNameStateFinal] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isCityEditable, setIsCityEditable] = useState(true);
  const [isZipEditable, setIsZipEditable] = useState(true);
  const [isProvinceEditable, setIsProvinceEditable] = useState(true);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let month_temp = renderMonth(date.getMonth());
    let date_temp = '';
    //
    if (date.getDate().toString().length === 1) {
      date_temp = '0' + date.getDate();
    } else {
      date_temp = date.getDate();
    }
    let temp = date.getFullYear() + '-' + month_temp + '-' + date_temp;

    setDeaExpiry(temp);

    hideDatePicker();
  };

  //
  //

  const [RegionIndex, setRegionIndex] = useState(-1);
  const [pickerVisible, setPickerVisible] = useState(false);

  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [custID, setCustID] = useState('');
  const [addID, setAddID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [FAX, setFAX] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [countryIndex, setCountryIndex] = useState(0);
  const [stateLicenseID, setStateLicenseID] = useState('');
  const [deaLicenseID, setDeaLicenseID] = useState('');
  const [stateExpiry, setStateExpiry] = useState('');
  const [deaExpiry, setDeaExpiry] = useState('');

  const [stateExpiryTrim, setStateExpiryTrim] = useState('');
  const [deaExpiryTrim, setDeaExpiryTrim] = useState('');

  const [regionName, setRegionName] = useState('');
  const [regionID, setRegionID] = useState('');
  const [regionCode, setRegionCode] = useState('');

  // const [RegionIndex,setRegionIndex]=useState(0)

  //

  // let region =loginData.region
  let region = JSON.parse(GlobalConst.region);
  //  tempProvinceArray=region

  let regionNameArray = [];
  let regionCodeArray = [];
  let regionIdArray = [];
  let countryNameArray = [];
  function getCountry() {
    for (let i = 0; i < region.length; i++) {
      countryNameArray.push(region[i].full_name_locale);
    }
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{height: 250, width: '100%'}}
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
            <Text
              style={{
                fontSize: 20,
                color: colors.textColor,
                fontFamily: 'DRLCircular-Bold',
              }}>
              Address Added!
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.textColor,
                fontSize: 14,
                fontFamily: 'DRLCircular-Book',
                marginTop: 10,
              }}>
              Please wait for approval
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
              dispatch(setIsAdded(false));
              dispatch(setIsUploadSuccessDEA(false));
              dispatch(setIsUploadSuccessState(false));
              navigation.goBack();
            }}>
            <Text style={{color: colors.blue}}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function renderMonth(month) {
    switch (month) {
      case 0:
        return '01';
      case 1:
        return '02';
      case 2:
        return '03';
      case 3:
        return '04';
      case 4:
        return '05';
      case 5:
        return '06';
      case 6:
        return '07';
      case 7:
        return '08';
      case 8:
        return '09';
      case 9:
        return '10';
      case 10:
        return '11';
      case 11:
        return '12';
    }
  }

  function renderCalendar() {
    return (
      <View
      //style={{flex: 1, alignSelf: 'stretch'}}
      >
        <ModalDatePicker
          button={
            <TextInput
              editable={false}
              onChangeText={text => setDeaExpiry(text)}
              value={deaExpiry}
              placeholder="DEA License Expire Date"
              style={styles.input}
            />
          }
          locale="tr"
          onSelect={date => {
            let month_temp = renderMonth(date.getMonth());
            let date_temp = '';
            //
            if (date.getDate().toString().length === 1) {
              date_temp = '0' + date.getDate();
            } else {
              date_temp = date.getDate();
            }
            let temp = date.getFullYear() + '-' + month_temp + '-' + date_temp;

            setDeaExpiry(temp);
          }}
          isHideOnSelect={true}
          language={require('./en.json')}
        />
      </View>
    );
  }

  //..................Document Upload................................................................
  const downloadFile1 = async () => {
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
        getDocuments1();
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give permission to access the file',
        );
      }
    } catch (err) {}
  };

  const getDocuments1 = async () => {
    try {
      const res = await DocumentPicker.pick({
        base64: true,
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (res !== undefined && res.uri !== undefined) {
        //  fileName = res.name;
        //  fileType = res.type;

        if (
          res.type === 'application/pdf' ||
          res.type === 'image/png' ||
          res.type === 'image/jpg' ||
          res.type === 'image/jpeg'
        ) {
          setFileNameDEA(res.name);
          setFileTypeDEA(res.type);
          deaName = res.name;
          //
          //
          convertFile1(res.uri, res.name, res.type);
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

  const convertFile1 = async (uri, fileNameDEA, fileTypeDEA) => {
    const file = Platform.OS === 'ios' ? uri.replace('file:', '') : uri;
    await RNFetchBlob.fs.readFile(file, 'base64').then(data => {
      dispatch(uploadAddressDoc(fileNameDEA, fileTypeDEA, data, 'DEA'));
    });
  };

  const downloadFile2 = async () => {
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
        getDocuments2();
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give permission to access the file',
        );
      }
    } catch (err) {}
  };

  const getDocuments2 = async () => {
    try {
      const res = await DocumentPicker.pick({
        base64: true,
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (res !== undefined && res.uri !== undefined) {
        //  fileName = res.name;
        //  fileType = res.type;

        if (
          res.type === 'application/pdf' ||
          res.type === 'image/png' ||
          res.type === 'image/jpg' ||
          res.type === 'image/jpeg'
        ) {
          setFileNameState(res.name);
          setFileTypeState(res.type);
          stateName = res.name;

          convertFile2(res.uri, res.name, res.type);
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

  const convertFile2 = async (uri, fileNameState, fileTypeState) => {
    const file = Platform.OS === 'ios' ? uri.replace('file:', '') : uri;
    await RNFetchBlob.fs.readFile(file, 'base64').then(data => {
      dispatch(uploadAddressDoc(fileNameState, fileTypeState, data, 'State'));
    });
  };

  //................................................................................

  function setRegionIndexFromLicense(code) {
    let index = _.findIndex(region[0].available_regions, {code: code});

    if (index !== -1) {
      regionDropDownSelect(index);
    }
  }

  function getRegion() {
    regionNameArray = [];
    regionCodeArray = [];
    regionIdArray = [];

    for (let i = 0; i < region[countryIndex].available_regions.length; i++) {
      regionNameArray.push(region[countryIndex].available_regions[i].name);
      regionCodeArray.push(region[countryIndex].available_regions[i].code);
      regionIdArray.push(region[countryIndex].available_regions[i].id);
    }
    tempProvinceArray = regionNameArray;
  }

  function addToAddress() {
    if (
      stateLicenseID === '' ||
      stateExpiry === '' ||
      city === '' ||
      street === '' ||
      zip === '' ||
      RegionIndex === -1 ||
      firstName === '' ||
      lastName === '' ||
      phone === '' ||
      fileNameStateFinal === ''
    ) {
      // || country==="" ||
      // _.isEmpty(province)){
      Toast.show('Please enter all mandatory fields', Toast.SHORT);
    } else {
      let temp = _.cloneDeep(loginData.customerInfo);

      let deaExpiryFinal = '';
      let filedeaToSend = '';

      if (deaExpiry.length > 0) {
        deaExpiryFinal = deaExpiry + ' 00:00:00';
      }
      if (fileNameDEAFinal.length > 0) {
        filedeaToSend = '/' + fileNameDEAFinal;
      }

      temp.addresses = loginData.customerInfo.addresses.concat([
        {
          region: {
            region_code:
              region[countryIndex].available_regions[RegionIndex].code,
            region: region[countryIndex].available_regions[RegionIndex].name,
            region_id: region[countryIndex].available_regions[RegionIndex].id,
          },

          country_id: 'US',
          street: [street],
          customer_id: loginData.customerInfo.id,
          firstname: firstName,
          lastname: lastName,
          default_shipping: defaultShipping,
          default_billing: defaultBilling,
          telephone: phone,
          postcode: zip,
          city: city,
          fax: FAX,
          company: company,

          custom_attributes: [
            {
              attribute_code: 'address_status',
              value: loginData.addressLabels.find(
                element => element.label === 'Pending',
              ).value,
            },
            {
              attribute_code: 'state_license_id',
              value: stateLicenseID,
            },
            {
              attribute_code: 'state_license_expiry',
              value: stateExpiryTrim + ' 00:00:00',
            },
            {
              attribute_code: 'dea_license_id',
              value: deaLicenseID,
            },
            {
              attribute_code: 'dea_license_expiry',
              value: deaExpiryFinal,
            },
            {
              attribute_code: 'state_license_upload',
              value: '/' + fileNameStateFinal,
            },
            {
              attribute_code: 'dea_license_upload',
              value: filedeaToSend,
            },
          ],
        },
      ]);

      dispatch(addAddress({customer: temp}));
    }
  }

  function getStateLicense() {
    if (stateLicenseID === '') {
      Toast.show('Enter State License ID', Toast.SHORT);
    } else {
      //.................
      setStateLicenseID('');
      setStateExpiry('');
      setStateExpiryTrim('');
      setCity('');
      setZip('');
      setProvince('');
      //..................
      setFetchStarted(true);
      dispatch(getTokenForAddress(stateLicenseID));
      // dispatch(getTokenForAddress("20-005029-1"));
    }
  }

  function regionDropDownSelect(value) {
    setRegionIndex(value);

    tempProvinceArray.push(regionNameArray[value]);

    setProvince(regionNameArray[value]);
  }

  useEffect(() => {
    dispatch(setStateLicenseInfo({}));

    dispatch(setIsAdded(false));
  }, []);

  useEffect(() => {
    return () => {
      setStateLicenseID('');
      setStateExpiry('');
      setStateExpiryTrim('');
      setCity('');
      setZip('');
      setProvince('');
    };
  }, []);

  useEffect(() => {
    if (
      profileData.isAdded === true &&
      bottomDrawerRef !== undefined &&
      bottomDrawerRef !== null
    ) {
      bottomDrawerRef.open();
    }
  }, [profileData.isAdded]);

  useEffect(() => {
    setFileNameDEAFinal(fileNameDEA);
    // setFileNameDEAFinal(deaName)
  }, [profileData.isUploadSuccessDEA]);

  useEffect(() => {
    setFileNameStateFinal(fileNameState);
    //  setFileNameStateFinal(stateName)
  }, [profileData.isUploadSuccessState]);

  useEffect(() => {
    setFetchStarted(false);
    if (!_.isEmpty(profileData.stateLicenseInfo)) {
      if (profileData.stateLicenseInfo.invalid !== undefined) {
        //Alert.alert("Invalid State License. Please provide a valid State License")
        //Toast.show("Invalid State License. Please provide a valid State License", Toast.LONG);
      } else {
        if (
          profileData.stateLicenseInfo.stateLicenses !== undefined &&
          profileData.stateLicenseInfo.stateLicenses.length > 0 &&
          profileData.stateLicenseInfo.stateLicenses[0].stateLicenseNumber !==
            undefined
        ) {
          setStateLicenseID(
            profileData.stateLicenseInfo.stateLicenses[0].stateLicenseNumber,
          );
        }

        if (
          profileData.stateLicenseInfo.stateLicenses !== undefined &&
          profileData.stateLicenseInfo.stateLicenses.length > 0 &&
          profileData.stateLicenseInfo.stateLicenses[0].expirationDate !==
            undefined
        ) {
          setStateExpiry(
            profileData.stateLicenseInfo.stateLicenses[0].expirationDate,
          );
          setStateExpiryTrim(
            profileData.stateLicenseInfo.stateLicenses[0].expirationDate.slice(
              0,
              10,
            ),
          );
        }

        if (
          profileData.stateLicenseInfo.stateLicenses !== undefined &&
          profileData.stateLicenseInfo.stateLicenses.length > 0 &&
          profileData.stateLicenseInfo.stateLicenses[0].address !== undefined &&
          profileData.stateLicenseInfo.stateLicenses[0].address.city !==
            undefined
        ) {
          setCity(profileData.stateLicenseInfo.stateLicenses[0].address.city);
          setIsCityEditable(false);
        }

        if (
          profileData.stateLicenseInfo.stateLicenses !== undefined &&
          profileData.stateLicenseInfo.stateLicenses.length > 0 &&
          profileData.stateLicenseInfo.stateLicenses[0].address !== undefined &&
          profileData.stateLicenseInfo.stateLicenses[0].address.zip !==
            undefined
        ) {
          setZip(profileData.stateLicenseInfo.stateLicenses[0].address.zip);
          setIsZipEditable(false);
        }

        if (
          profileData.stateLicenseInfo.stateLicenses !== undefined &&
          profileData.stateLicenseInfo.stateLicenses.length > 0 &&
          profileData.stateLicenseInfo.stateLicenses[0].address !== undefined &&
          profileData.stateLicenseInfo.stateLicenses[0].address.state !==
            undefined
        ) {
          setRegionIndexFromLicense(
            profileData.stateLicenseInfo.stateLicenses[0].address.state,
          );
          setIsProvinceEditable(false);
        }
      }
    }
  }, [profileData.stateLicenseInfo]);

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
        title={'Address Book'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {bottomSliderView()}
      <ScrollView style={{padding: 20, height: '100%'}}>
        <LoaderCustome />

        <View
          style={{
            height: 70,
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            borderColor: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Add New Address
          </Text>
        </View>

        <View
          style={{marginTop: 10, borderBottomWidth: 0.5, paddingBottom: 20}}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
            Contact Information
          </Text>

          <View style={styles.container}>
            <Text style={styles.label}>
              First Name <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onChangeText={text => setFirstName(text)}
              value={firstName}
              placeholder="Enter First Name"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              Last Name <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onChangeText={text => setLastName(text)}
              value={lastName}
              placeholder="Enter Last Name"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              onChangeText={text => setCompany(text)}
              value={company}
              placeholder="Enter Company"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              Phone Number <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              //editable={false}
              onChangeText={text => setPhone(text)}
              keyboardType={'phone-pad'}
              maxLength={10}
              value={phone}
              placeholder="Phone Number"
              style={styles.input}
            />
          </View>
        </View>

        <View
          style={{marginTop: 10, borderBottomWidth: 0.5, paddingBottom: 20}}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
            Address
          </Text>
          <View style={styles.container}>
            <Text style={styles.label}>
              State License Id <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onSubmitEditing={() => getStateLicense()}
              onChangeText={text => setStateLicenseID(text)}
              value={stateLicenseID}
              placeholder="State License Id"
              style={styles.input}
            />
            {profileData.invalid}
          </View>
          {fetchStated === true ? (
            <Text style={{fontFamily: 'DRLCircular-Book'}}>Please wait</Text>
          ) : profileData.stateLicenseInfo.invalid !== undefined ? (
            <Text style={{color: colors.red, fontFamily: 'DRLCircular-Book'}}>
              Invalid State License ID
            </Text>
          ) : (
            <Text></Text>
          )}

          <View style={styles.container}>
            <Text style={styles.label}>
              State License Expire Date{' '}
              <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              editable={false}
              onChangeText={text => setStateExpiry(text)}
              value={stateExpiryTrim}
              placeholder="State License Expire Date"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>DEA License Id</Text>
            <TextInput
              onChangeText={text => setDeaLicenseID(text)}
              value={deaLicenseID}
              placeholder="DEA License Id"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>DEA License Expire Date</Text>
          </View>

          {/* {renderCalendar()} */}

          <View>
            <TouchableOpacity onPress={showDatePicker}>
              <View style={styles.input}>
                {deaExpiry.length > 0 ? (
                  <Text>{deaExpiry}</Text>
                ) : (
                  <Text>DEA License Expire Date</Text>
                )}
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setDeaExpiry('');
            }}
            style={{marginLeft: 3, width: 120, marginTop: 5}}>
            <Text>Clear date</Text>
          </TouchableOpacity>

          <View style={styles.container}>
            {fileNameStateFinal.length > 0 ? (
              <Text numberOfLines={1} style={[styles.label]}>
                Attached File (State License){' '}
                <Text style={{color: colors.red}}>*</Text>: {fileNameStateFinal}
              </Text>
            ) : (
              <Text style={styles.label}>
                Upload State License<Text style={{color: colors.red}}>*</Text>
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== 'ios') {
                  downloadFile2();
                } else {
                  getDocuments2();
                }
              }}
              style={[styles.buttonSelected, {marginTop: 10, height: 40}]}>
              <Text style={[styles.whiteTextMedium, {fontSize: 15}]}>
                Select Attachment
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            {fileNameDEAFinal.length > 0 ? (
              <Text numberOfLines={1} style={[styles.label]}>
                Attached File (DEA License): {fileNameDEAFinal}
              </Text>
            ) : (
              <Text style={styles.label}>Upload DEA License</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== 'ios') {
                  downloadFile1();
                } else {
                  getDocuments1();
                }
              }}
              style={[styles.buttonSelected, {marginTop: 10, height: 40}]}>
              <Text style={[styles.whiteTextMedium, {fontSize: 15}]}>
                Select Attachment
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              Street Address <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onChangeText={text => setStreet(text)}
              value={street}
              placeholder="Enter Street Address"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              City <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onChangeText={text => setCity(text)}
              editable={isCityEditable}
              value={city}
              placeholder="Enter City"
              style={styles.input}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              Zip/Postal Code <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              onChangeText={text => setZip(text)}
              editable={isZipEditable}
              keyboardType="number-pad"
              value={zip}
              placeholder="Enter Zip/Postal Code"
              style={styles.input}
            />
          </View>

          {getCountry()}
          {getRegion()}

          {isProvinceEditable ? (
            <View>
              {region[countryIndex].available_regions !== undefined &&
                !_.isEmpty(region[countryIndex].available_regions) && (
                  <View style={styles.container}>
                    <Text style={styles.label}>
                      State/Province <Text style={{color: colors.red}}>*</Text>
                    </Text>
                    <View style={styles.input}>
                      <View
                        style={{
                          height: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ModalDropdown
                          style={{width: '100%'}}
                          textStyle={{fontSize: 18}}
                          dropdownStyle={{
                            width: '70%',
                            color: colors.red,
                            height: 100,
                          }}
                          dropdownTextStyle={{fontSize: 16}}
                          defaultValue={
                            tempProvinceArray.length > 0 && tempProvinceArray[0]
                          }
                          // onSelect={this.regionDropDownSelect()}
                          onSelect={value => {
                            regionDropDownSelect(value);
                          }}
                          options={tempProvinceArray}></ModalDropdown>
                      </View>
                    </View>
                  </View>
                )}
            </View>
          ) : (
            <View style={styles.container}>
              <Text style={styles.label}>
                State/Province <Text style={{color: colors.red}}>*</Text>
              </Text>
              <TextInput
                editable={false}
                //onChangeText={(text) =>setPhone(text)}
                value={province}
                //placeholder="Phone Number"
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.container}>
            <Text style={styles.label}>
              Country <Text style={{color: colors.red}}>*</Text>
            </Text>
            <View style={styles.input}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ModalDropdown
                  style={{width: '100%'}}
                  textStyle={{fontSize: 18}}
                  dropdownStyle={{
                    width: '70%',
                    height: 50,
                    color: colors.red,
                  }}
                  dropdownTextStyle={{fontSize: 16}}
                  defaultValue={countryNameArray[0]}
                  options={countryNameArray}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{height: 30}}></View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.buttonUnselected}>
          <Text style={styles.blackTextMedium}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            //  if(RegionIndex === -1){
            //      Toast.show("Province not found", Toast.SHORT);
            //  }
            //  else{
            addToAddress();
            //  }
          }}
          style={styles.buttonSelected}>
          <Text style={styles.whiteTextMedium}>Add Address</Text>
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
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
  },
  footer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.shopCategoryBackground,
    // position: 'absolute',
    // bottom:0,
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
    height: 40,
  },
});
