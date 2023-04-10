import React, {useState, useEffect, useRef} from 'react';
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
  Modal,
  TouchableHighlight,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from '../authetication/login_style';
import styles2 from '../onboardingScreens/Onboarding_styles';
import {useSelector, useDispatch} from 'react-redux';

import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import CheckBox from '@react-native-community/checkbox';
import WebView from 'react-native-webview';
import decode from 'decode-html';
import {Dimensions} from 'react-native';
import HTML from 'react-native-render-html';
import ErrorModal from '../../utilities/customviews/ErrorModal';
import GlobalConst from '../../config/GlobalConst';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator,
} from 'react-native-best-viewpager';
import AsyncStorage from '@react-native-community/async-storage';
// import {useHttpErrorHanlder} from '../../utilities/hooks/useHttpErrorHanlder';
import {useNavigation} from '@react-navigation/native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

let ViewWithSpinner = withLoader(View);
var base64 = require('base-64');

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const images = [
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
  '../../images/sliderImage1.png',
];

const Onboarding = props => {
  const [active, setActive] = useState(0);
  const [i, setI] = useState(0);

  const navigation = useNavigation();

  const [gestureName, setGestureName] = useState('none');

  const dispatch = useDispatch();

  // const  loginData = useSelector((state) => state.authenticatedUser);

  const change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );

    if (slide !== active) {
      setActive(slide);
    }
  };

  function setUserStatus() {
    AsyncStorage.setItem('FIRST_TIME_USER', JSON.stringify('FIRST_TIME_USER'));
  }

  function renderView(img_url) {
    return (
      <View>
        {img_url === 0 && (
          <View style={styles2.box}>
            <Image
              source={require('../../images/Splash/1_big.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
            <Text style={styles2.titleText}>Rich list of medicines</Text>
            <Text style={styles2.bodyText}>
              We have 10,000+ Branded & Generic medicines
            </Text>
          </View>
        )}

        {img_url === 1 && (
          <View style={styles2.box}>
            <Image
              source={require('../../images/Splash/2_big.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
            <Text style={styles2.titleText}>Up to 60% off on shortdated</Text>
            <Text style={styles2.bodyText}>
              We have provide discounts on shortdated products
            </Text>
          </View>
        )}

        {img_url === 2 && (
          <View style={styles2.box}>
            <Image
              source={require('../../images/Splash/3_big.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
            <Text style={styles2.titleText}>Trusted by millions</Text>
            <Text style={styles2.bodyText}>
              More than 10,000+ Hospitals, 50 ,000+ Doctors and many
              professionals trust us
            </Text>
          </View>
        )}

        {img_url === 3 && (
          <View style={styles2.box}>
            <Image
              source={require('../../images/Splash/4_big.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
            <Text style={styles2.titleText}>Great Transparency</Text>
            <Text style={styles2.bodyText}>
              More than 10,000+ Hospitals, 50 ,000+ Doctors and many
              professionals trust us
            </Text>
          </View>
        )}

        {img_url === 4 && (
          <View style={styles2.box}>
            <Image
              source={require('../../images/Splash/5_big.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
            <Text style={styles2.titleText}>Quick Assistance</Text>
            <Text style={styles2.bodyText}>
              We provide dedicated sales representative for each customer
            </Text>
          </View>
        )}
      </View>
    );
  }

  function onSwipeUp(gestureState) {
    // this.setState({myText: 'You swiped up!'});
  }

  function onSwipeDown(gestureState) {
    // this.setState({myText: 'You swiped down!'});
  }

  function onSwipeLeft(gestureState) {
    if (i !== 4) {
      setI(i + 1);
    }

    //     this.setState({myText: 'You swiped left!'});
  }

  function onSwipeRight(gestureState) {
    if (i !== 0) {
      setI(i - 1);
    }

    // this.setState({myText: 'You swiped right!'});
  }

  function onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    setGestureName(gestureName);
    switch (gestureName) {
      case SWIPE_UP:
        // this.setState({backgroundColor: 'red'});
        break;
      case SWIPE_DOWN:
        // this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        if (i !== 4) {
          setI(i + 1);
        }
        // this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        // this.setState({backgroundColor: 'yellow'});
        if (i !== 0) {
          setI(i - 1);
        }

        break;
    }
  }

  return (
    <ViewWithSpinner
      style={[styles.container, {height: '100%'}]}
      //  isLoading={loginData.isLoading}
    >
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      {/* {loginData !== undefined && _.isEmpty(loginData.apiAccessToken) ?getAccessToken(): null} */}

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center', marginLeft: 20}}>
          <Image source={require('../../images/logo.png')} />
        </View>

        <TouchableOpacity
          onPress={() => {
            setUserStatus();
            navigation.replace('Login');
          }}
          style={{marginRight: 20, width: 50}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'DRLCircular-Bold',
              fontSize: 16,
            }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          margin: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '80%',
        }}>
        {/* <View style={{alignItems:'center',marginBottom:20}}><Image source={require('../../images/logo.png')} /></View> */}

        <View style={{width: '100%', marginTop: 20}}>
          <GestureRecognizer
            onSwipe={(direction, state) => onSwipe(direction, state)}
            onSwipeUp={state => onSwipeUp(state)}
            onSwipeDown={state => onSwipeDown(state)}
            onSwipeLeft={state => onSwipeLeft(state)}
            onSwipeRight={state => onSwipeRight(state)}
            // config={config}
          >
            {renderView(i)}
          </GestureRecognizer>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {images.map((p, k) => {
              //    <Text key={k} style={k===i ? styles.activeIndicator : styles.indicator}>⬤ </Text>
              if (k === i) {
                return <View style={styles.activeIndicator}></View>;
              } else {
                return <View style={styles.indicator}></View>;
              }
            })}
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          {i < 4 ? (
            <TouchableOpacity
              onPress={() => {
                setI(i + 1);
              }}
              full
              style={[styles.loginButton, {width: '80%'}]}>
              <Text uppercase={false} style={styles.buttonText}>
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setUserStatus();
                navigation.replace('Login');
              }}
              full
              style={[styles.loginButton, {width: '80%'}]}>
              <Text uppercase={false} style={styles.buttonText}>
                Let's Start
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{position: 'absolute', right: 0, bottom: 0, marginBottom: -50}}>
        <Image source={require('../../images/groups.png')} />
      </View>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(Onboarding);

// errorHandledComponent.navigationOptions = ({navigation}) => {
//   return {headerShown: false};
// };
// export default errorHandledComponent;
export default Onboarding;
