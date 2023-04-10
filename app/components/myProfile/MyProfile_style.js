import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';
import GlobalConst from '../../config/GlobalConst';
import {Container} from 'native-base';

const styles = StyleSheet.create({
  lightText: {
    fontFamily: 'DRLCircular-Light',
    fontSize: 13,
    color: '#9A9A9A',
    lineHeight: 19,
    marginBottom: 13,
  },

  boldText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: '#434861',
    lineHeight: 23,
  },

  headingLabel: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: '#4F4F4F',
    lineHeight: 23,
  },

  infoContainer: {
    marginBottom: 30,
  },

  Container: {
    borderBottomWidth: 1.5,
    borderColor: '#80707070',
    borderStyle: 'dotted',
  },

  addButton: {
    width: 200,
    height: 50,
    borderColor: '#5225B5',
    borderWidth: 1.2,
    borderRadius: 25,
  },

  addButtonText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 14,
    color: '#5225B5',
  },
  shippingCards: {
    height: 250,
    width: '80%',
    backgroundColor: colors.white,
    alignSelf: 'center',
    shadowColor: '#5225B51A',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 40,
    borderWidth: 0.2,
  },

  primaryLabel: {
    backgroundColor: '#00A26D',
    height: 40,
    padding: 5,
    justifyContent: 'center',
  },

  textWhite: {
    fontFamily: 'DRLCircular-Book',
    color: colors.white,
    fontSize: 16,
  },
});

export default styles;
