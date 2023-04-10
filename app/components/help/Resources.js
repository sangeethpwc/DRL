import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import styles from '../product/productStyles';
import colors from '../../config/Colors';
import _ from 'lodash';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';

import CustomeHeader from '../../config/CustomeHeader';

export default function Resources(props) {
  const loginData = useSelector(state => state.authenticatedUser);

  const [list, setList] = useState([]);
  const [heading, setHeading] = useState('');
  const [popLink, setPopLink] = useState('');

  useEffect(() => {
    let index = loginData.resourceCategories[0].id;
    setList(_.filter(loginData.resources, v => v.category_id === index));
    setHeading(loginData.resourceCategories[0].category);
  }, []);

  let nameDrawerRef = useRef(null);

  function dialogView() {
    return (
      <Modal
        onClosed={() => setPopLink('')}
        style={{height: '40%', width: '70%'}}
        //position={'bottom'}
        swipeToClose={false}
        ref={c => (nameDrawerRef = c)}
        backdropPressToClose={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
            }}
            style={{position: 'absolute', right: 10, top: 0}}>
            <Image
              style={{width: 10, resizeMode: 'contain'}}
              source={require('../../images/cross.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
            }}>
            <ScrollView>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'DRLCircular-Book',
                  lineHeight: 16,
                }}>
                You are about to leave Dr.Reddy’s and affiliates website.{'\n'}
                {'\n'}
                Dr. Reddy's assumes no responsibility for the information
                presented on the external website or any further links from such
                sites. These links are presented to you only as a convenience,
                and the inclusion of any link does not imply endorsement by Dr.
                Reddy's. If you wish to continue to this external website, click
                Proceed.
              </Text>
            </ScrollView>
          </View>
          <Text
            onPress={() => {
              if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                nameDrawerRef.close();
              }
              if (popLink !== '') {
                Linking.openURL(popLink);
              }
            }}
            style={{
              marginTop: 20,
              fontFamily: 'DRLCircular-Book',
              color: colors.blue,
              alignSelf: 'center',
            }}>
            Proceed
          </Text>
        </View>
      </Modal>
    );
  }

  function renderItems(item, index) {
    if (item.status === '1') {
      return (
        <TouchableOpacity
          onPress={() => {
            if (item.link !== undefined && item.link !== '') {
              if (item.hide_leave_popup === '1') {
                Linking.openURL(item.link);
              } else {
                setPopLink(item.link);
                if (nameDrawerRef !== undefined && nameDrawerRef !== null) {
                  nameDrawerRef.open();
                }
              }
            }
          }}
          style={{
            maxHeight: 100,
            backgroundColor: colors.lightGrey2,
            borderWidth: 0.5,
            marginVertical: 10,
            marginHorizontal: 10,
            padding: 10,
          }}>
          {item.title !== undefined && (
            <Text
              numberOfLines={3}
              style={{
                fontFamily: 'DRLCircular-Book',
                fontSize: 14,
                color: colors.textColor,
              }}>
              {item.title}
            </Text>
          )}

          {item.attachment_url !== undefined && item.attachment_url !== '' && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(item.attachment_url);
              }}
              style={{marginTop: 10}}>
              <Text
                style={{
                  fontFamily: 'DRLCircular-Book',
                  fontSize: 14,
                  color: colors.blue,
                }}>
                View
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  function filterItems(id) {
    setList(_.filter(loginData.resources, v => v.category_id === id));
  }

  return (
    <View style={{height: '100%', backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
      
      <CustomeHeader
        back={'back'}
        title={'Documents and Links'}
        isHome={undefined}
        addToCart={undefined}
        addToWishList={undefined}
        addToLocation={undefined}
      />

      <View style={[styles.container, {marginTop: 10}]}>
        <View style={[styles.categoryContainer, {paddingLeft: 10}]}>
          {loginData.resourceCategories.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setHeading(item.category);
                  filterItems(item.id);
                }}
                style={{height: 50, justifyContent: 'center'}}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      fontSize: 14,
                      color: colors.blue,
                    }}>
                    {item.category}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.itemsContainer}>
          <Text
            style={{
              fontFamily: 'DRLCircular-Bold',
              fontSize: 18,
              color: colors.textColor,
              marginLeft: 10,
              marginBottom: 10,
            }}>
            {heading}
          </Text>
          {console.log('List...............', JSON.stringify(list))}
          <FlatList
            data={list}
            renderItem={({item, index}) => renderItems(item, index)}
            keyExtractor={(item, index) => index}
          />
          <View style={{height: 100}}></View>
        </View>
      </View>
      {dialogView()}
    </View>
  );
}
