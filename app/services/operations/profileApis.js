import {
  fetchingData,
  fetchingDataDone,
  setErrorMsg,
  setBillingAddressSuccess,
  setShippingAddressSuccess,
  setBillingAddressFailure,
  setShippingAddressFailure,
  setServiceRequestsActive,
  setServiceRequestsHistory,
  serviceRequestStatus,
  setStateLicenseInfo,
  setIsUploadSuccessDEA,
  setIsUploadSuccessState,
  setIsUploadFailure,
  setIsLicenseValid,
  setIsAdded,
  setContactSuccess,
  setBusinessLabels,
  setOrganizationLabels,
  setRequestFetched,
  setIsUpdated,
} from '../../slices/profileSlices';
import {setCustomerInfoStatus} from '../../slices/authenticationSlice';
import {
  getCustomerInfoSuccess,
  getCustomerInfoFailed,
  getTokenSuccess,
  getTokenFailure,
} from '../../slices/authenticationSlice';
import {
  getApiAccessTokenGeneral,
  getCustomerInfoAfterAddAddress,
} from '../../services/operations/getToken';

import {requestConnector} from '../../services/restApiConnector';
import API_SERVICES, {BASE_URL_DRL} from '../../services/ApiServicePath';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';

import {displayName as appName} from '../../../app.json';
import md5 from 'react-native-md5';

export function addAddress(address) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'PUT',
        API_SERVICES.ADD_ADDRESS,
        headers,
        null,
        address,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(address);
        dispatch(getTokenGeneral(addAddress, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
          dispatch(setIsAdded(true));
          dispatch(setCustomerInfoStatus());
          dispatch(getCustomerInfoAfterAddAddress(headers));
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function  updateSubscription(value, email) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.ApiAccessToken,
      };

      const headers1 = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };

      console.log(
        'id.....email.....value.......loginToken........',
        GlobalConst.customerId,
        email,
        value,
        GlobalConst.ApiAccessToken,
      );
      const response = await requestConnector(
        'PUT',
        API_SERVICES.UPDATE_SUBSCRIPTION + GlobalConst.customerId,
        headers,
        null,
        {
          customer: {
            id: GlobalConst.customerId,
            email: email,
            extension_attributes: {is_subscribed: value},
          },
        },
      );
      console.log('Response....................', response);
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(value);
        args.push(email);
        dispatch(getTokenGeneral(updateSubscription, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
          dispatch(setIsUpdated(true));
          // dispatch(setCustomerInfoStatus());
          dispatch(getCustomerInfoAfterAddAddress(headers1));
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function updateShippingAddress(shipadd_id) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };

      console.log('Access Token..............', GlobalConst.LoginToken);

      const response = await requestConnector(
        'POST',
        API_SERVICES.UPDATE_SHIPPING_ADDRESS + '?addressId='+shipadd_id,
        headers,
        null,
        null,
      );

      console.log('update Shipping Address..............', response);
      console.log('Response......update Shipping Address..............', response);

      if (GlobalConst.errorStatus === 401) {
       
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
       
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}


export function updateAddress(address) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'PUT',
        API_SERVICES.UPDATE_ADDRESS,
        headers,
        null,
        address,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(address);
        dispatch(getTokenGeneral(updateAddress, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
          dispatch(setCustomerInfoStatus());
          dispatch(getCustomerInfo(headers));
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function getShippingAddress() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'GET',
        API_SERVICES.GET_SHIPPING,
        headers,
        null,
        null,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];

        dispatch(getTokenGeneral(getShippingAddress, args));
      } else if (response !== undefined && response.data !== undefined) {
        dispatch(setShippingAddressSuccess(response.data));
      } else {
        dispatch(setShippingAddressFailure());
      }
    } catch (err) {}
  };
}

export function getBillingAddress() {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'GET',
        API_SERVICES.GET_BILLING,
        headers,
        null,
        null,
      );

      if (response !== undefined && response.data !== undefined) {
        dispatch(setBillingAddressSuccess(response.data));
      } else {
        dispatch(setBillingAddressFailure());
      }
    } catch (err) {}
  };
}

