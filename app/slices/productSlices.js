import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialProductState = {
  isLoading: false,
  searchedProducts: [],
  products: [],
  configurableProducts: [],
  configurableProductsProductDetail: [],
  productDetail: {},
  productLoadCompleted: false,
  searchStart: false,
  cartId: '',
  adminToken: '',

  cartList: {},
  errorCode: 200,
  errorMsg: '',
  shipping_methods: [],
  shippingInformationUpdated: false,
  shippingMethodName: '',
  deliveryDateForPurchase: '',
  deliveryInstructionsForPurchase: '',
  deliveryInstrction: '',
  shippingMethodFetchFailed: false,
  shippingAddress: {},
  billingAddress: {},
  shippingTotalInfromation: {},
  orderId: '',
  itemAddedToCart: false,
  wishlist: {},
  wishlistEmpty: false,
  cartAdded: false,
  wishlistAdded: false,
  indicatorSteps: 0,
  cartPrice: {},
  trackingInfo: [],
  stockStatus: '',
  stockStatusPDP: '',
  invoiceInfo: [],

  deliveryDates: {},
  cartSuccess: false,
  productDetailWishlist: {},
  productDetailConfigurable: {},
  shipmenDownloadStarted: false,
  invoiceDowladStated: false,

  dosage: [],
  theraputic: [],
  filters: [],
  categoryApplied: false,
  productName: undefined,

  reorderMsg: '',
  oldCartState: [],
  coupon_applied: '',
  totalInfoArgs: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState: initialProductState,

  reducers: {
    fetchingData(state, action) {
      state.isLoading = true;
    },

    fetchingDataDone(state, action) {
      state.isLoading = false;
    },

    getProductsSuccess(state, products) {
      // state.isLoading=false;
      state.products = products.payload;
    },

    setConfigurableProducts(state, products) {
      state.configurableProducts = products.payload;
    },

    setConfigurableProductDetail(state, products) {
      state.configurableProductsProductDetail = products.payload;
    },

    getProductsFailure(state, action) {
      state.products = [];
      //state.isLoading=false;
    },

    getProductDetailSuccess(state, productDetail) {
      state.isLoading = false;
      state.productDetail = productDetail.payload;
    },

    getProductDetailFailure(state, action) {
      state.isLoading = false;
    },
    getRelatedProductsSuccess(state, value) {
      state.relatedProducts = value;
      state.isLoading = false;
    },
    getRelatedProductsFailure(state, value) {
      state.isLoading = false;
    },
    setProductLoadCompleted(state) {
      state.productLoadCompleted = true;
    },

    setProductLoadInitiated(state) {
      //state.productLoadCompleted = false;
    },

    startSearch(state) {
      state.searchStart = true;
    },
    endSearch(state) {
      state.searchStart = false;
    },
    setCartId(state, value) {
      state.cartId = value.payload;
      // state.isLoading=false;
    },
    setCartIdFailure(state, value) {
      state.isLoading = false;
    },

    setAdminToken(state, value) {
      state.adminToken = value;
      state.isLoading = false;
    },
    setAdminTokenFailure(state, value) {
      state.isLoading = false;
    },
    setCartList(state, value) {
      (state.isLoading = false), (state.cartList = value.payload);
    },
    emptyCartList(state) {
      state.cartId = '';
      state.shippingTotalInfromation = {};
      state.shipping_methods = [];
      state.shippingMethodName = '';
      // state.deliveryDate= ''
      state.deliveryDateForPurchase = '';
      //   state.deliveryInstrction = ''
      state.deliveryInstructionsForPurchase = '';
      state.cartList = {};
    },

    emptyCartListAfterError(state) {
      state.shippingTotalInfromation = {};
      state.shipping_methods = [];
      state.shippingMethodName = '';
      // state.deliveryDate= ''
      state.deliveryDateForPurchase = '';
      //   state.deliveryInstrction = ''
      state.deliveryInstructionsForPurchase = '';
    },

    refreshCartForPurchase(state) {
      state.shippingTotalInfromation = {};
      state.shipping_methods = [];
      // state.shippingMethodName = '';
      // state.deliveryDate= ''
      //   state.deliveryDateForPurchase=''
      state.deliveryInstructionsForPurchase = '';
      // state.deliveryInstrction = ''
    },
    setErrorCode(state, value) {
      state.errorCode = value;
    },
    setErrorCodeFailed(state) {
      state.errorCode = 200;
    },
    setErrorMsg(state, value) {
      state.errorMsg = value.payload;
    },
    setShippingMethods(state, value) {
      state.shipping_methods = value.payload;
    },
    setShippingMethodsFailed(state) {
      state.shipping_methods = [];
      state.shippingMethodFetchFailed = true;
    },
    setShippingTotalInformation(state, value) {
      state.shippingTotalInfromation = value.payload;
    },
    setShippingTotalInformationFailed(state, value) {
      state.isLoading = false;
      state.shippingTotalInfromation = {};
    },
    setOrderId(state, value) {
      state.isLoading = false;
      state.orderId = value.payload;
    },
    setOrderFailed(state, value) {
      state.isLoading = false;
      state.orderId = '';
    },
    setItemAddedToCart(state, value) {
      state.itemAddedToCart = value.payload;
    },
    setDeliveryDateForPurchase(state, value) {
      //  state.deliveryDate= value.payload;
      state.deliveryDateForPurchase = value.payload;
    },
    setDeliveryInstructionsForPurchase(state, value) {
      state.deliveryInstructionsForPurchase = value.payload;
    },
    setShippingMethodName(state, value) {
      state.shippingMethodName = value.payload;

      // state.deliveryInstrction= value.payload.deliveryInstrction;
    },
    setShippingDeliveryDate(state, value) {
      // state.deliveryDate= value.payload;
      //    state.deliveryDateForPurchase=value.payload
    },
    setShippingDeliveryInstruction(state, value) {
      //  state.deliveryInstrction= value.payload;
    },
    setShippingInformationUpdated(state, value) {
      state.shippingInformationUpdated = value.payload;

      state.shippingInformationUpdated = value.payload;
    },

    setWishlistSuccess(state, value) {
      state.isLoading = false;
      state.wishlist = value.payload;

      if (
        state.wishlist !== undefined &&
        state.wishlist.items_count !== undefined &&
        state.wishlist.items_count > 0
      ) {
        state.wishlistEmpty = false;
      } else {
        state.wishlistEmpty = true;
      }
      //
    },

    setWishlistEmpty(state) {
      state.isLoading = false;
      state.wishlistEmpty = false;
      state.wishlist = [];
    },

    setWishlistFailure(state, value) {
      state.isLoading = false;
    },

    setcartAdded(state) {
      state.cartAdded = true;
    },

    setcartDone(state) {
      state.cartAdded = false;
      state.cartSuccess = false;
    },

    setWishlist(state) {
      state.wishlistAdded = true;
    },

    setWishlistDone(state) {
      state.wishlistAdded = false;
    },
    setIndicatorSteps(state, value) {
      state.indicatorSteps = value.payload;
    },
    setCartPriceSuccess(state, value) {
      state.isLoading = false;
      state.cartPrice = value.payload;
      //
    },
    setCartPriceFailure(state, value) {
      state.isLoading = false;
    },
    setTrackingInfoSuccess(state, value) {
      // state.isLoading=false;
      state.trackingInfo = value.payload;
      //state.trackingInfo= sampleTracking
    },

    setTrackingInfoFailure(state, value) {
      state.isLoading = false;
    },

    setInvoiceInfoSuccess(state, value) {
      state.isLoading = false;
      state.invoiceInfo = value.payload;
      //state.trackingInfo= sampleTracking
    },

    setStockStatus(state, value) {
      state.stockStatus = value.payload;
    },
    setStockStatusPDP(state, value) {
      state.stockStatusPDP = value.payload;
    },
    setSearchedProductsSuccess(state, value) {
      state.searchedProducts = value.payload;
      state.isLoading = false;
    },
    setSearchedProductsFailure(state, value) {
      state.isLoading = false;
    },
    setDeliveryDateSuccess(state, value) {
      state.isLoading = false;
      state.deliveryDates = value.payload;
    },
    setCartSuccess(state) {
      state.cartSuccess = true;
    },
    getProductDetailSuccessWishlist(state, productDetail) {
      state.isLoading = false;
      state.productDetailWishlist = productDetail.payload;
    },

    getProductDetailConfigurableSuccess(state, productDetail) {
      state.isLoading = false;
      state.productDetailConfigurable = productDetail.payload;
    },

    setShipmentDownloadStarted(state, value) {
      state.shipmenDownloadStarted = value.payload;
    },

    setInvoiceDownloadStarted(state, value) {
      state.invoiceDowladStated = value.payload;
    },
    setCategoryApplied(state, value) {
      state.categoryApplied = value.payload;
    },
    setDosageApplied(state, value) {
      state.dosage = value.payload;
    },

    setTherapeutic(state, value) {
      state.theraputic = value.payload;
    },
    setFilters(state, value) {
      state.filters = value.payload;
    },
    setProductName(state, value) {
      state.productName = value.payload;
    },
    setReorderMsg(state, value) {
      state.reorderMsg = value.payload;
    },
    setOldCartState(state, value) {
      state.oldCartState = value.payload;
      console.log('Old cart state set................', state.oldCartState);
    },
    setCouponApplied(state, value) {
      state.coupon_applied = value.payload;
    },
    setTotalInfoArgs(state, value) {
      state.totalInfoArgs = value.payload;
    },
  },
});
export const {
  fetchingData,
  getProductsFailure,
  getProductsSuccess,
  getProductDetailSuccess,
  getProductDetailFailure,
  setProductLoadCompleted,
  setProductLoadInitiated,
  getRelatedProductsSuccess,
  getRelatedProductsFailure,
  endSearch,
  startSearch,
  setCartId,
  setCartIdFailure,
  setAdminToken,
  setAdminTokenFailure,
  fetchingDataDone,
  setCartList,
  setErrorMsg,
  setShippingMethods,
  setShippingMethodsFailed,
  setShippingTotalInformationFalied,
  setShippingTotalInformation,
  setOrderId,
  setOrderFailed,
  emptyCartList,
  setItemAddedToCart,
  setShippingMethodName,
  setShippingInformationUpdated,
  setIndicatorSteps,
  setWishlistSuccess,
  setWishlistFailure,
  setWishlistEmpty,
  setcartAdded,
  setcartDone,
  setWishlist,
  setWishlistDone,
  setCartPriceSuccess,
  setCartPriceFailure,
  setTrackingInfoSuccess,
  setTrackingInfoFailure,
  setStockStatus,
  setConfigurableProducts,
  setConfigurableProductDetail,
  refreshCartForPurchase,
  setSearchedProductsSuccess,
  setSearchedProductsFailure,
  setShippingDeliveryDate,
  setShippingDeliveryInstruction,
  setDeliveryDateSuccess,
  setInvoiceInfoSuccess,
  setCartSuccess,
  setDeliveryDateForPurchase,
  setDeliveryInstructionsForPurchase,
  setStockStatusPDP,
  getProductDetailSuccessWishlist,
  getProductDetailConfigurableSuccess,
  setShipmentDownloadStarted,
  setInvoiceDownloadStarted,
  setCategoryApplied,
  setDosageApplied,
  setTherapeutic,
  setFilters,
  setProductName,
  setReorderMsg,
  setOldCartState,
  emptyCartListAfterError,
  setCouponApplied,
  setTotalInfoArgs,
} = productSlice.actions;

export default productSlice.reducer;
