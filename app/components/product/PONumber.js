import React, {Component} from 'react';
import {TextInput, View, Text} from 'react-native';
import colors from '../../config/Colors';

export default function PONumber(props) {
  const [value, setPO] = React.useState({props}.props.poValue);

  function onChangeText(po) {
    setPO(po);
    props.setPONumber(po);
  }

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View
        style={{
          borderWidth: 1,
          width: '90%',
          borderColor: colors.lightGrey,
          borderRadius: 10,
          marginLeft: 10,
          paddingLeft: 5,
          paddingRight: 5,
        }}>
        <TextInput
          style={{marginRight: 25, height: 40, fontFamily: 'DRLCircular-Book'}}
          onChangeText={po => onChangeText(po)}
          value={value}
          placeholder="Enter PO No."
          placeholderTextColor={colors.placeholderColor}
        />
      </View>
      <Text style={{color: 'red', fontSize: 24, marginRight: 10}}> *</Text>
    </View>
  );
}
