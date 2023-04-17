import {StackActions, NavigationActions} from 'react-navigation';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalConst from '../config/GlobalConst';
import {getMedicationTypeFailure} from '../slices/authenticationSlice';

// Store markers outside of the function scope,
// not to recreate them on every call
var entities = {
  amp: '&',
  apos: "'",
  lt: '<',
  gt: '>',
  quot: '"',
  nbsp: '\xa0',
};
var entityPattern = /&([a-z]+);/gi;

module.exports = {
  resetRoute(currentRoute, newPath, params) {
    const resetAction = StackActions.reset({
      index: currentRoute,
      actions: [NavigationActions.navigate({routeName: newPath, params})],
    });
    return resetAction;
  },
  removeItem(items, index) {
    var newItems = items
      .slice(0, index)
      .concat(items.slice(index + 1, items.length));

    return newItems;
  },

  formatPrice(p) {
    let x = p.toFixed(2);
    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return x;
  },

  getHtmls(text) {
    text = _.replace(text, new RegExp('&lt;', 'g'), '<');
    text = _.replace(text, new RegExp('&gt;', 'g'), '>');
    //
    return text;
  },

  getCurrentDateTime() {
    var today = new Date();
    let currentDateTime = today.getTime();

    return currentDateTime;
  },

  saveDateTime() {
    try {
      var today = new Date();
      let currentDateTime = today.getTime();
      AsyncStorage.setItem('dateTime', JSON.stringify(currentDateTime));
    } catch (e) {}
  },

  async saveCreds(creds) {
    try {
      //
      await AsyncStorage.setItem('creds', JSON.stringify(creds));
    } catch (e) {}
  },

  async getCreds() {
    try {
      AsyncStorage.getItem('creds').then(creds => {
        //
        GlobalConst.creds = creds;
      });
    } catch (error) {}
  },

  ///.............................
  async setVersionDetails(body) {
    try {
      //
      await AsyncStorage.setItem('versionInfo', JSON.stringify(body));
    } catch (e) {}
  },

  async getVersionDetails() {
    try {
      AsyncStorage.getItem('versionInfo').then(body => {
        //
        console.log('Body.....................', body);
        GlobalConst.storedVersions = JSON.parse(body);
      });
    } catch (error) {
      console.log('Error...........', error);
    }
  },

  async _clearStorage() {
    try {
      const keys = ['cartId', 'creds', 'FIRST_TIME_USER'];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {}
  },

  async setAccepted(body) {
    try {
      //
      await AsyncStorage.setItem('accepted', JSON.stringify(body));
    } catch (e) {}
  },

  async getAccepted() {
    try {
      AsyncStorage.getItem('accepted').then(body => {
        //
        console.log('Body accepted.....................', body);
        GlobalConst.accepted = JSON.parse(body);
      });
    } catch (error) {
      console.log('Error accped...........', error);
    }
  },

  //.............................

  changeDateFormat(dateString) {
    var createdDate = new Date(dateString);
    var date = createdDate.toLocaleDateString();
    var day = createdDate.getDate();
    var month = createdDate.getMonth() + 1; //months are zero based
    var year = createdDate.getFullYear();

    return '' + day + ' ' + month + ' ' + year;
  },

  async getDateTimeDiff() {
    var today = new Date();
    let currentDateTime = today.getTime();
    let timeDiff = 0;
    try {
      let storedTime = JSON.parse(await AsyncStorage.getItem('dateTime'));

      if (storedTime !== null) {
        timeDiff = Math.floor(
          (currentDateTime - parseFloat(storedTime)) / (1000 * 60),
        );
      }
      return timeDiff;
    } catch (e) {
      await AsyncStorage.removeItem('dateTime');
      return 0;
    }
  },

  getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  },

  async _storeToken(token, expires_in) {
    try {
      const items = [
        ['access_token', token],
        ['expires_in', expires_in],
      ];
      await AsyncStorage.multiSet(items);
    } catch (error) {}
  },

  async _storeTime() {
    var today = new Date();
    let currentDateTime = today.getTime();
    try {
      await AsyncStorage.setItem('dateTime', JSON.stringify(currentDateTime));
    } catch (error) {}
  },

  async _clearTimeToken() {
    try {
      const keys = ['access_token', 'dateTime', 'expires_in'];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {}
  },

  async _clearCartId() {
    try {
      const keys = ['cartId', 'creds'];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {}
  },

  async _storeCartID(cartId) {
    try {
      GlobalConst.cartId = cartId;
      await AsyncStorage.setItem('cartId', JSON.stringify(cartId));
    } catch (error) {}
  },

  async getCartID() {
    try {
      AsyncStorage.getItem('cartId').then(cartId => {
        if (cartId !== null) {
          GlobalConst.cartId = cartId;
        }
      });
    } catch (error) {}
  },

  // let storedTime=JSON.parse( await AsyncStorage.getItem('dateTime'));

  getAttributeFromCustom(item, attribute) {
    let v = 'NA';

    if (
      item !== undefined &&
      item !== null &&
      item.custom_attributes !== undefined
    ) {
      let att = _.find(item.custom_attributes, {attribute_code: attribute});
      if (att !== undefined) {
        v = att.value;
      }
    }

    return v;
  },

  getAttributeFromCustomForConfigurable(item, attribute) {
    let v = [];
    if (
      item !== undefined &&
      item !== null &&
      item.extension_attributes !== undefined &&
      item.extension_attributes.configurable_product_options !== undefined &&
      item.extension_attributes.configurable_product_options.length > 0
    ) {
      let att = _.find(item.extension_attributes.configurable_product_options, {
        label: attribute,
      });
      if (att !== undefined) {
        v = att.values;
      }
    }
    //
    return v;
  },

  getChildernOfConfigurableFromAttribute(item, attribute) {
    let v = [];
    let childerItem = undefined;
    let att = undefined;
    if (item !== undefined && item !== null && item.length > 0) {
      for (let i = 0; i < item.length; i++) {
        childerItem = item[i];
        att = _.find(childerItem.custom_attributes, {label: attribute});
        if (att !== undefined) {
          return childerItem;
        }
      }
    }
  },

  getOptions(item, attribute) {
    let v = [];
    if (
      item !== undefined &&
      item !== null &&
      item.options !== undefined &&
      item.options.length > 0
    ) {
      let att = _.find(item.options, {title: attribute});

      if (att !== undefined) {
        v = att.values;
      }

      if (
        att !== undefined &&
        att.option_id !== undefined &&
        v !== undefined &&
        v.length > 0
      ) {
        v = _.map(v, o => _.extend({option_id: att.option_id}, o));
      }
      v = _.map(v, o => _.extend({entered_qunatity: ''}, o));
    }
    //
    return v;
  },

  // getAttributeFromExtensionForConfigurable (item, attribute){
  //   let v="NA";
  //   if(item !== undefined && item !==null && item.configurable_product_options!== undefined){
  //   let att= _.find(item.configurable_product_options,{ 'attribute_code': attribute});
  //    if(att !== undefined){
  //     v=att.value ;
  //   }
  //   }
  //   return v
  // }

  getCommonValues(values, labelValues) {
    let v = [];
    let temp;
    for (let i = 0; i < labelValues.length; i++) {
      temp = _.find(values.find, {value: labelValues.i.value});
      if (temp !== undefined) {
        v.push(temp);
      }
      return v;
    }
  },

  async _storeRegion(region) {
    try {
      AsyncStorage.setItem('region', JSON.stringify(region));
    } catch (error) {}
  },

  async getRegion() {
    try {
      AsyncStorage.getItem('region').then(region => {
        if (region !== null) {
          GlobalConst.region = region;
        }
      });
    } catch (error) {}
  },

  getCountry(id) {
    if (id === 'NA') {
      return 'NA';
    } else {
      let temp = JSON.parse(GlobalConst.region);
      let country = _.find(temp, function(o) {
        return o.id == id;
      });

      if (country !== undefined && country.full_name_locale !== undefined) {
        return country.full_name_locale;
      } else {
        return 'NA';
      }
    }
  },

  getRegion(countryID, regionID) {
    if (countryID === 'NA' || regionID === 'NA') {
      return 'NA';
    } else {
      let temp = JSON.parse(GlobalConst.region);

      // let country=GlobalConst.region.find(Element=>Element.id===countryID)

      let country = _.find(temp, function(o) {
        return o.id === countryID;
      });

      if (country !== undefined && country.available_regions !== undefined) {
        let region = _.find(country.available_regions, function(o) {
          return o.id == regionID;
        });

        if (region !== undefined && region.name !== undefined) {
          return region.name;
        } else {
          return 'NA';
        }
      } else {
        return 'NA';
      }
    }
  },
};
