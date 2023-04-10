import React, {useState, useEffect} from 'react';
import {Alert, Platform, Text} from 'react-native';
import Login from './app/components/authetication/Login';
import HomeWithoutLogin from './app/components/home/HomeWithoutLogin';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './app/config/DrawerNavigatore';
import ForgotPaassword from './app/components/authetication/ForgotPasswordNew';
// import CapchaVerification from '../app/components/authetication/CapchaVerification';
import AllProducts from './app/components/product/AllProducts';
import ProductDetail from './app/components/product/ProductDetail';
import ProductDetailConfigurable from './app/components/product/ProductDetailConfigurable';
import ErrorModal from './app/utilities/customviews/ErrorModal';
import TabNavigator from './app/config/TabNavigator';
import TabNavigatorWithoutLogin from './app/config/TabNavigatorWithoutLogin';
import PasswordResetComplete from './app/components/authetication/PasswordResetComplete';
import SplashScreen from './app/components/splashScreen/splashScreen';
import Onboarding from './app/components/onboardingScreens/Onboarding';
import Privacy from './app/components/onboardingScreens/Privacy';
import PrivacyMore from './app/components/onboardingScreens/PrivacyMore';
import Terms from './app/components/onboardingScreens/Terms';
import Categories from './app/components/product/Categories';
import Dashboard from './app/components/home/DashboardNew';
import MyProfile from './app/components/myProfile/MyProfile';
import ShippingAddresses from './app/components/myProfile/ShippingAddressParent';
import Medication from './app/components/more/Medication';
import Theraputic from './app/components/more/Theraputic';
import MyCart from './app/components/product/MyCart';
import ShortDated from './app/components/product/ShortDated';
import AddAddress from './app/components/myProfile/AddAddressNew';
import EditProfile from './app/components/myProfile/EditProfile';
import Help from './app/components/help/Help1';
import ServiceRequest from './app/components/help/ServiceRequest';
import ViewRequests from './app/components/help/ViewRequests';
import ContactUs from './app/components/help/ContactUs';
import EULA from './app/components/onboardingScreens/EULA';
import Subscription from './app/components/onboardingScreens/Subscription'
import CustomScanner from './app/config/CustomeScanner'
import CustomeLocation from './app/config/CustomeLocation'
import BarCodeScanner from './app/config/BarCodeScanner'
import MyCartAddress from './app/components/myProfile/MyCartAddress'
import ChangeLocationAddress from './app/components/location/ChangeLocationAddress'
import ChangeAddress from './app/components/location/ChangeAddress'
import ScanTest from './app/config/ScanTest';

import AccountInfo from './app/components/myProfile/AccountInfo';
import BusinessInfo from './app/components/myProfile/BusinessInfo';
import CompanyInfo from './app/components/myProfile/CompanyInfo';
import TradeInfo from './app/components/myProfile/TradeInfo';
import BankInfo from './app/components/myProfile/BankInfo';
import MyOrder from './app/components/product/MyOrder';
import OrderDetail from './app/components/product/OrderDetail';
import WishList from './app/components/product/WishList';

import Settings from './app/components/more/Settings';
import Brands from './app/components/more/Brands';
import Tracking from './app/components/product/Tracking';
import TermsGeneral from './app/components/onboardingScreens/TermsGeneral';
import Invoices from './app/components/product/Invoices';
import Resources from './app/components/help/Resources';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import GlobalConst from './app/config/GlobalConst';
import {useSelector, useDispatch} from 'react-redux';
import {setNotificationStatus} from './app/slices/authenticationSlice';
import utils from './app/utilities/utils';
import _ from 'lodash';
import AllProductsName from './app/components/product/AllProductsName';
import AllProductsNDC from './app/components/product/AllProductsNDC';
import {uploadToken} from './app/services/operations/getToken';
import {
  setServiceRequestsActive,
  setServiceRequestsHistory,
} from './app/slices/profileSlices';
import AsyncStorage from '@react-native-community/async-storage';
//Comment for iOS release
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType,
} from 'react-native-fcm';

