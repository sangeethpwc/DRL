import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../components/home/HomeWithoutLogin';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import colors from './Colors';
import Drawer from '../components/more/MoreComponent';
import Help from '../components/help/Help1';
import CategoryTab from '../components/Category/CategoryTab';
import {uploadToken} from '../services/operations/getToken';
import GlobalConst from './GlobalConst';
import {useDispatch} from 'react-redux';

const Tab = createBottomTabNavigator();

function renderIcon(label, isFocused) {
  switch (label) {
    case 'Home':
      return isFocused ? (
        <Image
          source={require('../images/TabNavigator_assets/png/white/home-w.png')}
        />
      ) : (
        <Image
          source={require('../images/TabNavigator_assets/png/Grey/home-g.png')}
        />
      );

    case 'Category':
      return isFocused ? (
        <Image
          source={require('../images/TabNavigator_assets/png/white/category-w.png')}
        />
      ) : (
        <Image
          source={require('../images/TabNavigator_assets/png/Grey/category-g.png')}
        />
      );

    case 'My Wishlist':
      return isFocused ? (
        <Image
          source={require('../images/TabNavigator_assets/png/white/fav-w.png')}
        />
      ) : (
        <Image
          source={require('../images/TabNavigator_assets/png/Grey/fav-g.png')}
        />
      );

    case 'Help':
      return isFocused ? (
        <Image
          source={require('../images/TabNavigator_assets/png/white/help-w.png')}
        />
      ) : (
        <Image
          source={require('../images/TabNavigator_assets/png/Grey/help-g.png')}
        />
      );

    case 'More':
      return isFocused ? (
        <Image
          source={require('../images/TabNavigator_assets/png/white/more-w.png')}
        />
      ) : (
        <Image
          source={require('../images/TabNavigator_assets/png/Grey/more-g.png')}
        />
      );

    default:
      return (
        <Image
          source={require('../images/TabNavigator_assets/Favourite.png')}
        />
      );
  }
}

function renderBackGround(isFocused) {
  if (isFocused) {
    return (
      <Image
        source={require('../images/TabNavigator_assets/Union_1.png')}
        style={{
          flex: 1,
          position: 'absolute',
          resizeMode: 'cover',
        }}></Image>
    );
  } else {
    return null;
  }
}

function MyTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const dispatch = useDispatch();

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const firebaseCrashTesting = () => {
    try {
      throw new Error('my error');
    } catch (error) {
      crashlytics().recordError(error);
    } finally {
      crashlytics().crash();
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: colors.white,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }

          if (
            GlobalConst.LoginToken.length > 0 &&
            GlobalConst.deviceId !== null &&
            GlobalConst.deviceId.length > 0 &&
            GlobalConst.tokenUploadSuccess === false
          ) {
            const headers = {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + '' + GlobalConst.LoginToken + '',
            };
            dispatch(uploadToken(headers));
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <View
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.white,
              }}>
              {renderBackGround(isFocused)}
              {renderIcon(label, isFocused)}
              <Text
                style={{
                  color: isFocused ? colors.white : colors.blue,
                  fontSize: 10,
                  marginTop: 2,
                }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} dispatch />}>
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen name="Category" component={CategoryTab}></Tab.Screen>
      <Tab.Screen name="Help" component={Help}></Tab.Screen>
      <Tab.Screen name="More" component={Drawer}></Tab.Screen>
    </Tab.Navigator>
  );
}
export default TabNavigator;
