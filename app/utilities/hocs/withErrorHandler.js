import React, {useState, useEffect} from 'react';
import {axiosInstance} from '../../services/restApiConnector';
import {useHttpErrorHanlder} from '../hooks/useHttpErrorHanlder';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import ErrorModal from '../customviews/ErrorModal';

const withErrorHandler = WrappedComponent => {
  return props => {
    const [error, errorConfirmedHandler] = useHttpErrorHanlder(axiosInstance);
    return (
      <React.Fragment>
        <ErrorModal
          visible={error ? true : false}
          errorMessage={error ? error.message : ''}
          closeModal={errorConfirmedHandler}
        />
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };
};

export default withErrorHandler;
