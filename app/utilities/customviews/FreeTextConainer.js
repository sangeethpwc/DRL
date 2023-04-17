import React from 'react';
import {View, Text, Card} from 'native-base';
import {Platform, StyleSheet, TextInput} from 'react-native';
import colors from '../../config/Colors';
import _ from 'lodash';

const FreeTextContainer = React.memo(props => {
  const onTextEntered = answerValue => {
    props.enteringFreeText(answerValue, props.index);
  };

  const getAnswer = () => {
    return _.isEmpty(props.item.AnswerSubmitted)
      ? ''
      : props.item.AnswerSubmitted[0].AnswerOpValue;
  };

  return (
    <View
      style={[localStyle.container, {flex: 1}]}
      pointerEvents={props.item.IsEditable ? 'auto' : 'none'}>
      <Card>
        <View>
          <Text
            allowFontScaling={false}
            style={localStyle.titleTextStyle}
            adjustsFontSizeToFit={true}
            numberOfLines={3}>
            {props.item.Question}
          </Text>

          <View style={localStyle.divider} />

          <TextInput
            style={[localStyle.textinputViewStyle, {height: 50}]}
            underlineColorAndroid="transparent"
            textAlignVertical={'top'}
            multiline={true}
            autoCorrect={true}
            maxLength={5000}
            onChangeText={text => onTextEntered(text)}
            value={getAnswer()}
            placeholder="Write your answer"></TextInput>
        </View>
      </Card>
    </View>
  );
});

const localStyle = StyleSheet.create({
  container: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  titleTextStyle: {
    fontSize: 14,
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Light',
    color: colors.black,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 8,
  },
  subTitleTextStyle: {
    fontSize: 12,
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Light',
    color: colors.darkGrey,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.darkGrey,
  },
  textinputViewStyle: {
    padding: 8,
    width: '100%',
    backgroundColor: '#d6d7da',
  },
});

export default FreeTextContainer;
