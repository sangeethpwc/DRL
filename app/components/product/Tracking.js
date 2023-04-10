import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, FlatList, Linking, } from 'react-native';
import {
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import colors from '../../config/Colors';
import _, { add } from 'lodash';
import utils from '../../utilities/utils';
import LinearGradient from 'react-native-linear-gradient';
import CustomeHeader from '../../config/CustomeHeader';
import styles from '../home/home_style';
import Modal from 'react-native-modalbox';
import { useNavigation } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import { getAdminTokenForPrintShipment } from '../../services/operations/productApis';
//import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Toast from 'react-native-simple-toast';

const Tracking = props => {
  const dispatch = useDispatch();
  const productData = useSelector(state => state.product);
  let bottomDrawerRef = useRef(null);
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [infoIndex, setInfoIndex] = useState(0);

  const [filePath, setFilePath] = useState('');

  function renderInfo(item, index) {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
          Carrier : {item.title}
        </Text>
        <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
          Tracking Number : {item.track_number}
        </Text>
      </View>
    );
  }

  function bottomSliderView() {
    return (
      <Modal
        style={{ height: '50%' }}
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
          <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 20 }}>
            Tracking Information
          </Text>
          {trackingInfo[infoIndex].extension_attributes !== undefined &&
            trackingInfo[infoIndex].extension_attributes
              .delivery_idoc_number !== undefined && (
              <Text style={{ fontFamily: 'DRLCircular-Book', fontSize: 18 }}>
                Shipment #{' '}
                {
                  trackingInfo[infoIndex].extension_attributes
                    .delivery_idoc_number
                }
              </Text>
            )}
          <FlatList
            style={{ padding: 10, height: '80%' }}
            data={trackingInfo[infoIndex].tracks}
            renderItem={({ item, index }) => renderInfo(item, index)}
          />
        </View>
      </Modal>
    );
  }

  useEffect(() => {
    if (!_.isEmpty(productData.trackingInfo) && trackingInfo.length === 0) {
      let temp = _.cloneDeep(productData.trackingInfo);
      temp = _.map(temp, o => _.extend({ isExpended: false }, o));
      setTrackingInfo(temp);
    }
  }, [productData.trackingInfo]);

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
          About Your Shipment
        </Text>

        {item.comments
          .slice(0)
          .reverse()
          .map((item, index) => {
            if (item.comment !== null) {
              return (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '30%' }}>
                    <Text
                      style={{
                        fontFamily: 'DRLCircular-Book',
                        fontSize: 16,
                        color: colors.grey,
                      }}>
                      {item.created_at.slice(0, 10)}
                    </Text>
                  </View>

                  <View style={{ width: '70%' }}>
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

  function renderTrackingNumbers(item) {
    let TrackingNumbers = '';
    if (item.tracks !== undefined && item.tracks.length > 0) {
      for (let i = 0; i < item.tracks.length; i++) {
        TrackingNumbers = TrackingNumbers + item.tracks[i].track_number + ' ';
      }
    }
    return TrackingNumbers;
  }

  function renderTrackingNames(item) {
    let TrackingNumbers = '';
    if (item.tracks !== undefined && item.tracks.length > 0) {
      for (let i = 0; i < item.tracks.length; i++) {
        TrackingNumbers = TrackingNumbers + item.tracks[i].title + ' ';
      }
    }
    return TrackingNumbers;
  }

  function renderItems(data) {
    return (
      <FlatList
        style={{ padding: 5 }}
        data={data}
        renderItem={({ item, index }) => renderItemslist(item, index, data)}
      />
    );
  }

  function renderItemslist(item, index, data) {
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
            : { marginTop: 10, paddingBottom: 5 }
        }>
        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
          }}>
          <Text style={{ fontFamily: 'DRLCircular-Bold' }}>Product Name: </Text>
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
          <Text style={{ fontFamily: 'DRLCircular-Bold' }}>NDC: </Text>
          {item.sku}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
          }}>
          <Text style={{ fontFamily: 'DRLCircular-Bold' }}>
            Quantity Shipped :{' '}
          </Text>{' '}
          {item.qty}
        </Text>
      </View>
    );
  }

  function renderOrderlist(item, index) {

    console.log('Tracking...........' + JSON.stringify(item))

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
          <View style={{ flexDirection: 'column', padding: 10 }}>
            {item.comments !== undefined &&
              item.comments.length > 0 &&
              renderComments(item)}
            <View>
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => {
                  if (productData.shipmenDownloadStarted) {
                    Toast.show(
                      'Shipment download started, please wait',
                      Toast.SHORT,
                    );
                  } else if (
                    productData.shipmenDownloadStarted === false &&
                    productData.trackingInfo !== undefined &&
                    productData.trackingInfo.length > 0
                  ) {
                    dispatch(getAdminTokenForPrintShipment(item.entity_id));
                    Toast.show(
                      'Shipment download started, please wait',
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
                  Download this Shipment
                </Text>
              </TouchableOpacity>

              {item.extension_attributes !== undefined &&
                item.extension_attributes.delivery_idoc_number !==
                undefined && (
                  <Text style={{ marginTop: 10, fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
                    Shipment # {item.extension_attributes.delivery_idoc_number}{' '}
                  </Text>
                )}
            </View>

            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
                Tracking Numbers: {renderTrackingNumbers(item)}{' '}
              </Text>
              <Text style={{ marginTop: 10, fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
                Carrier: {renderTrackingNames(item)}{' '}
              </Text>
            </View>

            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
                POD Date & time (EST) : {item.extension_attributes.pod_datetime}{' '}
              </Text>

              {/* <Text
                onPress={() => {
                  Linking.openURL(item.extension_attributes.pod_tracking_url);
                }}
                style={{
                  fontFamily: 'DRLCircular-Bold',
                  color: colors.blue,
                  textDecorationLine: 'underline',
                  fontSize: 16,
                }}>
                Tracking URL :  {item.extension_attributes.pod_tracking_url}{' '}
              </Text> */}

              <Text
                style={{
                  marginTop: 10, marginBottom: 10,
                  color: colors.textColor,
                  fontSize: 16,
                  fontFamily: 'DRLCircular-Book',
                }}>
                Tracking URL :{' '}
                <Text
                  style={{ color: colors.blue, fontFamily: 'DRLCircular-Book', fontSize: 16,
                   textDecorationLine: 'underline' }}
                  onPress={() =>
                    Linking.openURL('https://www.ups.com/track?loc=en_US&requester=ST/')
                  }>
                  {item.extension_attributes.pod_tracking_url}

                </Text>{' '}
                
              </Text>



            </View>

            {/* {item.comments.length > 0 ? (
              <View>
                <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
                  {item.comments[0].comment}{' '}
                </Text>
              </View>
            ) : null} */}

            <TouchableOpacity
              style={{ marginTop: 10, width: '100%' }}
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
              <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 16 }}>
                Items
              </Text>
              <Image
                source={require('../../images/bottom_small.png')}
                style={{ position: 'absolute', right: 2, top: 2 }}
              />
            </TouchableOpacity>

            <Collapsible collapsed={!item.isExpended}>
              <View style={true ? { minHeight: 30 } : { height: 0 }}>
                {renderItems(item.items)}
              </View>
            </Collapsible>
          </View>
        </View>
      </View>
    );
  }

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const createPDF = async () => {
    if (await isPermitted()) {
      let options = {
        //Content to print
        html:
          '<h1 style="text-align: center;"><strong>Hello Guys</strong></h1><p style="text-align: center;">Here is an example of pdf Print in React Native</p><p style="text-align: center;"><strong>Team About React</strong></p>',
        //File Name
        fileName: 'test',
        //File directory
        directory: 'docs',
      };

      let file = await RNHTMLtoPDF.convert(options);

      //
      setFilePath(file.filePath);
    }
  };

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

        {productData.trackingInfo.length > 0 ? (
          <View>
            <TouchableOpacity
              style={{ marginTop: 20, marginLeft: 20 }}
              onPress={() => {
                if (productData.shipmenDownloadStarted) {
                  Toast.show(
                    'Shipment download started, please wait',
                    Toast.SHORT,
                  );
                } else if (
                  productData.shipmenDownloadStarted === false &&
                  productData.trackingInfo !== undefined &&
                  productData.trackingInfo.length > 0
                ) {
                  dispatch(
                    getAdminTokenForPrintShipment(
                      productData.trackingInfo[0].order_id,
                      true,
                    ),
                  );
                  Toast.show(
                    'Shipment download started, please wait',
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
                Download all Shipments
              </Text>
            </TouchableOpacity>
            <FlatList
              style={{ padding: 10, height: '100%' }}
              data={trackingInfo}
              renderItem={({ item, index }) => renderOrderlist(item, index)}
            />
            <View style={{ height: 100 }}></View>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize: 20 }}>
              No Shipments created
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default Tracking;
