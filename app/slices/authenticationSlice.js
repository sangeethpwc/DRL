 import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialAuthState = {
  token: '',
  apiAccessToken: '',
  userDetails: {},
  // locations: [],
  // locationOptions: [],
  isLoading: false,
  isPasswordReset: false,
  isPasswordWrong: false,
  invalidUser: false,
  categoryNames: [],
  brandNames: [],
  splashFetch: false,
  customerInfo: {},
  wishlist: [],
  medicationTypes: [],
  apiAccessTokenFailed: false,
  strengthLabels: [],
  packLabels: [],
  filterCategories: [],
  adminToken: '',
  region: {},
  customerInfoUpdated: false,
  addressLabels: [],
  shippingAddressId: '',
  orderStatus: [],
  privacyData: '',
  termsData: '',
  genTermsData: '',
  applicationStatus: [],
  resourceCategories: [],
  resources: [],
  notificationStatus: '',
  // otp: '',
  // role: -1,
  // searchedUserDetails: {}
};

const autheticationSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    getTokenSuccess(state, token) {
      state.token = token.payload;
    },

    intilizedToken(state) {
      state.token = '';
    },

    getApiAccessTokenSuccess(state, token) {
      state.apiAccessToken = token.payload;
    },

    fetchingData(state, action) {
      state.isLoading = true;
    },

    setInvalidUser(state, action) {
      state.invalidUser = action.payload;
    },

    fetchingDataDone(state, action) {
      state.isLoading = false;
    },

    passwordResetSuccess(state, isPasswordReset) {
      state.isPasswordReset = isPasswordReset;
      state.isLoading = false;
    },

    passwordResetFailure(state, isPasswordReset) {
      state.isPasswordReset = false;
      state.isLoading = false;
    },

    setPasswordWrong(state, value) {
      state.isPasswordWrong = value;
    },

    getCustomerInfoSuccess(state, token) {
      // state.isLoading = false;
      state.customerInfoUpdated = true;
      state.customerInfo = token.payload;
    },
    setCustomerInfoStatus(state) {
      state.customerInfoUpdated = false;
    },
    getCustomerInfoFailed(state, action) {
      state.isLoading = false;
    },
    getTokenFailure(state, action) {
      state.isLoading = false;
      state.invalidUser = true;
      state.token = undefined;
    },

    getApiAccessTokenFailure(state, action) {
      state.isLoading = false;
      state.apiAccessTokenFailed = true;
    },

    userDetailsFailure(state, action) {
      state.isLoading = false;
    },

    clearUser(state, action) {
      // state = initialAuthState;

      state.token = '';
      state.splashFetch = false;
      // state.apiAccessToken= '';
      state.userDetails = {};
      state.isLoading = false;
      state.isPasswordReset = false;
      state.isPasswordWrong = false;
      state.invalidUser = false;
      state.customerInfo = {};
      // state.categoryNames=[];
      // state.brandNames=[];
      // state.splashFetch = false;
    },

    getNews(state, data) {
      state.isLoading = false;
      state.news = data.payload;
    },
    getBrandSuccess(state, value) {
      let temp = [];
      temp.push(...value.payload[0].options);

      temp = _.map(temp, o => _.extend({CHECKED: false}, o));

      state.brandNames = temp;
      state.isLoading = false;

      //
    },
    getBrandFailure(state, value) {
      state.isLoading = false;
      state.isLoading = false;
    },
    getSpashFetchDone(state) {
      state.isLoading = false;
      state.splashFetch = true;
    },

    setSpashFetchDoneFalse(state) {
      state.splashFetch = false;
    },

    getCategorySuccess(state, value) {
      let temp = [];
      temp.push(...value.payload[0].options);

      temp = _.map(temp, o => _.extend({CHECKED: false}, o));

      state.categoryNames = temp;
      state.isLoading = false;
    },

    getCategoryFailure(state, value) {
      state.isLoading = false;
    },

    getMedicationTypeSuccess(state, value) {
      let temp = [];
      temp.push(...value.payload[0].options);

      temp = _.map(temp, o => _.extend({CHECKED: false}, o));

      state.medicationTypes = temp;
      state.isLoading = false;
    },

    getMedicationTypeFailure(state, value) {
      state.isLoading = false;
    },

    getFilterCategorySuccess(state, value) {
      let temp = [];
      temp.push(...value.payload[0].options);
      temp = _.map(temp, o => _.extend({CHECKED: false}, o));
      state.filterCategories = temp;
      state.isLoading = false;
    },

    getFilterCategoryFailure(state, value) {
      state.isLoading = false;
    },

    getStrengthLabelSuccess(state, value) {
      state.strengthLabels = value.payload[0].options;
      state.isLoading = false;
    },

    getStrengthLabelFailure(state, value) {
      state.isLoading = false;
    },

    getPackLabelSuccess(state, value) {
      state.packLabels = value.payload[0].options;
      state.isLoading = false;
    },

    getPackLabelFailure(state, value) {
      state.isLoading = false;
    },

    getWishlistSuccess(state, value) {
      state.wishlist = value.payload;
    },
    setAdminToken(state, value) {
      state.adminToken = value;
      state.isLoading = false;
    },
    setAdminTokenFailure(state, value) {
      state.isLoading = false;
    },

    setRegionSuccess(state, value) {
      state.isLoading = false;
      state.region = value.payload;
      //
    },

    setRegionFailure(state, value) {
      state.isLoading = false;
    },

    setAddressLabelsSuccess(state, value) {
      state.addressLabels = value.payload;
      state.isLoading = false;
    },
    setAddressLabelsFailure(state, value) {
      state.isLoading = false;
    },
    setShippingAddressId(state, value) {
      state.shippingAddressId = value.payload;
    },
    setOrderStatusSuccess(state, value) {
      state.orderStatus = value.payload;
      state.isLoading = false;
    },
    setOrderStatusFailure(state, value) {
      state.isLoading = false;
    },
    setPrivacydataSuccess(state, value) {
      state.privacyData = value.payload[0].content;
      state.isLoading = false;
    },
    setPrivacydataFailure(state, value) {
      state.isLoading = false;
    },
    setTermsdataSuccess(state, value) {
      state.termsData = value.payload[0].content;
      state.isLoading = false;
    },

    setGeneralTermsdataSuccess(state, value) {
      state.genTermsData = value.payload[0].content;
      state.isLoading = false;
    },

    setTermsdataFailure(state, value) {
      state.isLoading = false;
    },
    setApplicationStatusSuccess(state, value) {
      state.isLoading = false;
      state.applicationStatus = value.payload;
    },
    setApplicationStatusFailure(state, value) {
      state.isLoading = false;
    },
    setResourcesCategoriesSuccess(state, value) {
      state.resourceCategories = value.payload;
      state.isLoading = false;
    },
    setResourcesCategoriesFailure(state, value) {
      state.isLoading = false;
    },
    setResourcesSuccess(state, value) {
      state.resources = value.payload;
      state.isLoading = false;
    },
    setResourcesFailure(state, value) {
      state.isLoading = false;
    },
    setNotificationStatus(state, value) {
      state.notificationStatus = value.payload;
    },
  },
});