export function deleteAddress(id, adminToken) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      };

      const header2 = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'DELETE',
        API_SERVICES.DELETE_ADDRESS + id,
        headers,
        null,
        null,
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
          dispatch(setCustomerInfoStatus());
          dispatch(getCustomerInfo(header2));
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function deleteAddressByAdminToken(id) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        'POST',
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        },
      );

      if (response.data === undefined) {
        // dispatch(setAdminTokenFailure(true))
      } else {
        //   dispatch(setAdminToken(response.data));

        dispatch(deleteAddress(id, response.data));
      }
    } catch (err) {
      //  dispatch(setAdminTokenFailure(true))
    }
  };
}

export function editProfile(profile) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'PUT',
        API_SERVICES.EDIT_PROFILE,
        headers,
        null,
        profile,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(profile);
        dispatch(getTokenGeneral(editProfile, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (response !== undefined && response.data !== undefined) {
          dispatch(getCustomerInfo(headers));
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function raiseRequest(body) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.RAISE_SERVICE_REQUEST,
        headers,
        null,
        body,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(body);
        dispatch(getTokenGeneral(raiseRequest, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data === 'success'
        ) {
          dispatch(serviceRequestStatus('Success'));
          console.log('service request....' + response.data);
          dispatch(getServiceRequestActive());
        } else {
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function getServiceRequestActive() {
  return async dispatch => {
    try {
      // dispatch(fetchingData());
      dispatch(setRequestFetched(true));
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.GET_SERVICE_REQUEST_ACTIVE,
        headers,
        null,
        null,
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getServiceRequestActive, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
        dispatch(setRequestFetched(false));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data.items !== undefined
        ) {
          dispatch(setServiceRequestsActive(response.data.items));

          console.log('request..' + JSON.stringify (response.data.items));
          dispatch(getServiceRequestHistory());
        } else {
          dispatch(fetchingDataDone(false));
          dispatch(setRequestFetched(false));
        }
      }
    } catch (err) {
      dispatch(setRequestFetched(false));
    }
    dispatch(fetchingDataDone(false));
  };
}

export function getServiceRequestHistory() {
  return async dispatch => {
    try {
      // dispatch(fetchingData());

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.GET_SERVICE_REQUEST_HISTORY,
        headers,
        null,
        null,
      );
      //
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getServiceRequestHistory, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
        dispatch(setRequestFetched(false));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data.items !== undefined
        ) {
          dispatch(setServiceRequestsHistory(response.data.items));
          dispatch(setRequestFetched(false));
        } else {
          dispatch(fetchingDataDone(false));
          dispatch(setRequestFetched(false));
          //dispatch(setServiceRequestsHistory([]))
        }
      }
    } catch (err) {
      dispatch(setRequestFetched(false));
    }
    dispatch(fetchingDataDone(false));
  };
}

export function getTokenForAddress(licenseNumber) {
  return async dispatch => {
    try {
      //dispatch(fetchingData());
      var formdata = new FormData();
      formdata.append('client_id', 'b2c0b706-7061-46e7-8576-393bba0d0718');
      formdata.append('client_secret', 'eca6b52b-9e58-46e0-a585-485fcc6c533b');
      formdata.append('grant_type', 'client_credentials');

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch('https://api.medproid.com/v1/authorize/token', requestOptions)
        .then(response => response.text())
        .then(result => {
          dispatch(
            getStateLicenseInfo(JSON.parse(result).access_token, licenseNumber),
          );
        })
        .catch(error);

      //dispatch(fetchingDataDone());
    } catch (err) {
      //dispatch(fetchingDataDone());
    }
  };
}

export function getStateLicenseInfo(token, licenseNumber) {
  return async dispatch => {
    try {
      // dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };
      const StateLicenseURL =
        'https://api.medproid.com/v1/hcos/match?slnStateLicenseNumber=' +
        licenseNumber;

      const response = await requestConnector(
        'GET',
        StateLicenseURL,
        headers,
        null,
        null,
      );

      if (response !== undefined && response.data !== undefined) {
        dispatch(setStateLicenseInfo(response.data));
        // dispatch(fetchingDataDone(false))
      } else {
        dispatch(setStateLicenseInfo({invalid: 'invalid'}));
        // dispatch(fetchingDataDone(false))
      }
    } catch (err) {
      //dispatch(fetchingDataDone(false))
    }
    //
  };
}

