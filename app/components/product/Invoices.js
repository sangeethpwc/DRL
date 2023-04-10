import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, Image, FlatList} from 'react-native';
import {TouchableOpacity, StatusBar} from 'react-native';
import colors from '../../config/Colors';
import _, {add} from 'lodash';
import utils from '../../utilities/utils';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import styles from '../home/home_style';
import Modal from 'react-native-modalbox';
import {useNavigation} from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import {getAdminTokenForPrintInvoice} from '../../services/operations/productApis';
import Toast from 'react-native-simple-toast';

const Invoices = props => {
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  let bottomDrawerRef = useRef(null);
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [allInfo, setAllInfo] = useState([]);

  const [infoIndex, setInfoIndex] = useState(0);

  function renderInfo(item, index) {
    return (
      <View style={{marginTop: 20}}>
        <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
          {item.title} : {item.track_number}
        </Text>
      </View>
    );
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{height: '40%'}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}
        backdropPressToClose={true}
        swipeToClose={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 150,
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
            Tracking Information
          </Text>
          <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 18}}>
            Shipment # {trackingInfo[infoIndex].increment_id}
          </Text>
          <FlatList
            style={{padding: 10}}
            data={trackingInfo[infoIndex].tracks}
            renderItem={({item, index}) => renderInfo(item, index)}
          />
        </View>
      </Modal>
    );
  }

  useEffect(() => {
    if (!_.isEmpty(productData.invoiceInfo) && trackingInfo.length === 0) {
      let temp = _.cloneDeep(productData.invoiceInfo);
      temp = _.map(temp, o => _.extend({isExpended: false}, o));
      setTrackingInfo(temp);
    }
    console.log(
      'productData.invoiceInfo.................',
      JSON.stringify(productData.invoiceInfo),
    );
  }, [productData.invoiceInfo]);

  function renderTrackingNumbers(item) {
    let TrackingNumbers = '';
    if (item.tracks !== undefined && item.tracks.length > 0) {
      for (let i = 0; i < item.tracks.length; i++) {
        TrackingNumbers = TrackingNumbers + item.tracks[i].track_number + ' ';
      }
    }
    return TrackingNumbers;
  }

  function renderItems(data,datas) {
    return (
      <FlatList
        style={{padding: 5}}
        data={data}
        renderItem={({item, index}) => renderItemslist(item, index, data,datas)}
      />
    );
  }

  function renderItemslist(item, index, data,datas) {
    // console.log("item.items.......iiii" + JSON.stringify (item));
    console.log("item.items......" + JSON.stringify (datas.extension_attributes.price_type));
    
    return (
      <View
        style={
          index !== data.length - 1
            ? {
                marginTop: 10,
                borderBottomWidth: 0.3,
                borderColor: colors.grey,
                paddingBottom: 5,
              }
            : {marginTop: 10, paddingBottom: 5}
        }>
       
        <Text
          // numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>Product Name: </Text>
          {item.name}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
            marginTop: 3,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>NDC: </Text>
          {item.sku}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
            marginTop: 3,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>Price: </Text>$
          {utils.formatPrice(item.base_price)}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>
            Price Type :{' '}
          </Text>{' '}
          {datas.extension_attributes.price_type}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>
            Quantity Invoiced :{' '}
          </Text>{' '}
          {item.qty}
        </Text>

        

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
            marginTop: 3,
          }}>
          <Text style={{fontFamily: 'DRLCircular-Bold'}}>Subtotal: </Text>$
          {utils.formatPrice(item.base_row_total)}
        </Text>
      </View>
    );
  }

  function renderInvoiceStatus(status) {
    if (status === 1) {
      return 'Pending';
    }
    if (status == 2) {
      return 'Paid';
    }
    if (status == 3) {
      return 'Cancelled';
    }
  }
  function renderComments(item) {
    return (
      <View
        style={{
          marginBottom: 10,
          paddingBottom: 10,
          borderBottomColor: colors.grey,
          borderBottomWidth: 0.5,
        }}>
        <Text
          style={{
            fontFamily: 'DRLCircular-Bold',
            fontSize: 14,
            color: colors.textColor,
          }}>
          About Your Invoice
        </Text>

        {item.comments
          .slice(0)
          .reverse()
          .map((item, index) => {
            if (item.comment !== null) {
              return (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{width: '30%'}}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 16,
                        color: colors.grey,
                      }}>
                      {item.created_at.slice(0, 10)}
                    </Text>
                  </View>

                  <View style={{width: '70%'}}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 16,
                        color: colors.textColor,
                      }}>
                      {item.comment}
                    </Text>
                  </View>
                </View>
              );
            }
          })}
      </View>
    );
  }
  function renderOrderlist(item, index) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: colors.whiteGradient,
          margin: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: colors.lightGrey,
            backgroundColor: colors.shopCategoryBackground,
          }}>
          <View style={{flexDirection: 'column', padding: 10}}>
            {item.comments !== undefined &&
              item.comments.length > 0 &&
              renderComments(item)}
            <View>
              {item.extension_attributes !== undefined &&
                item.extension_attributes.invoice_idoc_number !== undefined && (
                  <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
                    Invoice # {item.extension_attributes.invoice_idoc_number}{' '}
                  </Text>
                )}
            </View>
            <TouchableOpacity
              style={{marginTop: 10}}
              onPress={() => {
                if (productData.invoiceDowladStated) {
                  Toast.show(
                    'Invoice download started, please wait',
                    Toast.SHORT,
                  );
                } else if (
                  productData.invoiceDowladStated === false &&
                  productData.invoiceInfo !== undefined &&
                  productData.invoiceInfo.length > 0
                ) {
                  dispatch(getAdminTokenForPrintInvoice(item.entity_id));
                  Toast.show(
                    'Invoice download started, please wait',
                    Toast.SHORT,
                  );
                }
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                  color: colors.blue,
                }}>
                Download this Invoice
              </Text>
            </TouchableOpacity>

            <View style={{marginBottom: 5}}>
              <TouchableOpacity
                style={{marginTop: 10, width: '100%'}}
                onPress={() => {
                  if (item.isExpended) {
                    item.isExpended = false;
                  } else {
                    item.isExpended = true;
                  }
                  let temp = [];
                  temp = _.cloneDeep(trackingInfo);
                  setTrackingInfo(temp);
                }}>
                <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 16}}>
                  Items
                </Text>
                <Image
                  source={require('../../images/bottom_small.png')}
                  style={{position: 'absolute', right: 2, top: 2}}
                />
              </TouchableOpacity>

              <Collapsible collapsed={!item.isExpended}>
                <View style={true ? {minHeight: 30} : {height: 0}}>
                  {renderItems(item.items,item)}
                  
                </View>
              </Collapsible>
            </View>

            <View style={{borderTopWidth: 0.5, borderColor: colors.grey}}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                Status: {renderInvoiceStatus(item.state)}{' '}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{width: '60%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 16,
                  }}>
                  Subtotal:
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                }}>
                ${utils.formatPrice(item.base_subtotal)}
              </Text>
            </View>

            {(item.base_discount_amount !== 0 ||
              (item.base_discount_amount === 0 &&
                item.discount_description !== undefined &&
                item.discount_description.length > 0)) && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <View style={{width: '60%'}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Bold',
                      fontSize: 16,
                    }}>
                    Discount:
                  </Text>
                  {item.discount_description !== undefined && (
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Light',
                        fontSize: 14,
                      }}>
                      ({item.discount_description})
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 16,
                  }}>
                  - ${utils.formatPrice(item.base_discount_amount * -1)}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{width: '60%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 16,
                  }}>
                  Shipping and Handling:
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                }}>
                ${utils.formatPrice(item.base_shipping_amount)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{width: '60%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    fontSize: 16,
                  }}>
                  Grand Total:
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                }}>
                ${utils.formatPrice(item.base_grand_total)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <LinearGradient
        colors={['#FFFFFF', '#F6FBFF', '#F6FBFF']}
        style={styles.homeLinearGradient}>
        <CustomeHeader
          back={'back'}
          title={'Order Detail'}
          isHome={true}
          addToCart={'addToCart'}
          addToWishList={'addToWishList'}
          addToLocation={'addToLocation'}
        />

        {trackingInfo.length > 0 && bottomSliderView()}

        {productData.invoiceInfo.length > 0 ? (
          <View>
            {!_.isEmpty(allInfo) && (
              <View>
                <Text>About Your Invoice</Text>
              </View>
            )}
            <TouchableOpacity
              style={{marginTop: 20, marginLeft: 20}}
              onPress={() => {
                if (productData.invoiceDowladStated) {
                  Toast.show(
                    'Invoice download started, please wait',
                    Toast.SHORT,
                  );
                } else if (
                  productData.invoiceDowladStated === false &&
                  productData.invoiceInfo !== undefined &&
                  productData.invoiceInfo.length > 0
                ) {
                  dispatch(
                    getAdminTokenForPrintInvoice(
                      productData.invoiceInfo[0].order_id,
                      true,
                    ),
                  );
                  Toast.show(
                    'Invoice download started, please wait',
                    Toast.SHORT,
                  );
                }
                //
              }}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  fontSize: 16,
                  color: colors.blue,
                }}>
                Download all Invoices
              </Text>
            </TouchableOpacity>

            <FlatList
              style={{padding: 10, height: '80%'}}
              data={trackingInfo}
              renderItem={({item, index}) => renderOrderlist(item, index)}
            />
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <Text style={{fontFamily: 'DRLCircular-Bold', fontSize: 20}}>
              Please wait...
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default Invoices;
