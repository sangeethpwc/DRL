import React, {Component, useEffect, useState} from 'react';
import Loader from '../customviews/Loader';
import {useDispatch, useSelector} from 'react-redux';

const LoaderProduct = Comp => ({isLoading, children, ...props}) => {
  const productData = useSelector(state => state.product);
  const [isLoaading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(productData.isLoaading);
  }, [productData.isLoading]);

  return (
    <Comp {...props}>
      {isLoading && <Loader />}
      {children}
    </Comp>
  );
};

export default LoaderProduct;
