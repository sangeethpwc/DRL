import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';

import styles from '../../config/common_styles';
import colors from '../../config/Colors';

const Loader = props => {
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={true}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color={colors.darkMaroon}
            size="large"
            animating={true}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
