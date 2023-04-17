import {
  fetchingData,
  getProductsFailure,
  getProductsSuccess,
  getProductDetailFailure,
  setProductLoadCompleted,
  setProductLoadInitiated,
  getRelatedProductsSuccess,
  getRelatedProductsFailure,
  getProductDetailSuccess,
  startSearch,
  setCartIdFailure,
  setCartId,
  setAdminToken,
  setAdminTokenFailure,
  fetchingDataDone,
  setCartList,
  setErrorMsg,
  setShippingMethods,
  setShippingMethodsFailed,
  setShippingTotalInformation,
  setShippingTotalInformationFalied,
  setOrderId,
  setOrderFailed,
  setItemAddedToCart,
  setWishlistSuccess,
  setWishlistFailure,
  setWishlistEmpty,
  setcartAdded,
  setcartDone,
  setWishlist,
  setWishlistDone,
  setTrackingInfoSuccess,
  setCartPriceSuccess,
  setCartPriceFailure,
  setStockStatus,
  setConfigurableProducts,
  setConfigurableProductDetail,
  setSearchedProductsSuccess,
  setSearchedProductsFailure,
  setDeliveryDateSuccess,
  setInvoiceInfoSuccess,
  setCartSuccess,
  setStockStatusPDP,
  getProductDetailSuccessWishlist,
  getProductDetailConfigurableSuccess,
  setShipmentDownloadStarted,
  setInvoiceDownloadStarted,
  setReorderMsg,
  setCouponApplied,
} from "../../slices/productSlices";
import {
  setCustomerInfoStatus,
  setShippingAddressId,
  getTokenFailure,
  getTokenSuccess,
  getApiAccessTokenFailure,
} from "../../slices/authenticationSlice";

import { getAdminTokenForOder } from "../operations/getToken";

import { getApiAccessTokenGeneral } from "../../services/operations/getToken";

import { requestConnector } from "../../services/restApiConnector";
import API_SERVICES, { BASE_URL_DRL } from "../../services/ApiServicePath";
import GlobalConst from "../../config/GlobalConst";
import utils from "../../utilities/utils";
import _ from "lodash";

import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { getFeatureProducts } from "./homeApis";


// import {
//   logPurchaseToAnalytics,
//   logAddCartToAnalytics,
//   logRemoveCartToAnalytics,
// } from '../FirebaseAnalytics';

export function getProductsSearch(text) {
  return async (dispatch) => {
    try {
      let prodcutAll =
        API_SERVICES.PRODUCTS_SEARCH +
        "&searchCriteria[filterGroups][0][filters][0][field]=name&searchCriteria[filterGroups][0][filters][0][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][0][conditionType]=like&searchCriteria[filterGroups][0][filters][1][field]=sku&searchCriteria[filterGroups][0][filters][1][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][1][conditionType]=like&searchCriteria[filterGroups][0][filters][2][field]=ndc&searchCriteria[filterGroups][0][filters][2][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][2][conditionType]=like&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=visibility&searchCriteria[filterGroups][2][filters][0][value]=4&searchCriteria[filterGroups][2][filters][0][condition_type]=in";

      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };

      const response = await requestConnector(
        "GET",
        prodcutAll,
        headers,
        null,
        null
      );

    
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        dispatch(setSearchedProductsSuccess(response.data.items));
        
      }
    
      else {
        dispatch(setProductLoadCompleted());
        dispatch(setSearchedProductsFailure());
      }
    } catch (err) {}
  };
}

export function getProductsSearch_Scan(text) {

  // const str = text;

  // console.log('text........ '+ text);

  // const withoutFirstAndLast = str.substring(2, str.length - 1);

  // console.log('withoutFirstAndLast........ '+ withoutFirstAndLast);

  return async (dispatch) => {
    try {
      let prodcutAll =
        API_SERVICES.PRODUCTS_SEARCH +
        "&searchCriteria[filterGroups][0][filters][0][field]=name&searchCriteria[filterGroups][0][filters][0][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][0][conditionType]=like&searchCriteria[filterGroups][0][filters][1][field]=sku&searchCriteria[filterGroups][0][filters][1][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][1][conditionType]=like&searchCriteria[filterGroups][0][filters][2][field]=barcode&searchCriteria[filterGroups][0][filters][2][value]=%25" +
        text +
        "%25&searchCriteria[filterGroups][0][filters][2][conditionType]=like&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=visibility&searchCriteria[filterGroups][2][filters][0][value]=4&searchCriteria[filterGroups][2][filters][0][condition_type]=in";

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };

      const response = await requestConnector(
        "GET",
        prodcutAll,
        headers,
        null,
        null
      );

      console.log('Search Success values........ '+ JSON.stringify(response.data.items[0].sku));

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        dispatch(setSearchedProductsSuccess(response.data.items));
        console.log('Search Success values........ '+ JSON.stringify(response.data.items[0].sku));
        dispatch(
          getCartID(
            response.data.items[0].sku,
            '1',
            'general',
            'price',
          ),
        );
       
      }
     
      else {
        dispatch(setProductLoadCompleted());
        dispatch(setSearchedProductsFailure());
      }
    } catch (err) {}
  };
}

export function getProducts(pageNo) {
  return async (dispatch) => {
    try {
      let prodcutAll =
        API_SERVICES.PRODUCTS_ALL + pageNo + "&searchCriteria[pageSize]=10";

      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };

      const response = await requestConnector(
        "GET",
        prodcutAll,
        headers,
        null,
        null
      );

      console.log("PLP..................", JSON.stringify(response.data));

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined &&
        response.data.items.length > 0
      ) {
        dispatch(getProductsSuccess(response.data.items));
      }
      // else if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length ===0 ){
      // dispatch(setProductLoadCompleted());
      // }
      else {
        dispatch(setProductLoadCompleted());
        dispatch(getProductsFailure());
      }
    } catch (err) {}
  };
}

export function getProductDetail(sku) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.PRODUCT_BASE + sku,
        headers,
        null,
        null
      );

      if (response !== undefined && response.data !== undefined) {
        console.log(
          "Product Detail................." + JSON.stringify(response.data)
        );
        dispatch(getProductDetailSuccess(response.data));
      } else {
        dispatch(getProductDetailFailure());
      }
    } catch (err) {}
  };
}

