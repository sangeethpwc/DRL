import React, {useState, useEffect} from 'react';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import CustomeHeader from '../../config/CustomeHeader';
import withLoader from '../../utilities/hocs/LoaderHOC';
import homeStyles from '../home/home_style';
import GlobalConst from '../../config/GlobalConst';
import colors from '../../config/Colors';
import styles from './Help_styles';
import {useSelector, useDispatch} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';
import {getFAQ} from '../../services/operations/homeApis';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

let ViewWithSpinner = withLoader(View);

const {width} = Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width * 0.6;

const Help = props => {
  const homeData = useSelector(state => state.home);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isExpended, setExpaned] = useState(false);

  const [FAQ, setFAQ] = useState([]);
  const [isApiCalled, setApiCalled] = useState(false);

  const holidays = [
    {
      month: 'Jan',
      list: [
        {
          event: "New Year's Day",
          date: 'Fri, 1st',
        },
      ],
    },
    {
      month: 'Apr',
      list: [
        {
          event: 'Good Friday',
          date: 'Fri, 2nd',
        },
      ],
    },
    {
      month: 'May',
      list: [
        {
          event: 'Memorial Day',
          date: 'Mon, 31st',
        },
      ],
    },
    {
      month: 'Jul',
      list: [
        {
          event: 'Independence Day Observed',
          date: 'Mon, 5th',
        },
      ],
    },
    {
      month: 'Sep',
      list: [
        {
          event: 'Labour Day',
          date: 'Mon, 6th',
        },
      ],
    },
    {
      month: 'Nov',
      list: [
        {
          event: 'Diwali',
          date: 'Fri, 6th',
        },
        {
          event: 'Thanksgiving Day',
          date: 'Thu, 25th',
        },
        {
          event: 'Day After Thanksgiving Day',
          date: 'Fri, 26th',
        },
      ],
    },
    {
      month: 'Dec',
      list: [
        {
          event: 'Christmas Eve',
          date: 'Thu, 23rd',
        },
        {
          event: 'Christmas Day Observed',
          date: 'Fri, 24th',
        },
      ],
    },
  ];

  function setFAQData() {
    if (
      homeData.isLoading === false &&
      !isApiCalled &&
      _.isEmpty(homeData.FAQdata)
    ) {
      setApiCalled(true);
      dispatch(getFAQ());
    }
  }

  const setExpandedView = () => {
    if (isExpended) {
      setExpaned(false);
    } else {
      setExpaned(true);
    }
  };

  function raiseRequest() {
    if (GlobalConst.customerStatus === 'Approved') {
      navigation.navigate('ServiceRequest');
    } else {
      Toast.show('Please complete Profile / Wait for approval', Toast.SHORT);
    }

    //  navigation.navigate("ServiceRequest")
  }

  function openRequest() {
    if (GlobalConst.customerStatus === 'Approved') {
      navigation.navigate('ViewRequests', {set: 'active'});
    } else {
      Toast.show('Please complete Profile / Wait for approval', Toast.SHORT);
    }

    // navigation.navigate("ViewRequests",{"set":"active"})
  }

  function openRequest2() {
    if (GlobalConst.customerStatus === 'Approved') {
      navigation.navigate('ViewRequests', {set: 'history'});
    } else {
      Toast.show('Please complete Profile / Wait for approval', Toast.SHORT);
    }

    //navigation.navigate("ViewRequests",{"set":"history"})
  }

  function renderAnswer(item, index) {
    // if(index!==2 && index!==5 && index!==6 && index!==12 ){
    if (index !== 2 && index !== 5 && index !== 6 && index !== 12) {
      return (
        <View
          style={
            item.isExpended
              ? {padding: 5, paddingVertical: 20, width: '90%'}
              : {height: 0}
          }>
          <Text style={[styles.lightText, {fontSize: 15, minHeight: 40}]}>
            {item.answer}
          </Text>
        </View>
      );
    }
    // else if(index===2){
    //     return(
    //         <View style={item.isExpended ? {padding:5,paddingVertical:20, width:'90%'}: {height:0}}>

    //   <View >
    //      <Text style={[styles.lightText,{fontSize:16,minHeight:40,}]}>
    //      Our Business hours are: {"\n"}Monday to Friday, 8 am - 5pm EST{"\n\n"}We will be closed on the following holidays:{"\n"}Please find our Holiday calendar below:
    //  </Text>
    //  <TouchableOpacity onPress={()=>{
    //      //Linking.openURL('')
    //  }}>
    //  <Text style={[styles.lightText,{fontSize:16,minHeight:40,color:colors.blue}]}>Click here</Text>
    //  </TouchableOpacity>
    //     </View>
    //     </View>
    //     )

    // }
    else if (index === 5 || index === 6 || index === 12) {
      return (
        <View
          style={
            item.isExpended
              ? {padding: 5, paddingVertical: 20, width: '90%'}
              : {height: 0}
          }>
          <View>
            <Text style={[styles.lightText, {fontSize: 16, minHeight: 40}]}>
              Please call Customer Service or
              <Text
                onPress={() => {
                  if (GlobalConst.LoginToken.length > 0) {
                    navigation.navigate('ServiceRequest');
                  } else {
                    Toast.show('Please login to submit Service request');
                  }
                }}
                style={[
                  styles.lightText,
                  {fontSize: 16, minHeight: 40, color: colors.blue},
                ]}>
                {' '}
                Click here
              </Text>
            </Text>
          </View>
        </View>
      );
    } else if (index === 2) {
      return (
        <View
          style={
            item.isExpended
              ? {padding: 5, paddingVertical: 20, width: '99%'}
              : {height: 0}
          }>
          <View>
            <Text style={[styles.lightText, {fontSize: 16, minHeight: 40}]}>
              Our Working hours are: {'\n'}Monday to Friday, 8 am - 5pm EST
              {'\n'}We will be closed on the following holidays in 2021:
            </Text>
            <View
              style={{
                borderWidth: 0.5,
                padding: 5,
                marginTop: 10,
                borderColor: colors.grey,
                borderRadius: 10,
                paddingBottom: 10,
              }}>
              {holidays.map(i => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 5,
                      borderBottomWidth: 0.5,
                      borderColor: colors.grey,
                    }}>
                    <View style={{width: '20%', justifyContent: 'center'}}>
                      <Text
                        style={{fontFamily: 'DRLCircular-Book', fontSize: 14}}>
                        {i.month}
                      </Text>
                    </View>
                    <View style={{width: '80%'}}>
                      {i.list.map((e, index) => {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={
                                i.list.length > 1 && index !== i.list.length - 1
                                  ? {
                                      paddingVertical: 2,
                                      width: '70%',
                                      paddingHorizontal: 2,
                                      borderBottomWidth: 0.5,
                                      borderColor: colors.grey,
                                      justifyContent: 'center',
                                    }
                                  : {
                                      paddingVertical: 2,
                                      width: '70%',
                                      paddingHorizontal: 2,
                                      justifyContent: 'center',
                                    }
                              }>
                              <Text
                                style={{
                                  fontFamily: 'DRLCircular-Book',
                                  fontSize: 14,
                                }}>
                                {e.event}
                              </Text>
                            </View>
                            <View
                              style={
                                i.list.length > 1 && index !== i.list.length - 1
                                  ? {
                                      paddingVertical: 2,
                                      width: '30%',
                                      paddingHorizontal: 2,
                                      borderBottomWidth: 0.5,
                                      borderColor: colors.grey,
                                      justifyContent: 'center',
                                    }
                                  : {
                                      paddingVertical: 2,
                                      width: '30%',
                                      paddingHorizontal: 2,
                                      justifyContent: 'center',
                                    }
                              }>
                              <Text
                                style={{
                                  fontFamily: 'DRLCircular-Book',
                                  fontSize: 14,
                                }}>
                                {e.date}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    }
  }

  function renderFAQitems() {
    return FAQ.map((item, index) => (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (item.isExpended) {
              item.isExpended = false;
            } else {
              item.isExpended = true;
            }

            let temp = [];
            temp = _.cloneDeep(FAQ);

            setFAQ(temp);
          }}>
          <View style={styles.faqitem}>
            <Text
              style={[
                styles.lightText,
                {fontSize: 18, lineHeight: 20, width: '80%'},
              ]}>
              {item.question}
            </Text>
            <Image source={require('../../images/bottom_small.png')} />
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={!item.isExpended}>
          {renderAnswer(item, index)}
        </Collapsible>
      </View>
    ));
  }

  useEffect(() => {
    // renderFAQitems();
    return () => {};
  }, [FAQ]);

  let temp = [
    {
      question: 'Where can I find Tracking Number?',
      answer:
        'Please go to My profile > \nMy Orders > View details >' + 'Shipment',
    },
    {
      question: 'How do I get a copy of my Packing Slip?',
      answer: 'Please submit a service request from Help & Support.',
    },
    {
      question: 'What are your Hours of Operation?',
      answer:
        'Our Business hours are: \nMonday to Friday, 8 am - 5pm EST\nWe will be closed on the following holidays:',
    },

    // {
    //   question: 'How are Delivery Charges Calculated?',
    //   answer:
    //     'We have 2 shipping modes:\n> Standard Delivery\n> Next Day Delivery\n\nOur Shipping Charges for each mode are mentioned below:\n\n1. Standard Shipping\n\nNon-Refrigerated Products (only)\n> Orders above $500 – Free\n> Orders below $500 - $50\n\nRefrigerated Products (Only)\n> Orders above $500 – Free\n> Orders below $500 - $100\n\nNon-Refrigerated + Refrigerated Products\n> Orders above $500 – Free\n> Orders below $500 - $100\n\n\n2. Next Day Delivery\n\nNon-Refrigerated Products (Only)\n> Orders above $500 – $40\n> Orders below $500 - $90\n\nRefrigerated Products (Only)\n> Orders above $500 – Free\n> Orders below $500 - $100\n\nNon-Refrigerated + Refrigerated Products\n> Orders above $500 – $40\n> Orders below $500 - $140',
    // },
    {
      question: 'How are Delivery Charges Calculated?',
      answer:
        'Minimum Order: $500 per Purchase Order*\n\n\n> *Refrigerated product orders under $500 will incur a $100 Processing Fee\n\n>*Non-refrigerated product orders under $500 will incur a $50 Processing Fee\n\n>A processing fee for refrigerated products will be incurred for total orders under $500\n\n>A processing fee for non-refrigerated products will be incurred for total orders under $500\n\n>Standard shipping: $50 for 3-5 business days\n\n>Expedited Shipping: $100 for non-refrigerated products',
    },
    {
      question: 'How do I find the Delivery Schedule for My Orders?',
      answer:
        'We have 2 shipping modes:\n\n> Standard Delivery\n> Next Day Delivery\n\nOur Shipping Schedules for each mode are mentioned below:\n\n1. Standard shipping\n\nNon Refrigerated Products\n> Delivery Date – Within 7 calendar days\n\nRefrigerated Products\n> If ordered before 3 PM EST (Working Day)\n> Delivery Date - Next Working day\n> If ordered after 3 PM EST (Working Day) or on a Holiday\n> Delivery date - Next to Next Working day\n> If ordered on Thursday after 3pm EST or on Friday/Saturday/Sunday\n> Delivery Date - Next Tuesday\n\n\n2. Next Day Delivery\nNext Day Delivery will impact the delivery time of Non Refrigerated products only. Refrigerated\ndelivery schedule remains unimpacted if this mode is chosen.\nNon Refrigerated Products\n> If ordered before 3 PM EST (Working Day)\n> Delivery Date - Next Working day\n> If ordered after 3 PM EST (Working Day) or on a non-working day (Saturday/Sunday/Holiday)\n> Delivery date - Next to Next Working day',
    },
    {
      question: 'How are Orders returned?',
      answer: 'Please initiate a service request from Help & Support.',
    },
    {
      question: 'How are Shipment errors reported?',
      answer: 'Please initiate a service request from Help & Support.',
    },
    {
      question: 'How do I reset my Password?',
      answer:
        'Go to Forgot Password-> Provide your registered email Id. Reset Password link will be sent to your mail. Click on the link to set your New Password.',
    },
    {
      question: 'How do I change my Password?',
      answer:
        'Go to My Account->Change Password\n\nNote: Needs to be done via web portal',
    },
    {
      question: 'How do I add another user?',
      answer:
        'Go to My Account-> Company Structure-> Add User\n\nNote: Needs to be done via web portal',
    },
    {
      question: 'How do I delete a user?',
      answer:
        'Go to My Account-> Company Users-> Select the User -> Delete\n\nNote: Needs to be done via web portal',
    },
    {
      question: 'How do I add a new Shipping Location?',
      answer: 'Go to My Account->Address Book -> Add New Address.',
    },
    {
      question: 'How do I remove a Shipping Location?',
      answer: 'Please initiate a service request from Help & Support.',
    },
  ];

  temp = _.map(temp, o => _.extend({isExpended: false}, o));

  return (
    <ViewWithSpinner style={homeStyles.container}>
      
      {FAQ.length === 0 && setFAQ(temp)}

      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <CustomeHeader
        back={undefined}
        title={'Help & Support'}
        isHome={true}
        addToCart={'addToCart'}
        addToWishList={'addToWishList'}
        addToLocation={'addToLocation'}
      />

      <ScrollView style={{backgroundColor: colors.white}}>
        <View style={{padding: 10, margin: 5}}>
          <Text
            style={[
              styles.titleText,
              {fontSize: 24, marginTop: 5, marginBottom: 20},
            ]}>
            How can we help you?
          </Text>

          <View style={styles.faqcard}>
            <Text style={styles.titleText}>FAQs</Text>

            {renderFAQitems(FAQ)}
          </View>

          {GlobalConst.LoginToken.length > 0 && (
            <View style={styles.serviceCard}>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  paddingBottom: 30,
                  borderColor: colors.textColor,
                }}>
                <View style={styles.serviceCardItem}>
                  <Image source={require('../../images/service.png')} />
                  <View style={{flexDirection: 'column', marginLeft: 20}}>
                    <Text style={styles.titleText}>Service Request</Text>
                    <Text style={styles.labelText}>
                      Click here to submit a new request for shipment
                      errors/returns and general inquiries
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        raiseRequest();
                      }}
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.blueText,
                          {marginRight: 5, maxWidth: '90%'},
                        ]}>
                        Submit a Request
                      </Text>
                      <Image
                        source={require('../../images/forward_small.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{marginTop: 30}}>
                <View style={styles.serviceCardItem}>
                  <Image source={require('../../images/serviceActive.png')} />
                  <View style={{flexDirection: 'column', marginLeft: 20}}>
                    <Text style={[styles.titleText, {maxWidth: '90%'}]}>
                      View Your Requests
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        openRequest();
                      }}
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.blueText,
                          {marginRight: 5, maxWidth: '90%'},
                        ]}>
                        View Active Requests
                      </Text>
                      <Image
                        source={require('../../images/forward_small.png')}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        openRequest2();
                      }}
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.blueText,
                          {marginRight: 5, maxWidth: '90%'},
                        ]}>
                        View Completed Requests
                      </Text>
                      <Image
                        source={require('../../images/forward_small.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              marginTop: 20,
              paddingRight: 50,
              borderTopWidth: 0.3,
              paddingTop: 20,
              borderColor: colors.textColor,
            }}>
            <Text style={styles.titleText}>Contact Us</Text>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/mail.png')} />
              </View>
              <View style={{width: '100%'}}>
                <View style={{justifyContent: 'center', width: '90%'}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Customer Care:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('mailto:customercare@drreddys.com');
                    }}
                    style={[styles.blueText, {fontSize: 14, maxWidth: '100%'}]}>
                    customercare@drreddys.com
                  </Text>
                </View>
                <View
                  style={{
                    // flexDirection: 'row',
                    //  alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Techical Support:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('mailto:Direct@drreddys.com');
                    }}
                    style={[styles.blueText, {fontSize: 14, maxWidth: '99%'}]}>
                    Direct@drreddys.com
                  </Text>
                </View>
                <View
                  style={{
                    //flexDirection: 'row',
                    // alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Medical Inquires:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('mailto:medinfo@drreddys.com');
                    }}
                    style={[styles.blueText, {fontSize: 14, maxWidth: '99%'}]}>
                    medinfo@drreddys.com
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View style={{marginRight: 20}}>
                <Image source={require('../../images/call.png')} />
              </View>
              <View>
                <View
                  style={
                    {
                      // flexDirection: 'row',
                      // alignItems: 'center'
                    }
                  }>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Customer Care:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('tel:+1 866-733-3952');
                    }}
                    style={[styles.blueText, {fontSize: 14, maxWidth: '99%'}]}>
                    +1 866-733-3952
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: 5,
                    width: '90%',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Adverse Events/Side Effects:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('tel:+1 888-375-3784');
                    }}
                    style={[styles.blueText, {fontSize: 14}]}>
                    +1 888-375-3784
                  </Text>
                </View>
                <View
                  style={{
                    //flexDirection: 'row',
                    //alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'DRLCircular-Book',
                      color: colors.textColor,
                      fontSize: 14,
                    }}>
                    Returns:{' '}
                  </Text>
                  <Text
                    onPress={() => {
                      Linking.openURL('tel:+1 800-967-5952');
                    }}
                    style={[styles.blueText, {fontSize: 14}]}>
                    +1 800-967-5952
                  </Text>
                </View>
                <Text style={[styles.labelText, {fontSize: 14, marginTop: 10}]}>
                  Business hours - 08:00AM to 05:00PM EST {'\n'}(Monday -
                  Friday)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ViewWithSpinner>
  );
};

// const errorHandledComponent = withErrorHandler(Help);

export default Help;
