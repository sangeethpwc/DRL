import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {TouchableOpacity, StatusBar, Picker} from 'react-native';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';
import _, {add} from 'lodash';
import utils from '../../utilities/utils';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import Modal from 'react-native-modalbox';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import {ScrollView} from 'react-native-gesture-handler';
import {getAdminTokenForOderDetail} from '../../services/operations/getToken';
import {setOrderDetail} from '../../slices/homesSlices';
import {
  getTrackingInfo,
  getAdminTokenForTracking,
} from '../../services/operations/productApis';
import {getAdminTokenForOder} from '../../services/operations/getToken';
import GlobalConst from '../../config/GlobalConst';

const OrderDetail = props => {
  const dispatch = useDispatch();
  // const homeData= useSelector((state)=>state.product);

  const navigation = useNavigation();
  const loginData = useSelector(state => state.authenticatedUser);

  const homeData = useSelector(state => state.home);
  const productData = useSelector(state => state.product);

  const [recentOrdersData, setRecentOrders] = useState({});
  const [show, setShow] = useState(false);

  let orderId = props.route.params.orderID;

  const [refreshing, setRefreshing] = React.useState(false);

  const [isShipmentEnabled, setIsShipmentEnabled] = React.useState(false);
  const [isInvoiceEnabled, setIsInvoiceEnabled] = React.useState(false);

  let orderIndex = -1;

  useEffect(() => {
    orderIndex = _.findIndex(homeData.recentOrders, {entity_id: orderId});

    let initialArray = {};
    if (orderIndex !== -1) {
      initialArray = homeData.recentOrders[orderIndex];
      setRecentOrders(initialArray);
    }
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(setOrderDetail({}));
    dispatch(getAdminTokenForOderDetail(orderId));
    dispatch(getAdminTokenForOder(GlobalConst.customerId));
  }, []);

  useEffect(() => {
    //
    if (_.isEmpty(homeData.orderDetail) === true) {
    } else {
      //
      setRefreshing(false);
      setRecentOrders(homeData.orderDetail);
      dispatch(getAdminTokenForTracking(orderId));
    }
  }, [homeData.orderDetail]);

  useEffect(() => {
    if (productData.trackingInfo.length > 0) {
      setIsShipmentEnabled(true);
    }
  }, [productData.trackingInfo]);

  useEffect(() => {
    if (productData.invoiceInfo.length > 0) {
      console.log('Check...... invoice............');
      setIsInvoiceEnabled(true);
    }
  }, [productData.invoiceInfo]);

  let bottomDrawerRef = useRef(null);
  let detailsDrawerRef = useRef(null);

  function renderOrderStatus(status) {
    if (
      loginData.orderStatus.find(item => item.value === status) !== undefined
    ) {
      return loginData.orderStatus.find(item => item.value === status).label;
    } else {
      return '';
    }
  }

  function renderOrderSummary() {
    return (
      <View style={{margin: 20}}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 20,
            color: colors.textColor,
          }}>
          Order Summary
        </Text>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '50%'}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.grey,
              }}>
              Order Number
            </Text>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 18,
                color: colors.textColor,
              }}>
              {recentOrdersData.increment_id}
            </Text>
          </View>

          {recentOrdersData.extension_attributes !== undefined &&
            recentOrdersData.extension_attributes.sap_id !== undefined && (
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.grey,
                  }}>
                  Sales Order Number
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 18,
                    color: colors.textColor,
                  }}>
                  {recentOrdersData.extension_attributes.sap_id}
                </Text>
              </View>
            )}
        </View>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '50%'}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.grey,
              }}>
              Created By
            </Text>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 18,
                color: colors.textColor,
              }}>
              {recentOrdersData.customer_firstname}{' '}
              {recentOrdersData.customer_lastname}
            </Text>
          </View>
          {recentOrdersData !== undefined &&
            recentOrdersData.updated_at !== undefined && (
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.grey,
                  }}>
                  Created on
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 18,
                    color: colors.textColor,
                  }}>
                  {recentOrdersData.updated_at.slice(0, 10)}
                </Text>
              </View>
            )}
        </View>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          {recentOrdersData !== undefined &&
            recentOrdersData.items !== undefined && (
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.grey,
                  }}>
                  Products Ordered
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 18,
                    color: colors.textColor,
                  }}>
                  {recentOrdersData.items.length}
                </Text>
              </View>
            )}
          {console.log('Order item............', recentOrdersData)}
          {recentOrdersData !== undefined &&
            recentOrdersData.base_grand_total !== undefined && (
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.grey,
                  }}>
                  Grand Total
                </Text>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 18,
                    color: colors.textColor,
                  }}>
                  ${utils.formatPrice(recentOrdersData.base_grand_total)}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setShow(true);
                    if (recentOrdersData !== undefined) {
                      if (
                        detailsDrawerRef !== undefined &&
                        detailsDrawerRef !== null
                      ) {
                        detailsDrawerRef.open();
                      }
                    }
                  }}
                  style={{
                    marginTop: 10,
                    width: 100,
                    height: 30,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 14,
                      color: colors.blue,
                    }}>
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => {
              if (bottomDrawerRef !== undefined && bottomDrawerRef !== null) {
                bottomDrawerRef.open();
              }
            }}
            style={{
              backgroundColor: colors.lightBlue,
              borderRadius: 50,
              borderColor: colors.white,
              borderWidth: 1,
              marginTop: 10,
              width: 100,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              uppercase={false}
              style={{
                fontSize: 14,
                color: colors.white,
                fontFamily: 'DRLCircular-Book',
              }}>
              Order Info
            </Text>
          </TouchableOpacity>
          {isShipmentEnabled ? (
            <TouchableOpacity
              onPress={() => {
                if (isShipmentEnabled) {
                  navigation.navigate('Tracking');
                }
              }}
              style={
                isShipmentEnabled
                  ? {
                      backgroundColor: colors.lightBlue,
                      borderRadius: 50,
                      borderColor: colors.white,
                      borderWidth: 1,
                      marginTop: 10,
                      width: 100,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {
                      backgroundColor: colors.lightGrey,
                      borderRadius: 50,
                      borderColor: colors.white,
                      borderWidth: 1,
                      marginTop: 10,
                      width: 100,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              <Text
                uppercase={false}
                style={
                  isShipmentEnabled
                    ? {
                        fontSize: 14,
                        color: colors.white,
                        fontFamily: 'DRLCircular-Book',
                      }
                    : {
                        fontSize: 14,
                        color: colors.textColor,
                        fontFamily: 'DRLCircular-Book',
                      }
                }>
                Shipments
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{width: 100}}></View>
          )}
          {isInvoiceEnabled ? (
            <TouchableOpacity
              onPress={() => {
                if (isInvoiceEnabled) {
                  navigation.navigate('Invoices');
                }
              }}
              style={
                isInvoiceEnabled
                  ? {
                      backgroundColor: colors.lightBlue,
                      borderRadius: 50,
                      borderColor: colors.white,
                      borderWidth: 1,
                      marginTop: 10,
                      width: 100,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {
                      backgroundColor: colors.lightGrey,
                      borderRadius: 50,
                      borderColor: colors.white,
                      borderWidth: 1,
                      marginTop: 10,
                      width: 100,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              <Text
                uppercase={false}
                style={
                  isInvoiceEnabled
                    ? {
                        fontSize: 14,
                        color: colors.white,
                        fontFamily: 'DRLCircular-Book',
                      }
                    : {
                        fontSize: 14,
                        color: colors.textColor,
                        fontFamily: 'DRLCircular-Book',
                      }
                }>
                Invoices
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{width: 100}}></View>
          )}
        </View>
      </View>
    );
  }

  function getAddressBilling() {
    let address = '';
    if (loginData.customerInfo !== undefined) {
      for (
        let i = 0;
        loginData.customerInfo.addresses !== undefined &&
        i < loginData.customerInfo.addresses.length;
        i++
      ) {
        if (loginData.customerInfo.addresses[i].default_billing) {
          if (
            utils.getAttributeFromCustom(
              loginData.customerInfo.addresses[i],
              'address_status',
            ) !== 'NA' &&
            loginData.addressLabels.find(
              element =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ) !== undefined &&
            loginData.addressLabels.find(
              element =>
                element.value ===
                utils.getAttributeFromCustom(
                  loginData.customerInfo.addresses[i],
                  'address_status',
                ),
            ).label === 'Approved'
          ) {
            if (
              loginData.customerInfo.addresses[i].street !== undefined &&
              loginData.customerInfo.addresses[i].street.length > 0
            ) {
              address =
                address + loginData.customerInfo.addresses[i].street[0] + '\n';
            }

            if (
              loginData.customerInfo.addresses[i].street !== undefined &&
              loginData.customerInfo.addresses[i].street.length > 0
            ) {
              address =
                address + loginData.customerInfo.addresses[i].street[0] + '\n';
            }
            if (
              loginData.customerInfo.addresses[i].city !== undefined &&
              loginData.customerInfo.addresses[i].city.length > 0
            ) {
              address =
                address + loginData.customerInfo.addresses[i].city + ' ';
            }
            if (
              loginData.customerInfo.addresses[i].region !== undefined &&
              loginData.customerInfo.addresses[i].region.region !== undefined
            ) {
              address =
                address +
                loginData.customerInfo.addresses[i].region.region +
                ' ';
            }

            if (loginData.customerInfo.addresses[i].postcode !== undefined) {
              address =
                address + loginData.customerInfo.addresses[i].postcode + '\n';
              address = address + 'United States' + '\n';
            }
            if (loginData.customerInfo.addresses[i].telephone !== undefined) {
              address =
                address + loginData.customerInfo.addresses[i].telephone + '\n';
            }
          }
        }
      }
    }
    return address;
  }

  function getAddress(item) {
    let address = '';
    if (item !== undefined) {
      // if(item.firstname !== undefined && item.firstname.length>0 ){
      //     address = address + item.firstname+ " "
      // }

      // if(item.lastname !== undefined && item.lastname.length>0 ){
      //     address = address + item.lastname+ "\n"
      // }
      if (item.company !== undefined && item.company.length > 0) {
        address = address + item.company + '\n';
      }
      if (item.street !== undefined && item.street.length > 0) {
        address = address + item.street[0] + '\n';
      }
      if (item.city !== undefined && item.city.length > 0) {
        address = address + item.city + ' ';
      }
      if (item.region !== undefined && item.region.length > 0) {
        address = address + item.region + ' ';
      }
      if (item.postcode !== undefined) {
        address = address + item.postcode + '\n';
        address = address + 'United States' + '\n';
      }
      if (item.telephone !== undefined) {
        address = address + 'T: ' + item.telephone + '\n';
      }
    }
    return address;
  }

  function priceDetailsView() {
    return (
      <Modal
        style={{height: '25%', width: '80%'}}
        ref={c => (detailsDrawerRef = c)}>
        <View
          style={{
            //flex: 1,
            flexDirection: 'column',
            // height: 150,
            padding: 10,
            backgroundColor: colors.white,
          }}>
          <View style={styles.summaryView}>
            {recentOrdersData.base_subtotal !== undefined && (
              <View style={styles.summaryItem}>
                <View style={{width: '70%'}}>
                  <Text style={styles.summaryTextTitle}>Subtotal : </Text>
                </View>
                <Text style={styles.summaryText}>
                  ${utils.formatPrice(recentOrdersData.base_subtotal)}
                </Text>
              </View>
            )}

            {recentOrdersData.base_discount_amount !== undefined &&
              (recentOrdersData.base_discount_amount !== 0 ||
                (recentOrdersData.base_discount_amount == 0 &&
                  recentOrdersData.discount_description !== undefined &&
                  recentOrdersData.discount_description.length > 0)) && (
                <View style={styles.summaryItem}>
                  <View style={{width: '60%'}}>
                    <Text style={styles.summaryTextTitle}>Discount : </Text>
                    {recentOrdersData.discount_description !== undefined && (
                      <Text style={styles.labeltext} numberOfLines={2}>
                        ({recentOrdersData.discount_description})
                      </Text>
                    )}
                  </View>
                  {/* <Text style={styles.labeltext}>{couponMsg}</Text> */}

                  <Text style={styles.summaryText}>
                    - $
                    {utils.formatPrice(
                      recentOrdersData.base_discount_amount * -1,
                    )}
                  </Text>
                </View>
              )}

            {recentOrdersData.base_shipping_amount !== undefined && (
              <View style={styles.summaryItem}>
                <View style={{width: '70%'}}>
                  <Text style={styles.summaryTextTitle}>
                    Shipping and Handling:{' '}
                  </Text>

                  {recentOrdersData.shipping_description !== undefined && (
                    <Text style={styles.labeltext}>
                      ( {recentOrdersData.shipping_description.split('-')[0]})
                    </Text>
                  )}
                </View>
                <Text style={styles.summaryText}>
                  ${utils.formatPrice(recentOrdersData.base_shipping_amount)}
                </Text>
              </View>
            )}

            {recentOrdersData.base_grand_total !== undefined && (
              <View style={[styles.summaryItem, {marginTop: 20}]}>
                <Text style={[styles.summaryTextTitle, {fontSize: 18}]}>
                  Total :{' '}
                </Text>
                <Text style={[styles.summaryText, {fontSize: 18}]}>
                  ${utils.formatPrice(recentOrdersData.base_grand_total)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{height: '85%'}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}
        backdropPressToClose={true}
        swipeToClose={false}>
        <ScrollView style={{height: '100%'}}>
          <View
            style={{
              //flex: 1,
              flexDirection: 'column',
              // height: 150,
              padding: 20,
              backgroundColor: colors.white,
            }}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 20,
                color: colors.textColor,
              }}>
              Order Information
            </Text>

            <View
              style={{
                backgroundColor: colors.shopCategoryBackground,
                marginTop: 30,
                minHeight: 100,
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 20,
                  color: colors.textColor,
                }}>
                Shipping address
              </Text>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                {recentOrdersData !== undefined &&
                  recentOrdersData.extension_attributes !== undefined &&
                  recentOrdersData.extension_attributes.shipping_assignments !==
                    undefined &&
                  recentOrdersData.extension_attributes.shipping_assignments
                    .length > 0 &&
                  getAddress(
                    recentOrdersData.extension_attributes
                      .shipping_assignments[0].shipping.address,
                  )}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.shopCategoryBackground,
                marginTop: 10,
                minHeight: 80,
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 20,
                  color: colors.textColor,
                }}>
                Shipping Method
              </Text>

              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                {recentOrdersData !== undefined &&
                  recentOrdersData.shipping_description}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.shopCategoryBackground,
                marginTop: 10,
                minHeight: 100,
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 20,
                  color: colors.textColor,
                }}>
                Billing address
              </Text>

              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                {recentOrdersData !== undefined &&
                  getAddress(recentOrdersData.billing_address)}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.shopCategoryBackground,
                marginTop: 10,
                minHeight: 100,
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 20,
                  color: colors.textColor,
                }}>
                Payment Info
              </Text>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                {/* Delivery Payment Terms : */}
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.textColor,
                  }}>
                  {recentOrdersData !== undefined &&
                    recentOrdersData.payment !== undefined &&
                    recentOrdersData.payment.additional_information !==
                      undefined &&
                    recentOrdersData.payment.additional_information.length >
                      0 &&
                    recentOrdersData.payment.additional_information[0] !==
                      undefined &&
                    recentOrdersData.payment.additional_information[0]}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                PO number :{' '}
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.textColor,
                  }}>
                  {recentOrdersData !== undefined &&
                    recentOrdersData.payment !== undefined &&
                    recentOrdersData.payment.po_number}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }

  function renderOrderlist(item, index) {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          backgroundColor: 'white',
          marginBottom: 10,
          borderBottomWidth: 0.5,
          borderColor: colors.lightGrey,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: colors.lightGrey,
            // backgroundColor: colors.shopCategoryBackground,
          }}>
          <View style={{borderRightWidth: 1, borderColor: colors.lightGrey}}>
            {item.extension_attributes !== undefined &&
            item.extension_attributes.productimage !== undefined ? (
              <Image
                style={{height: 100, width: 100}}
                resizeMode="contain"
                source={{
                  uri: BASE_URL_IMAGE + item.extension_attributes.productimage,
                }}
              />
            ) : (
              <Image
                style={{height: 100, width: 100}}
                resizeMode="contain"
                source={require('../../images/Group_741.png')}
              />
            )}
          </View>

          <View style={{flexDirection: 'column', padding: 10}}>
            {item.extension_attributes !== undefined &&
              item.extension_attributes.batch_number !== undefined &&
              item.extension_attributes.batch_number.length > 0 && (
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    color: colors.green,
                  }}>
                  {item.extension_attributes.batch_number}
                </Text>
              )}

            {item.extension_attributes !== undefined &&
              item.extension_attributes.batch_number !== undefined &&
              item.extension_attributes.batch_number.length === 0 &&
              item.product_option !== undefined &&
              !_.isEmpty(item.product_option) && (
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    color: colors.green,
                  }}>
                  Shortdated
                </Text>
              )}

            <Text
              style={{
                maxWidth: 250,
                marginRight: 10,
                fontFamily: 'DRLCircular-Book',
                fontSize: 18,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Product Name:{' '}
              </Text>
              {item.name}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Light',
                fontSize: 14,
                color: colors.textColor,
                marginTop: 3,
              }}>
              NDC: {item.sku}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
                marginTop: 10,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Price: </Text>$
              {utils.formatPrice(item.base_price)}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Quantity </Text>
              {'\n'}Ordered: {item.qty_ordered} Shipped: {item.qty_shipped}
            </Text>

            {item.qty_canceled !== undefined && item.qty_canceled !== 0 && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                Cancelled: {item.qty_canceled}
              </Text>
            )}
            <View style={{marginTop: 10}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>Subtotal: </Text>
                $
                {utils.formatPrice(
                  item.base_price * (item.qty_ordered - item.qty_canceled),
                )}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>Discount: </Text>
                ${utils.formatPrice(item.base_discount_amount)}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>Total: </Text>$
                {utils.formatPrice(item.base_row_total)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderComments() {
    return (
      <View style={{margin: 20}}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 20,
            color: colors.textColor,
          }}>
          About Your Order
        </Text>

        {recentOrdersData.status_histories.map((item, index) => {
          if (item.comment !== null) {
            return (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{width: '30%'}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.grey,
                    }}>
                    {item.created_at.slice(0, 10)}
                  </Text>
                </View>

                <View style={{width: '70%'}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.textColor,
                    }}>
                    {item.comment}
                  </Text>
                </View>
              </View>
            );
          }
        })}
      </View>
    );
  }

  return (
    // <SafeAreaView>
    <View>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      {/* <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}> */}
      <CustomeHeader
        back={'back'}
        title={'Order Detail'}
        isHome={true}
        addToCart={'addToCart'}
        addToWishList={'addToWishList'}
        addToLocation={'addToLocation'}
      />

      {bottomSliderView()}
      {priceDetailsView()}
      {/* <ScrollView > */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {recentOrdersData.status !== undefined && (
          <View
            style={
              renderOrderStatus(recentOrdersData.status) !== 'Cancelled' &&
              renderOrderStatus(recentOrdersData.status) !==
                'Suspected Fraud' &&
              renderOrderStatus(recentOrdersData.status) !== 'On Hold'
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
              {renderOrderStatus(recentOrdersData.status)}
            </Text>
          </View>
        )}

        {renderOrderSummary()}

        {recentOrdersData !== undefined &&
          recentOrdersData.status_histories !== undefined &&
          recentOrdersData.status_histories.length > 0 &&
          renderComments()}
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 20,
            color: colors.textColor,
            marginHorizontal: 20,
            marginBottom: 10,
          }}>
          Products Ordered :
        </Text>
        {/* <FlatList
                style={{padding:10, }}
                data={recentOrdersData.items}
                renderItem={({item,index}) => (
                renderOrderlist(item,index)
            )}/> */}

        {recentOrdersData !== undefined &&
          recentOrdersData.items !== undefined &&
          recentOrdersData.items.map((item, index) => {
            return renderOrderlist(item, index);
          })}

        <View style={{height: 80}}></View>

        {/* </ScrollView>  */}
      </ScrollView>
      {/* 
      {recentOrdersData !== undefined && show && (
        <View
          style={{flexDirection: 'row', backgroundColor: colors.lightGrey2}}>
          <View style={{flexDirection: 'column', padding: 10, width: '70%'}}>
            {recentOrdersData.base_subtotal !== undefined && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>Subtotal: </Text>
                ${utils.formatPrice(recentOrdersData.base_subtotal)}
              </Text>
            )}

            {recentOrdersData.base_shipping_amount !== undefined && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 16,
                  color: colors.textColor,
                  marginTop: 3,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                  Shipping and Handling:{' '}
                </Text>
                ${utils.formatPrice(recentOrdersData.base_shipping_amount)}
              </Text>
            )}

            {recentOrdersData.base_discount !== undefined &&
              recentOrdersData.base_discount !== 0 && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.textColor,
                    marginTop: 3,
                  }}>
                  <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                    Discount:{' '}
                  </Text>
                  ${utils.formatPrice(recentOrdersData.base_discount)}
                </Text>
              )}

            {recentOrdersData.base_grand_total !== undefined && (
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 18,
                  color: colors.textColor,
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                  Grand Total:{' '}
                </Text>
                ${utils.formatPrice(recentOrdersData.base_grand_total)}
              </Text>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '30%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShow(false);
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 14,
                  color: colors.blue,
                }}>
                Hide Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
      {/* </LinearGradient> */}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryView: {
    padding: 10,
    paddingBottom: 20,
  },

  labeltext: {
    color: Colors.textColor,
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  summaryText: {
    color: Colors.textColor,
    fontSize: 16,
    fontFamily: 'DRLCircular-Bold',
  },
  summaryTextTitle: {
    color: Colors.textColor,
    fontSize: 16,
    fontFamily: 'DRLCircular-Bold',
    width: '70%',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'DRLCircular-Bold',
    marginTop: 10,
  },

  titleText: {
    color: Colors.blue,

    fontFamily: 'DRLCircular-Bold',
    fontSize: 24,
  },
});

export default OrderDetail;