export function getProductsListConfigurable(sku, screen) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.PRODUCT_BASE_CONFIGURABLE + sku + "/children",
        headers,
        null,
        null
      );

      dispatch(fetchingDataDone());
      if (response !== undefined && response.data !== undefined) {
        if (screen === "AllProducts") {
          dispatch(setConfigurableProducts(response.data));
        } else if (screen === "ProductDetailConfigurable") {
          dispatch(setConfigurableProductDetail(response.data));
        }
      } else {
        dispatch(getProductDetailFailure());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getCartID(
  sku,
  qty,
  status,  
  pricetype,
  option_id,  
  option_type_id,
  calledFrom,
  
) {
  return async (dispatch) => {

    console.log('Inside cart id' + pricetype);
    try {
      console.log("Inside cart id");
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_QUOTE_ID,
        headers,
        null,
        null
      );

      console.log('pricetype....' + JSON.stringify (response.data));
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(sku);
        args.push(qty);
        args.push(status);
        args.push(pricetype);
        args.push(option_id);
        args.push(option_type_id);
        dispatch(getTokenGeneral(getCartID, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setCartIdFailure());
        dispatch(fetchingDataDone());
      } else {
        if (response !== undefined && response.data !== undefined) {
          utils._storeCartID(response.data);
          dispatch(setCartId(response.data));
          if (status !== "shortDated") {
            dispatch(addToCart(sku, qty, response.data,pricetype, null, calledFrom));
          } else {
            dispatch(
              addToCartWithOptions(
                sku,
                qty,
                response.data,
                option_id,
                option_type_id
              )
            );
          }
        }
      }
    } catch (err) {
      dispatch(fetchingDataDone());
      console.log("cart id Error.......", err);
    }
  };
}

export function getCartIDGeneral() {
  return async (dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_QUOTE_ID,
        headers,
        null,
        null
      );
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getCartIDGeneral, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setCartIdFailure());
        dispatch(fetchingDataDone());
      } else {
        if (response !== undefined && response.data !== undefined) {
          utils._storeCartID(response.data);
          dispatch(setCartId(response.data));
        }
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function addToCart(sku, qty, quoteId, pricetype, id, calledFrom) {
  //
  return async (dispatch) => {

    console.log("Inside add to cart..........", sku, qty, quoteId, id,pricetype);

    try {
     
      console.log("Inside add to cart..........", sku, qty, quoteId, id,pricetype);
      

      console.log("AppToken.........", GlobalConst.AppToken);
      console.log("LoginToken.......", GlobalConst.LoginToken);
    
      dispatch(fetchingData());
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };

      console.log("Inside add to cart pricetype..........", pricetype);

      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_ADD_TO_CART,
        headers,
        null,
        {
          cartItem: {
            sku: sku,
            qty: qty,
            quote_id: quoteId,
            extension_attributes:{
              price_type: pricetype,
            }            
          },
        }
      );

      console.log(
        "Add to cart rersponse -- ",
        JSON.stringify(response)
      );

      console.log(
        "Add to cart rersponse -- ",
        JSON.stringify(response.data)
      );

      console.log(
        "Add to cart rersponse -- ",
        GlobalConst.errorStatus
      );


      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(sku);
        args.push(qty);
        args.push(quoteId);
        args.push(id);
        args.push(calledFrom);
        dispatch(getTokenGeneral(addToCart, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
        console.log(
          "GlobalConst.featuredValue........calledFrom........",
          GlobalConst.featuredValue,
          calledFrom
        );
        if (calledFrom === "Featured" && GlobalConst.featuredValue !== "") {
          dispatch(getFeatureProducts(GlobalConst.featuredValue));
        }

        //dispatch(setErrorMsg(response.error.message));
        dispatch(setErrorMsg("Could not be added to cart"));
      } else {

        dispatch(setCustomerInfoStatus());
        // dispatch(getCartListGeneral())
        dispatch(setcartAdded());
        dispatch(setCartSuccess());
        dispatch(setItemAddedToCart(true));
        // dispatch(deleteWishlist(id))

        if (response !== undefined && response.data !== undefined) {

          console.log(
            "Add to cart rersponse.............",
            JSON.stringify(response.data)
          );

          if(response.data.extension_attributes !== undefined && response.data.extension_attributes.error !== undefined){
          
            alert(response.data.extension_attributes.error);

          }

          if (GlobalConst.analyticsEnabled) {
            logAddCartToAnalytics(
              response.data.price * qty,
              response.data,
              parseInt(qty)
            );
          }
        } else {
        }
        dispatch(fetchingDataDone(false));
      }
    } catch (err) {

      // dispatch(fetchingDataDone(false));
      
      // Toast.show('Please enter Valid Quantity', Toast.SHORT);

      // console.log("Inside add to cart.11.........", sku, qty, quoteId, id);
      
      console.log("Error......", err.config);

      console.log("Error...1...", err.request._response);
      
      dispatch(fetchingDataDone(false));

      // alert(JSON.stringify(err.config.request.response));

      let response =  JSON.parse(err.request._response);

      alert(response.message);

      
      // console.log("Error...... Status Code--", err);
      
      
    }
  };
}

export function updateCart(sku, qty, quoteId) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "PUT",
        API_SERVICES.CART_UPDATE + quoteId + "items" + sku,
        headers,
        null,
        {
          cartItem: {
            item_id: sku,
            qty: qty,
            quote_id: quoteId,
            extension_attributes:{
              price_type: pricetype,
            }  
          },
        }
      );

      console.log('update Cart 1' + response);

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        console.log('update Cart' + response.data);
        args.push(sku);
        args.push(qty);
        args.push(quoteId);
        dispatch(getTokenGeneral(updateCart, args));
      } else if (response !== undefined && response.data !== undefined) {
        console.log('update Cart' + response.data);
      } else {
      }
    } catch (err) {}
  };
}

