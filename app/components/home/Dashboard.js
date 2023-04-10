import React, {useState, useEffect} from 'react';
import {Button, Card} from 'native-base';
import {
  StatusBar,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from './home_style';
import {useSelector, useDispatch} from 'react-redux';
import {getToken} from '../../services/operations/getToken';
import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import StepIndicator from 'react-native-step-indicator';
import RecentOrdersDashboard from './RecentOrdersDashboard';

const chart_wh = 250;
const series = [123, 321, 123, 789, 537];
const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.stepsColor,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.stepsColor,
  stepStrokeUnFinishedColor: colors.transparent,
  separatorFinishedColor: colors.stepsColor,
  separatorUnFinishedColor: colors.lightGrey,
  stepIndicatorFinishedColor: colors.stepsColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: colors.stepsColor,
  labelSize: 13,
};

const labels = ['Cart', 'Delivery Address', 'Order Summary', 'Track', ''];

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const images = [
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
];

const sliders = ['../../images/sliderImage1.png'];

const dashboard = props => {
  const [email, setEmail] = useState('');
  const [active, setActive] = useState(0);
  const [isRecentOrder, recentOrders] = useState(false);
  const [isUpcomingDelivery, upcomingDeliveries] = useState(true);

  const dispatch = useDispatch();
  const loginData = useSelector(state => state.authenticatedUser);

  const {width} = Dimensions.get('window');
  GlobalConst.DeviceWidth = width;

  function renderBanner() {
    return (
      <View
        style={{
          backgroundColor: colors.bannerDarkBlue,
          margin: 20,
          borderRadius: 10,
          height: 150,
          padding: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image source={require('../../images/Tablet.png')} />
          <View style={{marginLeft: 20, width: '70%'}}>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 22,
                color: colors.white,
              }}>
              Running low on a specific drug?
            </Text>
            <Text
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 14,
                color: colors.white,
              }}>
              Get express shipping within 24 hours contact us
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: colors.white,
          }}>
          <Text>Contact Us</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const validateContactNumber = () => {
    if (_.isEmpty(email)) {
      Toast.show('Please enter Email', Toast.SHORT);
    } else if (_.isEmpty(password)) {
      Toast.show('Please enter password', Toast.SHORT);
    } else {
      dispatch(getToken(email, password));
    }
  };

  const recenterOrdersSelection = () => {
    if (!isRecentOrder) {
      recentOrders(true);
      upcomingDeliveries(false);
    } else {
      recentOrders(false);
      upcomingDeliveries(true);
    }
  };

  const upcomingDeliverySerlection = () => {
    if (!isUpcomingDelivery) {
      recentOrders(false);
      upcomingDeliveries(true);
    } else {
      recentOrders(true);
      upcomingDeliveries(false);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(loginData.token)) {
    }
  }, [loginData]);

  const change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );

    if (slide !== active) {
      setActive(slide);
    }
  };

  const renderStepIndicatorTracker = params => {
    return (
      <Image
        source={
          params.stepStatus === 'current'
            ? require('../../images/tracker.png')
            : null
        }
      />
    );
  };

  const renderStepIndicatorSteps = params => {
    return (
      <Image
        source={
          params.stepStatus === 'current'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'finished'
            ? require('../../images/tick_large.png')
            : params.stepStatus === 'unfinished'
            ? require('../../images/unselected_large.png')
            : null
        }
      />
    );
  };

  const renderCustomeLabel = params => {
    return params.position === 0 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Order Placed
      </Text>
    ) : params.position === 1 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Processing
      </Text>
    ) : params.position === 2 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Packed
      </Text>
    ) : params.position === 3 ? (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Shipped
      </Text>
    ) : (
      <Text
        style={
          params.stepStatus === 'finished'
            ? {
                marginLeft: 20,
                width: 400,
                fontFamily: 'DRLCircular-Book',
                color: colors.stepsColor,
                textAlign: 'left',
                width: 400,
              }
            : {
                width: 400,
                marginLeft: 20,
                fontFamily: 'DRLCircular-Book',
                marginLeft: 20,
                textAlign: 'left',
              }
        }>
        Arriving
      </Text>
    );
  };
  return (
    <ViewWithSpinner style={styles.container}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'Dashboard'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />
        <ScrollView>
          <View
            style={{
              backgroundColor: colors.dashboardCard1BackgroundColor,
              width: '100%',
              height: 250,
            }}>
            <View
              style={{
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{width: '70%'}}>
                  <Text style={styles.textWhite}>
                    You’re Eligible for Upto 40% Off on All Diabetes Medication
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: colors.blue,
                    height: 25,
                  }}></View>
                <View
                  style={{
                    width: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity>
                    <Text style={styles.textBlue}>Know More</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity>
                <View
                  style={{
                    borderRadius: 50,
                    borderColor: colors.blue,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      marginLeft: 50,
                      marginRight: 50,
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    View Meds
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: colors.white, width: '100%'}}>
            <ScrollView
              style={{marginTop: -100}}
              pagingEnabled
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={change}>
              {sliders.map((image, index) => (
                <View style={{padding: 10}}>
                  <Card
                    style={{
                      width: width - 25,
                      backgroundColor: colors.white,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={[
                        styles.textBold,
                        {marginLeft: 30, marginRight: 30, marginTop: 10},
                      ]}>
                      Hey Adam, You’ve got an Upcoming Delivery
                    </Text>
                    <Text
                      style={[
                        styles.textLight,
                        {marginLeft: 30, marginRight: 30, marginTop: 10},
                      ]}>
                      Your shipment has left the warehouse and is en route to
                      the{' '}
                      <Text style={styles.textBold}>Dalas Delivery Hub </Text>{' '}
                    </Text>
                    <Text
                      style={[
                        styles.textLight,
                        {marginLeft: 30, marginRight: 30, marginTop: 30},
                      ]}>
                      Tracking Number:{' '}
                      <Text style={styles.textBold}>24353464 </Text>
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        height: 250,
                        marginLeft: 20,
                        marginTop: 5,
                      }}>
                      <StepIndicator
                        customStyles={customStyles}
                        currentPosition={2}
                        stepCount={5}
                        direction={'vertical'}
                        labels={labels}
                        renderStepIndicator={renderStepIndicatorSteps}
                        renderLabel={renderCustomeLabel}
                      />
                      <Text
                        style={[
                          styles.textBlue,
                          {
                            marginRight: 30,
                            marginTop: 5,
                            marginBottom: 20,
                            fontSize: 14,
                          },
                        ]}>
                        View Order Details
                      </Text>
                    </View>
                  </Card>
                </View>
              ))}
            </ScrollView>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'DRLCircular-Bold',
                fontSize: 20,
                marginLeft: 10,
              }}>
              Recent Orders
            </Text>

            <RecentOrdersDashboard />
          </View>
          {renderBanner()}
        </ScrollView>
      </LinearGradient>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(dashboard);

export default dashboard;
