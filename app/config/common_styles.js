import {StyleSheet, Dimensions} from 'react-native';
import colors from './Colors';

export default StyleSheet.create({
  navHeaderStyle: {
    backgroundColor: colors.primary,
  },
  navHeaderTitleStyle: {
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