export function getAdminToken() {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          dispatch(setAdminToken(response.data.access_token));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function addToCartWithOptions(
  sku,
  qty,
  quoteId,
  option_id,
  option_type_id
) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_ADD_TO_CART,
        headers,
        null,
        {
          cartItem: {
            sku: sku,
            qty: qty,
            quote_id: quoteId,
            product_option: {
              extension_attributes: {
                custom_options: [
                  {
                    option_id: option_id,
                    option_value: option_type_id,
                  },
                ],
              },
            },
          },
        }
      );
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(sku);
        args.push(qty);
        args.push(quoteId);
        args.push(option_id);
        args.push(option_type_id);
        dispatch(getTokenGeneral(addToCartWithOptions, args));
      } else if (response !== undefined && response.status === 200) {
        dispatch(setItemAddedToCart(true));
        // dispatch(getCartListGeneral())
        dispatch(setcartAdded());
        dispatch(setCartSuccess());
      } else if ( response.status === 400) {
        console.log('Status Code 400');
      } else {
        dispatch(setItemAddedToCart(false));
      }
      dispatch(fetchingDataDone());
    } catch (err) {}
  };
}
let fetching = false;
export function getCartListGeneral() {
  return async (dispatch) => {
    if (!fetching) {
      try {
        fetching = true;
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
        };
        // const response = await requestConnector("GET", API_SERVICES.CART_ADD_TO_CART_TOTAL, headers, null,
        const response = await requestConnector(
          "GET",
          API_SERVICES.CART_MINE,
          headers,
          null,
          null
        );
        // if(response.data !== undefined ){
        //
        // }
        console.log(
          "Cartlist response..........................." +
            JSON.stringify(response.data.items)
        );
        fetching = false;
        dispatch(setcartDone());
        dispatch(fetchingDataDone());

        if (GlobalConst.errorStatus === 401) {
          let args = [];
          dispatch(getTokenGeneral(getCartListGeneral, args));
        } else if (response !== undefined && response.data !== undefined) {
          dispatch(setCartList(response.data));
          //dispatch(estimateShippingMethod(getAddressShippinggWithId()));
        } else {
          dispatch(setCartList([]));
        }
      } catch (err) {
        fetching = false;
        console.log("cartlist error.......", err);
      }
    }
  };
}

export function getCartListGeneralWithLoader() {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      // const response = await requestConnector("GET", API_SERVICES.CART_ADD_TO_CART_TOTAL, headers, null,
      const response = await requestConnector(
        "GET",
        API_SERVICES.CART_MINE,
        headers,
        null,
        null
      );
      // if(response.data !== undefined ){
      //
      // }

      dispatch(setcartDone());
      dispatch(fetchingDataDone());
      console.log("Cartlist reponse new.............", response.data);
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getCartListGeneral, args));
      } else if (response !== undefined && response.data !== undefined) {
        dispatch(setCartList(response.data));
        //dispatch(estimateShippingMethod(getAddressShippinggWithId()));
      } else {
        dispatch(setCartList([]));
      }
    } catch (err) {
      dispatch(setcartDone());
      dispatch(fetchingDataDone());
    }
  };
}

let isCartPriceCalled = false;
export function getCartPrice() {
  return async (dispatch) => {
    if (isCartPriceCalled === false) {
      try {
        isCartPriceCalled = true;
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
        };
        // const response = await requestConnector("GET", API_SERVICES.CART_ADD_TO_CART_TOTAL, headers, null,
        const response = await requestConnector(
          "GET",
          API_SERVICES.CART_ADD_TO_CART_TOTAL,
          headers,
          null,
          null
        );
        //
        isCartPriceCalled = false;
        dispatch(setcartDone());
        dispatch(fetchingDataDone());

        if (GlobalConst.errorStatus === 401) {
          let args = [];
          dispatch(getTokenGeneral(getCartPrice, args));
        } else if (response !== undefined && response.data !== undefined) {
          dispatch(setCartPriceSuccess(response.data));
          //dispatch(estimateShippingMethod(getAddressShippinggWithId()));
        } else {
          dispatch(setCartPriceSuccess({}));
        }
      } catch (err) {
        isCartPriceCalled = false;
      }
    }
  };
}

export function getCartList(address) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.CART_ADD_TO_CART_TOTAL,
        headers,
        null,
        null
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getCartList, args));
      } else if (response !== undefined && response.data !== undefined) {
        dispatch(setCartList(response.data));
      } else {
        dispatch(setCartList([]));
      }
    } catch (err) {}
  };
}

export function deleteCartItemByAdminToken(item, addToWish, list) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
          dispatch(fetchingDataDone());
        } else {
          GlobalConst.ApiAccessToken = response.data.access_token;
          dispatch(deleteCartItem(item, addToWish, list));
          // dispatch(setAdminToken(response.data));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function upateCartItemByAdminToken(item, qty, list,pcr_typ) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
          dispatch(fetchingDataDone());
        } else {
          GlobalConst.ApiAccessToken = response.data.access_token;
          dispatch(updateCartItem(item, qty, list,pcr_typ));
          // dispatch(setAdminToken(response.data));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
      dispatch(fetchingDataDone());
    }
  };
}

