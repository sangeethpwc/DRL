import React from 'react';
import {StatusBar, Text, View, TouchableOpacity} from 'react-native';
import styles from './login_style';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
import {useDispatch} from 'react-redux';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Colors from '../../config/Colors';
import {useNavigation} from '@react-navigation/native';
import {getTokenFailure} from '../../slices/authenticationSlice';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;

const PasswordResetComplete = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <ViewWithSpinner
      style={{backgroundColor: Colors.lightBlue, height: '100%'}}
      isLoading={false}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <View
        style={{
          margin: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Text style={[styles.textStyle, {fontSize: 26, marginBottom: 40}]}>
          Email has been sent
        </Text>
        <Text style={styles.textStyle}>{props.route.params.email}</Text>
        <Text style={styles.textStyle}>
          Please check your inbox and click on the link to reset the password
        </Text>

        <TouchableOpacity
          onPress={() => {
            //dispatch(getTokenFailure(false))
            navigation.replace('Login');
          }}
          full
          style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ViewWithSpinner>
  );
};
export default PasswordResetComplete;
