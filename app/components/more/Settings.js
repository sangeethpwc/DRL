import React, {useState} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import colors from '../../config/Colors';
import CustomeHeader from '../../config/CustomeHeader';
import {useSelector, useDispatch} from 'react-redux';
import GlobalConst from '../../config/GlobalConst';

export function Settings({props}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#F6FBFF'}}>
      <CustomeHeader
        back={'back'}
        title={'Settings'}
        isHome={false}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />
      <View
        style={{
          marginTop: 20,
          backgroundColor: colors.white,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 10,
          borderWidth: 0.1,
          borderRadius: 5,
          borderBottomWidth: 0.4,
          borderTopWidth: 0.2,
          padding: 10,
          borderColor: colors.grey,
        }}>
        {/* <View style={{flexDirection:'row',justifyContent:'space-between',paddingBottom:50,borderBottomWidth:0.7,borderColor:colors.textColor}}>
           <Text style={{fontFamily:'DRLCircular-Bold', fontSize:20}}> Allow Notifications  </Text>
           <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
        </View> */}

        <View
          style={{
            paddingTop: 30,
            paddingBottom: 30,
            borderBottomWidth: 0.7,
            borderColor: colors.textColor,
          }}>
          <Text
            style={{
              fontFamily: 'DRLCircular-Bold',
              fontSize: 20,
              marginBottom: 50,
            }}>
            About the app
          </Text>
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
            Version : {GlobalConst.AppVersion}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    height: 35,
    justifyContent: 'center',
  },
});

export default Settings;