export function deleteCartItem(item, addToWish, list) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "DELETE",
        API_SERVICES.CART_DELETE +
          GlobalConst.cartId +
          "/items/" +
          item.item_id,
        headers,
        null,
        null
      );

      // if (GlobalConst.errorStatus === 200) {
      //   let temp = [];
      //   let index = _.findIndex(list.items, {sku: item.sku});
      //   let old_qnt = parseInt(list.items[index].qty);
      //   temp = _.cloneDeep(list);
      //   temp.items.splice(index, 1);
      //   temp.items_qty = temp.items_qty - old_qnt;
      //   dispatch(setCartList(temp));
      //   dispatch(getCartPrice());
      // } else if (GlobalConst.errorStatus === 404) {
      //   let temp = [];
      //   let index = _.findIndex(list.items, {sku: item.sku});
      //   let old_qnt = parseInt(list.items[index].qty);
      //   temp = _.cloneDeep(list);
      //   temp.items.splice(index, 1);
      //   temp.items_qty = temp.items_qty - old_qnt;
      //   dispatch(setCartList(temp));
      //   dispatch(getCartPrice());
      // } else {
      // }

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data
      ) {
        console.log(
          "Delete cart response...............",
          JSON.stringify(response.data),
          item
        );
        if (GlobalConst.analyticsEnabled) {
          logRemoveCartToAnalytics(item.price * item.qty, item);
        }

        dispatch(getCartListGeneral());
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };``
}
``
export function updateCartItem(item, qty, list,pcr_typ) {

  console.log('extension_attributes......' + item,qty,pcr_typ)

  return async (dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "PUT",
        API_SERVICES.CART_ADD_TO_CART +
        "/" +
        item.item_id,
        headers,
        null,
        {
          cartItem: {
            sku: item.sku,
            qty: qty,
            quote_id: GlobalConst.cartId,
            extension_attributes:{
              price_type: pcr_typ,
            }  
          },
        }
      );

      console.log('update Cart response ' + JSON.stringify(response.data));
      

      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data



      ) {



        console.log(
          "Update cart rersponse.............",
          JSON.stringify(response.data)
        );

        if (response.data.extension_attributes !== undefined && response.data.extension_attributes.error !== undefined) {

          alert(response.data.extension_attributes.error);

        }

        dispatch(getCartListGeneral());

      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

// export function updateCartItem(item, qty, list) {
//   return async (dispatch) => {
//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + GlobalConst.ApiAccessToken,
//       };
//       const response = await requestConnector(
//         "PUT",
//         API_SERVICES.CART_DELETE +
//           GlobalConst.cartId +
//           "/items/" +
//           item.item_id,
//         headers,
//         null,
//         {
//           cartItem: {
//             item_id: item.item_id,
//             // sku: item.sku,
//             qty: qty,
//             quote_id: GlobalConst.cartId,
//           },
//         }
//       );


//       console.log('update Cart response ' + response.data);
      
//       console.log('update Cart response ' + response.data);

//       console.log('update Cart response ' + API_SERVICES.CART_DELETE +
//       GlobalConst.cartId +
//       "/items/" +
//       item.item_id);

//       // dispatch(fetchingDataDone());
//       if (
//         response !== undefined &&
//         response.data !== undefined &&
//         response.data
//       ) {
//         dispatch(getCartListGeneral());

//         // let temp = [];
//         // let tempObj = {};

//         // let index = _.findIndex(list.items, {sku: item.sku});
//         // let old_qnt = parseInt(list.items[index].qty);
//         // let new_qnt = parseInt(response.data.qty);
//         // let diff = 0;
//         // diff = new_qnt - old_qnt;

//         // //
//         // //
//         // //

//         // temp = _.cloneDeep(list);
//         // temp.items.splice(index, 1, response.data);
//         // temp.items_qty = temp.items_qty + diff;

//         // //
//         // dispatch(setCartList(temp));
//         // dispatch(getCartPrice());
//         // dispatch(fetchingDataDone());

//         // dispatch(setcartAdded());
//       } else {
//         dispatch(fetchingDataDone());
//       }
//     } catch (err) {
//       dispatch(fetchingDataDone());
//     }
//   };
// }

export function getRelatedProducts(dosage_form) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        BASE_URL_DRL +
          "products?searchCriteria[sortOrders][0][field]=name&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[currentPage]=1&searchCriteria[pageSize]=10&searchCriteria[filterGroups][0][filters][0][field]=dosage_form&searchCriteria[filterGroups][0][filters][0][value]=" +
          dosage_form +
          "&searchCriteria[filterGroups][0][filters][0][conditionType]=like",
        headers,
        null,
        null
      );
      //
      if (response !== undefined && response.data !== undefined) {
        dispatch(getRelatedProductsSuccess(response.data.items));
      } else {
        dispatch(getRelatedProductsFailure());
      }
    } catch (err) {}
  };
}

let fetchingShipping = false;
export function estimateShippingMethod(address) {

  console.log('estimateShippingMethod.....' + JSON.stringify(address));

  return async (dispatch) => {
    if (fetchingShipping === false) {
      try {
        fetchingShipping = true;
        dispatch(fetchingData());
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
          "quote-id": GlobalConst.cartId,
        };
        const response = await requestConnector(
          "POST",
          API_SERVICES.CART_SHIPPING_METHOD,
          headers,
          null,

          address
        );

        if (GlobalConst.errorStatus === 401) {
          fetchingShipping = false;
          let args = [];
          args.push(address);
          dispatch(getTokenGeneral(estimateShippingMethod, args));
        } else if (GlobalConst.errorStatus !== 200) {
          dispatch(setErrorMsg(response.error.message));
          fetchingShipping = false;
          dispatch(fetchingDataDone());
        } else {
          dispatch(setCustomerInfoStatus());
          console.log(
            "Shipping mthd......................." +
              JSON.stringify(response.data)
          );
          if (
            response !== undefined &&
            response.data !== undefined &&
            Array.isArray(response.data)
          ) {
            dispatch(setShippingMethods(response.data));
            fetchingShipping = false;
          } else {
            dispatch(setShippingMethodsFailed([]));
          }
        }
      } catch (err) {
        fetchingShipping = false;
        dispatch(setShippingMethodsFailed([]));
        // dispatch(setShippingAddressId(""))
      }
      dispatch(fetchingDataDone(false));
      // dispatch(setShippingAddressId(""))
    }
  };
}