function getTokenGeneral(functionCall, args) {
  return async dispatch => {
    try {
      // dispatch(fetchingData());
      const response = await requestConnector(
        'POST',
        API_SERVICES.TOKEN_URL,
        null,
        null,
        JSON.parse(GlobalConst.creds),
      );

      if (response.data === undefined) {
        dispatch(getTokenFailure(true));
      } else {
        GlobalConst.TOKEN_URL = API_SERVICES.TOKEN_URL;
        // GlobalConst.API_ACCESS_TOKEN = response.data;
        dispatch(getTokenSuccess(response.data));
        GlobalConst.LoginToken = response.data;
        dispatch(functionCall(...args));
      }
    } catch (err) {
      dispatch(getTokenFailure(true));
    }
  };
}

export function uploadAddressDoc(filename, fileType, base64Image, docType) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.UPLOAD_DOC,
        headers,
        null,
        {
          data: {
            content: {
              base64_encoded_data: base64Image,
              type: fileType,
              name: filename,
            },
          },
        },
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(filename);
        args.push(fileType);
        args.push(base64Image);
        args.push(docType);
        dispatch(getTokenGeneral(uploadAddressDoc, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data === 'success'
        ) {
          if (docType === 'DEA') {
            dispatch(setIsUploadSuccessDEA(true));
          }

          if (docType === 'State') {
            dispatch(setIsUploadSuccessState(true));
          }

          // dispatch(setCustomerInfoStatus());
          // dispatch(getCustomerInfo(headers))
        } else {
          dispatch(setIsUploadFailure());

          if (
            response != undefined &&
            response.error !== undefined &&
            response.error.message !== undefined
          ) {
          }
        }
      }
    } catch (err) {
      dispatch(setIsUploadFailure());
    }
    dispatch(fetchingDataDone(false));
  };
}

export function contactUs(name, phone, email, description) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        'POST',
        API_SERVICES.CONTACT_US +
          'contactForm[name]=' +
          name +
          '&contactForm[email]=' +
          email +
          '&contactForm[telephone]=' +
          phone +
          '&contactForm[comment]=' +
          description,
        null,
        null,
        null,
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data.message !== undefined
        ) {
          dispatch(setContactSuccess(response.data.message));
          dispatch(fetchingDataDone(false));
        } else {
          dispatch(fetchingDataDone(false));
        }
      }
    } catch (err) {}
    dispatch(fetchingDataDone(false));
  };
}

export function getAdminTokenForLabels() {
  return async dispatch => {
    try {
      //  dispatch(fetchingData());
      const response = await requestConnector(
        'POST',
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        },
      );

      if (
        response.data === undefined ||
        response.data.access_token === undefined
      ) {
        //   dispatch(setAdminTokenFailure(true))
      } else {
        dispatch(getBusinessTypeLabels(response.data.access_token));
        //  dispatch(setAdminToken(response.data));
        //  dispatch(getAddressLabels(response.data))
        // GlobalConst.ApiAccessToken = response.data;
      }
    } catch (err) {
      //dispatch(setAdminTokenFailure(true))
    }
  };
}

export function getBusinessTypeLabels(token) {
  return async dispatch => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };

      const response = await requestConnector(
        'GET',
        API_SERVICES.BUSINESSTYPE_LABELS,
        headers,
        null,
        null,
      );

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.options !== undefined &&
        response.data.options.length > 0
      ) {
        dispatch(setBusinessLabels(response.data.options));
        dispatch(getOrganizationLabels(token));
      } else {
      }
    } catch (err) {}
  };
}

export function getOrganizationLabels(token) {
  return async dispatch => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };

      const response = await requestConnector(
        'GET',
        API_SERVICES.PARTOFORG_LABELS,
        headers,
        null,
        null,
      );

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.options !== undefined &&
        response.data.options.length > 0
      ) {
        dispatch(setOrganizationLabels(response.data.options));
      } else {
      }
    } catch (err) {}
  };
}
