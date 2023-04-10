import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modalbox';
import colors from '../../config/Colors';
import {getServiceRequestActive} from '../../services/operations/profileApis';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../../config/CustomeHeader';
import _ from 'lodash';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import Collapsible from 'react-native-collapsible';
import {setNotificationStatus} from '../../slices/authenticationSlice';

export default function ServiceRequest(props) {
  const [typeActive, setTypeActive] = useState(-1);
  const [typeHistory, setTypeHistory] = useState(-1);

  const loginData = useSelector(state => state.authenticatedUser);
  const profileData = useSelector(state => state.profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const types = [
    'General Inquiries',
    'Product Complaints',
    'Product Inquiries',
    'Upcoming Order',
    'Returns/Cancellation',
    'Damage/Shortages',
    'Profile Update',
  ];

  const typesDropdown = [
    'All',
    'General Inquiries',
    'Product Complaints',
    'Product Inquiries',
    'Upcoming Order',
    'Returns/Cancellation',
    'Damage/Shortages',
    'Profile Update',
  ];

  const [active, setActive] = useState(false);
  const [history, setHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [activeRequests, setActiveRequests] = useState([]);
  const [requestsHistory, setRequestsHistorys] = useState(
    profileData.serviceRequestHistory,
  );

  let bottomDrawerRef = useRef(null);

  function openAttachment(url) {
    Linking.openURL(url);
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getServiceRequestActive());
  }, []);

  useEffect(() => {
    if (
      props !== undefined &&
      props.route !== undefined &&
      props.route.params !== undefined &&
      props.route.params.set !== undefined
    ) {
      if (props.route.params.set === 'active') {
        setActive(true);
      } else {
        setHistory(true);
      }
    } else {
      setActive(true);
    }

    dispatch(getServiceRequestActive());
  }, []);

  useEffect(() => {
    if (loginData.notificationStatus !== '') {
      setActive(true);
      dispatch(getServiceRequestActive());
      dispatch(setNotificationStatus(''));
    }
  }, [loginData.notificationStatus]);

  useEffect(() => {
    let temp = [];

    if (
      !_.isEmpty(profileData.activeServiceRequests) &&
      _.isEmpty(activeRequests)
    ) {
      temp = _.map(profileData.activeServiceRequests, o =>
        _.extend({isExpended: false}, o),
      );
      setActiveRequests(temp);
    }
  }, [profileData.activeServiceRequests]);

  useEffect(() => {
    let temp = [];

    if (
      !_.isEmpty(profileData.serviceRequestHistory) &&
      _.isEmpty(requestsHistory)
    ) {
      temp = _.map(profileData.serviceRequestHistory, o =>
        _.extend({isExpended: false}, o),
      );
      setRequestsHistorys(temp);
    }
  }, [profileData.serviceRequestHistory]);

  useEffect(() => {
    if (!profileData.serviceRequestFetched) {
      setRefreshing(false);
    }
  }, [profileData.serviceRequestFetched]);

  function bottomSliderView() {
    return (
      <Modal
        style={{height: 300}}
        position={'bottom'}
        ref={c => (bottomDrawerRef = c)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            padding: 20,
            backgroundColor: colors.white,
            paddingTop: 30,
          }}>
          <Text
            numberOfLines={10}
            style={{
              fontFamily: 'DRLCircular-Book',
              fontSize: 16,
              color: colors.textColor,
              width: '80%',
            }}>
            <Text style={{fontFamily: 'DRLCircular-Bold'}}>Description :</Text>
            {selectedItem.solution_description}
          </Text>
          {selectedItem.solution_attachment_url !== null &&
            selectedItem.solution_attachment_url !== '' && (
              <View style={{marginTop: 10, width: '80%'}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    marginRight: 10,
                    fontSize: 16,
                  }}>
                  Attachment:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    openAttachment(selectedItem.solution_attachment_url);
                  }}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.blue,
                    }}>
                    {selectedItem.solution_attachment}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </Modal>
    );
  }

  function renderListActive(item, index) {
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
            borderColor: colors.lightGrey,
            backgroundColor: colors.shopCategoryBackground,
          }}>
          <View style={{flexDirection: 'column', padding: 10}}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 18,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>SR No. : </Text>
              {item.id}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
                marginTop: 3,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Service Request :{' '}
              </Text>
              {item.request_type !== 0 ? types[item.request_type - 1] : ''}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Initiated on :
              </Text>{' '}
              {item.created_at.slice(0, 10)}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Reference :</Text>{' '}
              {item.reference_number}
            </Text>

            <TouchableOpacity
              style={{width: '100%', marginTop: 10}}
              onPress={() => {
                //  Toast.show("Check",Toast.SHORT)
                if (item.isExpended) {
                  item.isExpended = false;
                } else {
                  item.isExpended = true;
                }

                let temp = [];
                temp = _.cloneDeep(activeRequests);
                setActiveRequests(temp);
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Description :
              </Text>
              <Image
                source={require('../../images/bottom_small.png')}
                style={{position: 'absolute', right: 2, top: 2}}
              />
            </TouchableOpacity>
            <Collapsible collapsed={!item.isExpended}>
              <View style={item.isExpended ? {padding: 10} : {height: 0}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.textColor,
                  }}>
                  {item.request_description}
                </Text>
              </View>
            </Collapsible>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Status:</Text>{' '}
              {item.status === '0' ? 'Pending' : 'Completed'}
            </Text>

            {item.attachment_url !== '' && (
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  width: '90%',
                }}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    marginRight: 10,
                    fontSize: 16,
                  }}>
                  Attachment:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    openAttachment(item.attachment_url);
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.blue,
                    }}>
                    {item.attachment}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {item.solution_description !== null &&
              item.solution_description !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    if (
                      bottomDrawerRef !== undefined &&
                      bottomDrawerRef !== null
                    ) {
                      bottomDrawerRef.open();
                    }
                  }}
                  style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.blue,
                    }}>
                    Response from Dr. Reddy’s team
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      </View>
    );
  }

  function renderListHistory(item, index) {
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
            borderColor: colors.lightGrey,
            backgroundColor: colors.shopCategoryBackground,
          }}>
          <View style={{flexDirection: 'column', padding: 10}}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 18,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>SR No. : </Text>
              {item.id}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
                marginTop: 3,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Service Request :{' '}
              </Text>
              {item.request_type !== 0 ? types[item.request_type - 1] : ''}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Initiated on :
              </Text>{' '}
              {item.created_at.slice(0, 10)}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Reference :</Text>{' '}
              {item.reference_number}
            </Text>

            <TouchableOpacity
              style={{width: '100%', marginTop: 10}}
              onPress={() => {
                if (item.isExpended) {
                  item.isExpended = false;
                } else {
                  item.isExpended = true;
                }

                let temp = [];
                temp = _.cloneDeep(requestsHistory);
                setRequestsHistorys(temp);
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>
                Description :
              </Text>
              <Image
                source={require('../../images/bottom_small.png')}
                style={{position: 'absolute', right: 2, top: 2}}
              />
            </TouchableOpacity>
            <Collapsible collapsed={!item.isExpended}>
              <View style={item.isExpended ? {padding: 10} : {height: 0}}>
                <Text
                  style={{
                    fontFamily: 'DRLCircular-Book',
                    fontSize: 16,
                    color: colors.textColor,
                  }}>
                  {item.request_description}
                </Text>
              </View>
            </Collapsible>

            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 16,
                color: colors.textColor,
              }}>
              <Text style={{fontFamily: 'DRLCircular-Bold'}}>Status:</Text>{' '}
              {item.status === '0' ? 'Pending' : 'Completed'}
            </Text>

            {item.attachment_url !== '' && (
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  width: '90%',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'DRLCircular-Bold',
                    marginRight: 10,
                    fontSize: 16,
                  }}>
                  Attachment:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    openAttachment(item.attachment_url);
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.blue,
                    }}>
                    {item.attachment}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {item.solution_description !== null &&
              item.solution_description !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    if (
                      bottomDrawerRef !== undefined &&
                      bottomDrawerRef !== null
                    ) {
                      bottomDrawerRef.open();
                    }
                  }}
                  style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 16,
                      color: colors.blue,
                    }}>
                    Response from Dr. Reddy’s team
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      </View>
    );
  }

  function filterHistory(type) {
    let temp = [];

    if (type === 0) {
      temp = _.map(profileData.serviceRequestHistory, o =>
        _.extend({isExpended: false}, o),
      );
      setRequestsHistorys(temp);
    } else {
      let StatusValue = type;

      temp = _.filter(
        profileData.serviceRequestHistory,
        element => element.request_type === '' + StatusValue,
      );

      temp = _.map(temp, o => _.extend({isExpended: false}, o));
      setRequestsHistorys(temp);
    }
  }

  function renderFilterHistory() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
            marginBottom: 10,
          }}>
          Filter By
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            borderColor: colors.textColor,
            borderWidth: 0.5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ModalDropdown
            style={{
              paddingLeft: 5,
              height: 30,
              width: '90%',
              justifyContent: 'center',
              borderColor: colors.textInputBorderColor,
              backgroundColor: colors.textInputBackgroundColor,
            }}
            textStyle={{
              fontSize: 16,
              fontFamily: 'DRLCircular-Book',
              color: colors.textColor,
            }}
            dropdownStyle={{width: '60%', height: 150}}
            dropdownTextStyle={{fontSize: 16, fontFamily: 'DRLCircular-Book'}}
            defaultValue={
              typeHistory !== -1 ? typesDropdown[typeHistory] : 'Please Select'
            }
            options={typesDropdown}
            onSelect={value => {
              setTypeHistory(value);

              filterHistory(value);
            }}
          />
          <Image
            style={{zIndex: 0, marginRight: 5}}
            source={require('../../images/bottom_small.png')}
          />
        </View>
      </View>
    );
  }

  function filterActiveRequests(type) {
    let temp = [];

    if (type === 0) {
      temp = _.map(profileData.activeServiceRequests, o =>
        _.extend({isExpended: false}, o),
      );
      setActiveRequests(temp);
    } else {
      let StatusValue = type;

      temp = _.filter(
        profileData.activeServiceRequests,
        element => element.request_type === '' + StatusValue,
      );

      temp = _.map(temp, o => _.extend({isExpended: false}, o));
      setActiveRequests(temp);
    }
  }

  function renderFilterActive() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'DRLCircular-Book',
            fontSize: 16,
            color: colors.textColor,
            marginBottom: 10,
          }}>
          Filter By
        </Text>

        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            borderColor: colors.textColor,
            borderWidth: 0.5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ModalDropdown
            style={{
              paddingLeft: 5,
              height: 30,
              width: '90%',
              justifyContent: 'center',
              borderColor: colors.textInputBorderColor,
              backgroundColor: colors.textInputBackgroundColor,
            }}
            textStyle={{
              fontSize: 16,
              fontFamily: 'DRLCircular-Book',
              color: colors.textColor,
            }}
            dropdownStyle={{width: '60%', height: 150}}
            dropdownTextStyle={{fontSize: 16, fontFamily: 'DRLCircular-Book'}}
            defaultValue={
              typeActive !== -1 ? typesDropdown[typeActive] : 'Please Select'
            }
            options={typesDropdown}
            onSelect={value => {
              setTypeActive(value);

              filterActiveRequests(value);
            }}
          />
          <Image
            style={{zIndex: 0, marginRight: 5}}
            source={require('../../images/bottom_small.png')}
          />
        </View>
      </View>
    );
  }

  function renderActive() {
    return (
      <View>
        {renderFilterActive()}
        {activeRequests.length > 0 ? (
          <View style={{marginTop: 10}}>
            <FlatList
              style={{height: '82%'}}
              data={activeRequests}
              renderItem={({item, index}) => renderListActive(item, index)}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : (
          <View style={{marginTop: 10}}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
              No Active Service Requests found
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderHistory() {
    return (
      <View>
        {renderFilterHistory()}
        {requestsHistory.length > 0 ? (
          <View style={{marginTop: 10}}>
            <FlatList
              style={{height: '82%'}}
              data={requestsHistory}
              renderItem={({item, index}) => renderListHistory(item, index)}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : (
          <View style={{marginTop: 10}}>
            <Text style={{fontFamily: 'DRLCircular-Book', fontSize: 16}}>
              No Service Request History found
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
        height: '100%',
      }}>
      <CustomeHeader
        back={'back'}
        title={'Help & Support'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      {bottomSliderView()}
      <View style={{flexDirection: 'row', height: 60}}>
        <TouchableOpacity
          onPress={() => {
            setActive(true);
            setHistory(false);
          }}
          style={active ? styles.viewSelected : styles.viewUnselected}>
          <Text style={active ? styles.boldText : styles.lightText}>
            Active Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActive(false);
            setHistory(true);
          }}
          style={history ? styles.viewSelected : styles.viewUnselected}>
          <Text style={history ? styles.boldText : styles.lightText}>
            Completed Requests
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 20}}>
        {history && renderHistory()}
        {active && renderActive()}
        <View style={{height: 30}}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'column',
  },

  label: {
    fontFamily: 'DRLCircular-Bold',
    fontSize: 16,
    color: colors.textColor,
  },

  input: {
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    fontFamily: 'DRLCircular-Book',
    color: colors.textColor,
    fontSize: 16,
    justifyContent: 'center',
    borderColor: colors.textInputBorderColor,
    backgroundColor: colors.textInputBackgroundColor,
  },
  footer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.shopCategoryBackground,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonSelected: {
    width: 150,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnselected: {
    width: 150,
    height: 50,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderWidth: 1,
  },
  blackTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.textColor,
  },
  whiteTextMedium: {
    fontFamily: 'DRLCircular-Book',
    fontSize: 16,
    color: colors.white,
  },

  checkbox: {
    height: 10,
  },
  viewSelected: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.blue,
  },
  viewUnselected: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontSize: 16,
    marginTop: 5,
    color: colors.textColor,
    fontFamily: 'DRLCircular-Bold',
  },

  lightText: {
    fontSize: 16,
    marginTop: 5,
    color: colors.textColor,
    fontFamily: 'DRLCircular-Book',
  },
});