let fetchingTotalInformation = false;
export function getTotalInformation(
  countryId,
  region,
  regionId,
  postCode,
  shippingMethod,
  shippingAddress,
  billingAddress,
  deliveryType,
  deliveryDate,
  deliveryInstrction
) {
  return async (dispatch) => {
    // console.log('countryId....................', countryId);
    // console.log('region....................', region);
    // console.log('regionId....................', regionId);
    // console.log('postCode....................', postCode);
    // console.log('shippingMethod....................', shippingMethod);
    // console.log('billingAddress....................', billingAddress);
    // console.log('deliveryType....................', deliveryType);
    // console.log('GlobalConst.cartId....................', GlobalConst.cartId);
    console.log("Inside Total info api");
    if (fetchingTotalInformation === false) {
      try {
        dispatch(fetchingData());
        fetchingTotalInformation = true;
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
          "quote-id": GlobalConst.cartId,
        };
        const response = await requestConnector(
          "POST",
          API_SERVICES.CART_TOTAL_INFORMATION,
          headers,
          null,

          {
            addressInformation: {
              address: {
                countryId: countryId,
                region: region,
                regionId: regionId,
                postcode: postCode,
              },
              shipping_method_code: shippingMethod,
              shipping_carrier_code: shippingMethod,
            },
          }
        );

        console.log(
          "Total info response................." + JSON.stringify(response.data)
        );

        fetchingTotalInformation = false;
        if (GlobalConst.errorStatus === 401) {
          let args = [];
          args.push(countryId);
          args.push(region);
          args.push(regionId);
          args.push(postCode);
          args.push(shippingMethod);
          args.push(shippingAddress);
          args.push(billingAddress);
          args.push(deliveryType);
          args.push(deliveryDate);
          args.push(deliveryInstrction);
          dispatch(getTokenGeneral(getTotalInformation, args));
        } else if (GlobalConst.errorStatus !== 200) {
          // dispatch(setErrorMsg(response.error.message));
          dispatch(setErrorMsg("Please try again"));
          fetchingTotalInformation = false;
          dispatch(fetchingDataDone());
        } else {
          if (response !== undefined && response.data !== undefined) {
            dispatch(setShippingTotalInformation(response.data));

            ///.................

            dispatch(
              setShippingInformation(
                shippingAddress,
                billingAddress,
                deliveryType,
                deliveryDate,
                deliveryInstrction,
                countryId,
                region,
                regionId,
                postCode,
                shippingMethod
              )
            );

            //...................
            // dispatch(
            //   setShippingInformation(
            //     shippingAddress,
            //     billingAddress,
            //     deliveryType,
            //     deliveryDate,
            //     deliveryInstrction,
            //   ),
            // );
            fetchingTotalInformation = false;
          } else {
            //dispatch(setShippingTotalInformationFalied());
          }
        }
        dispatch(fetchingDataDone(false));
      } catch (err) {
        //dispatch(setShippingTotalInformationFalied());
        fetchingTotalInformation = false;
        dispatch(fetchingDataDone(false));
      }
    }
  };
}

let count = 0;
let setShippingInfo = false;
export function setShippingInformation(
  shippingAddress,
  billingAddress,
  deliveryType,
  deliveryDate,
  deliveryInstrction,
  countryId,
  region,
  regionId,
  postCode,
  shippingMethod
) {
  return async (dispatch) => {
    if (setShippingInfo === false) {
      try {
        console.log("Count...........", count);
        const body = {
          addressInformation: {
            shippingAddress,
            billingAddress,
            // "shipping_method_code": "standardshipping",
            // "shipping_carrier_code": "standardshipping"
            shipping_method_code: deliveryType,
            shipping_carrier_code: deliveryType,
            extension_attributes: {
              rgdd_delivery_date: deliveryDate,
              rgdd_delivery_comment: deliveryInstrction,
            },
          },
        };

        console.log(
          "Set Shipping Info Body......................." + JSON.stringify(body)
        );
        setShippingInfo = true;
        // dispatch(fetchingData());
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
        };
        const response = await requestConnector(
          "POST",
          API_SERVICES.CART_SHIPPING_INFORMATION,
          headers,
          null,

          {
            addressInformation: {
              shippingAddress,
              billingAddress,
              // "shipping_method_code": "standardshipping",
              // "shipping_carrier_code": "standardshipping"
              shipping_method_code: deliveryType,
              shipping_carrier_code: deliveryType,
              extension_attributes: {
                rgdd_delivery_date: deliveryDate,
                rgdd_delivery_comment: deliveryInstrction,
              },
            },
          }
        );
        setShippingInfo = false;
        //
        console.log(
          "SetShippingInfo..................." + JSON.stringify(response)
        );
        if (GlobalConst.errorStatus === 401) {
          let args = [];
          args.push(shippingAddress);
          args.push(billingAddress);
          args.push(deliveryType);
          args.push(deliveryDate);
          args.push(deliveryInstrction);
          dispatch(getTokenGeneral(setShippingInformation, args));
        } else if (GlobalConst.errorStatus === 400) {
          count = count + 1;
          if (count <= 1) {
            dispatch(
              getTotalInformation(
                countryId,
                region,
                regionId,
                postCode,
                shippingMethod,
                shippingAddress,
                billingAddress,
                deliveryType,
                deliveryDate,
                deliveryInstrction
              )
            );
          } else {
            dispatch(setErrorMsg("Please Try Again"));
            dispatch(fetchingDataDone());
          }
        } else if (GlobalConst.errorStatus !== 200) {
          //dispatch(setErrorMsg(response.error.message));
          dispatch(setErrorMsg("Please Try Again"));
          dispatch(fetchingDataDone());
        } else {
          if (response !== undefined && response.data !== undefined) {
            //dispatch(setShippingTotalInformation(response.data))
          } else {
            //dispatch(setShippingTotalInformationFalied())
          }
        }
      } catch (err) {
        dispatch(setShippingTotalInformationFalied());
        setShippingInfo = false;
      }
      // dispatch(fetchingDataDone(false))
    }
  };
}

export function paymentInformation(cartId, billingAddress, poNumber) {


  console.log('payment Info.....'+ cartId +' - '+ JSON.stringify(billingAddress) +' - '+ poNumber);

  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
        "quote-id": cartId,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_PAYMENT_INFORMATION,
        headers,
        null,

        {
          cartId: cartId,
          billingAddress,
          paymentMethod: {
            method: "purchaseorder",
            po_number: poNumber,
            additional_data: null,
            extension_attributes: {
              agreement_ids: ["1"],
            },
          },
        }
      );

      console.log('Order ID --- '+ JSON.stringify(response));

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(cartId);
        args.push(billingAddress);
        args.push(poNumber);
        dispatch(getTokenGeneral(paymentInformation, args));
      } else if (GlobalConst.errorStatus !== 200) {
        // dispatch(setErrorMsg(response.error.message));
        dispatch(setErrorMsg("Please Try Again"));
        dispatch(fetchingDataDone());
      } else {
        if (response !== undefined && response.data !== undefined) {
          // dispatch(setOrderId(response.data))

          console.log('Order ID....'+ JSON.stringify(response.data));

          dispatch(getAdminTokenForOrderID(response.data));

          // {dispatch(setErrorMsg(''))}
          // dispatch(getAdminTokenForOder(GlobalConst.customerId))
          // dispatch(getCartIDGenerail())
          // dispatch(fetchingDataDone(false))
        } else {
          dispatch(setOrderFailed());
          dispatch(fetchingDataDone(false));
        }
      }
    } catch (err) {
      dispatch(setOrderFailed());
      dispatch(fetchingDataDone(false));
    }
    // dispatch(fetchingDataDone(false))
  };
}