export const {
  setPasswordWrong,
  fetchingData,
  fetchingDataDone,
  getTokenSuccess,
  getTokenFailure,
  getApiAccessTokenSuccess,
  getApiAccessTokenFailure,
  getCustomerInfoSuccess,
  getCustomerInfoFailed,
  getNews,
  passwordResetSuccess,
  passwordResetFailure,
  getBrandFailure,
  getBrandSuccess,
  getCategoryFailure,
  getCategorySuccess,
  getSpashFetchDone,
  clearUser,
  getWishlistSuccess,
  getMedicationTypeSuccess,
  getMedicationTypeFailure,
  getPackLabelSuccess,
  getPackLabelFailure,
  getStrengthLabelFailure,
  getStrengthLabelSuccess,
  setAdminToken,
  setAdminTokenFailure,
  setRegionSuccess,
  setRegionFailure,
  setCustomerInfoStatus,
  getFilterCategorySuccess,
  getFilterCategoryFailure,
  setAddressLabelsFailure,
  setAddressLabelsSuccess,
  setShippingAddressId,
  setOrderStatusSuccess,
  setOrderStatusFailure,
  setPrivacydataFailure,
  setPrivacydataSuccess,
  setTermsdataSuccess,
  setTermsdataFailure,
  setApplicationStatusSuccess,
  setApplicationStatusFailure,
  setInvalidUser,
  setSpashFetchDoneFalse,
  setResourcesCategoriesSuccess,
  setResourcesCategoriesFailure,
  setResourcesSuccess,
  setResourcesFailure,
  setNotificationStatus,
  intilizedToken,
  setGeneralTermsdataSuccess,
} = autheticationSlice.actions;

export default autheticationSlice.reducer;