//........................

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const Stack = createStackNavigator();
console.disableYellowBox = true;

const navigationOptionHandler = () => ({
  headerShown: false,
});

const App = props => {
  // const [permissions, setPermissions] = useState({});
  const dispatch = useDispatch();

  var notfi = null;

  const [permissions, setPermissions] = useState({});

  /**
   * By calling this function, notification with category `userAction` will have action buttons
   */

  if (Platform.OS === 'ios') {
    console.log("Inside ios block.......")
    try{
    PushNotificationIOS.addEventListener('register', token => {
      console.log(
        '***** PushNotificationHandler CALLLEDDD ********************* ',
        token,
      );
      if (token !== null) {
        GlobalConst.tokenUploadSuccess = false;
        GlobalConst.deviceId = token;
        PushNotificationIOS.addEventListener(
          'localNotification',
          onRemoteNotification,
        );
        PushNotificationIOS.addEventListener(
          'notification',
          onRemoteNotification,
        );

        if (GlobalConst.LoginToken.length > 0) {
          const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + '' + GlobalConst.LoginToken + '',
          };
          dispatch(uploadToken(headers));
        }
      }
    });
  }
  catch(e){
    console.log("Ios block error",e)
  }
    PushNotificationIOS.requestPermissions();
  }

 

  useEffect(() => {
    if (Platform.OS === 'ios') {
      dispatch(setNotificationStatus(''));
      PushNotificationIOS.addEventListener(
        'localNotification',
        onRemoteNotification,
      );
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotification,
      );

      PushNotificationIOS.getInitialNotification().then(notif => {
        console.log('Log - notification from closed', notif);
        if (!notif) {
          return;
        }
        if (notif !== undefined && notif._category !== undefined) {
          navigate(notif._category);
        }
      });
    }
  });

  const onRemoteNotification = notif => {
    if (Platform.OS === 'ios') {
      if (
        notif !== undefined &&
        notif._data !== undefined &&
        notif._data.aps !== undefined &&
        notif._data.aps.category !== undefined
      ) {
        navigate(notif._data.aps.category);
      }
    }
  };

  const navigate = async notif => {
    if (_.isEmpty(GlobalConst.cred)) {
      utils.getCreds();
    }
    console.log('Navigation state ' + notif);
    if (notif !== undefined && notif === 'service') {
      dispatch(setNotificationStatus('ViewRequests'));
    } else if (notif !== undefined && notif === 'order') {
      dispatch(setNotificationStatus('MyOrder'));
    } else if (notif !== undefined && notif === 'customer') {
      dispatch(setNotificationStatus('MyProfile'));
    } else if (notif !== undefined && notif === 'address') {
      dispatch(setNotificationStatus('ShippingAddresses'));
    }
    GlobalConst.notifDataNoUserInteraction = '';

    // await AsyncStorage.removeItem('category')
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      FCM.createNotificationChannel({
        id: 'default',
        name: 'Default',
        description: 'DrReddysDirect',
        priority: 'high',
      });

      FCM.requestPermissions();

      FCM.getFCMToken().then(token => {
        console.log('TOKEN (getFCMToken)', token);
        if (token !== null) {
          // GlobalConst.deviceId = token;
          if (token !== null) {
            GlobalConst.tokenUploadSuccess = false;
            GlobalConst.deviceId = token;
            if (GlobalConst.LoginToken.length > 0) {
              const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + '' + GlobalConst.LoginToken + '',
              };
              dispatch(uploadToken(headers));
            }
          }
        }
      });
      FCM.getInitialNotification().then(notif => {
        console.log('INITIAL NOTIFICATION', notif);
        if (notif.opened_from_tray) {
          let regexService = new RegExp('service', 'ig');
          let regexOrder = new RegExp('order', 'ig');
          let regexCustomer = new RegExp('customer', 'ig');
          let regexAddress = new RegExp('address', 'ig');
          if (regexService.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'service';
          }
          if (regexOrder.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'order';
          }
          if (regexCustomer.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'customer';
          }
          if (regexAddress.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'address';
          }

          console.log('INITIAL NOTIFICATION', notif);
          console.log(
            'INITIAL NOTIFICATION',
            GlobalConst.notifDataNoUserInteraction,
          );

          // AsyncStorage.getItem("category").then((category) => {
          //   console.log("Category........ "+category);
          //   if(category !== null){
          // GlobalConst.notifDataNoUserInteraction = category;
          if (GlobalConst.notifDataNoUserInteraction.length > 0) {
            if (GlobalConst.notifDataNoUserInteraction === 'service') {
              dispatch(setServiceRequestsActive([]));
              dispatch(setServiceRequestsHistory([]));
            }
            if (
              notif.fcm.action === null ||
              notif.fcm.action == 'fcm.ACTION.NOTIF'
            ) {
              navigate(GlobalConst.notifDataNoUserInteraction);
            }
          }
          //   }
          // })
        }
      });

      this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
        console.log('Opened from Tray While App is in Foreground');
        if (notif.opened_from_tray) {
          let regexService = new RegExp('service', 'ig');
          let regexOrder = new RegExp('order', 'ig');
          let regexCustomer = new RegExp('customer', 'ig');
          let regexAddress = new RegExp('address', 'ig');
          if (regexService.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'service';
          }
          if (regexOrder.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'order';
          }
          if (regexCustomer.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'customer';
          }
          if (regexAddress.test(notif.title) === true) {
            GlobalConst.notifDataNoUserInteraction = 'address';
          }

          if (GlobalConst.notifDataNoUserInteraction.length > 0) {
            if (GlobalConst.notifDataNoUserInteraction === 'service') {
              dispatch(setServiceRequestsActive([]));
              dispatch(setServiceRequestsHistory([]));
            }
            if (
              notif.fcm.action === null ||
              notif.fcm.action == 'fcm.ACTION.NOTIF'
            ) {
              navigate(GlobalConst.notifDataNoUserInteraction);
            }
          }

          // AsyncStorage.getItem("category").then((category) => {
          //   if(category !== null){
          //     GlobalConst.notifDataNoUserInteraction = category;
          //     if(GlobalConst.notifDataNoUserInteraction.length>0){
          //       if(GlobalConst.notifDataNoUserInteraction === 'service'){
          //         dispatch(setServiceRequestsActive([]))
          //         dispatch(setServiceRequestsHistory([]))
          //       }
          //       if(notif.fcm.action === null){
          //         navigate(GlobalConst.notifDataNoUserInteraction )
          //       }

          //     }
          //   }
          // })
          return;
        }
        utils.getCreds();
        if (
          notif !== undefined &&
          notif.category !== undefined &&
          notif.category.length > 0
        ) {
          if (notif.category === 'service') {
            dispatch(setServiceRequestsActive([]));
            dispatch(setServiceRequestsHistory([]));
          }
          GlobalConst.notifDataNoUserInteraction = notif.category;
          //AsyncStorage.setItem('category', GlobalConst.notifDataNoUserInteraction);
        }
        showLocalNotification(notif);
      });

      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
        console.log('TOKEN (refreshUnsubscribe)', token);
        if (token !== null) {
          GlobalConst.tokenUploadSuccess = false;
          GlobalConst.deviceId = token;
          if (GlobalConst.LoginToken.length > 0) {
            const headers = {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + '' + GlobalConst.LoginToken + '',
            };
            dispatch(uploadToken(headers));
          }
        }
      });
    }

    
  }, []);

  useEffect(() => {
    return () => {
      console.log('Unmount called');
      if (
        this.notificationListener !== undefined &&
        this.notificationListener !== null
      ) {
        this.notificationListener.remove();
      }
      if (
        this.refreshTokenListener !== undefined &&
        this.refreshTokenListener !== null
      ) {
        this.refreshTokenListener.remove();
      }
    };
  }, []);

  const showLocalNotification = notif => {
    try {
      if (notif && notif.fcm) {
        let body = '';
        let title = '';
        if (notif.fcm.body != null) {
          body = notif.fcm.body;
        }
        if (notif.fcm.title != null) {
          title = notif.fcm.title;
        }
        if (title.length === 0) {
          title = 'DrReddysDirect';
        }
        FCM.cancelAllLocalNotifications();
        FCM.presentLocalNotification({
          // channel: "CORE-S",
          channel: 'default',
          id: new Date().valueOf().toString(), // (optional for instant notification)
          //id:1,
          title: title,
          body: body,
          priority: 'high',
          // icon: "ic_notification",
          // large_icon: "ic_launcher",
          icon: 'ic_launcher', // as FCM payload, you can relace this with custom icon you put in mipmap
          color: 'white',
          sound: 'default',
          lights: true, // Android only, LED blinking (default false)
          show_in_foreground: true, // notification when app is in foreground (local & remote)
          local: true,
        });
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* <Stack.Navigator initialRouteName="ShippingAddresses"> */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ForgotPaassword"
          component={ForgotPaassword}
          options={navigationOptionHandler}></Stack.Screen>
        {/* <Stack.Screen name= 'CapchaVerification' component={CapchaVerification} options={navigationOptionHandler}></Stack.Screen> */}
        <Stack.Screen
          name="HomeWithoutLogin"
          component={HomeWithoutLogin}
          options={navigationOptionHandler}></Stack.Screen>
        {/* <Stack.Screen name= 'MenuTab' component={DrawerNavigator} options={navigationOptionHandler}></Stack.Screen> */}
        <Stack.Screen
          name="MenuTab"
          component={TabNavigator}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="MenuTabWithoutLogin"
          component={TabNavigatorWithoutLogin}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="AllProducts"
          component={AllProducts}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ProductDetailConfigurable"
          component={ProductDetailConfigurable}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ErrorModal"
          component={ErrorModal}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="PasswordResetComplete"
          component={PasswordResetComplete}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ShippingAddresses"
          component={ShippingAddresses}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Medication"
          component={Medication}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Theraputic"
          component={Theraputic}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="MyCart"
          component={MyCart}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="AccountInfo"
          component={AccountInfo}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="BusinessInfo"
          component={BusinessInfo}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="CompanyInfo"
          component={CompanyInfo}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="TradeInfo"
          component={TradeInfo}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="BankInfo"
          component={BankInfo}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="MyOrder"
          component={MyOrder}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Help"
          component={Help}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetail}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="WishList"
          component={WishList}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Brands"
          component={Brands}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ServiceRequest"
          component={ServiceRequest}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Tracking"
          component={Tracking}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ViewRequests"
          component={ViewRequests}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="PrivacyMore"
          component={PrivacyMore}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Invoices"
          component={Invoices}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="ContactUs"
          component={ContactUs}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Resources"
          component={Resources}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="AllProductsName"
          component={AllProductsName}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="AllProductsNDC"
          component={AllProductsNDC}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="TermsGeneral"
          component={TermsGeneral}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="EULA"
          component={EULA}
          options={navigationOptionHandler}></Stack.Screen>
        <Stack.Screen
          name="Subscription"
          component={Subscription}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="ScanTest"
          component={ScanTest}
          options={navigationOptionHandler}></Stack.Screen>
        
        <Stack.Screen
          name="CustomScanner"
          component={CustomScanner}
          options={navigationOptionHandler}></Stack.Screen>  
        
        <Stack.Screen
          name="CustomeLocation"
          component={CustomeLocation}
          options={navigationOptionHandler}></Stack.Screen>  

        <Stack.Screen
          name="BarCodeScanner"
          component={BarCodeScanner}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="MyCartAddress"
          component={MyCartAddress}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="ChangeLocationAddress"
          component={ChangeLocationAddress}
          options={navigationOptionHandler}></Stack.Screen>

        <Stack.Screen
          name="ChangeAddress"
          component={ChangeAddress}
          options={navigationOptionHandler}></Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