let wishListFetching = false;
export function getWishlist() {
  return async (dispatch) => {
    if (wishListFetching === false) {
      try {
        wishListFetching = true;
        // dispatch(fetchingData());
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GlobalConst.LoginToken,
        };
        const response = await requestConnector(
          "GET",
          API_SERVICES.GET_WISHLIST,
          headers,
          null,
          null
        );

        dispatch(setWishlistDone());
        dispatch(fetchingDataDone());
        wishListFetching = false;
        if (GlobalConst.errorStatus === 401) {
          let args = [];
          dispatch(getTokenGeneral(getWishlist, args));
        } else if (response !== undefined && response.data !== undefined) {

          

          dispatch(
            setWishlistSuccess({
              items: response.data,
              items_count: response.data.length,
            })
          );
          // dispatch(setWishlistSuccess(response.data));
        } else {
          dispatch(setWishlistFailure());
        }
      } catch (err) {
        wishListFetching = false;
      }
    }
  };
}

export function getCartIDGenerail() {
  return async (dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.CART_QUOTE_ID,
        headers,
        null,
        null
      );
      dispatch(fetchingDataDone());
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        dispatch(getTokenGeneral(getCartIDGenerail, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setCartIdFailure());
      } else {
        if (response !== undefined && response.data !== undefined) {
          utils._storeCartID(response.data);
          dispatch(setCartId(response.data));
        }
      }
    } catch (err) {}
  };
}

export function addWishlist(sku) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      dispatch(setWishlistDone());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADD_WISHLIST + sku,
        headers,
        null,
        null
      );

      // dispatch(fetchingDataDone());
      // if(response.data === undefined){
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(sku);
        dispatch(getTokenGeneral(addWishlist, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
        dispatch(fetchingDataDone());
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data === true
        ) {
          dispatch(getWishlist());
        } else {
          dispatch(fetchingDataDone());
          // dispatch(setWishlistFailure())
        }
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function updateWishlist(id, qnt) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      // dispatch(setWishlistDone());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "PUT",
        API_SERVICES.UPDATE_WISHLIST + id + "/qty/" + qnt,
        headers,
        null,
        null
      );

      // dispatch(fetchingDataDone());
      // if(response.data === undefined){
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(id);
        args.push(qnt);
        dispatch(getTokenGeneral(updateWishlist, args));
      } else if (GlobalConst.errorStatus !== 200) {
        dispatch(setErrorMsg(response.error.message));
        dispatch(fetchingDataDone());
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data === true
        ) {
          dispatch(getWishlist());
        } else {
          dispatch(fetchingDataDone());
          // dispatch(setWishlistFailure())
        }
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getAdminTokenForWishListDelete(id) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          dispatch(setAdminToken(response.data.access_token));
          dispatch(deleteWishlist(id));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function deleteWishlist(id) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "DELETE",
        API_SERVICES.DELETE_WISHLIST + id,
        headers,
        null,
        null
      );

      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(id);
        dispatch(getTokenGeneral(deleteWishlist, args));
      } else if (response !== undefined && response.data === true) {
        // dispatch(setWishlistEmpty());
        // dispatch(setWishlist()); //4737//0480

        dispatch(getWishlist());
      } else {
        dispatch(setErrorMsg("Item could not be removed from Wishlist"));

        // dispatch(setWishlistFailure())
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getAdminTokenForTracking(id) {
  return async (dispatch) => {
    try {
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          dispatch(setAdminToken(response.data.access_token));
          dispatch(getTrackingInfo(id, response.data.access_token));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function getTrackingInfo(id, token) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.TRACKING_INFO + id,
        headers,
        null,
        null
      );

      // dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined
      ) {
        dispatch(setTrackingInfoSuccess(response.data.items));
        dispatch(getAdminTokenForInvoice(id));
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getAdminTokenForInvoice(id) {
  return async (dispatch) => {
    try {
      //dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          console.log("check 1.................");
          dispatch(setAdminToken(response.data.access_token));
          dispatch(getInvoiceInfo(id, response.data.access_token));
        }
      }
    } catch (err) {
      console.log("Error 1....................", err);
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function getInvoiceInfo(id, token) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      console.log("Invoice info call check...............", id, token);
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.INVOICE_INFO + id,
        headers,
        null,
        null
      );

      // dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined
      ) {
        dispatch(fetchingDataDone());

        dispatch(setInvoiceInfoSuccess(response.data.items));
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      console.log("Error 2..................", err);
      dispatch(fetchingDataDone());
    }
  };
}
//.....................................
export function getAdminTokenForInvoiceWithLoader(id) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
          dispatch(fetchingDataDone());
        } else {
          dispatch(setAdminToken(response.data.access_token));
          dispatch(getInvoiceInfoWithLoader(id, response.data.access_token));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function getInvoiceInfoWithLoader(id, token) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.INVOICE_INFO + id,
        headers,
        null,
        null
      );
      console.log(
        "Invoice info................",
        JSON.stringify(response.data)
      );
      // dispatch(fetchingDataDone());
      if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.items !== undefined
      ) {
        dispatch(fetchingDataDone());
        dispatch(setInvoiceInfoSuccess(response.data.items));
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

//....................................

export function checkStockStatus(sku) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.STOCK_STATUS + sku,
        headers,
        null,
        null
      );
      //
      dispatch(fetchingDataDone());
      if (response !== undefined && response.data !== undefined) {
        dispatch(setStockStatus("" + response.data.qty));
        if (parseInt(response.data.qty) === 0) {
          dispatch(fetchingDataDone());
        }
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function checkStockStatusWithLoader(sku) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.STOCK_STATUS + sku,
        headers,
        null,
        null
      );
      //
      dispatch(fetchingDataDone());
      if (response !== undefined && response.data !== undefined) {
        dispatch(setStockStatus("" + response.data.qty));
        if (parseInt(response.data.qty) === 0) {
          dispatch(fetchingDataDone());
        }
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function reorder(id) {
  return async (dispatch) => {
    try {
      console.log("Reorder ID..............", id);
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.LoginToken,
      };
      const response = await requestConnector(
        "POST",
        API_SERVICES.REORDER + id,
        headers,
        null,
        null
      );

      // dispatch(fetchingDataDone());
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(id);
        dispatch(getTokenGeneral(reorder, args));
      } else if (
        response !== undefined &&
        response.data !== undefined &&
        response.data.length > 0
      ) {
        dispatch(setCustomerInfoStatus());
        dispatch(setReorderMsg(response.data));
        // dispatch(getCartListGeneral())
        dispatch(setcartAdded());
        dispatch(setCartSuccess());
        dispatch(setItemAddedToCart(true));
        dispatch(fetchingDataDone());
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getLoginTokenGeneral(functionCall) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.TOKEN_URL,
        null,
        null,
        JSON.parse(GlobalConst.creds)
      );

      if (response.data === undefined) {
        dispatch(getTokenFailure(true));
      } else {
        GlobalConst.TOKEN_URL = API_SERVICES.TOKEN_URL;
        // GlobalConst.API_ACCESS_TOKEN = response.data;
        dispatch(getTokenSuccess(response.data));
        GlobalConst.LoginToken = response.data;

        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "" + GlobalConst.LoginToken + "",
        };

        dispatch(functionCall(headers));
      }
    } catch (err) {
      dispatch(getTokenFailure(true));
    }
  };
}

