import {useState, useEffect} from 'react';
import {getApiAccessTokenGeneral} from '../../services/operations/getToken';
import {setErrorCode, setErrorCodeFailed} from '../../slices/productSlices';
import {useDispatch} from 'react-redux';
import GlobalConst from '../../config/GlobalConst';

export function useHttpErrorHanlder(axiosInstance) {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const reqInterceptor = axiosInstance.interceptors.request.use(req => {
    console.log('Check here hi 1...........');
    setError(null);
    return req;
  });

  const resInterceptor = axiosInstance.interceptors.response.use(
    response => {
      console.log('Check here hi 2...........');
      // if(response.status === 401) {
      //
      //     response.status = 401;
      // }
      // dispatch(setErrorCode(response.status));
      if (response.status !== undefined) {
        console.log('Check here hi 3...........', JSON.stringify(response));
        GlobalConst.errorStatus = response.status;
      }

      return response;
    },
    error => {
      console.log('Check here hi 4...........');
      if (error.response && error.response.data && error.response.status) {
        console.log('Check here hi 5...........', JSON.stringify(error));
        //
        // dispatch(setErrorCode(error.response.status));
        GlobalConst.errorStatus = error.response.status;
        // if(error.response.status !== 401){
        //     //getApiAccessTokenGeneral();
        //    // setError( error);
        // }
        // else{
        //    // return Promise.reject(error.response);
        // }
      }
      return Promise.resolve({error});
    },
  );

  // const resInterceptor = axiosInstance.interceptors.response.use(res => res, err => {
  //

  //     setError(Promise.resolve({ err }));
  // });

  useEffect(() => {
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [reqInterceptor, resInterceptor]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler, setError];
}
