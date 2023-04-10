import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {TouchableOpacity, StatusBar, Picker, Alert} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import _, {add} from 'lodash';
import {
  getAdminTokenForTracking,
  reorder,
  getAdminTokenForInvoice,
  getAdminTokenForInvoiceWithLoader,
} from '../../services/operations/productApis';
import {
  getAdminTokenForOder,
  getAdminTokenForOderDetail,
} from '../../services/operations/getToken';
import {setOrderDetail, setRecentOrdersSuccess} from '../../slices/homesSlices';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import styles from '../home/home_style';
import {
  setTrackingInfoSuccess,
  setInvoiceInfoSuccess,
  setReorderMsg,
} from '../../slices/productSlices';
import Modal from 'react-native-modalbox';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ADMIN_TOKEN_URL, BASE_URL_DRL} from '../../services/ApiServicePath';
import {requestConnector} from '../../services/restApiConnector';
import {setNotificationStatus} from '../../slices/authenticationSlice';
import utils from '../../utilities/utils';
import {displayName as appName} from '../../../app.json';
import md5 from 'react-native-md5';
import {sha256} from 'react-native-sha256';

var temp = '';

const MyOrder = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let bottomDrawerRef = useRef(null);

  const loginData = useSelector(state => state.authenticatedUser);
  const [searchText, setSearchText] = useState('');

  const [show, setShow] = useState(false);

  // const [show,setShow]=useState(false)

  const [orderNum, setOrderNum] = useState('');
  const [PONum, setPONum] = useState('');
  const [salesID, setSalesID] = useState('');
  const [orderStatus, setOrderStatus] = useState(-1);
  const [invoiceNum, setInvoiceNum] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  // const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [listDownloaded, setLoadingDone] = useState(false);
  const [data, setData] = useState([]);
  const [productFetchCompleted, setProductFetchCompleted] = useState(false);

  const [pageCurrent, setpageCurrent] = useState(1);

  const pageSize = 10;

  const homeData = useSelector(state => state.home);

  const productData = useSelector(state => state.product);

  const [startDateObj, setStartDateObj] = useState(null);
  const [endDateObj, setEndDateObj] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (productData.reorderMsg.length > 0) {
      Alert.alert(
        'Note',
        productData.reorderMsg,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(setReorderMsg(''));
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, [productData.reorderMsg]);

  useEffect(() => {
    if (refreshing) {
      setpageCurrent(1);
      dispatch(getAdminTokenForOder(GlobalConst.customerId));
      setProductFetchCompleted(false);
      sha256(appName).then(hash => {
        getAdminTokenForMyOder(hash);
      });
    }
  }, [refreshing]);

  useEffect(() => {
    if (loginData.notificationStatus !== '') {
      setpageCurrent(1);
      setData([]);
      dispatch(setNotificationStatus(''));
    }
  }, [loginData.notificationStatus]);

  useEffect(() => {
    return () => {
      temp = '';
    };
  }, []);

  useEffect(() => {
    if (loginData.notificationStatus === 'MyOrder') {
      setTimeout(() => {
        temp = '';
        dispatch(setNotificationStatus(''));
      }, 500);
    }
  }, [loginData.notificationStatus]);

  //////////
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let month_temp = renderMonth(date.getMonth());
    let date_temp = '';
    if (date.getDate().toString().length === 1) {
      date_temp = '0' + date.getDate();
    } else {
      date_temp = date.getDate();
    }
    let temp = date.getFullYear() + '-' + month_temp + '-' + date_temp;

    // if(Date.parse(temp)>Date.parse(GlobalConst.today)){
    //   Toast.show("Future date can't be selected", Toast.LONG);
    //  }
    //  else
    //  if(endDateObj !== null && endDateObj<date){
    //    Toast.show("Start date can't be greater than end date", Toast.LONG);
    //  }
    //  else{

    setStartDateObj(date);
    setStartDate(temp);
    hideDatePicker();
    // }
  };

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm1 = date => {
    let month_temp = renderMonth(date.getMonth());
    let date_temp = '';
    if (date.getDate().toString().length === 1) {
      date_temp = '0' + date.getDate();
    } else {
      date_temp = date.getDate();
    }
    let temp = date.getFullYear() + '-' + month_temp + '-' + date_temp;

    setEndDateObj(date);
    setEndDate(temp);
    hideDatePicker1();
  };
  ////////2 end/

  var types = [];
  for (let j = 0; j < loginData.orderStatus.length; j++) {
    types.push(loginData.orderStatus[j].label);
  }

  useEffect(() => {
    if (
      pageCurrent > 1 &&
      productFetchCompleted === false &&
      isLoading === false
    ) {
      sha256(appName).then(hash => {
        getAdminTokenForMyOder(hash);
      });
    }
  }, [pageCurrent]);

  useEffect(() => {
    if (
      data.length === 0 &&
      pageCurrent === 1 &&
      productFetchCompleted === false &&
      isLoading === false
    ) {
      sha256(appName).then(hash => {
        getAdminTokenForMyOder(hash);
      });
    }
  }, [data]);

  useEffect(() => {
    //
    if (_.isEmpty(homeData.orderDetail) === true) {
    } else {
      setProductFetchCompleted(false);
      setpageCurrent(1);
      setData([]);
    }
  }, [homeData.orderDetail]);

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          animating={true}
          size="large"
          style={{opacity: 1}}
          color={colors.grey}
        />
      </View>
    ) : null;
  };
  const getAdminTokenForMyOder = async hash => {
    setisLoading(true);
    try {
      const response = await requestConnector(
        'POST',
        ADMIN_TOKEN_URL,
        null,
        null,
        {
          secure_token: hash,
        },
      );
      if (
        response.data === undefined ||
        response.data.access_token === undefined
      ) {
        setisLoading(false);
      } else {
        GlobalConst.ApiAccessToken = response.data.access_token;
        getData();
      }
    } catch (err) {
      setisLoading(false);
    }
  };

  const getData = async () => {
    let pageNumber = 1;
    if (refreshing) {
      pageNumber = 1;
    } else {
      pageNumber = pageCurrent;
    }

    let URL =
      BASE_URL_DRL +
      'orders?&searchCriteria[currentPage]=' +
      pageNumber +
      '&searchCriteria[pageSize]=10&searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]=' +
      loginData.customerInfo.id +
      temp +
      '&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC';

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector('GET', URL, headers, null, null);

      console.log('order details...' + JSON.stringify(response.data));

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        if (refreshing) {
          setData(response.data.items);
        } else {
          setData(data.concat(response.data.items));
        }
        if (response.data.items.length < 10) {
          setProductFetchCompleted(true);
        }
        setisLoading(false);
        setRefreshing(false);
      } else if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length === 0
      ) {
        setProductFetchCompleted(true);

        if (pageCurrent > 1 && refreshing === false) {
          setpageCurrent(pageCurrent - 1);
        }
        setisLoading(false);
        setRefreshing(false);
      } else {
        setisLoading(false);

        setRefreshing(false);
      }
    } catch (err) {
      setisLoading(false);
      setProductFetchCompleted(true);

      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      setpageCurrent(pageCurrent + 1);
    }
  };
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

  function renderOrderStatus(status) {
    if (
      loginData.orderStatus.find(item => item.value === status) !== undefined
    ) {
      return loginData.orderStatus.find(item => item.value === status).label;
    } else {
      return '';
    }
  }

  function apply() {
    temp = '';
    let c = 1;
    if (orderNum.length > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=increment_id&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=%25' +
        orderNum +
        '%25&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=like';
      c = c + 1;
    }
    if (PONum.length > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=po_number&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=%25' +
        PONum +
        '%25&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=like';
      c = c + 1;
    }
    if (salesID.length > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=sap_id&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=%25' +
        salesID +
        '%25&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=like';
      c = c + 1;
    }

    if (min > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=base_grand_total&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=' +
        min +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=gteq';
      c = c + 1;
    }
    if (max > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=base_grand_total&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=' +
        max +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=lteq';
      c = c + 1;
    }
    if (startDate.length > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=created_at&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=' +
        startDate +
        ' 00:00:00' +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=from';
      c = c + 1;
    }
    if (endDate.length > 0) {
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=created_at&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=' +
        endDate +
        ' 00:00:00' +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=to';
      c = c + 1;
    }
    if (orderStatus !== -1) {
      let orderStatusValue = loginData.orderStatus[orderStatus].value;
      temp =
        temp +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][field]=status&searchCriteria[filter_groups][' +
        c +
        '][filters][0][value]=' +
        orderStatusValue +
        '&searchCriteria[filter_groups][' +
        c +
        '][filters][0][conditionType]=in';
    }
    setShow(true);
    if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
      bottomDrawerRef.close();
    }
    setProductFetchCompleted(false);
    setpageCurrent(1);
    setData([]);
  }

  function clear() {
    setOrderNum('');
    setPONum('');
    setSalesID('');
    setOrderStatus(-1);
    setInvoiceNum('');
    setCreatedBy('');
    setStartDate('');
    setEndDate('');
    setMax('');
    setMin('');
    setStartDateObj(null);
    setEndDateObj(null);
    temp = '';
    setSearchText('');
    setProductFetchCompleted(false);
    setpageCurrent(1);
    setData([]);
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{height: '75%'}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}
        backdropPressToClose={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: 10, height: 20}}
            onPress={() => {
              if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
                bottomDrawerRef.close();
              }
            }}>
            <Image
              source={require('../../images/cross.png')}
              style={{height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={styles.container2}>
              <Text style={styles.label}>Order Number</Text>
              <TextInput
                onChangeText={text => setOrderNum(text)}
                value={orderNum}
                placeholder="Enter"
                style={styles.input2}
              />
            </View>

            <View style={styles.container2}>
              <Text style={styles.label}>PO Number</Text>
              <TextInput
                onChangeText={text => setPONum(text)}
                value={PONum}
                placeholder="Enter"
                style={styles.input2}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={styles.container2}>
              <Text style={styles.label}>Sales Order No.</Text>
              <TextInput
                onChangeText={text => setSalesID(text)}
                value={salesID}
                placeholder="Enter"
                style={styles.input2}
              />
            </View>

            <View style={styles.container2}>
              <Text style={styles.label}>Order Amount ($)</Text>

              <View style={{flexDirection: 'row', marginTop: 5}}>
                <TextInput
                  onChangeText={text => setMin(text)}
                  keyboardType={'number-pad'}
                  value={min}
                  placeholder="Min"
                  style={{
                    borderColor: colors.textInputBorderColor,
                    backgroundColor: colors.textInputBackgroundColor,
                    width: 80,
                    borderWidth: 0.5,
                    marginRight: 10,
                    height: 40,
                    paddingLeft: 5,
                  }}
                />
                <TextInput
                  onChangeText={text => setMax(text)}
                  keyboardType={'number-pad'}
                  value={max}
                  placeholder="Max"
                  style={{
                    borderColor: colors.textInputBorderColor,
                    backgroundColor: colors.textInputBackgroundColor,
                    width: 80,
                    borderWidth: 0.5,
                    height: 40,
                    paddingLeft: 5,
                  }}
                />
              </View>
            </View>
          </View>

          {/* <View style={styles.container2}>
    <Text style={styles.label}>Invoice Number</Text>
    <TextInput
    editable={false}
   onChangeText={(text) =>setInvoiceNum(text)}
   value={invoiceNum}
    placeholder="Enter"
    style={styles.input2}/>
    </View> */}

          <View style={styles.container2}>
            <Text style={styles.label}>Order Date</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{width: 50}}>From</Text>
                {/* {renderCalendar1()} */}

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={{
                    borderBottomWidth: 0.5,
                    borderColor: colors.grey,
                    paddingBottom: 5,
                  }}>
                  <View style={{maxHeight: 40, width: 100}}>
                    {startDate.length > 0 ? (
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                        }}>
                        {startDate}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                        }}>
                        YYYY-MM-DD
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  maximumDate={
                    endDateObj !== null
                      ? endDateObj
                      : Date.parse(GlobalConst.today)
                  }
                  minimumDate={Date.parse('2010-01-01')}
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text style={{width: 50}}>To</Text>
                {/* {renderCalendar2()} */}

                <TouchableOpacity
                  onPress={showDatePicker1}
                  style={{
                    borderBottomWidth: 0.5,
                    borderColor: colors.grey,
                    paddingBottom: 5,
                  }}>
                  <View style={{maxHeight: 40, width: 100}}>
                    {endDate.length > 0 ? (
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                        }}>
                        {endDate}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'DRLCircular-Book',
                          color: colors.grey,
                        }}>
                        YYYY-MM-DD
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  maximumDate={Date.parse(GlobalConst.today)}
                  minimumDate={
                    startDateObj !== null
                      ? startDateObj
                      : Date.parse('2010-01-01')
                  }
                  isVisible={isDatePickerVisible1}
                  mode="date"
                  onConfirm={handleConfirm1}
                  onCancel={hideDatePicker1}
                />
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={styles.container2}>
              <Text style={styles.label}>Order Status</Text>
              <ModalDropdown
                style={styles.input2}
                textStyle={{
                  fontSize: 16,
                  fontFamily: 'DRLCircular-Book',
                  color: colors.textColor,
                }}
                dropdownStyle={{width: '40%', height: 150}}
                dropdownTextStyle={{
                  fontSize: 16,
                  fontFamily: 'DRLCircular-Book',
                }}
                defaultValue={
                  orderStatus !== -1
                    ? loginData.orderStatus[orderStatus].label
                    : 'Please Select'
                }
                // value={orderStatus!==-1 ? loginData.orderStatus[orderStatus].label:"Please Select"}
                options={types}
                onSelect={value => setOrderStatus(value)}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              clear();
            }}
            style={styles.buttonUnselected}>
            <Text style={styles.blackTextMedium}>Clear All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              apply();
            }}
            style={styles.buttonSelected}>
            <Text style={styles.whiteTextMedium}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function search() {
    setShow(true);
    temp = '';
    let sortedArray = [];
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].items.find(element => element.name.includes(searchText)) !==
        undefined
      ) {
        sortedArray.push(data[i]);
      }
      if (
        data[i].items.find(element => element.sku.includes(searchText)) !==
        undefined
      ) {
        sortedArray.push(data[i]);
      }
    }
    setProductFetchCompleted(true);
    setpageCurrent(1);
    setData(sortedArray);
  }

  function renderOrderlist(item, index) {
    
    return (
      
      
      console.log('item.items.........'+JSON.stringify(item.items[0].extension_attributes.price_type )),
      
      // console.log('item.items.extension_attributes....'+JSON.stringify(item.extension_attributes.price_type)),

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: colors.whiteGradient,
          marginTop: 15,
          marginLeft: 10,
          marginBottom:10,
          marginRight: 10,
        }}>
        {item.status !== undefined && (
          <View
            style={
              renderOrderStatus(item.status) !== 'Cancelled' &&
              renderOrderStatus(item.status) !== 'Suspected Fraud' &&
              renderOrderStatus(item.status) !== 'On Hold'
                ? {
                    height: 30,
                    paddingHorizontal: 20,
                    backgroundColor: colors.stepsColor,
                    justifyContent: 'center',
                  }
                : {
                    height: 30,
                    paddingHorizontal: 20,
                    backgroundColor: colors.orange,
                    justifyContent: 'center',
                  }
            }>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 14,
                color: colors.white,
              }}>
              {renderOrderStatus(item.status)}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: colors.lightGrey,
            backgroundColor: colors.whiteGradient,
            borderWidth: 0.5,
          }}>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '50%'}}>
                <View style={{marginRight: 10, marginBottom: 15}}>
                  <Text style={{fontFamily: 'DRLCircular-Light'}}>
                    Order No.
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 18,
                      color: colors.textColor,
                    }}>
                    {item.increment_id}
                  </Text>
                </View>
                <View style={{marginRight: 10, marginBottom: 10}}>
                  <Text style={{fontFamily: 'DRLCircular-Light'}}>
                    PO Number
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.textColor,
                    }}>
                    {item.payment.po_number}
                  </Text>
                </View>
                
                <View style={{marginRight: 10}}>
                  <Text style={{fontFamily: 'DRLCircular-Light'}}>Date</Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.textColor,
                    }}>
                    {item.updated_at.slice(0, 10)}
                  </Text>
                </View>

                
              </View>

              <View style={{width: '50%'}}>
                {item.extension_attributes !== undefined &&
                  item.extension_attributes.sap_id !== undefined && (
                    <View style={{marginBottom: 15}}>
                      <Text style={{fontFamily: 'DRLCircular-Light'}}>
                        Sales Order No.
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          width: '99%',
                          fontFamily: 'DRLCircular-Bold',
                          fontSize: 18,
                          color: colors.textColor,
                        }}>
                        {item.extension_attributes.sap_id}
                      </Text>
                    </View>
                  )}
                <View style={{marginRight: 10,marginBottom:10}}>
                  <Text style={{fontFamily: 'DRLCircular-Light'}}>
                    Created By{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.textColor,
                      width: '90%',
                    }}>
                    {item.customer_firstname} {item.customer_lastname}
                  </Text>
                </View>


                <View style={{marginRight: 10,}}>
                  <Text style={{fontFamily: 'DRLCircular-Light'}}>
                    Price Type{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                      color: colors.textColor,
                      width: '90%',
                    }}>
                    {item.items[0].extension_attributes.price_type}
                  </Text>
                </View>

              </View>
            </View>
            <View style={{marginVertical: 10}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Light',
                  fontSize: 18,
                  marginTop: 5,
                  color: colors.textColor,
                }}>
                Order Total:{' '}
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                  ${utils.formatPrice(item.base_grand_total)}
                </Text>
              </Text>
            </View>

            {item.extension_attributes !== undefined &&
              item.extension_attributes.has_invoices !== undefined &&
              item.extension_attributes.has_invoices && (
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() => {
                    dispatch(setInvoiceInfoSuccess([]));
                    dispatch(getAdminTokenForInvoiceWithLoader(item.entity_id));
                    navigation.navigate('Invoices');
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      color: colors.blue,
                      textDecorationLine: 'underline',
                      fontSize: 16,
                    }}>
                    View Invoice(s)
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: 40,
            marginBottom:10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopColor: colors.lightGrey,
            backgroundColor: colors.shopCategoryBackground,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: colors.lightGrey,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: '48%',
              alignItems: 'center',
            }}
            onPress={() => {
              if (GlobalConst.customerStatus === 'Approved') {
                dispatch(reorder(item.entity_id));
              } else {
                Toast.show(
                  'Please complete Profile / Wait for approval',
                  Toast.SHORT,
                );
              }
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  color: colors.textColor,
                  marginLeft: 5,
                  fontSize: 16,
                }}>
                {' '}
                Reorder
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{backgroundColor: colors.blue, width: 1, margin: 5}}></View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: '48%',
              alignItems: 'center',
            }}
            onPress={() => {
              dispatch(setRecentOrdersSuccess(data));
              dispatch(setTrackingInfoSuccess([]));
              dispatch(setInvoiceInfoSuccess([]));
              dispatch(getAdminTokenForTracking(item.entity_id));
              dispatch(setOrderDetail({}));
              let orderID = item.entity_id;
              navigation.navigate('OrderDetail', (orderId = {orderID}));
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  color: colors.textColor,
                  marginLeft: 5,
                  fontSize: 16,
                }}>
                {' '}
                View Order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  function renderSearchSection() {
    return (
      <View style={{marginTop: 10, marginHorizontal: 10, paddingBottom: 10}}>
        <View style={{marginBottom: 10, marginHorizontal: 5}}>
          <Text
            style={{
              fontFamily: 'DRLCircular-Book',
              color: colors.textColor,
              fontSize: 14,
            }}>
            Need Return/Cancellation?{' '}
            <Text
              style={{color: colors.blue}}
              onPress={() => navigation.navigate('ServiceRequest')}>
              Click here
            </Text>
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: '85%'}}>
            <View
              style={{
                height: 40,
                borderWidth: 0.5,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 20,
              }}>
              <TextInput
                placeholder={'Search by Product Name/NDC'}
                style={{fontFamily: 'DRLCircular-Book', width: '80%'}}
                value={searchText}
                onChangeText={text => setSearchText(text)}
                onSubmitEditing={() => {
                  if (searchText.length > 0) {
                    search();
                  } else {
                    Toast.show('Please enter text to search');
                  }
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  if (searchText.length > 0) {
                    search();
                  } else {
                    Toast.show('Please enter text to search');
                  }
                }}>
                <Image source={require('../../images/search.png')} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={{width: 150, marginLeft: 5}}
            // hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
            onPress={() => {
              if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
                bottomDrawerRef.open();
              }
            }}>
            <Image
              source={require('../../images/filter.png')}
              style={{height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {show && (
          <TouchableOpacity
            style={{width: 150, marginTop: 5, marginLeft: 5}}
            // hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
            onPress={() => {
              setSearchText('');
              clear();
            }}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 14,
                color: colors.blue,
              }}>
              Show All Orders
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'My Orders'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />
        {bottomSliderView()}
        {renderSearchSection()}
       
        <FlatList
          style={{padding: 10}}
          data={data}
          renderItem={({item, index}) => renderOrderlist(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {data.length === 0 && productFetchCompleted && (
          <View style={{alignItems: 'center', height: '100%'}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 18,
                marginTop: 50,
              }}>
              No Orders found
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};
export default MyOrder;