function getTokenGeneral(functionCall, args) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.TOKEN_URL,
        null,
        null,
        JSON.parse(GlobalConst.creds)
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

export function getAdminTokenForOrderID(id) {

  console.log('Order ID 1......' + id);

  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
          dispatch(fetchingDataDone());
        } else {
          dispatch(setAdminToken(response.data.access_token));
          GlobalConst.ApiAccessToken = response.data.access_token;
          dispatch(getOrderByID(id));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
      dispatch(fetchingDataDone());
    }
  };
}

export function getOrderByID(id) {

    console.log('Order ID 2 ......' + id);

  return async (dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.GET_ORDER_BY_ID + id,
        headers,
        null,
        null
      );
      // dispatch(fetchingDataDone());
      //

      if (response !== undefined && response.data !== undefined) {
        dispatch(setOrderId(response.data.increment_id));

        if (GlobalConst.analyticsEnabled) {
          logPurchaseToAnalytics(
            response.data.base_grand_total,
            response.data.increment_id,
            response.data.items,
            response.data.base_shipping_amount
          );
        }

        {
          dispatch(setErrorMsg(""));
        }
        dispatch(getAdminTokenForOder(GlobalConst.customerId));
        dispatch(getCartIDGenerail());
        dispatch(fetchingDataDone());
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getDeliveryDates() {
  return async (dispatch) => {
    try {
      // const headers = {
      // "Content-Type": "application/json",
      // "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
      // }
      const response = await requestConnector(
        "GET",
        API_SERVICES.GET_DELIVERY_DATE,
        null,
        null,
        null
      );
      // dispatch(fetchingDataDone());
      //

      if (response !== undefined && response.data !== undefined) {
        console.log(
          "Delivery dates................" + JSON.stringify(response.data)
        );
        dispatch(setDeliveryDateSuccess(response.data));
        dispatch(fetchingDataDone());
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getAdminTokenForPrintShipment(id, allShipment) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      dispatch(setShipmentDownloadStarted(true));
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
          dispatch(setShipmentDownloadStarted(false));
        } else {
          dispatch(setAdminToken(response.data.access_token));
          dispatch(printShipment(id, response.data.access_token, allShipment));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function printShipment(id, token, allShipment) {
  var path = "";
  if (allShipment !== undefined && allShipment) {
    path =
      RNFS.DocumentDirectoryPath + "/" + "drl_order_shipping_" + id + ".pdf";
  } else {
    path = RNFS.DocumentDirectoryPath + "/" + "drl_shipping_" + id + ".pdf";
  }

  return async (dispatch) => {
    let fileStats = 0;

    if (await RNFS.exists(path)) {
      fileStats = await RNFS.stat(path);
    }

    if (fileStats.size !== undefined && fileStats.size > 0) {
      dispatch(setShipmentDownloadStarted(false));
      if (Platform.OS === "ios") {
        RNFetchBlob.ios.previewDocument(path);
      } else {
        FileViewer.open(path)
          .then(() => {})
          .catch((error) => {});
      }
    } else {
      dispatch(fetchingData());
      try {
        const headers = {
          //"Accept": "application/pdf",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        };
        let URL = "";
        if (allShipment !== undefined && allShipment) {
          URL = API_SERVICES.PRINT_SHIPMENT_ALL + id;
        } else {
          URL = API_SERVICES.PRINT_SHIPMENT + id;
        }
        const response = await requestConnector(
          "GET",
          URL,
          headers,
          null,
          null
        );

        if (response !== undefined && response.data !== undefined) {
          dispatch(fetchingDataDone());
          RNFetchBlob.fs
            .writeFile(path, response.data, "base64")
            .then((success) => {
              dispatch(setShipmentDownloadStarted(false));

              if (Platform.OS === "ios") {
                RNFetchBlob.ios.previewDocument(path);
              } else {
                FileViewer.open(path)
                  .then(() => {})
                  .catch((error) => {});
              }
            })
            .catch((err) => {
              dispatch(fetchingDataDone());
              dispatch(setShipmentDownloadStarted(false));
            });
        } else {
          dispatch(fetchingDataDone());
          dispatch(setShipmentDownloadStarted(false));
        }
      } catch (err) {
        dispatch(fetchingDataDone());
      }
    }
  };
}

export function getAdminTokenForPrintInvoice(id, allInvoice) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      dispatch(setInvoiceDownloadStarted(true));
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          dispatch(setAdminToken(response.data.access_token));
          dispatch(printInvoice(id, response.data.access_token, allInvoice));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

export function printInvoice(id, token, allInvoice) {
  var path = RNFS.DocumentDirectoryPath + "/" + "drl_invoice_" + id + ".pdf";

  if (allInvoice !== undefined && allInvoice) {
    path =
      RNFS.DocumentDirectoryPath + "/" + "drl_invoice_allInvoice" + id + ".pdf";
  } else {
    path = RNFS.DocumentDirectoryPath + "/" + "drl_invoice_" + id + ".pdf";
  }

  return async (dispatch) => {
    let fileStats = 0;

    if (await RNFS.exists(path)) {
      fileStats = await RNFS.stat(path);
    }

    if (fileStats.size !== undefined && fileStats.size > 0) {
      dispatch(setInvoiceDownloadStarted(false));
      if (Platform.OS === "ios") {
        RNFetchBlob.ios.previewDocument(path);
      } else {
        FileViewer.open(path)
          .then(() => {})
          .catch((error) => {});
      }
    } else {
      try {
        dispatch(fetchingData());
        const headers = {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        };

        let URL = "";
        if (allInvoice !== undefined && allInvoice) {
          URL = API_SERVICES.PRINT_INVOICE_ALL + id;
        } else {
          URL = API_SERVICES.PRINT_INVOICE + id;
        }

        const response = await requestConnector(
          "GET",
          URL,
          headers,
          null,
          null
        );
        //
        // dispatch(fetchingDataDone());

        console.log("Invoice response............", response);

        if (response !== undefined && response.data !== undefined) {
          dispatch(fetchingDataDone());
          RNFetchBlob.fs
            .writeFile(path, response.data, "base64")
            .then((success) => {
              dispatch(setInvoiceDownloadStarted(false));

              if (Platform.OS === "ios") {
                RNFetchBlob.ios.previewDocument(path);
              } else {
                FileViewer.open(path)
                  .then(() => {})
                  .catch((error) => {});
              }
            })
            .catch((err) => {
              dispatch(fetchingDataDone());
            });
        } else {
          dispatch(fetchingDataDone());
          dispatch(setInvoiceDownloadStarted(false));
        }
      } catch (err) {
        dispatch(fetchingDataDone());
        dispatch(setInvoiceDownloadStarted(false));
      }
    }
  };
}

export function checkStockStatusPDP(sku) {
  return async (dispatch) => {
    try {
      // dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.STOCK_STATUS + sku,
        headers,
        null,
        null
      );
      console.log("Stock info................", response.data.qty);
      dispatch(fetchingDataDone());
      if (response !== undefined && response.data !== undefined) {
        dispatch(setStockStatusPDP("" + response.data.qty));
        if (parseInt(response.data.qty) === 0) {
          dispatch(fetchingDataDone());
        }
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getProductDetailWishlist(sku) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };

      console.log("Bearer -- " + GlobalConst.ApiAccessToken);

      const response = await requestConnector(
        "GET",
        API_SERVICES.PRODUCT_BASE + sku,
        headers,
        null,
        null
      );
      //
      if (response !== undefined && response.data !== undefined) {
        dispatch(getProductDetailSuccessWishlist(response.data));
      } else {
        dispatch(fetchingDataDone());
      }
    } catch (err) {
      dispatch(fetchingDataDone());
    }
  };
}

export function getProductDetailConfigurable(sku) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "GET",
        API_SERVICES.PRODUCT_BASE + sku,
        headers,
        null,
        null
      );

      if (response !== undefined && response.data !== undefined) {
        dispatch(getProductDetailConfigurableSuccess(response.data));
      }
    } catch (err) {}
    dispatch(fetchingDataDone());
  };
}

//.........................Admin token on 404....................
export function getAdminTokenGeneral(functionCall, args) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        "POST",
        API_SERVICES.ADMIN_TOKEN_URL,
        null,
        null,

        {
          secure_token: GlobalConst.AppToken,
        }
      );

      if (GlobalConst.errorStatus !== 200) {
        dispatch(fetchingDataDone());
      } else {
        if (
          response.data === undefined ||
          response.data.access_token === undefined
        ) {
          dispatch(setAdminTokenFailure(true));
        } else {
          dispatch(setAdminToken(response.data.access_token));
          GlobalConst.ApiAccessToken = response.data.access_token;
          dispatch(functionCall(...args));
        }
      }
    } catch (err) {
      dispatch(setAdminTokenFailure(true));
    }
  };
}

