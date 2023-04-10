import React from 'react';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
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
import ShippingAddresses from './ShippingAddresses';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const ShippingAddressesParent = props => {
  return (
    <ViewWithSpinner style={styles.container}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'Address Book'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />

        <ScrollView style={{backgroundColor: '#F6FBFF'}}>
          <ShippingAddresses />
        </ScrollView>
      </LinearGradient>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(ShippingAddressesParent);

export default ShippingAddressesParent;
