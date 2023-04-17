import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import PropTypes from 'prop-types';
import colors from '../../config/Colors';

const CustomCheckBoxGroup = props => {
  const findBackgroundColor = item => {
    if (props.selectedValues.includes(item.AnswerOpID)) {
      return colors.lightGrey;
    }
    return colors.white;
  };

  const findCheckStatus = item => {
    var status = false;
    const index = props.selectedValues.findIndex(
      answerOptionId => answerOptionId === item.AnswerOpID,
    );
    if (index !== -1) {
      status = true;
    } else {
      status = false;
    }

    return status;
  };

  const findRadioOptionTextColor = item => {
    if (props.selectedValues.includes(item.AnswerOpID)) {
      return colors.black;
    }
    return colors.darkGrey;
  };

  return (
    <View>
      {props.content.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.AnswerOpID.toString()}
            onPress={() => props.onClick(item, index)}>
            <View
              style={[
                styles.buttonContainer,
                {backgroundColor: findBackgroundColor(item)},
              ]}>
              <CheckBox
                style={{
                  height: props.size,
                  width: props.size,
                  alignSelf: 'center',
                }}
                onClick={() => props.onClick(item, index)}
                isChecked={findCheckStatus(item)}
                checkBoxColor={props.color}
              />

              <Text
                style={[
                  styles.itemTextStyle,
                  {color: findRadioOptionTextColor(item)},
                ]}
                numberOfLines={2}>
                {item.AnswerOpValue}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

CustomCheckBoxGroup.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedValues: PropTypes.array,
};

CustomCheckBoxGroup.defaultProps = {
  size: 20,
  color: colors.primary,
  selectedValues: [],
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemTextStyle: {
    fontSize: 14,
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Light',
    marginLeft: 12,
    color: colors.darkGrey,
  },
});

export default CustomCheckBoxGroup;
