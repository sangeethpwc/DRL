import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialHomeState = {
  awards: {},
  videos: [],
  isLoading: false,
  voiceOfCustomer: {},
  featureProducts: {},
  recentOrders: [],
  recentOrdersForHome: [],
  upcomingOrdersForHome: [],
  productPackSize: [],
  productStrength: [],
  banner: [],
  bannerLoggedIn: [],
  loadStart: false,
  brandNames: [],
  categoryNames: [],
  recentOrderFailed: false,
  FAQdata: '',
  recentInvoices: [],
  orderFetchStarted: false,

  orderDetail: {},
};

const homeSlice = createSlice({
  name: 'home',
  initialState: initialHomeState,
  reducers: {
    getBannerSuccess(state, banner) {
      if (banner.payload.length > 0) {
        state.banner = banner.payload[0].data;
      }
      state.isLoading = false;
    },

    getBannerLoggedInSuccess(state, banner) {
      if (banner.payload.length > 0) {
        state.bannerLoggedIn = banner.payload[0].data;
      }
      state.isLoading = false;
    },

    getBannerFailure(state, value) {
      state.isLoading = false;
    },
    getAwardsSuccess(state, value) {
      state.awards = value.payload;
    },
    fetchingData(state, action) {
      state.isLoading = true;
    },
    fetchingDataDone(state, action) {
      state.isLoading = false;
    },
    getAwardsFailure(state, action) {
      state.isLoading = false;
    },
    getVoiceOfCustomersSuccess(state, voc) {
      state.voiceOfCustomer = voc.payload;
    },
    getVoiceOfCustomersFailure(state, action) {
      state.voiceOfCustomer = {};
      state.isLoading = false;
    },
    setFeatureProductsSuccess(state, data) {
      //
      // state.featureProducts.length = 0;
      state.featureProducts = data.payload;
      state.isLoading = false;
    },
    setFeatureProductsFailed(state) {
      state.isLoading = false;
    },

    startLoad(state) {
      state.loadStart = true;
    },

    endLoad(state) {
      state.loadStart = false;
    },

    setRecentOrdersSuccess(state, value) {
      state.recentOrders = value.payload;
      state.isLoading = false;
      state.recentOrderFailed = true;
    },

    setRecentInvoicesSuccess(state, value) {
      state.recentInvoices = value.payload;
      state.isLoading = false;
    },
    setRecentOrdersFailure(state, value) {
      state.isLoading = false;
      state.recentOrderFailed = true;
    },

    setFAQdataSuccess(state, value) {
      state.FAQdata = value.payload[0].content;
      state.isLoading = false;
    },
    setFAQdataFailure(state, value) {
      state.isLoading = falses;
    },

    setRecentOrdersForHome(state, value) {
      (state.isLoading = false), (state.recentOrdersForHome = value.payload);
    },

    setUpcomingOrdersForHome(state, value) {
      (state.isLoading = false), (state.upcomingOrdersForHome = value.payload);
    },

    clearOrders(state) {
      (state.upcomingOrdersForHome = []),
        (state.recentOrdersForHome = []),
        (state.recentOrders = []),
        (state.recentInvoices = []);
    },

    setOrderFetchStarted(state, value) {
      state.orderFetchStarted = value.payload;
    },

    setOrderDetail(state, value) {
      state.orderDetail = value.payload;
      state.isLoading = false;
    },

    setVideoSuccess(state, value) {
      state.videos = value.payload;
    },

    setVideoFailure(state, action) {
      state.isLoading = false;
    },

  },
});

export const {
  getBannerSuccess,
  getBannerFailure,
  getAwardsSuccess,
  getAwardsFailure,
  fetchingData,
  fetchingDataDone,
  getVoiceOfCustomersSuccess,
  getVoiceOfCustomersFailure,
  setFeatureProductsSuccess,
  setFeatureProductsFailed,
  setRecentOrdersSuccess,
  setRecentOrdersFailure,
  getProductPackSizeSuccess,
  getProductPackSizeFailure,
  getProductStrengthFailure,
  getProductStrengthSuccess,
  startLoad,
  endLoad,
  setFAQdataSuccess,
  setFAQdataFailure,
  setRecentInvoicesSuccess,
  setRecentOrdersForHome,
  setUpcomingOrdersForHome,
  clearOrders,
  setOrderFetchStarted,
  setOrderDetail,
  getBannerLoggedInSuccess,
  setVideoSuccess,
  setVideoFailure,
} = homeSlice.actions;

export default homeSlice.reducer;
