import React, {Component} from 'react';
import {View, Text, Card} from 'native-base';
import {Platform, StyleSheet} from 'react-native';
import RadioGroup from './CustomRadioGroup';
import colors from '../../config/Colors';
import _ from 'lodash';

const SingleChoiceContainer = React.memo(props => {
  const onChoiceSelected = item => {
    props.selectSingleChoiceItem(item, props.index);
  };

  const findAnswer = () => {
    var selectedAnswer = '';
    if (!_.isEmpty(props.item.AnswerSubmitted)) {
      selectedAnswer = props.item.AnswerSubmitted[0];
    }
    return selectedAnswer;
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
            numberOfLines={5}>
            {props.item.Question}
          </Text>

          <View style={localStyle.divider} />

          <RadioGroup
            onClick={onChoiceSelected}
            selectedValue={findAnswer()}
            content={props.item.AnswerOptions}></RadioGroup>
        </View>
      </Card>
    </View>
  );
});

export default SingleChoiceContainer;

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
});
