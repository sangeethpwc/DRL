import {StyleSheet} from 'react-native';
import colors from '../../config/Colors';
import Colors from '../../config/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.lightBlue,
  },
  containerHTML5: {
    marginTop: 40,
    padding: 20,
  },
  containerForgotPassword: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  buttonTextUnSelected: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 14,
    color: Colors.blue,
    textAlign: 'center',
    marginRight: 10,
    textAlignVertical: 'center',
    fontFamily: 'DRLCircular-Book',
  },
  button: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: Colors.blue,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  input: {
    borderBottomWidth: 0.5,
    borderColor: Colors.white,
    // backgroundColor: Colors.textInputBackgroundColor,

    color: colors.white,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 25,
    marginBottom: 5,
    paddingBottom: 5,
    fontFamily: 'DRLCircular-Light',
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
    color: colors.white,
    fontFamily: 'DRLCircular-Light',
  },

  logo: {
    alignSelf: 'center',
  },

  loginView: {
    // backgroundColor: Colors.lightBlue,
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  loginInfoView: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: Colors.greyText,
    //  opacity: 0.05,
    // backgroundColor: '#FFFFFF',

    marginTop: 10,
  },

  loginHeaderText: {
    color: Colors.textColor,
    fontSize: 18,
    fontFamily: 'DRLCircular-Bold',
  },

  textStyle: {
    color: colors.white,
    marginTop: 15,
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
  },
  loginInfoText: {
    color: colors.white,
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'DRLCircular-Light',
  },

  bottomImage: {
    alignSelf: 'flex-end',
  },
  loginScrollView: {
    margin: 0,
  },
  activeIndicator: {
    // color: colors.white,
    // fontSize: 20,
    width: 25,
    height: 10,
    marginLeft: 2,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  indicator: {
    // color: colors.grey,
    // fontSize: 18,
    width: 10,
    height: 10,
    marginLeft: 2,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.grey,
  },
});

export default styles;
