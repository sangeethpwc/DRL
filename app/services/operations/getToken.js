import {setPasswordWrong,fetchingData, fetchingDataDone, getTokenSuccess, getTokenFailure, getApiAccessTokenSuccess, getApiAccessTokenFailure, getCustomerInfoSuccess, getNews, passwordResetSuccess, passwordResetFailure ,
  getBrandSuccess,getBrandFailure,getCategoryFailure,getCategorySuccess, getSpashFetchDone, getMedicationTypeSuccess, getMedicationTypeFailure,
 getPackLabelSuccess,getPackLabelFailure,getStrengthLabelFailure,getStrengthLabelSuccess,setAdminToken,setAdminTokenFailure,
 setRegionSuccess,setRegionFailure,getFilterCategorySuccess,getFilterCategoryFailure
 ,setAddressLabelsSuccess,setAddressLabelsFailure,setOrderStatusSuccess,setOrderStatusFailure,setPrivacydataSuccess,setPrivacydataFailure
 ,setTermsdataSuccess,setGeneralTermsdataSuccess,setTermsdataFailure,setApplicationStatusSuccess,setApplicationStatusFailure
 ,setResourcesCategoriesSuccess,setResourcesFailure,setResourcesCategoriesFailure,setResourcesSuccess} from '../../slices/authenticationSlice';
 
 import {setRecentOrdersSuccess,setRecentOrdersFailure,setRecentInvoicesSuccess, setUpcomingOrdersForHome, setRecentOrdersForHome, setOrderFetchStarted , setOrderDetail} from '../../slices/homesSlices';
 import {setcartAdded} from '../../slices/productSlices';
 import {getServiceRequestActive} from '../../services/operations/profileApis';
 import utils from '../../utilities/utils'
 
 import { displayName as appName } from '../../../app.json';
 import md5 from "react-native-md5";
 
 import {requestConnector} from '../../services/restApiConnector';
  import API_SERVICES from '../../services/ApiServicePath';
  import GlobalConst from '../../config/GlobalConst'
  import _ from 'lodash'
  import AsyncStorage from '@react-native-community/async-storage';
 import { getCartListGeneral, getCartIDGeneral, getWishlist, getLoginTokenGeneral } from './productApis';
///..................................

export function uploadConsent(header,email) {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  console.log("Upload consent body...............",email)
  console.log("Upload consent body tc...............",GlobalConst.storedVersions.tc_version)
  console.log("Upload consent body eula...............", GlobalConst.storedVersions.eula_version)
  
  const response = await requestConnector("POST", API_SERVICES.TC_CONSENT_SAVE, header, null, 
  {
    "data":
    { 
    "email": email,
    "tc_version": GlobalConst.storedVersions.tc_version,
    "eula_version": GlobalConst.storedVersions.eula_version
    }
    }
  );
  
  console.log("Upload consent response................",response.data)

  utils.setAccepted(false)
  GlobalConst.accepted=false
 
  } catch (err) {
  
  dispatch(fetchingDataDone())
  if(err.status === 401){
  dispatch(getLoginTokenGeneral(uploadConsent))
  } 
  }
  };
  }
 

