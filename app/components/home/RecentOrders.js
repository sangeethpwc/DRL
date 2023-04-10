import React, {useState, useEffect} from 'react';
import {Button, Card} from 'native-base';
import {Text, View, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Colors from '../../config/Colors';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {setTrackingInfoSuccess} from '../../slices/productSlices';
import {getAdminTokenForTracking} from '../../services/operations/productApis';
import utils from '../../utilities/utils';

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const RecentOrders = props => {
  const [active, setActive] = useState(0);
  const [isRecentOrder, recentOrders] = useState(true);
  const [isUpcomingDelivery, upcomingDeliveries] = useState(false);
  const [recentOrdersData, setRecentOrders] = useState([]);
  const [upcomingOrdersData, setUpcomingOrders] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);

  const loginData = useSelector(state => state.authenticatedUser);
  const homeData = useSelector(state => state.home);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function renderImagesSection(order) {
    //
    let OrderLength = order.items.length;

    if (OrderLength === 1) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {order.items.map((item, index) => {
            if (
              item.extension_attributes !== undefined &&
              item.extension_attributes.productimage !== undefined &&
              item.extension_attributes.productimage.length > 0
            ) {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={{
                    uri:
                      BASE_URL_IMAGE + item.extension_attributes.productimage,
                  }}
                />
              );
            } else {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={require('../../images/Group_741.png')}
                />
              );
            }
          })}
        </View>
      );
    } else if (OrderLength === 2) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {order.items.map((item, index) => {
            if (
              item.extension_attributes !== undefined &&
              item.extension_attributes.productimage !== undefined
            ) {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={{
                    uri:
                      BASE_URL_IMAGE + item.extension_attributes.productimage,
                  }}
                />
              );
            } else {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={require('../../images/Group_741.png')}
                />
              );
            }
          })}
        </View>
      );
    } else if (OrderLength === 3) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {order.items.map((item, index) => {
            if (
              item.extension_attributes !== undefined &&
              item.extension_attributes.productimage !== undefined
            ) {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={{
                    uri:
                      BASE_URL_IMAGE + item.extension_attributes.productimage,
                  }}
                />
              );
            } else {
              return (
                <Image
                  style={{height: 150, width: 120}}
                  resizeMode="contain"
                  source={require('../../images/Group_741.png')}
                />
              );
            }
          })}
        </View>
      );
    } else if (OrderLength > 3) {
      let count = 0;
      return (
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {order.items.map((item, index) => {
              if (count < 3) {
                if (
                  item.extension_attributes !== undefined &&
                  item.extension_attributes.productimage !== undefined
                ) {
                  count = count + 1;
                  return (
                    <Image
                      style={{height: 150, width: 120}}
                      resizeMode="contain"
                      source={{
                        uri:
                          BASE_URL_IMAGE +
                          item.extension_attributes.productimage,
                      }}
                    />
                  );
                } else {
                  count = count + 1;
                  return (
                    <Image
                      style={{height: 150, width: 120}}
                      resizeMode="contain"
                      source={require('../../images/Group_741.png')}
                    />
                  );
                }
              }
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(setTrackingInfoSuccess([]));
              dispatch(getAdminTokenForTracking(order.entity_id));
              let orderID = order.entity_id;

              navigation.navigate('OrderDetail', (orderId = {orderID}));
              props.handleScroll();
            }}>
            <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
              +{OrderLength - 3} more
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  useEffect(() => {
    if (!_.isEmpty(homeData.recentOrdersForHome)) {
      setRecentOrders(homeData.recentOrdersForHome);
      // setSortedArray(_.filter(homeData.recentOrders, v => v.status === "pending"))
    }
  }, [homeData.recentOrdersForHome]);

  useEffect(() => {
    if (!_.isEmpty(homeData.upcomingOrdersForHome)) {
      setUpcomingOrders(homeData.upcomingOrdersForHome);
      // setSortedArray(_.filter(homeData.recentOrders, v => v.status === "pending"))
    }
  }, [homeData.upcomingOrdersForHome]);

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;

  const recenterOrdersSelection = () => {
    if (isRecentOrder === false) {
      recentOrders(true);
      upcomingDeliveries(false);
    }
    // else{
    //     recentOrders(false)
    //     upcomingDeliveries(true);
    // }

    //setSortedArray(sortByStatus("pending"))
  };

  const upcomingDeliverySerlection = () => {
    if (isUpcomingDelivery === false) {
      recentOrders(false);
      upcomingDeliveries(true);
    }
    // else{
    //     recentOrders(true)
    //     upcomingDeliveries(false);
    // }

    //setSortedArray(sortByStatus("not pending"))
  };

  const change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );

    if (slide !== active) {
      setActive(slide);
    }
  };

  function renderOrderStatus(status) {
    if (
      loginData.orderStatus.find(item => item.value === status) !== undefined
    ) {
      return loginData.orderStatus.find(item => item.value === status).label;
    } else {
      return '';
    }
  }

  const getOrders = () => {
    return (
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={change}>
        {recentOrdersData.map((order, index) => (
          <View key={index} style={{padding: 10}}>
            <Card
              style={{
                width: width - 25,
                backgroundColor: colors.white,
                borderRadius: 10,
                padding: 20,
              }}>
              {order.status !== undefined && (
                <View
                  style={{
                    height: 30,
                    paddingHorizontal: 10,
                    backgroundColor: colors.bannerBlue,
                    justifyContent: 'center',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 14,
                      color: colors.textColor,
                    }}>
                    Order Status: {renderOrderStatus(order.status)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  marginTop: 20,
                  paddingBottom: 10,
                }}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.textLight, {fontSize: 16}]}>
                    Order Value
                  </Text>
                  <Text style={[styles.textBold, {fontSize: 20}]}>
                    ${utils.formatPrice(order.base_grand_total)}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: colors.grey,
                    height: 30,
                  }}></View>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.textLight, {fontSize: 16}]}>
                    Order ID
                  </Text>
                  <Text style={[styles.textBold, {fontSize: 20}]}>
                    {order.increment_id}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderRadius: 1,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.grey,
                  marginTop: 5,
                  marginHorizontal: 20,
                }}></View>

              <View style={{marginTop: 40, marginBottom: 10}}>
                {renderImagesSection(order)}
              </View>

              <View
                style={{
                  marginTop: 20,
                  borderRadius: 1,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.grey,
                  marginTop: 5,
                  marginHorizontal: 20,
                }}></View>

              <View style={{borderColor: colors.grey}}>
                <Button
                  onPress={() => {
                    dispatch(setTrackingInfoSuccess([]));
                    dispatch(getAdminTokenForTracking(order.entity_id));
                    let orderID = order.entity_id;
                    navigation.navigate('OrderDetail', (orderId = {orderID}));
                    props.handleScroll();
                  }}
                  full
                  style={{
                    backgroundColor: Colors.lightBlue,
                    borderRadius: 50,
                    borderColor: colors.white,
                    borderWidth: 1,
                    marginHorizontal: 20,
                    marginTop: 20,
                  }}>
                  <Text
                    uppercase={false}
                    style={[styles.buttonText, {fontSize: 14}]}>
                    View Order
                  </Text>
                </Button>
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    );
  };

  const getOrdersUpcoming = () => {
    return (
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={change}>
        {upcomingOrdersData.map((order, index) => (
          <View key={index} style={{padding: 10}}>
            <Card
              style={{
                width: width - 25,
                backgroundColor: colors.white,
                borderRadius: 10,
                padding: 20,
              }}>
              {order.status !== undefined && (
                <View
                  style={{
                    height: 30,
                    paddingHorizontal: 10,
                    backgroundColor: colors.bannerBlue,
                    justifyContent: 'center',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 14,
                      color: colors.textColor,
                    }}>
                    Order Status: {renderOrderStatus(order.status)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  marginTop: 20,
                  paddingBottom: 10,
                }}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.textLight, {fontSize: 16}]}>
                    Order Value
                  </Text>
                  <Text style={[styles.textBold, {fontSize: 20}]}>
                    ${utils.formatPrice(order.base_grand_total)}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: colors.grey,
                    height: 30,
                  }}></View>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.textLight, {fontSize: 16}]}>
                    Order ID
                  </Text>
                  <Text style={[styles.textBold, {fontSize: 20}]}>
                    {order.increment_id}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderRadius: 1,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.grey,
                  marginTop: 5,
                  marginHorizontal: 20,
                }}></View>

              <View style={{marginTop: 40, marginBottom: 10}}>
                {renderImagesSection(order)}
              </View>

              <View
                style={{
                  marginTop: 20,
                  borderRadius: 1,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.grey,
                  marginTop: 5,
                  marginHorizontal: 20,
                }}></View>

              <View style={{borderColor: colors.grey}}>
                <Button
                  onPress={() => {
                    dispatch(setTrackingInfoSuccess([]));
                    dispatch(getAdminTokenForTracking(order.entity_id));
                    let orderID = order.entity_id;
                    navigation.navigate('OrderDetail', (orderId = {orderID}));
                    props.handleScroll();
                  }}
                  full
                  style={{
                    backgroundColor: Colors.lightBlue,
                    borderRadius: 50,
                    borderColor: colors.white,
                    borderWidth: 1,
                    marginHorizontal: 20,
                    marginTop: 20,
                  }}>
                  <Text
                    uppercase={false}
                    style={[styles.buttonText, {fontSize: 14}]}>
                    View Order
                  </Text>
                </Button>
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View>
      {isUpcomingDelivery ? (
        <View
          style={{
            width: '100%',
            height: 150,
            backgroundColor: colors.lightBlue,
          }}>
          <Button
            full
            style={
              isRecentOrder
                ? styles.recentOrderSelected
                : styles.recentOrderUnselected
            }
            onPress={recenterOrdersSelection}>
            <Text
              uppercase={false}
              style={
                isRecentOrder
                  ? [styles.buttonTextSelected, {fontSize: 12, width: '70%'}]
                  : [styles.buttonTextUnSelected, {fontSize: 12, width: '70%'}]
              }>
              Recent Orders
            </Text>
          </Button>

          <Button
            full
            style={
              isUpcomingDelivery
                ? styles.upcomingDeliverySelected
                : styles.upcomingDeliveryUnSelected
            }
            onPress={upcomingDeliverySerlection}>
            <Text
              uppercase={false}
              style={
                isUpcomingDelivery
                  ? [styles.buttonTextSelected, {fontSize: 12, width: '70%'}]
                  : [styles.buttonTextUnSelected, {fontSize: 12, width: '70%'}]
              }>
              Upcoming Delivery
            </Text>
          </Button>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: 150,
            backgroundColor: colors.lightBlue,
          }}>
          <Button
            full
            style={
              isUpcomingDelivery
                ? styles.upcomingDeliverySelected
                : styles.upcomingDeliveryUnSelected
            }
            onPress={upcomingDeliverySerlection}>
            <Text
              uppercase={false}
              style={
                isUpcomingDelivery
                  ? [styles.buttonTextSelected, {fontSize: 12, width: '70%'}]
                  : [styles.buttonTextUnSelected, {fontSize: 12, width: '70%'}]
              }>
              Upcoming Delivery
            </Text>
          </Button>

          <Button
            full
            style={
              isRecentOrder
                ? styles.recentOrderSelected
                : styles.recentOrderUnselected
            }
            onPress={recenterOrdersSelection}>
            <Text
              uppercase={false}
              style={
                isRecentOrder
                  ? [styles.buttonTextSelected, {fontSize: 12, width: '70%'}]
                  : [styles.buttonTextUnSelected, {fontSize: 14, width: '70%'}]
              }>
              Recent Orders
            </Text>
          </Button>
        </View>
      )}

      <View style={{backgroundColor: colors.lightBlue}}>
        {recentOrdersData.length === 0 && isRecentOrder ? (
          <View style={{padding: 20}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 16,
                color: colors.white,
              }}>
              No recent orders found
            </Text>
          </View>
        ) : upcomingOrdersData.length === 0 && isUpcomingDelivery ? (
          <View style={{padding: 20}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 16,
                color: colors.white,
              }}>
              No upcoming deliveries found
            </Text>
          </View>
        ) : recentOrdersData.length > 0 && isRecentOrder ? (
          getOrders()
        ) : (
          getOrdersUpcoming()
        )}
        {/* {
            recentOrdersData.length>0 && isRecentOrder?
            
            :
            getOrders(upcomingOrdersData)
            }
            
            

            {/* <View style={{borderTopWidth:0.2,borderColor:'grey',height:70,alignItems:'center',justifyContent:'center',marginTop:20,width:'100%'}}>
                            <Button
                            onPress={()=>{
                                navigation.navigate("MyOrder")
                            }}
                             
                              full style={{backgroundColor: Colors.lightBlue, borderRadius: 50,borderColor: colors.white, borderWidth: 1,marginHorizontal:20}}
                                 >
                             <Text uppercase={false} style={[styles.buttonText,{fontSize:14}]}>View All Orders</Text>
                             </Button>
                            </View> */}
      </View>
    </View>
  );
};

export default RecentOrders;
