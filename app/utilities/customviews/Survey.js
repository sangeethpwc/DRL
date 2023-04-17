import React, {Component} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import SingleChoiceContainer from '../../utilities/customviews/SingleChoiceContainer';
import MultiChoiceContainer from '../../utilities/customviews/MultiChoiceContainer';
import FreeTextContainer from '../../utilities/customviews/FreeTextConainer';
import _ from 'lodash';
import * as constants from '../../utilities/Constants';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

const Survey = props => {
  const keyExtractor = (item, index) => item.QuesId.toString();

  const renderItem = ({item, index}) => {
    return (
      <View>
        {item.AnswerType === constants.ANSWER_TYPE_SINGLE && (
          <SingleChoiceContainer
            item={item}
            index={index}
            selectSingleChoiceItem={props.onSelectingSingleChoiceItem}
          />
        )}
        {item.AnswerType === constants.ANSWER_TYPE_MULTIPLE && (
          <MultiChoiceContainer
            item={item}
            index={index}
            selectMultipleChoiceItem={props.onSelectingMultipleChoiceItem}
          />
        )}
        {item.AnswerType === constants.ANSWER_TYPE_TEXT && (
          <FreeTextContainer
            item={item}
            index={index}
            enteringFreeText={props.onEnteringFreeText}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{margin: 8}}
        data={props.questions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Survey;
