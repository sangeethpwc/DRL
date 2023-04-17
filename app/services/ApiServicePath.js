//.................. pwcdemo End points...............................................

// let BASE_URL_DRL = 'http://pwcdemo.eastus.cloudapp.azure.com/dr-reddys-laboratories-ltd/rest/V1/';
// let BASE_URL_DELIVERY_DATE ='http://pwcdemo.eastus.cloudapp.azure.com/dr-reddys-laboratories-ltd/';
// let LICENSE_BASE_URL= "http://pwcdemo.eastus.cloudapp.azure.com/dr-reddys-laboratories-ltd/media/customer_address";
// let BASE_URL_IMAGE='http://pwcdemo.eastus.cloudapp.azure.com/dr-reddys-laboratories-ltd/media/catalog/product';
// let BANNER_IMAGE_URL ='http://pwcdemo.eastus.cloudapp.azure.com/dr-reddys-laboratories-ltd/media/';

//....................................................................................

//.................. Integration End points...............................................

// let BASE_URL_DRL = 'http://integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud/rest/V1/';
// let BASE_URL_DELIVERY_DATE ='http://integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud/';
// let LICENSE_BASE_URL= "http://integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud/media/customer_address";
// let BASE_URL_IMAGE='http://integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud/media/catalog/product';
// let BANNER_IMAGE_URL ='http://integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud/media/';

//....................................................................................

//.................. Staging End points...............................................
let BASE_URL_DRL = 'https://mcstaging.drreddysdirect.com/rest/V1/';
let BASE_PRODUCT_URL = 'https://mcstaging.drreddysdirect.com/rest/V1/ecomm-api/';
let BASE_URL_DELIVERY_DATE = 'https://mcstaging.drreddysdirect.com/';
let LICENSE_BASE_URL =
  'https://mcstaging.drreddysdirect.com/media/customer_address';
let BASE_URL_IMAGE =
  'https://mcstaging.drreddysdirect.com/media/catalog/product';
let BANNER_IMAGE_URL = 'https://mcstaging.drreddysdirect.com/media/';
//....................................................................................

