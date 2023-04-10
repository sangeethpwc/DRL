import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';
import GlobalConst from '../../config/GlobalConst';
import {Dimensions} from 'react-native';

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const styles = StyleSheet.create({
  /////////////////
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
  },

  labelRed: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: colors.black,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },

  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white',
  },
  radiusMaskEven: {
    backgroundColor: colors.black,
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  textContainerEven: {
    backgroundColor: colors.black,
  },
  title: {
    color: colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  titleEven: {
    color: 'white',
  },
  subtitle: {
    marginTop: 6,
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic',
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  /////////////////////
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  container2: {
    marginTop: 20,
    flexDirection: 'column',
    width: '50%',
  },
  containerForgotPassword: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  button: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 50,
    marginRight: 50,
    borderColor: colors.white,
    borderWidth: 1,
  },

  recentOrderUnselected: {
    backgroundColor: colors.lightBlue,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: GlobalConst.DeviceWidth / 2,
    right: 10,
    position: 'absolute',
    height: 47,
    marginTop: 52,
    marginRight: 10,
    borderColor: colors.white,
    borderWidth: 0.5,
  },

  recentOrderSelected: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: GlobalConst.DeviceWidth / 2,
    right: 10,
    position: 'absolute',
    height: 47,
    marginTop: 52,
    marginRight: 10,
    borderColor: colors.white,
    borderWidth: 0.5,
  },

  upcomingDeliverySelected: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: GlobalConst.DeviceWidth / 2 + 10,
    height: 50,
    position: 'absolute',
    marginTop: 50,
    left: 10,
    borderColor: colors.darkGrey,
    borderWidth: 1,
  },

  upcomingDeliveryUnSelected: {
    backgroundColor: colors.lightBlue,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: GlobalConst.DeviceWidth / 2 + 10,
    height: 47,
    marginTop: 52,
    position: 'absolute',
    left: 10,
    borderColor: colors.white,
    borderWidth: 0.5,
  },

  buttonHalf2: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: '50%',
  },

  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'DRLCircular-Book',
  },

  buttonTextSelected: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 8,
    color: Colors.lightBlue,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'DRLCircular-Book',
  },

  buttonTextUnSelected: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 8,
    color: Colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'DRLCircular-Book',
  },

  buttonTextBlue: {
    fontFamily: 'Roboto-Regular',
    fontSize: 8,
    color: Colors.blue,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'DRLCircular-Book',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: Colors.textInputBorderColor,
    backgroundColor: Colors.textInputBackgroundColor,
    borderRadius: 50,
    color: Colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: 'center',
    width: '90%',
  },

  searchInputAbsolute: {
    zIndex: 1,
    position: 'absolute',
    top: Platform.OS === 'android' ? 90 : 100,
    width: '100%',
  },

  searchInputBorder: {
    color: Colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 40,
    justifyContent: 'center',
  },

  searchInputSquare: {
    borderWidth: 1,
    borderColor: Colors.textInputBorderColor,
    backgroundColor: Colors.textInputBackgroundColor,
    borderRadius: 5,
    color: Colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 40,
    justifyContent: 'center',
  },

  floatingItem: {
    marginBottom: 16,
  },

  titleText: {
    fontFamily: 'Roboto-Light',
    color: Colors.primary,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 25,
    marginTop: 16,
  },

  greyText: {
    fontFamily: 'Roboto-Light',
    color: Colors.grey,
  },

  logo: {
    alignSelf: 'center',
  },

  loginView: {
    backgroundColor: Colors.white,
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  loginInfoView: {
    backgroundColor: colors.blue,
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.greyText,
    //opacity: 0.05,
  },

  loginHeaderText: {
    color: Colors.textColor,
    fontSize: 18,
  },

  textStyle: {
    color: Colors.textColor,
    marginTop: 15,
  },
  loginInfoText: {
    color: colors.white,
    fontSize: 12,
    marginBottom: 5,
  },

  bottomImage: {
    alignSelf: 'flex-end',
  },
  homeLinearGradient: {
    margin: 0,
    height: '100%',
    width: '100%',
  },
  homeScrollView: {},
  viewPager: {
    width: '100%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },

  indicator: {
    color: colors.grey,
    fontSize: 18,
  },

  indicatorRewards: {
    width: 10,
    height: 10,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 14 / 2,
    backgroundColor: colors.grey,
  },
  activeIndicator: {
    color: colors.blue,
    fontSize: 20,
  },
  activeIndicatorRewards: {
    width: 25,
    height: 10,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },

  activeIndicatorNews: {
    width: 25,
    height: 20,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  textWhiteStyle: {
    color: Colors.white,
    width: '40%',
    marginTop: 5,
    fontFamily: 'DRLCircular-Light',
    fontSize: 14,
    // position: 'absolute'
  },

  textWhite: {
    color: Colors.deepGrey,
    fontFamily: 'DRLCircular-Light',
    fontSize: 16,
    margin: 20,
    // position: 'absolute'
  },

  textBold: {
    color: Colors.textColor,
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,

    // position: 'absolute'
  },

  textLight: {
    color: Colors.textColor,
    fontFamily: 'DRLCircular-Light',
    fontSize: 16,
  },

  textBlue: {
    color: Colors.blue,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
    marginTop: 10,
  },

  paginationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  paginationDotSmall: {
    width: 15,
    height: 15,
    borderRadius: 10,
  },
  activeIndicatorRewardsSmalll: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.blue,
  },

  paginationDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  modal4: {
    height: 400,
  },
  modal: {},
  header: {
    width: '100%',
    height: 50,
    borderBottomWidth: 0.2,
    borderColor: colors.lightGrey,
  },

  headerCart: {
    flexDirection: 'column',
    width: '60%',
  },

  headerText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 20,
    top: 15,
    left: 20,
    position: 'absolute',
    color: colors.darkGrey,
  },

  headerTextCart: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 20,
    color: colors.darkGrey,
  },

  clearAllText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 14,
    color: colors.blue,
  },

  labelText: {
    color: colors.textColor,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },

  labelTextSelected: {
    color: colors.white,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },

  labelSelected: {
    backgroundColor: colors.blue,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
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

  buttonUnselected: {
    width: 150,
    height: 50,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderWidth: 1,
  },

  buttonSelected: {
    width: 150,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },
  blackTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.textColor,
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
  checkbox: {
    alignSelf: 'center',
    height: 20,
    marginRight: 5,
  },
  greyTextSmall: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 18,
    color: colors.darkGrey,
  },
  labelGreen: {
    backgroundColor: 'rgba(93, 241, 193,0.2)',
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenLight: {
    fontFamily: 'DRLCircular-Book',
    color: 'rgba(0, 162, 109,0.8)',
  },

  //.....................
  label: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: colors.textColor,
  },

  input2: {
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
    width: '90%',
  },
  //......................
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: '100%',
    paddingHorizontal: 8,
  },
  input: {maxHeight: 40},
  inputContainer: {
    display: 'flex',
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c7c6c1',
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: '5%',
    width: '100%',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  plus: {
    position: 'absolute',
    left: 15,
    top: 10,
  },
  //......................
});

export default styles;
