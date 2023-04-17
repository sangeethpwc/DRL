import React, {Component} from 'react';
import Loader from '../customviews/Loader';

const withCommonValidation = Comp => ({isLoading, children, ...props}) => {
  return (
    <Comp {...props}>
      {isLoading && <Loader />}
      {children}
    </Comp>
  );
};

export default withCommonValidation;
