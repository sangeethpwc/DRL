import React from 'react';

import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import withLoader from '../../utilities/hocs/LoaderHOC';
import styles from '../home/home_style';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import _ from 'lodash';
import ChangeAddress from './ChangeAddress';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const ChangeLocationAddress = props => {
  return (
    <ViewWithSpinner style={styles.container}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'Change Location'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />

        <ScrollView style={{height: '100%',backgroundColor: '#F6FBFF'}}>
          <ChangeAddress />
        </ScrollView>
      </LinearGradient>
    </ViewWithSpinner>
  );
};

export default ChangeLocationAddress;