export function getVersion() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  const response = await requestConnector("GET", API_SERVICES.GET_VERISON_INFO, headers, null, 
  null
  ); 
  // 
  if(response !== undefined && response.data !== undefined && response.data !== undefined){
  //dispatch(setPrivacydataSuccess(response.data.items)); 
  console.log("Version sucess........",response.data)

  // let storedVersions= utils.getVersionDetails()
  // console.log("storedVersions...............",storedVersions)

 

if(response.data.app_version.trim()===GlobalConst.AppVersion.trim())
{
  ///......................
  AsyncStorage.getItem('FIRST_TIME_USER').then(firstTimeUser => {
    if (firstTimeUser === null) {
      console.log("First time user")
      utils.setVersionDetails(response.data)
      GlobalConst.storedVersions=response.data
    }
    else{
      console.log("Not first time user")
       utils.getVersionDetails()

       setTimeout(()=>{
        console.log("storedVersions...............",GlobalConst.storedVersions)

        if(GlobalConst.storedVersions.eula_version!==undefined && GlobalConst.storedVersions.eula_version.length>0 && GlobalConst.storedVersions.tc_version!==undefined && GlobalConst.storedVersions.tc_version.length>0 &&
           GlobalConst.storedVersions.eula_version.trim()!== response.data.eula_version.trim() || GlobalConst.storedVersions.tc_version.trim() !== response.data.tc_version.trim()){
        console.log("Cleared")
        GlobalConst.tcVersionMismatch=true;
          utils._clearStorage()
        }
        utils.setVersionDetails(response.data)
        GlobalConst.storedVersions=response.data
       },1000)
 
    }

    
  })
  //.........................


  dispatch(getPrivacy())
  dispatch(getTerms())
  dispatch(getTermsGeneral())
  dispatch(getCategoryNames())
  dispatch(getApplicationStatus());
  dispatch(getMedicationTypes());
  dispatch(getFilterCategory())
  dispatch(getResourceCategory())
  dispatch(getResources())
  dispatch(getAdminTokenForAddressLabels())
  dispatch(getStrengthLabel())
  dispatch(getPackLabel())
  /////////////
  
  try {
  
  AsyncStorage.getItem("region").then((region) => {
  if( region !== null){ 
  GlobalConst.region= region
  dispatch(getSpashFetchDone());
  } 
  else{
  dispatch(getAdminTokenForRegionIDs())
  } 
  })
  } catch (error) {
  
  }
}

else{
console.log("App version mismatch")
GlobalConst.appVerisonMismatch=true
 
}

  }
  else{ 
    console.log("Version failure........",response.data)
 // dispatch(setPrivacydataFailure())
  }
  
  
  } catch (err) {
  
  //dispatch(setPrivacydataFailure())
  }
  
  };
  }