module.exports = {
  BASE_URL_DRL, 
  LICENSE_BASE_URL,
  BASE_URL_IMAGE,
  BANNER_IMAGE_URL,
  BASE_URL_DELIVERY_DATE,

  FEATURE_PRODUCTS:
  BASE_PRODUCT_URL +
    'products?searchCriteria[sortOrders][0][field]=name&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[currentPage]=1&searchCriteria[pageSize]=10&searchCriteria[filterGroups][0][filters][0][field]=categorytype&searchCriteria[filterGroups][0][filters][0][value]=',

  RESET_PASSWORD: BASE_URL_DRL + 'customers/password',

  GET_DETAILS: BASE_URL_DRL + 'ecomm-api/get-api-access',

  API_ACCESS_TOKEN: BASE_URL_DRL + 'ecomm-api/get-access-token',

  TOKEN_URL: BASE_URL_DRL + 'integration/customer/token',

  ADMIN_TOKEN_URL: BASE_URL_DRL + 'ecomm-api/get-access-token',
  
  CUSTOMER_INFO: BASE_URL_DRL + 'customers/me',

  VIDEO_LIST: BASE_URL_DRL + 'ecomm-videolist/get-video-details',

  DeviceIdUpload: BASE_URL_DRL + 'pushnotification',

  GET_VERISON_INFO: BASE_URL_DRL + 'ecomm-api/version-info',
  TC_CONSENT_SAVE: BASE_URL_DRL + 'ecomm-api/policy-track',

  AWARDS:
    BASE_URL_DRL +
    'rewards/getList?&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=ASC',
  NEWS_SCROLL_BLOCK_3:
    BASE_URL_DRL +
    'news/getList?&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=ASC',
  VOICE_OF_CUSTOMER:
    BASE_URL_DRL +
    'voiceofcustomer/getList?&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=ASC',

  PRODUCTS_ALL:
  BASE_PRODUCT_URL +
    'products?searchCriteria[sortOrders][0][field]=name&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[currentPage]=',
  PRODUCTS_SEARCH:
  BASE_PRODUCT_URL +
    'products?searchCriteria[sortOrders][0][field]=name&searchCriteria[sortOrders][0][direction]=ASC',

  PRODUCT_BASE: BASE_PRODUCT_URL + 'products/',

  PRODUCT_BASE_CONFIGURABLE: BASE_URL_DRL + 'configurable-products/',

  RECENT_ORDERS_HOME:
    BASE_URL_DRL +
    'orders?&searchCriteria[currentPage]=1&searchCriteria[pageSize]=5&searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]=',

  RECENT_ORDERS:
    BASE_URL_DRL +
    'orders?&searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]=',

  UPCOMING_ORDERS_HOME:
    BASE_URL_DRL +
    'orders?&searchCriteria[currentPage]=1&searchCriteria[pageSize]=5&searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]=',

  ORDER_DETAIL: BASE_URL_DRL + 'orders/',

  ORDER_LIST:
    BASE_URL_DRL +
    'orders?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]=',
  INVOICE_LIST:
    BASE_URL_DRL +
    'invoices?searchCriteria[filter_groups][0][filters][0][field]=order_id&searchCriteria[filter_groups][0][filters][0][value]=',

  PRODUCT_ATTRIBUTES:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_id&searchCriteria[filterGroups][0][filters][0][value]=',
  BANNER_URL: BASE_URL_DRL + 'bannerList',
  CAT_NAMES_CUSTOM:
    BASE_URL_DRL + 'ecomm-api/get-attributes-with-product-count',
  BRAND_NAMES:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=brand_name&searchCriteria[filterGroups][0][filters][0][condition_type]=like',

  CAT_NAMES:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=drl_division&searchCriteria[filterGroups][0][filters][0][condition_type]=like',

  MED_TYPES:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=dosage_form&searchCriteria[filterGroups][0][filters][0][condition_type]=like',
  PACK_SIZE:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=pack_size&searchCriteria[filterGroups][0][filters][0][condition_type]=like',
  STRENGTH:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=strength&searchCriteria[filterGroups][0][filters][0][condition_type]=like',
  FILTER_CATEGORY:
    BASE_URL_DRL +
    'products/attributes?searchCriteria[filterGroups][0][filters][0][field]=attribute_code&searchCriteria[filterGroups][0][filters][0][value]=categorytype&searchCriteria[filterGroups][0][filters][0][condition_type]=like',
  APPLICATION_STATUS:
    BASE_URL_DRL + 'attributeMetadata/customer/attribute/application_status',
  REGION: BASE_URL_DRL + 'directory/countries',
  ADDRESS_STATUS:
    BASE_URL_DRL + 'attributeMetadata/customerAddress/attribute/address_status',

  FAQ_URL:
    BASE_URL_DRL +
    'cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=view-faqs&searchCriteria[filterGroups][0][filters][0][conditionType]=like',
  PRIVACY_URL:
    BASE_URL_DRL +
    'cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=privacy-notice&searchCriteria[filterGroups][0][filters][0][conditionType]=like',
  TERMS_URL:
    BASE_URL_DRL +
    'cmsBlock/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=mobiletc',
  GEN_TERMS_URL:
    BASE_URL_DRL +
    'cmsBlock/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=eula_mobile',

  TRACKING_INFO:
    BASE_URL_DRL +
    'shipments?searchCriteria[filterGroups][0][filters][0][field]=order_id&searchCriteria[filterGroups][0][filters][0][value]=',
  INVOICE_INFO:
    BASE_URL_DRL +
    'invoices?searchCriteria[filterGroups][0][filters][0][field]=order_id&searchCriteria[filterGroups][0][filters][0][value]=',

  PRINT_SHIPMENT: BASE_URL_DRL + 'htmltopdf/shipping/',

  PRINT_SHIPMENT_ALL: BASE_URL_DRL + 'htmltopdf/shipping/all/',

  PRINT_INVOICE: BASE_URL_DRL + 'htmltopdf/invoice/',

  PRINT_INVOICE_ALL: BASE_URL_DRL + 'htmltopdf/invoice/all/',

  GET_WISHLIST: BASE_URL_DRL + 'wishlist',
  ADD_WISHLIST: BASE_URL_DRL + 'wishlist/', //sku
  DELETE_WISHLIST: BASE_URL_DRL + 'wishlist/', //id

  CART_QUOTE_ID: BASE_URL_DRL + 'carts/mine',
  CART_ADD_TO_CART: BASE_URL_DRL + 'carts/mine/items',
  CART_UPDATE: BASE_URL_DRL + 'carts', // "/carts/55/items/87"
  CART_ADD_TO_CART_OPTIONS: BASE_URL_DRL + 'carts/mine/items',
  CART_ADD_TO_CART_TOTAL: BASE_URL_DRL + 'carts/mine/totals',
  CART_MINE: BASE_URL_DRL + 'carts/mine',

  CART_DELETE: BASE_URL_DRL + 'carts/',

  CART_SHIPPING_METHOD: BASE_URL_DRL + 'carts/mine/estimate-shipping-methods',
  CART_TOTAL_INFORMATION: BASE_URL_DRL + 'carts/mine/totals-information',
  CART_SHIPPING_INFORMATION: BASE_URL_DRL + 'carts/mine/shipping-information',
  CART_PAYMENT_INFORMATION: BASE_URL_DRL + 'carts/mine/payment-information',

  ADD_ADDRESS: BASE_URL_DRL + 'customers/me',
  UPDATE_ADDRESS: BASE_URL_DRL + 'customers/me',
  GET_SHIPPING: BASE_URL_DRL + 'customers/me/shippingAddress',
  GET_BILLING: BASE_URL_DRL + 'customers/me/billingAddress',
  DELETE_ADDRESS: BASE_URL_DRL + 'addresses/',
  EDIT_PROFILE: BASE_URL_DRL + 'customers/me',
  UPDATE_SUBSCRIPTION: BASE_URL_DRL + 'customers/',
  UPDATE_SHIPPING_ADDRESS: BASE_URL_DRL + 'ecomm-api/setshippingaddress',

  UPLOAD_DOC: BASE_URL_DRL + 'address/upload/document',

  RAISE_SERVICE_REQUEST: BASE_URL_DRL + 'servicerequest/add',
  GET_SERVICE_REQUEST_ACTIVE:
    BASE_URL_DRL +
    'servicerequest/getList?searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=0&searchCriteria[sortOrders][0][field]=id&searchCriteria[sortOrders][0][direction]=DESC',
  GET_SERVICE_REQUEST_HISTORY:
    BASE_URL_DRL +
    'servicerequest/getList?searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=1&searchCriteria[sortOrders][0][field]=id&searchCriteria[sortOrders][0][direction]=DESC',

  CONTACT_US: BASE_URL_DRL + 'contactus?',

  STOCK_STATUS: BASE_URL_DRL + 'stockStatuses/',
  REORDER: BASE_URL_DRL + 'reorder/', //entity_id
  ORDER_STATUS: BASE_URL_DRL + 'getorderstatus',
  GET_ORDER_BY_ID: BASE_URL_DRL + 'orders/',

  UPDATE_WISHLIST: BASE_URL_DRL + 'wishlist/',

  GET_DELIVERY_DATE: BASE_URL_DELIVERY_DATE + 'rdd/getdate?delivery_method=all',

  RESOURCE_CATEGORY:
    BASE_URL_DRL +
    'resources/getcategoryList?searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=ASC',
  RESOURCES:
    BASE_URL_DRL +
    'resources/getList?searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=ASC',

  PARTOFORG_LABELS:
    BASE_URL_DRL + 'attributeMetadata/customer/attribute/partof_organization',
  BUSINESSTYPE_LABELS:
    BASE_URL_DRL + 'attributeMetadata/customer/attribute/business_type',

  CART_COUPON: BASE_URL_DRL + 'carts/',

  productApiURLGenerator(
    dosage,
    theraputic,
    brand,
    currentPage,
    name,
    filterCategories,
  ) {
    let BASE_URL =
    BASE_PRODUCT_URL +
      'products?searchCriteria[sortOrders][0][field]=name&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[filter_groups][0][filters][0][field]=website_id&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[currentPage]=' +
      currentPage +
      '&searchCriteria[pageSize]=10';
    let temp = '';

    if (filterCategories !== undefined) {
      // temp="&searchCriteria[filterGroups][0][filters][0][field]=categorytype&searchCriteria[filterGroups][0][filters][0][value]="+filterCategories+"&searchCriteria[filterGroups][0][filters][0][conditionType]=in"

      let c = 0;
      if (filterCategories.length > 0) {
        let tempArray = '';
        for (i = 0; i < filterCategories.length; i++) {
          tempArray = tempArray + filterCategories[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=categorytype&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }
      //.......................................................................................
      if (dosage.length > 0) {
        let tempArray = '';
        for (i = 0; i < dosage.length; i++) {
          tempArray = tempArray + dosage[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=dosage_form&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (theraputic.length > 0) {
        let tempArray = '';
        for (i = 0; i < theraputic.length; i++) {
          tempArray = tempArray + theraputic[i] + ',';
        }

        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=drl_division&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (brand.length > 0) {
        let tempArray = '';
        for (i = 0; i < brand.length; i++) {
          tempArray = tempArray + brand[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=brand_name&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }
      //...............................................................................

      temp =
        temp +
        '&searchCriteria[filterGroups][' +
        c +
        '][filters][0][field]=status&searchCriteria[filterGroups][' +
        c +
        '][filters][0][value]=1&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][field]=visibility&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][value]=4';

      //    for(let i=0;i<filterCategories.length;i++){
      //        temp=temp+'&searchCriteria[filterGroups][0][filters]['+i+'][field]=categorytype&searchCriteria[filterGroups][0][filters]['+i+'][value]='+filterCategories[i]+'&searchCriteria[filterGroups][0][filters]['+i+'][conditionType]=in'
      //    }
    }

    if (name !== undefined) {
      temp =
        '&searchCriteria[filterGroups][0][filters][0][field]=name&searchCriteria[filterGroups][0][filters][0][value]=%25' +
        name +
        '%25&searchCriteria[filterGroups][0][filters][0][conditionType]=like&searchCriteria[filterGroups][0][filters][1][field]=sku&searchCriteria[filterGroups][0][filters][1][value]=%25' +
        name +
        '%25&searchCriteria[filterGroups][0][filters][1][conditionType]=like&searchCriteria[filterGroups][0][filters][2][field]=ndc&searchCriteria[filterGroups][0][filters][2][value]=%25' +
        name +
        '%25&searchCriteria[filterGroups][0][filters][2][conditionType]=like' +
        '&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=visibility&searchCriteria[filterGroups][2][filters][0][value]=4&searchCriteria[filterGroups][2][filters][0][condition_type]=in';
    }

    if (
      (dosage.length > 0 || theraputic.length > 0 || brand.length > 0) &&
      filterCategories === undefined
    ) {
      let c = 0;
      if (dosage.length > 0) {
        let tempArray = '';
        for (i = 0; i < dosage.length; i++) {
          tempArray = tempArray + dosage[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=dosage_form&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (theraputic.length > 0) {
        let tempArray = '';
        for (i = 0; i < theraputic.length; i++) {
          tempArray = tempArray + theraputic[i] + ',';
        }

        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=drl_division&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (brand.length > 0) {
        let tempArray = '';
        for (i = 0; i < brand.length; i++) {
          tempArray = tempArray + brand[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=brand_name&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      temp =
        temp +
        '&searchCriteria[filterGroups][' +
        c +
        '][filters][0][field]=status&searchCriteria[filterGroups][' +
        c +
        '][filters][0][value]=1&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][field]=visibility&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][value]=4';
    }

    if (
      dosage.length === 0 &&
      theraputic.length === 0 &&
      filterCategories === undefined &&
      brand.length == [] &&
      name === undefined
    ) {
      temp =
        temp +
        '&searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=1&searchCriteria[filterGroups][1][filters][0][field]=visibility&searchCriteria[filterGroups][1][filters][0][value]=4&searchCriteria[filterGroups][1][filters][0][condition_type]=in';
    }
    let URL = BASE_URL + temp;

    return URL;
  },

  productApiURLGeneratorNDCPage(
    dosage,
    theraputic,
    brand,
    currentPage,
    name,
    filterCategories,
  ) {
    let BASE_URL =
      BASE_URL_DRL +
      'products?searchCriteria[sortOrders][0][field]=sku&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[currentPage]=' +
      currentPage +
      '&searchCriteria[pageSize]=15';
    let temp = '';

    if (filterCategories !== undefined) {
      // temp="&searchCriteria[filterGroups][0][filters][0][field]=categorytype&searchCriteria[filterGroups][0][filters][0][value]="+filterCategories+"&searchCriteria[filterGroups][0][filters][0][conditionType]=in"

      let c = 0;
      if (filterCategories.length > 0) {
        let tempArray = '';
        for (i = 0; i < filterCategories.length; i++) {
          tempArray = tempArray + filterCategories[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=categorytype&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }
      //.......................................................................................
      if (dosage.length > 0) {
        let tempArray = '';
        for (i = 0; i < dosage.length; i++) {
          tempArray = tempArray + dosage[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=dosage_form&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (theraputic.length > 0) {
        let tempArray = '';
        for (i = 0; i < theraputic.length; i++) {
          tempArray = tempArray + theraputic[i] + ',';
        }

        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=drl_division&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (brand.length > 0) {
        let tempArray = '';
        for (i = 0; i < brand.length; i++) {
          tempArray = tempArray + brand[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=brand_name&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }
      //...............................................................................

      temp =
        temp +
        '&searchCriteria[filterGroups][' +
        c +
        '][filters][0][field]=status&searchCriteria[filterGroups][' +
        c +
        '][filters][0][value]=1&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][field]=visibility&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][value]=4';
    }

    if (name !== undefined) {
      temp =
        '&searchCriteria[filterGroups][0][filters][0][field]=name&searchCriteria[filterGroups][0][filters][0][value]=%25' +
        name +
        '%25&searchCriteria[filterGroups][0][filters][0][conditionType]=like&searchCriteria[filterGroups][0][filters][1][field]=sku&searchCriteria[filterGroups][0][filters][1][value]=%25' +
        name +
        '%25&searchCriteria[filterGroups][0][filters][1][conditionType]=like' +
        '&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=visibility&searchCriteria[filterGroups][2][filters][0][value]=4&searchCriteria[filterGroups][2][filters][0][condition_type]=in';
    }

    if (
      (dosage.length > 0 || theraputic.length > 0 || brand.length > 0) &&
      filterCategories === undefined
    ) {
      let c = 0;
      if (dosage.length > 0) {
        let tempArray = '';
        for (i = 0; i < dosage.length; i++) {
          tempArray = tempArray + dosage[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=dosage_form&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (theraputic.length > 0) {
        let tempArray = '';
        for (i = 0; i < theraputic.length; i++) {
          tempArray = tempArray + theraputic[i] + ',';
        }

        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=drl_division&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      if (brand.length > 0) {
        let tempArray = '';
        for (i = 0; i < brand.length; i++) {
          tempArray = tempArray + brand[i] + ',';
        }
        tempArray = tempArray.slice(0, -1);

        temp =
          temp +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][field]=brand_name&searchCriteria[filterGroups][' +
          c +
          '][filters][0][value]=' +
          tempArray +
          '&searchCriteria[filterGroups][' +
          c +
          '][filters][0][conditionType]=in';
        c = c + 1;
      }

      temp =
        temp +
        '&searchCriteria[filterGroups][' +
        c +
        '][filters][0][field]=status&searchCriteria[filterGroups][' +
        c +
        '][filters][0][value]=1&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][field]=visibility&searchCriteria[filterGroups][' +
        (c + 1) +
        '][filters][0][value]=4';
    }

    if (
      dosage.length === 0 &&
      theraputic.length === 0 &&
      filterCategories === undefined &&
      brand.length == [] &&
      name === undefined
    ) {
      temp =
        temp +
        '&searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=1&searchCriteria[filterGroups][1][filters][0][field]=visibility&searchCriteria[filterGroups][1][filters][0][value]=4&searchCriteria[filterGroups][1][filters][0][condition_type]=in';
    }
    let URL = BASE_URL + temp;

    return URL;
  },
};
