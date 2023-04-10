import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';

const styles = StyleSheet.create({
  titleText: {
    color: colors.darkGrey,
    fontFamily: 'DRLCircular-Bold',
    fontSize: 20,
  },

  lightText: {
    color: colors.textColor,
    fontFamily: 'DRLCircular-Book',
    fontSize: 18,
  },

  blueText: {
    color: colors.blue,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },

  faqcard: {
    backgroundColor: colors.whiteGradient,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  faqitem: {
    //height:70,
    //margin: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.textColor,
    paddingRight: 10,
  },

  button: {
    marginTop: 20,
    borderRadius: 25,
    borderColor: colors.blue,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 250,
    alignSelf: 'center',
  },

  serviceCard: {
    marginTop: 30,
    backgroundColor: colors.shopCategoryBackground,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 35,
    paddingTop: 25,
    paddingBottom: 25,
  },

  serviceCardItem: {
    flexDirection: 'row',
  },

  labelText: {
    color: colors.textColor,
    fontFamily: 'DRLCircular-Light',
    fontSize: 16,
  },
});

export default styles;
