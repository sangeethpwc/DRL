import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';
import GlobalConst from '../../config/GlobalConst';
import {Dimensions} from 'react-native';

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    marginTop: 20,
    fontFamily: 'DRLCircular-Bold',
    color: colors.white,
    fontSize: 26,
    textAlign: 'center',
    width: 300,
  },

  bodyText: {
    marginTop: 10,
    fontFamily: 'DRLCircular-Light',
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    width: 200,
  },
});

export default styles;