//....................Cart Coupon APIs..........................

export function applyCoupon(coupon, cartID, calledFrom, totalInfoArgs) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      console.log(
        "URL..................",
        API_SERVICES.CART_COUPON + cartID + "/coupons/" + coupon
      );
      console.log("Admin token..................", GlobalConst.ApiAccessToken);
      const response = await requestConnector(
        "PUT",
        API_SERVICES.CART_COUPON + cartID + "/coupons/" + coupon,
        headers,
        null,
        null
      );

      console.log(
        "Apply coupon response......................." +
          JSON.stringify(response)
      );
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(coupon);
        args.push(cartID);
        args.push(calledFrom);
        args.push(totalInfoArgs);
        dispatch(getAdminTokenGeneral(applyCoupon, args));
      } else if (GlobalConst.errorStatus !== 200) {
        console.log("Check here...........");
        dispatch(setCouponApplied("NA"));
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data
        ) {
          dispatch(setCouponApplied(coupon));
          dispatch(getCartListGeneral());
          if (calledFrom !== undefined && calledFrom === "checkout") {
            dispatch(getCartPrice());
            dispatch(getTotalInformation(...totalInfoArgs));
          }
        }
      }
    } catch (err) {
      console.log("Error..............", err);
    }
    dispatch(fetchingDataDone());
  };
}

export function deleteCoupon(cartID, calledFrom, totalInfoArgs) {
  return async (dispatch) => {
    try {
      dispatch(fetchingData());
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GlobalConst.ApiAccessToken,
      };
      const response = await requestConnector(
        "DELETE",
        API_SERVICES.CART_COUPON + cartID + "/coupons",
        headers,
        null,
        null
      );

      console.log(
        "Delete coupon response......................." +
          JSON.stringify(response)
      );
      if (GlobalConst.errorStatus === 401) {
        let args = [];
        args.push(cartID);
        args.push(calledFrom);
        args.push(totalInfoArgs);
        dispatch(getAdminTokenGeneral(deleteCoupon, args));
      } else if (GlobalConst.errorStatus !== 200) {
      } else {
        if (
          response !== undefined &&
          response.data !== undefined &&
          response.data
        ) {
          dispatch(setCouponApplied(""));
          dispatch(getCartListGeneral());
          if (calledFrom !== undefined && calledFrom === "checkout") {
            dispatch(getCartPrice());
            console.log("Total Info args......................", totalInfoArgs);
            dispatch(getTotalInformation(...totalInfoArgs));
          }
        }
      }
    } catch (err) {
      console.log("Error..............", err);
    }
    dispatch(fetchingDataDone());
  };
}
