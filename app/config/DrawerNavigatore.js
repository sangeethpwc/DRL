import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../components/home/Home';
import ShippingAddresses from '../components/myProfile/ShippingAddresses';
import colors from './Colors';
import GlobalConst from '../config/GlobalConst';
import DrawerContent from '../config/DrawerContent';
import TabNavigator from '../config/TabNavigator';

const Drawer = createDrawerNavigator();

function DrawerNavigator({props}) {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.drawerColor,
        width: GlobalConst.DeviceWidth - 50,
      }}
      drawerContent={props => (
        <DrawerContent {...props} style={{height: 20}} />
      )}>
      <Drawer.Screen
        style={{backgroundColor: colors.blue}}
        name="Home"
        component={TabNavigator}></Drawer.Screen>
      {/* <Drawer.Screen style ={{backgroundColor: colors.blue}} name= 'Home' component={Home}></Drawer.Screen> */}
      <Drawer.Screen
        style={{backgroundColor: colors.blue}}
        name="Dashboard"
        component={TabNavigator}></Drawer.Screen>
      <Drawer.Screen
        style={{backgroundColor: colors.blue}}
        name="Settings"
        component={Home}></Drawer.Screen>
      <Drawer.Screen
        style={{backgroundColor: colors.blue}}
        name="MyProfile"
        component={TabNavigator}></Drawer.Screen>
      <Drawer.Screen
        style={{backgroundColor: colors.blue}}
        name="ShippingAddresses"
        component={ShippingAddresses}></Drawer.Screen>
    </Drawer.Navigator>
  );
}
export default DrawerNavigator;