//..................................
  
  export function getToken(body) {
  // 
  return async (dispatch) => {
  try {
  dispatch(fetchingData());
  
  const response = await requestConnector("POST", API_SERVICES.TOKEN_URL, null, null, 
  body, 
  
  );
 
  console.log("User Body................."+ JSON.stringify(body))
  console.log("User Body................."+ JSON.stringify(response.data))
  console.log("User Body................."+ response.data.length)

  if(response.data===undefined || response.data.length !==32){
  dispatch(getTokenFailure(true))
  }
  else{
   
  GlobalConst.TOKEN_URL = API_SERVICES.TOKEN_URL;
  // GlobalConst.API_ACCESS_TOKEN = response.data;
  dispatch(getTokenSuccess(response.data));
  GlobalConst.LoginToken = response.data;
  GlobalConst.creds = JSON.stringify(body);
  utils.saveCreds(body);

  console.log("User email.................",body.username)
  // utils.setEmailList(body.username)
  
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ ""+response.data +""
  }

  if(GlobalConst.accepted){
    console.log("Set agreement api will be called")

    dispatch(uploadConsent(headers,body.username))
    //call api for setting agreement response 
    //GlobalConst.accepted=false
  }
  dispatch( getCustomerInfo(headers));
  }
  } catch (err) {
  dispatch(getTokenFailure(true))
  }
  
  };
  }
  
  export function resetPassword(email,accessToken) {
  return async (dispatch) => {
  try {
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ ""+accessToken +""
  } 
  dispatch(fetchingData());
  const response = await requestConnector("PUT", API_SERVICES.RESET_PASSWORD, headers, null, 
  {
  // "email": "testuser2.pwc@gmail.com",
  "email": email,
  "template": "email_reset",
  "websiteId": 1
  }
  );
  
  //{getApiAccessToken};
  if(response.data){
  dispatch(passwordResetSuccess(true))
  }
  // else if(response.data===undefined){
  // alert("Couldn't reach server");
  // dispatch(passwordResetFailure())
  // }
  else{
  dispatch(passwordResetFailure(true));
  dispatch(setPasswordWrong(true));
  }
  
  } catch (err) {
  
  dispatch(passwordResetFailure(true))
  }
  };
  }
 
  export function getDetails(data) {
  
  return async (dispatch) => {
  try {
  dispatch(fetchingData());
  let URL = API_SERVICES.GET_DETAILS;
  const response = await requestConnector("POST", URL , null, null,
  {
  "secure_token": data
  }
  ); 
  
  
  
  if( response.data !== undefined){ 
  let body={"username":"","password":""}
 
  body.username=response.data.username
  body.password=response.data.password
 
  body= {
  "secure_token": GlobalConst.AppToken
  }
 
  dispatch(getApiAccessToken(body))
 
  
  }
  else{
  // dispatch(getApiAccessTokenFailure())
  dispatch(fetchingDataDone())
  }
  
  } catch (err) {
  
  // dispatch(getApiAccessTokenFailure())
  dispatch(fetchingDataDone())
  
  }
  };
  }
 
 
  
  export function getApiAccessToken(data) {
  // 
  // 
  // 
  return async (dispatch) => {
    
  try {
  
  let URL = API_SERVICES.API_ACCESS_TOKEN;
  console.log('token........',data);
  console.log('Endpoint........',URL);
  
  const response = await requestConnector("POST", URL , null, null,
  {
  "secure_token":data
  }
  ); 

  console.log("Api access token.........")

  console.log("Api access token.........",response)
  
  console.log('check........');
  GlobalConst.ApiAccessToken=response.data.access_token;
  dispatch(getApiAccessTokenSuccess(GlobalConst.ApiAccessToken)) 

  console.log("Api access token.........",response)
  
  if( response.data.access_token !== undefined){ 
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ ""+response.data.access_token +""
  } 
  GlobalConst.TOKEN_URL = URL;
  _storeToken(response.data.access_token, response.data.expires_in) 
  _storeTime();  
  
  dispatch(getVersion())
    
  }
  else{

  dispatch(getApiAccessTokenFailure())
  _clearTimeToken ();
  }
  
  } catch (err) {
    console.log("Errr.........",JSON.stringify(err))
  dispatch(getApiAccessTokenFailure())
  _clearTimeToken ();
  }
  };
  }
  
  export async function _storeToken (token, expires_in) {
  
  try {
  const items = [['access_token', token], ['expires_in', expires_in]]
  await AsyncStorage.multiSet(items);
  } catch (error) {
  
  }
  };
  
  export async function _storeTime () {
  var today = new Date();
  let currentDateTime = today.getTime()
  try {
  await AsyncStorage.setItem('dateTime',JSON.stringify(currentDateTime));
  } catch (error) {
  
  }
  };
  
  export async function _clearTimeToken () {
  try {
  const keys = ['access_token','dateTime','expires_in'];
  await AsyncStorage.multiRemove(keys);
  } catch (error) {
  
  }
  }
  
  
  export function getCustomerInfo(header) {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const response = await requestConnector("GET", API_SERVICES.CUSTOMER_INFO, header, null, 
  null
  );
  //
  

  console.log("response.data --- " + JSON.stringify(response.data));
  
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getToken(GlobalConst.creds));
  }
  else{

    console.log("response.data --- " + JSON.stringify(response.data));
  
    if(response.data!==undefined && !_.isEmpty(response.data)){
  dispatch(getCustomerInfoSuccess(response.data))
  GlobalConst.customerId = response.data.id;
  GlobalConst.customerGroup=response.data.group_id;

  if(GlobalConst.statusLabels.length>0){
    if(utils.getAttributeFromCustom(response.data,'application_status')!=="NA"){
   //  
     if(GlobalConst.statusLabels.find(element=>element.value===utils.getAttributeFromCustom(response.data,'application_status'))!==undefined){
      GlobalConst.customerStatus = GlobalConst.statusLabels.find(element=>element.value===utils.getAttributeFromCustom(response.data,'application_status')).label;
     }
    }
 
    }
    else{
      GlobalConst.customerStatus="Approved"
    }
  if(GlobalConst.deviceId !== null && GlobalConst.deviceId.length>0){
  dispatch(uploadToken(header))
  }
  
  dispatch(fetchingDataDone())
  dispatch(getCartListGeneral());
 
  dispatch(getWishlist());
 
  dispatch(setcartAdded());
  dispatch(getCartIDGeneral())
  dispatch(getAdminTokenForOder(response.data.id))
  dispatch(getServiceRequestActive())
 
  }
  else{
    dispatch(getToken(GlobalConst.creds));
  }
}
  } catch (err) {
  
  dispatch(fetchingDataDone())
  }
  };
  }
 
 
  export function uploadToken(header) {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  if(GlobalConst.deviceId === null){
  return;
  }
  if(GlobalConst.deviceId.length===0){
  return;
  }
  const response = await requestConnector("POST", API_SERVICES.DeviceIdUpload, header, null, 
  {
  "data":
  { 
  "customer_id": GlobalConst.customerId,
  "device_token": GlobalConst.deviceId,
  "device_type": Platform.OS
  }
  }
  );
  
  if(GlobalConst.errorStatus === 401){
  // dispatch(getLoginTokenGeneral(uploadToken))
  }
  else{
  
  GlobalConst.tokenUploadSuccess = true;
  }
  } catch (err) {
  
  dispatch(fetchingDataDone())
  if(err.status === 401){
  dispatch(getLoginTokenGeneral(uploadToken))
  } 
  }
  };
  }
 
 
  export function clearToken(header) {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const response = await requestConnector("POST", API_SERVICES.DeviceIdUpload, header, null, 
  {
  "data":
  { 
  "customer_id": GlobalConst.customerId,
  "device_token": '',
  "device_type": Platform.OS
  }
  }
  );
  
  if(GlobalConst.errorStatus === 401){
  // dispatch(getLoginTokenGeneral(uploadToken))
  }
  else{
  
  }
  } catch (err) {
  
  dispatch(fetchingDataDone())
  if(err.status === 401){
  dispatch(getLoginTokenGeneral(uploadToken))
  } 
  }
  };
  }
 
  
  export function getNewsData(header) {
  return async (dispatch) => {
  try {
  dispatch(fetchingData()); 
  let URL = API_SERVICES.NEWS_SCROLL_BLOCK_3;
  
  const response = await requestConnector("POST", URL, header, null, 
  JSON.stringify({})
  ); 
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getNewsData))
  dispatch(getApiAccessTokenFailure())
  } 
  else{
  dispatch(getNews(response.data))
  // dispatch(getBrandNames())
  }
  dispatch(fetchingDataDone())
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getNewsData))
  } 
  }
  };
  }
  
 
  export function getPrivacy() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  const response = await requestConnector("GET", API_SERVICES.PRIVACY_URL, headers, null, 
  null
  ); 
  // 
  if(response !== undefined && response.data !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setPrivacydataSuccess(response.data.items)); 
  //console.log("Privacy sucess........",response.data.items)
  }
  else{ 
    console.log("Privacy failure........",response.data.items)
  dispatch(setPrivacydataFailure())
  }
  
  
  } catch (err) {
  
  dispatch(setPrivacydataFailure())
  }
  
  };
  }
 
  export function getTerms() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  const response = await requestConnector("GET", API_SERVICES.TERMS_URL, headers, null, 
  null
  ); 
  //
  if(response !== undefined && response.data !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setTermsdataSuccess(response.data.items)); 
  
  }
  else{ 
  dispatch(setTermsdataFailure())
  }
  
  
  } catch (err) {
  
  dispatch(setTermsdataFailure())
  }
  
  };
  }


  export function getTermsGeneral() {
    return async (dispatch) => {
    try {
    // dispatch(fetchingData());
    const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
    }
    const response = await requestConnector("GET", API_SERVICES.GEN_TERMS_URL, headers, null, 
    null
    ); 
    //
    if(response !== undefined && response.data !== undefined && response.data !== undefined && response.data.items !== undefined){
    dispatch(setGeneralTermsdataSuccess(response.data.items)); 
    
    }
    else{ 
    dispatch(setTermsdataFailure())
    }
    
    
    } catch (err) {
    
    dispatch(setTermsdataFailure())
    }
    
    };
    }
 
  export function getBrandNames() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.BRAND_NAMES, headers, null, 
  null,
  );
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getBrandNames))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getBrandSuccess(response.data.items));
  dispatch(getPrivacy())
  // dispatch(getCategoryNames())
  }
  else{ 
  dispatch(getBrandFailure());
  }}
  //dispatch(getAwardsSuccess(response.data));
  } catch (err) {
  
  // dispatch(getAwardsSuccess("Failed")); 
  //dispatch(getAwardsFailure())
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getBrandNames))
  } 
  }
  };
  }


  
  
  
  export function getCategoryNames() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  // const response = await requestConnector("GET", API_SERVICES.CAT_NAMES, headers, null, 
  // null,
  // );

  const response = await requestConnector("POST", API_SERVICES.CAT_NAMES_CUSTOM, headers, null, 
  {
    "attribute_code":"drl_division"
  },
  );
  // 
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getCategoryNames))
  }else{ 
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getCategorySuccess(response.data.items));
  
  }
  else{ 
  dispatch(getCategoryFailure());
  }}
  //dispatch(getAwardsSuccess(response.data));
  
  } catch (err) {
  
  // dispatch(getAwardsSuccess("Failed")); 
  //dispatch(getAwardsFailure())
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getCategoryNames))
  } 
  }
  
  };
  }
 
  let statusLabels=[]
  export function getApplicationStatus() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.APPLICATION_STATUS, headers, null, 
  null,
  );
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getApplicationStatus))
  }
  else{ 
  if(response !== undefined && response.data !== undefined && response.data.options !== undefined && response.data.options.length>0){
  dispatch(setApplicationStatusSuccess(response.data.options));
//  statusLabels=response.data.options;
//   GlobalConst.statusLabels=statusLabels
GlobalConst.statusLabels=response.data.options;
  
  }
  else{ 
  dispatch(setApplicationStatusFailure());
  }}
  //dispatch(getAwardsSuccess(response.data));
  
  } catch (err) {
  
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getApplicationStatus))
  } 
  }
  
  };
  }
  
  export function getMedicationTypes() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  // const response = await requestConnector("GET", API_SERVICES.MED_TYPES, headers, null, 
  // null,
  // );

  const response = await requestConnector("POST", API_SERVICES.CAT_NAMES_CUSTOM, headers, null, 
  {
    "attribute_code":"dosage_form"
  },
  );
 
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getMedicationTypes))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getMedicationTypeSuccess(response.data.items));
  
  }
  else{ 
  dispatch(getMedicationTypeFailure());
  }}
  
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getMedicationTypes))
  } 
  }
  
  };
  }
 
  export function getFilterCategory() {
  return async (dispatch) => {
  try {

  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.FILTER_CATEGORY, headers, null, 
  null,
  );

  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getFilterCategory))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getFilterCategorySuccess(response.data.items));
  console.log("Filter cat...................",JSON.stringify(response.data.items))
  }
  else{ 
  dispatch(getFilterCategoryFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getFilterCategory))
  } 
  }
  
  };
  }
 
 
  export function getResourceCategory() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.RESOURCE_CATEGORY, headers, null, 
  null,
  );
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getResourceCategory))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(setResourcesCategoriesSuccess(response.data.items));
  
  }
  else{ 
  dispatch(setResourcesCategoriesFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getResourceCategory))
  } 
  }
  
  };
  }
 
 
  export function getResources() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.RESOURCES, headers, null, 
  null,
  );
 
  
 
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getResources))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(setResourcesSuccess(response.data.items));
  
  }
  else{ 
  dispatch(setResourcesFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getResources))
  } 
  }
  
  };
  }
 
 
  
 
 
  export function getAdminTokenForAddressLabels(){
  return async (dispatch) => {

  try {
  // dispatch(fetchingData());
  const response = await requestConnector("POST", API_SERVICES.ADMIN_TOKEN_URL, null, null, 
 
  {
  "secure_token": GlobalConst.AppToken
  }
  );
  
  if(response.data===undefined){
  dispatch(setAdminTokenFailure(true))
  }
  else{
  
  GlobalConst.ApiAccessToken= response.data.access_token;
  dispatch(setAdminToken(response.data.access_token));
  dispatch(getAddressLabels(response.data.access_token))
  dispatch(getOrderStatus())
 
  }
  
  } catch (err) {
  dispatch(setAdminTokenFailure(true))
  }
  
  }
  }
 
  export function getAddressLabels(header) {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ header
  }
  
  const response = await requestConnector("GET", API_SERVICES.ADDRESS_STATUS, headers, null, 
  null,
  );
 
  // 
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getAddressLabels))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.options !== undefined && response.data.options.length>0){
  dispatch(setAddressLabelsSuccess(response.data.options));
  
  }
  else{ 
  dispatch(setAddressLabelsFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getAddressLabels))
  } 
  }
  
  };
  }
 
  export function getStrengthLabel() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.STRENGTH, headers, null, 
  null,
  );
 
  // 
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getStrengthLabel))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getStrengthLabelSuccess(response.data.items));
  
  }
  else{ 
  dispatch(getStrengthLabelFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getStrengthLabel))
  } 
  }
  
  };
  }
 
  export function getPackLabel() {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken 
  }
  
  const response = await requestConnector("GET", API_SERVICES.PACK_SIZE, headers, null, 
  null,
  );
  
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getPackLabel))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined && response.data.items.length>0){
  dispatch(getPackLabelSuccess(response.data.items));
  dispatch(getSpashFetchDone());
  
  
  
  
  }
  else{ 
  dispatch(getPackLabelFailure());
  }}
  
  
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getPackLabel))
  } 
  }
  
  };
  }
 
  export function getAdminTokenForRegionIDs(){
  
  return async (dispatch) => {
  try {
  dispatch(fetchingData());
  const response = await requestConnector("POST", API_SERVICES.ADMIN_TOKEN_URL, null, null, 
 
  {
  "secure_token": GlobalConst.AppToken
  }
  );
  
  if(response.data!==undefined && response.data.access_token!==undefined){
  
  dispatch(setAdminToken(response.data.access_token))
  GlobalConst.AdminToken=response.data.access_token
  dispatch(getRegionID())
  }
  else{
  dispatch(setAdminTokenFailure(true))
  
  }
  
  } catch (err) {
  dispatch(setAdminTokenFailure(true))
  }
  
  }
  }
 
 
  export function getAdminTokenForOder(customerId){
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const response = await requestConnector("POST", API_SERVICES.ADMIN_TOKEN_URL, null, null, 
 
  {
  "secure_token": GlobalConst.AppToken
  }
  );

  console.log('My Orders Status.....'+JSON.stringify(response.data))
  
  if(response.data!==undefined && response.data.access_token!==undefined){
  
  dispatch(setAdminToken(response.data.access_token));
  GlobalConst.ApiAccessToken= response.data.access_token;
  dispatch(getUpcomingOrderForHome(customerId));
  dispatch(getRecentOrderForHome(customerId));
  }
  else{
  dispatch(setAdminTokenFailure(true))
  }
  
  } catch (err) {
  dispatch("Admin token failure........"+setAdminTokenFailure(true))
  }
  
 }
 }
 
 
 export function getAdminTokenForMyOder(customerId){
 
  return async (dispatch) => {
  try {
  dispatch(fetchingData());
  dispatch(setOrderFetchStarted(true))
  const response = await requestConnector("POST", API_SERVICES.ADMIN_TOKEN_URL, null, null, 
 
  {
  "secure_token": GlobalConst.AppToken
  }
  );
  // 
  if(response.data!==undefined && response.data.access_token!==undefined){
  
 
  dispatch(setAdminToken(response.data.access_token));
  GlobalConst.ApiAccessToken= response.data.access_token;
  dispatch(getRecentProducts(customerId));
 
 
  }
  else{
  
  dispatch(setAdminTokenFailure(true))
  dispatch(setOrderFetchStarted(false))
  
  }
  
  } catch (err) {
  dispatch("Admin token failure........"+setAdminTokenFailure(true))
  }
  
 }
 }
 
 export function getRecentProducts(customerId) {
 
 
  
 
  return async (dispatch) => {
  try {
  
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.RECENT_ORDERS+customerId+'&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC', headers, null, 
  null,
  );
  // 
  
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setRecentOrdersSuccess(response.data.items));
  let orderIDArray=""
 
  for(let i=response.data.items.length-1;i>=0;i--){
  if(response.data.items[i].entity_id!==undefined){
  orderIDArray=orderIDArray+ response.data.items[i].entity_id + ","
  }
  }
 
  orderIDArray=orderIDArray.slice(0,-1)
  
 
  
 
  dispatch(getRecentInvoices(orderIDArray))
  dispatch(setOrderFetchStarted(false))
  }
  else{ 
  dispatch(setRecentOrdersFailure())
  dispatch(setOrderFetchStarted(false))
  }
  //dispatch(getAwardsSuccess(response.data));
  } catch (err) {
  
  dispatch(setOrderFetchStarted(false))
  // dispatch(getAwardsSuccess("Failed")); 
  //dispatch(getAwardsFailure())
  }
  
  };
 }
 
 export function getUpcomingOrderForHome(customerId) {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.
  UPCOMING_ORDERS_HOME+customerId+
  '&searchCriteria[filter_groups][1][filters][0][field]=status&searchCriteria[filter_groups][1][filters][0][condition_type]=in&searchCriteria[filter_groups][1][filters][0][value]=out_for_delivery,complete&searchCriteria[filter_groups][2][filters][0][field]=rgdd_delivery_date&searchCriteria[filter_groups][2][filters][0][condition_type]=gteq&searchCriteria[filter_groups][2][filters][0][value]='+
  GlobalConst.today, headers, null, 
  null,
  );
  // 
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setUpcomingOrdersForHome(response.data.items));
  
  }
  else{ 
  dispatch(fetchingDataDone())
  }
  
  } catch (err) {
  
  dispatch(fetchingDataDone())
  }
  
  };
 }
 
 export function getRecentOrderForHome(customerId) {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.RECENT_ORDERS_HOME+customerId+'&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC', headers, null, 
  null,
  );
 
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setRecentOrdersForHome(response.data.items))
  dispatch(setRecentOrdersSuccess(response.data.items));
  
  }
  else{ 
  // dispatch(setRecentOrdersFailure())
  dispatch(fetchingDataDone())
  }
  
  } catch (err) {
  
  dispatch(fetchingDataDone())
  }
  
  };
 }
 
 
 export function getAdminTokenForOderDetail(orderID){
 
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const response = await requestConnector("POST", API_SERVICES.ADMIN_TOKEN_URL, null, null, 
 
  {
  "secure_token": GlobalConst.AppToken
  }
  );
 
  if(response.data!==undefined && response.data.access_token!==undefined ){
  
  dispatch(setAdminToken(response.data.access_token));
  GlobalConst.ApiAccessToken= response.data.access_token;
  dispatch(getOrderDetail(orderID));
  }
  else{
  dispatch(setAdminTokenFailure(true))
  }
  
  } catch (err) {
  dispatch("Admin token failure........"+setAdminTokenFailure(true))
  }
  
 }
 }
 
 export function getOrderDetail(orderId) {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.ORDER_DETAIL+orderId, headers, null, 
  null,
  );
 
  
 
  if(response !== undefined && response.data !== undefined ){
  dispatch(setOrderDetail(response.data))
  
  }
  else{ 
  // dispatch(setRecentOrdersFailure())
  dispatch(fetchingDataDone())
  }
  
  } catch (err) {
  
  dispatch(fetchingDataDone())
  }
  
  };
 }
 
 
 export function getRecentInvoices(arr) {

  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.INVOICE_LIST+arr+'&searchCriteria[filter_groups][0][filters][0][condition_type]=in&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC', headers, null, 
  null,
  );
  
  if(response !== undefined && response.data !== undefined && response.data.items !== undefined){
  dispatch(setRecentInvoicesSuccess(response.data.items));
  }
  else{ 
  dispatch(fetchingDataDone())
  }
  //dispatch(getAwardsSuccess(response.data));
  } catch (err) {
  dispatch(fetchingDataDone())
  
  // dispatch(getAwardsSuccess("Failed")); 
  //dispatch(getAwardsFailure())
  }
  
  };
 }
 
 
  export function getRegionID(){
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.REGION, headers, null, 
  null,
  );
  
  if(response !== undefined && response.data !== undefined && response.data.length>0){
  dispatch(setRegionSuccess(response.data));
  utils._storeRegion(response.data)
  GlobalConst.region= JSON.stringify(response.data)
  }
  else{ 
  dispatch(setRegionFailure());
  }
  dispatch(getSpashFetchDone());
  } 
  
  catch (err) {
  
  if(err.status === 401){
  //dispatch(getApiAccessTokenGeneral(getPackLabel))
  } 
  }
  
  };
  }
  
  
  
  
  export function getApiAccessTokenGeneral(functionCall) {
  
  return async (dispatch) => {
  try {
  dispatch(fetchingData());
  _storeTime(); 
  let URL = API_SERVICES.API_ACCESS_TOKEN;
  // const response = await requestConnector("POST", GlobalConst.TOKEN_URL, null, null,{}); 
  const response = await requestConnector("POST", URL , null, null, null); 
  
  
  GlobalConst.ApiAccessToken=response.data.access_token;
  dispatch(getApiAccessTokenSuccess(GlobalConst.ApiAccessToken)) 
  if( response.data.access_token !== undefined){ 
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ ""+response.data.access_token +""
  } 
  _storeToken(response.data.access_token, response.data.expires_in) 
  dispatch(functionCall(headers));
  }
  else{
  dispatch(getApiAccessTokenFailure())
  }
  
  } catch (err) {
  
  
  
  
  dispatch(getApiAccessTokenFailure())
  }
  };
  }
 
 
  export function getOrderStatus() {
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer "+ GlobalConst.ApiAccessToken
  }
  
  const response = await requestConnector("GET", API_SERVICES.ORDER_STATUS, headers, null, 
  null,
  );
 
  
  if(GlobalConst.errorStatus === 401){
  dispatch(getApiAccessTokenGeneral(getOrderStatus))
  } 
  else{
  if(response !== undefined && response.data !== undefined && response.data.length>0){
  dispatch(setOrderStatusSuccess(response.data));
  }
  else{ 
  dispatch(setOrderStatusFailure());
  }}
  
  // dispatch(getSpashFetchDone());
  } catch (err) {
  
  if(err.status === 401){
  dispatch(getApiAccessTokenGeneral(getOrderStatus))
  } 
  }
  
  };
  }
 
  export function getCustomerInfoAfterAddAddress(header) {
  
  return async (dispatch) => {
  try {
  // dispatch(fetchingData());
  const response = await requestConnector("GET", API_SERVICES.CUSTOMER_INFO, header, null, 
  null
  );
  console.log("Response.................... cust info.............",JSON.stringify(response.data))
  if(GlobalConst.errorStatus === 401){
  dispatch(getToken(GlobalConst.creds))
  }
  else{
    if(response.data!==undefined && !_.isEmpty(response.data)){
  dispatch(getCustomerInfoSuccess(response.data))
  GlobalConst.customerId = response.data.id;
 
  if(GlobalConst.statusLabels.length>0){
    if(utils.getAttributeFromCustom(response.data,'application_status')!=="NA"){
   //  
     if(GlobalConst.statusLabels.find(element=>element.value===utils.getAttributeFromCustom(response.data,'application_status'))!==undefined){
      GlobalConst.customerStatus = GlobalConst.statusLabels.find(element=>element.value===utils.getAttributeFromCustom(response.data,'application_status')).label;
     }
    }
    console.log("Customer status..................",GlobalConst.customerStatus)
    }
    else{
      GlobalConst.customerStatus="Approved"
    }
 
  dispatch(fetchingDataDone())
 
  }
  else{
   // dispatch(getCustomerInfoAfterAddAddress(header))
   dispatch(fetchingDataDone())
  }
}
  } catch (err) {
  
  dispatch(fetchingDataDone())
  
  }
  };
  }