import {
  getBannerSuccess,
  getBannerLoggedInSuccess,
  getBannerFailure,
  getAwardsSuccess,
  getAwardsFailure,
  fetchingData,
  getVoiceOfCustomersSuccess,
  getVoiceOfCustomersFailure,
  setFeatureProductsSuccess,
  setFeatureProductsFailed,
  setFAQdataSuccess,
  setFAQdataFailure,
  setVideoSuccess,
  setVideoFailure,
} from '../../slices/homesSlices';
import {requestConnector} from '../../services/restApiConnector';
import API_SERVICES from '../../services/ApiServicePath';
import GlobalConst from '../../config/GlobalConst';
import {fetchingDataDone} from '../../slices/productSlices';

export function getBanner() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.BANNER_URL,
        headers,
        null,
        {
          slider_id: '1',
        },
      );
      //
      dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data !== undefined &&
        response.data.length > 0
      ) {
        dispatch(getBannerSuccess(response.data));
      } else {
        dispatch(getBannerFailure());
      }
    } catch (err) {
      dispatch(getBannerFailure());
    }
  };
}

export function getBannerLoggedIn() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.BANNER_URL,
        headers,
        null,
        {
          slider_id: '2',
        },
      );
      //
      dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data !== undefined &&
        response.data.length > 0
      ) {
        dispatch(getBannerLoggedInSuccess(response.data));
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getAwards() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.AWARDS,
        headers,
        null,
        null,
      );

      dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        dispatch(getAwardsSuccess(response.data.items));
      } else {
        dispatch(getAwardsFailure());
      }
    } catch (err) {
      // dispatch(getAwardsSuccess("Failed"));
      dispatch(getAwardsFailure());
    }
  };
}

export function getVoiceCustomer() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.VOICE_OF_CUSTOMER,
        headers,
        null,
        null,
      );

      dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        dispatch(getVoiceOfCustomersSuccess(response.data.items));
      } else {
        dispatch(getVoiceOfCustomersFailure());
      }
    } catch (err) {}
  };
}
let featureProductFetching = false;
export function getFeatureProducts(value) {
  if (featureProductFetching === false) {
    return async dispatch => {
      try {
        featureProductFetching = true;
        dispatch(fetchingData());
        const headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + GlobalConst.LoginToken,
        };
        
        console.log(
          'featured prods..................',
          value,
        );

        const response = await requestConnector(
          'GET',
          API_SERVICES.FEATURE_PRODUCTS +
            value +
            '&searchCriteria[filterGroups][0][filters][0][conditionType]=like&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=visibility&searchCriteria[filterGroups][2][filters][0][value]=4&searchCriteria[filterGroups][2][filters][0][condition_type]=in&searchCriteria[pageSize]=10',
          headers,
          null,
          null,
        );
        console.log(
          'featured prods..................',
          JSON.stringify(response.data.items),
        );
        console.log(
          'featured prods..................',
          JSON.stringify(response.data.items.length),
        );
        //
        dispatch(fetchingDataDone());

        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data.items !== undefined &&
          response.data.items.length > 0
        ) {
          dispatch(setFeatureProductsSuccess(response.data.items));
          featureProductFetching = false;
        } else {
          dispatch(setFeatureProductsFailed());
          featureProductFetching = false;
        }
      } catch (err) {
        featureProductFetching = false;
      }
    };
  }
}

export function getFAQ() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        'GET',
        API_SERVICES.FAQ_URL,
        headers,
        null,
        null,
      );
      //
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined
      ) {
        dispatch(setFAQdataSuccess(response.data.items));
      } else {
        dispatch(setFAQdataFailure());
      }
    } catch (err) {
      dispatch(setFAQdataFailure());
    }
  };
}

export function getvideo() {
  return async dispatch => {
    try {
     
      const response = await requestConnector(
        'POST',
        API_SERVICES.VIDEO_LIST,
        null,
        null,
      );  
      
      if (
        response.data !== undefined 
      ) {
        console.log('video..........' +  JSON.stringify( response.data));
        dispatch(setVideoSuccess(response.data));
      } else {
        dispatch(setVideoFailure());
      }
    } catch (err) {
      dispatch(setVideoFailure());
    }
  };
}