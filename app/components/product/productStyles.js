import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';
import homeStyles from '../home/home_style';

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderColor: colors.lightGrey,
  },
  footer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.shopCategoryBackground,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 20,
    color: colors.darkGrey,
    marginTop: 20,
    marginLeft: 20,
  },

  mediumText: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 14,
    color: colors.blue,
    marginRight: 20,
    marginTop: 20,
  },

  container: {
    flexDirection: 'row',
    height: '100%',
  },

  input: {
    textAlignVertical: 'top',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    // justifyContent:'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
  },
  
  categoryContainer: {
    width: '40%',
    borderRightWidth: 0.1,
    borderColor: colors.textColor,
    paddingTop: 10,
  },
  itemsContainer: {
    width: '60%',
    backgroundColor: colors.whiteGradient,
    paddingTop: 10,
    paddingBottom: 10,
  },
  categoriesViewUnselected: {
    justifyContent: 'center',
    paddingLeft: 10,
    textAlign: 'left',
    height: 50,
  },
  categoriesViewSelected: {
    justifyContent: 'center',
    paddingLeft: 10,
    textAlign: 'left',
    height: 50,
    backgroundColor: colors.whiteGradient,
  },
  itemsView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-around',
    paddingLeft: 10,
    textAlign: 'left',
    height: 30,
    margin: 5,
  },
  blackTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.textColor,
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },
  whiteTextMediumSelected: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: colors.textColor,
  },
  greyTextSmall: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 14,
    color: colors.darkGrey,
  },
  checkbox: {
    alignSelf: 'center',
    height: 20,
    marginRight: 5,
  },

  buttonSelected: {
    width: 150,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnselected: {
    width: 150,
    height: 50,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderWidth: 1,
  },

  titleText: {
    color: colors.textColor,
    fontSize: 26,
    fontFamily: 'DRLCircular-Bold',
  },
  paddedView: {
    padding: 10,
    borderColor: colors.grey,
    borderBottomWidth: 0.4,
  },

  productDetailViews: {justifyContent: 'center', marginBottom: 10},

  lightText: homeStyles.textLight,

  boldText: {
    fontSize: 18,
    marginTop: 5,
    color: colors.textColor,
    fontFamily: 'DRLCircular-Bold',
  },

  greenBold: {
    fontFamily: 'DRLCircular-Bold',
    color: 'rgba(0, 162, 109,0.8)',
  },
  greenLight: {
    fontFamily: 'DRLCircular-Book',
    color: 'rgba(0, 162, 109,0.8)',
  },

  labelGreen: {
    backgroundColor: 'rgba(93, 241, 193,0.2)',
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRed: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewSelected: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.blue,
  },
  viewUnselected: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn: {
    margin: 10,
    backgroundColor: '#3B5998',
    color: 'white',
    padding: 10,
  },
  modal2: {
    height: 230,
    backgroundColor: '#3B5998',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal4: {
    height: 300,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },

  generalSection: {
    backgroundColor: colors.whiteGradient,
    margin: 10,
    marginTop: 40,
  },

  blueText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.blue,
  },
});

export default styles;
