import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../config/Colors';

const CustomRadioGroup = props => {
  const findBackgroundColor = item => {
    if (item.AnswerOpID === props.selectedValue) {
      return colors.lightGrey;
    }
    return colors.white;
  };

  const findRadioOptionTextColor = item => {
    if (item.AnswerOpID === props.selectedValue) {
      return colors.black;
    }
    return colors.darkGrey;
  };

  return (
    <View>
      {props.content.map(item => {
        return (
          <TouchableOpacity
            key={item.AnswerOpID.toString()}
            onPress={() => props.onClick(item)}>
            <View
              style={[
                styles.buttonContainer,
                {backgroundColor: findBackgroundColor(item)},
              ]}>
              <View
                style={{
                  height: props.outerCircleSize,
                  width: props.outerCircleSize,
                  borderRadius: props.outerCircleSize / 2,
                  borderWidth: props.outerCircleBorder,
                  borderColor: props.outerCircleColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {props.selectedValue === item.AnswerOpID && (
                  <View
                    style={{
                      width: props.innerCircleSize,
                      height: props.innerCircleSize,
                      borderRadius: props.innerCircleSize / 2,
                      backgroundColor: props.innerCircleColor,
                    }}
                  />
                )}
              </View>

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

CustomRadioGroup.propTypes = {
  onClick: PropTypes.func.isRequired,
  innerCircleSize: PropTypes.number,
  outerCircleSize: PropTypes.number,
  outerCircleBorder: PropTypes.number,
  outerCircleColor: PropTypes.string,
  innerCircleColor: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedValue: PropTypes.string,
};

CustomRadioGroup.defaultProps = {
  innerCircleSize: 9,
  outerCircleSize: 18,
  outerCircleBorder: 1.5,
  outerCircleColor: colors.primary,
  innerCircleColor: colors.primary,
  selectedValue: '',
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

export default CustomRadioGroup;
