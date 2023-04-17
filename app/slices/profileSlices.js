import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialProfileState = {
  isLoading: false,
  errorMsg: '',
  shippingAddress: {},
  billingAddress: {},
  activeServiceRequests: [],
  serviceRequestHistory: [],
  serviceRequest: '',
  stateLicenseInfo: {},
  isUploadSuccessDEA: false,
  isUploadSuccessState: false,
  isLicenseValid: '',
  isAdded: false,
  contactSuccess: '',
  businessLabels: [],
  organizationLabels: [],
  serviceRequestFetched: false,
  isUpdated: false,
};
const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,

  reducers: {
    fetchingData(state, action) {
      state.isLoading = true;
    },

    fetchingDataDone(state, action) {
      state.isLoading = false;
    },
    setErrorMsg(state, value) {
      state.errorMsg = value.payload;
    },

    setShippingAddressSuccess(state, value) {
      state.shippingAddress = value.payload;
      state.isLoading = false;
    },
    setShippingAddressFailure(state, value) {
      state.isLoading = false;
    },

    setBillingAddressSuccess(state, value) {
      state.billingAddress = value.payload;
      state.isLoading = false;
    },
    setBillingAddressFailure(state, value) {
      state.isLoading = false;
    },
    setServiceRequestsActive(state, value) {
      state.activeServiceRequests = value.payload;
      state.isLoading = false;
      //
    },
    setServiceRequestsHistory(state, value) {
      state.serviceRequestHistory = value.payload;
      state.isLoading = false;
      //
    },
    serviceRequestStatus(state, value) {
      state.serviceRequest = value.payload;
    },
    setStateLicenseInfo(state, value) {
      state.stateLicenseInfo = value.payload;
      state.isLoading = false;
      state.isLicenseValid = 'valid';
    },

    setIsUploadSuccessDEA(state, value) {
      state.isUploadSuccessDEA = value.payload;
      state.isLoading = false;
    },

    setIsUploadSuccessState(state, value) {
      state.isUploadSuccessState = value.payload;
      state.isLoading = false;
    },

    setIsUploadFailure(state, value) {
      state.isLoading = false;
    },

    setIsLicenseValid(state, value) {
      state.isLicenseValid = 'invalid';
      state.isLoading = false;
    },
    setIsAdded(state, value) {
      state.isAdded = value.payload;
    },
    setContactSuccess(state, value) {
      state.contactSuccess = value.payload;
    },
    setBusinessLabels(state, value) {
      state.isLoading = false;
      state.businessLabels = value.payload;
    },
    setOrganizationLabels(state, value) {
      state.organizationLabels = value.payload;
      state.isLoading = false;
    },

    setRequestFetched(state, value) {
      state.serviceRequestFetched = value.payload;
    },
    setIsUpdated(state, value) {
      state.isUpdated = value.payload;
    },
  },
});

export const {
  fetchingData,
  fetchingDataDone,
  setErrorMsg,
  setBillingAddressSuccess,
  setBillingAddressFailure,
  setShippingAddressSuccess,
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
} = profileSlice.actions;
export default profileSlice.reducer;
