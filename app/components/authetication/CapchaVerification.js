import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';

const siteKey = '6Lf41K0UAAAAAHd3FeZbJsMbL00-Beqyk33NHqtp';
const baseUrl = 'https://google.com';

export default class CapchaVerification extends React.Component {
  state = {
    code: null,
  };
  onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        
        this.setState({code: event.nativeEvent.data});
        setTimeout(() => {
          this.captchaForm.hide();
          // do what ever you want here
        }, 1500);
      }
    }
  };

  render() {
    let {code} = this.state;
    return (
      <View style={styles.container}>
        <ConfirmGoogleCaptcha
          ref={_ref => (this.captchaForm = _ref)}
          siteKey={siteKey}
          baseUrl={baseUrl}
          languageCode="vi"
          onMessage={this.onMessage}
        />
        <TouchableOpacity
          onPress={() => {
            this.captchaForm.show();
          }}>
          <Text style={styles.paragraph}>Click</Text>
        </TouchableOpacity>
        {code && (
          <Text style={{alignSelf: 'center'}}>
            {`Your verification code is `}
            <Text style={{color: 'darkviolet', fontWeight: 'bold'}}>
              {code}
            </Text>
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
