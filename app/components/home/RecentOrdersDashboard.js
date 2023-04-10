import React, { useState, useEffect } from 'react';
import { Button, Card } from 'native-base';
import { Text, View, Image, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './home_style';
import { useSelector,useDispatch } from 'react-redux';
import _ from 'lodash';
import colors from '../../config/Colors';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import Colors from '../../config/Colors';
import {BASE_URL_IMAGE} from '../../services/ApiServicePath'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setTrackingInfoSuccess  } from '../../slices/productSlices';
import { getAdminTokenForTracking } from '../../services/operations/productApis';

const {width} =Dimensions.get('window');
GlobalConst.DeviceWidth = width;


const RecentOrders = (props) => {
   
    const [active , setActive] = useState(0);
    const [isRecentOrder , recentOrders] = useState(true);
    const [isUpcomingDelivery , upcomingDeliveries] = useState(false);
    const [recentOrdersData, setRecentOrders] = useState([]);
    // const [recentOrders , setRecentOrders] = useState([]);
    const [sortedArray,setSortedArray]=useState([]);

    const  loginData = useSelector((state) => state.authenticatedUser);
    const  homeData = useSelector((state) => state.home);
    const dispatch=useDispatch(); 
    const navigation = useNavigation();

    
    function renderImagesSection(order){
        // 
        let OrderLength= order.items.length;

        if(OrderLength===1){
            return(
                <View style={{flexDirection:'row',justifyContent:'center'}} >

                    {order.items.map((item,index)=>{
                        if(item.extension_attributes !== undefined && item.extension_attributes.productimage !== undefined){
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={{uri :BASE_URL_IMAGE +item.extension_attributes.productimage}}/> )
                        }
                        else{
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={require('../../images/Group_741.png')}/>)
                        }
                                    
                    })}
                </View>
            )

        }
        else if(OrderLength===2){
            return(
                <View style={{flexDirection:'row',justifyContent:'center'}} >

                    {order.items.map((item,index)=>{
                        if(item.extension_attributes !== undefined && item.extension_attributes.productimage !== undefined){
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={{uri :BASE_URL_IMAGE +item.extension_attributes.productimage}}/> )
                        }
                        else{
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={require('../../images/Group_741.png')}/>)
                        }
                                    
                    })}
                </View>
            )

        }
        else if(OrderLength===3){
            return(
                <View style={{flexDirection:'row',justifyContent:'center'}} >

                    {order.items.map((item,index)=>{
                        if(item.extension_attributes !== undefined && item.extension_attributes.productimage !== undefined){
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={{uri :BASE_URL_IMAGE +item.extension_attributes.productimage}}/> )
                        }
                        else{
                            return(<Image style={{height:200, width:120}} resizeMode='contain'  source={require('../../images/Group_741.png')}/>)
                        }
                                    
                    })}
                </View>
            )

        }
        else if(OrderLength>3){
            let count=0;
            return(
                <View>
                <View style={{flexDirection:'row',justifyContent:'center'}} >

                    {order.items.map((item,index)=>{
                        if(count<3){
                            if(item.extension_attributes !== undefined && item.extension_attributes.productimage !== undefined){
                                count=count+1;
                                return(<Image style={{height:200, width:120}} resizeMode='contain'  source={{uri :BASE_URL_IMAGE +item.extension_attributes.productimage}}/> )
                            }
                            else{
                                count=count+1;
                                return(<Image style={{height:200, width:120}} resizeMode='contain'  source={require('../../images/Group_741.png')}/>)
                            }

                        }
                       
                                    
                    })}
                </View>
                <TouchableOpacity onPress = {()=>{
                       dispatch(setTrackingInfoSuccess([]))
                       dispatch(getAdminTokenForTracking(order.entity_id))
                       let orderID=order.entity_id;
                   
                        navigation.navigate("OrderDetail", orderId={orderID})
                    }}
                
                ><Text style={{fontFamily:'DRLCircular-Bold',fontSize:16}}>+{OrderLength-3} more</Text></TouchableOpacity>
                </View>
            )
        }
       
    }

    useEffect(()=>{
        
        if(!_.isEmpty(homeData.recentOrders)){
            
            setRecentOrders(homeData.recentOrders)
            setSortedArray(_.filter(homeData.recentOrders, v => v.status === "pending"))
        }
    }, [homeData.recentOrders])

    const {width} =Dimensions.get('window');
    GlobalConst.DeviceWidth = width;


    function sortByStatus(status){
       
            //let sortedArray=_.filter(recentOrders,{​​​​ 'status' : status}​​​​);
           // let sortedArray=_.filter(recentOrders,{​​​​ 'status' : "pending"}​​​​);
          //

          if(status==="pending"){
            let sortedArray =_.filter(recentOrdersData, v => v.status === "pending");
           // 
            return(sortedArray)
          }
          else{
            let sortedArray =_.filter(recentOrdersData, v => v.status !== "pending");
          //  
            return(sortedArray)

          }
    }

    const recenterOrdersSelection = () =>{
        if(!isRecentOrder){
            recentOrders(true)
            upcomingDeliveries(false);
        }
        else{
            recentOrders(false)
            upcomingDeliveries(true);
        }
       setSortedArray(sortByStatus("pending")) 
    }

    const upcomingDeliverySerlection = () =>{
        if(!isUpcomingDelivery){
            recentOrders(false)
            upcomingDeliveries(true);
        }
        else{
            recentOrders(true)
            upcomingDeliveries(false);
        }
        setSortedArray(sortByStatus("not pending")) 
    }
  
    const change = ({nativeEvent})=>{
        const slide= Math.ceil(nativeEvent.contentOffset.x/nativeEvent.layoutMeasurement.width)
        
        if(slide !==active){
            setActive(slide)
        }
    }
    return ( 
           <View>
           
             
            {homeData.recentOrders.length>0 ?
            <ScrollView            
            pagingEnabled
            horizontal 
            showsHorizontalScrollIndicator={false}
            onScroll={change}
            >
                    {homeData.recentOrders.map((order, index)=>(
                        <View key={index} style={{padding:10}}>
                        <Card style={{width:width-25, backgroundColor: colors.white, borderRadius: 10,padding:20}}>
                           {/* <View style={{backgroundColor:'rgba(195, 176, 245,1)', width:200,height:30,borderRadius:20,alignItems:'center',justifyContent:'center'}} >
                               <Text style={[styles.textLight,{fontSize:14,color:colors.white}]}>Expected Delivery in 2 days</Text>
                               </View> */}
                            
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',marginTop:20}}>
                                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                   <Text style={[styles.textLight,{fontSize:16}]}>Order Value</Text> 
                                   <Text style={[styles.textBold,{fontSize:20}]}>${order.base_grand_total}</Text> 
                                </View>

                                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                   <Text style={[styles.textLight,{fontSize:16}]}>Order ID</Text> 
                                   <Text style={[styles.textBold,{fontSize:20}]}>{order.increment_id}</Text> 
                                </View>
                            </View>

                            {/* <Image source={require('../../images/Screenshot.jpg')} style={{height:250,width:'100%'}} resizeMode='contain'/> */}
                               {renderImagesSection(order)}

                               <Button
                            onPress={()=>{
                                dispatch(setTrackingInfoSuccess([]))
                                dispatch(getAdminTokenForTracking(order.entity_id))
                                let orderID=order.entity_id;
                                 navigation.navigate("OrderDetail", orderId={orderID})
                               
                            }}
                             
                              full style={{backgroundColor: Colors.lightBlue, borderRadius: 50,borderColor: colors.white, borderWidth: 1,marginHorizontal:20,marginTop:10}}
                                 >
                             <Text uppercase={false} style={[styles.buttonText,{fontSize:14}]}>Track Order</Text>
                             </Button>
                          
                            </Card>

                            </View>
                        ))
                    }
            </ScrollView>
            :
            <View style={{padding:20}}>
                <Text style={{fontFamily:'DRLCircular-Bold',fontSize:16}}>No such orders found</Text>
            </View>
            }

            <View style={{borderTopWidth:0.2,borderColor:'grey',height:70,alignItems:'center',justifyContent:'center',marginTop:20,width:'100%'}}>
                            <Button
                            onPress={()=>{
                                navigation.navigate("MyOrder")
                            }}
                             
                              full style={{backgroundColor: Colors.lightBlue, borderRadius: 50,borderColor: colors.white, borderWidth: 1,marginHorizontal:20}}
                                 >
                             <Text uppercase={false} style={[styles.buttonText,{fontSize:14}]}>View All Orders</Text>
                             </Button>
                            </View>
            </View>
    );
}

export default RecentOrders;