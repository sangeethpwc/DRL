import React, {useState, useEffect} from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../config/common_styles';
import colors from '../../config/Colors';

const LoaderCustome = props => {
  const productData = useSelector(state => state.product);
  const profileData = useSelector(state => state.profile);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    //
    if (productData.isLoading && !loader) {
      setLoader(true);
    }
    if (!productData.isLoading && loader) {
      setLoader(false);
    }
  }, [productData.isLoading]);

  useEffect(() => {
    //
    if (profileData.isLoading && !loader) {
      setLoader(true);
    }
    if (!profileData.isLoading && loader) {
      setLoader(false);
    }
  }, [profileData.isLoading]);

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loader}
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

export default LoaderCustome;
