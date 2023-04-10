import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View, Image, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styles from './home_style';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, getAdminTokenForMyOder } from '../../services/operations/getToken';
import _ from 'lodash';
import colors from '../../config/Colors';
import withLoader from '../../utilities/hocs/LoaderHOC';
// import withErrorHandler from '../../utilities/hocs/withErrorHandler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import CustomeHeader from '../../config/CustomeHeader';
import utils from '../../utilities/utils'
import { useNavigation } from '@react-navigation/native';
import {getAdminTokenForPrintInvoice} from '../../services/operations/productApis'



let ViewWithSpinner = withLoader(View);

const {width} =Dimensions.get('window');
GlobalConst.DeviceWidth = width;
const height = width*0.6;



const dashboard = (props) => {

    const [email, setEmail] = useState("");
    const [active , setActive] = useState(0);
    const [activeStepCount , setActiveStepCount] = useState(0);
    const [currentStepCount , setCurrentStepCount] = useState(1);
   // const [isRecentOrder , recentOrders] = useState(false);
    const [isUpcomingDelivery , upcomingDeliveries] = useState(true);

    const [recentOrders,setRecentOrders]=useState([]);
    const [recentInvoices,setRecentInvoices]=useState([]);

    //

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const  loginData = useSelector((state) => state.authenticatedUser);
    const  homeData = useSelector((state) => state.home);

    

    const {width} =Dimensions.get('window');
    GlobalConst.DeviceWidth = width; 

    useEffect(()=>{
        dispatch(getAdminTokenForMyOder(GlobalConst.customerId))
    }, [])

    useEffect(() => {
        if(homeData.recentOrders!==undefined && !_.isEmpty(homeData.recentOrders)){
            setRecentOrders(homeData.recentOrders)
        }
  
    }, [homeData.recentOrders]);

    useEffect(() => {
        if(homeData.recentInvoices!==undefined && !_.isEmpty(homeData.recentInvoices)){
            setRecentInvoices(homeData.recentInvoices)
        }
  
    }, [homeData.recentInvoices]);



    function renderOrderStatus(status){
        if(loginData.orderStatus.find(item=>item.value===status)!==undefined){
            return(loginData.orderStatus.find(item=>item.value===status).label)
        }
       else{
           return ""
       }
      
    }

    function renderInvoiceStatus(status)
    {
        if(status===1){
            return "Open"
        }
        if(status==2){
            return "Paid"
        }
        if(status==3){
            return "Cancelled"
        }
    }



    function renderAccountSection(){
        return(
            <View>
                <Text style={{fontFamily:'DRLCircular-Bold',fontSize:18,paddingBottom:10,borderWidthBottom:0.5,borderColor:colors.textColor}}>Contact Information</Text>

                <View style={{marginTop:10}}>
                <Text style={{fontFamily:'DRLCircular-Book',fontSize:16}}>{loginData.customerInfo.firstname} {loginData.customerInfo.lastname}</Text>
                 <Text style={{fontFamily:'DRLCircular-Book',fontSize:14,color:colors.darkBlue}}>{loginData.customerInfo.email}</Text>
                 </View>
            </View>
        )
    }

    function renderAddressSection(){
        return(
            <View style={{marginTop:40}}>
                  <Text style={{fontFamily:'DRLCircular-Bold',fontSize:18,paddingBottom:10,borderWidthBottom:0.5,borderColor:colors.textColor}}>Address Book</Text>

                {renderDefaultAddress()}

                <TouchableOpacity
                style={{marginRight:20,marginTop:10}}
                onPress={()=>{
                    navigation.navigate("ShippingAddresses")
                }}
                >
                    <Text style={{textAlign:'right',fontFamily:'DRLCircular-Bold',fontSize:14,color:colors.darkBlue}}>View All</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderOrdersSection(){
       let recentOrdersTrim= recentOrders.slice(0,5)
        return(
            <View style={{marginTop:20}}>
                <Text style={{fontFamily:'DRLCircular-Bold',fontSize:20,paddingBottom:10,borderWidthBottom:0.5,borderColor:colors.textColor}}>Recent Orders</Text>
            
            {recentOrdersTrim.map((item,index)=>{
               
                    return(
                        <View>
                        <View style={{flex:1, flexDirection: 'column',
             backgroundColor: colors.whiteGradient, margin:10}}>
            <View style={{flexDirection:"row", alignItems: 'center',
            borderColor: colors.lightGrey, backgroundColor:colors.shopCategoryBackground, 
            }}>
            {/* <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source= {{uri: BASE_URL_IMAGE+ utils.getAttributeFromCustom(item, 'image')}}/> */}
            {/* <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source={require('../../images/Group_741.png')}/> */}
            <View style={{flexDirection: 'column', padding:10, }}>
               
                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:18, color: colors.textColor,}}>
                 <Text style={{fontFamily: 'DRLCircular-Bold',}}>Order# </Text>{item.increment_id}
                </Text>
                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,marginTop:3}}>
                <Text style={{fontFamily: 'DRLCircular-Bold',}}>PO Number# </Text>{item.payment.po_number}
                </Text>

               { item.extension_attributes!==undefined && item.extension_attributes.sap_id!==undefined &&
               <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,marginTop:3}}>
                <Text style={{fontFamily: 'DRLCircular-Bold',}}>Sales Order Number# </Text>{item.extension_attributes.sap_id}
                </Text>}


                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,}}>
                <Text style={{fontFamily: 'DRLCircular-Bold',}}>Date </Text> {item.updated_at.slice(0,10)}
                </Text>

                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,}}>
                <Text style={{fontFamily: 'DRLCircular-Bold',}}>Created By </Text> {item.customer_firstname} {item.customer_lastname}
                </Text>

                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,}}>
                <Text style={{fontFamily: 'DRLCircular-Bold',}}>Status:</Text> {renderOrderStatus(item.status)}
                </Text>

                <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Bold', fontSize:18, marginTop:5, color: colors.textColor}}>
                Order Total: ${item.base_grand_total}
                </Text>
            

            </View>

          
            </View>
{/* 
            <View style={{width: '100%', height:40, flexDirection: 'row', justifyContent: 'space-between', borderTopColor: colors.lightGrey,
                    backgroundColor: colors.shopCategoryBackground, borderWidth:1, borderTopWidth:1, borderColor: colors.lightGrey}}> 
                    <TouchableOpacity style={{justifyContent: 'center', width:'48%', alignItems: 'center'}}  onPress = {()=>{
                        
                       dispatch(reorder(item.entity_id))
                      
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>  
                    <Text style={{fontFamily: 'DRLCircular-Book', color: colors.blue, marginLeft:5, fontSize:14}}> Reorder</Text>
                    </View>  
                    </TouchableOpacity >

                    <View style={{backgroundColor: colors.blue, width:1, margin:5}}>

                    </View>

                    <TouchableOpacity style={{justifyContent: 'center', width:'48%', alignItems: 'center'}} onPress = {()=>{
                     dispatch(setTrackingInfoSuccess([]))
                      dispatch(getAdminTokenForTracking(item.entity_id))
                       let orderID=item.entity_id;
                   
                        navigation.navigate("OrderDetail", orderId={orderID})
                    }} >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                    <Text style={{fontFamily: 'DRLCircular-Book', color: colors.blue, marginLeft:5, fontSize:14}}> View Order</Text>
                    </View>  
                    </TouchableOpacity >
                    </View> */}

            </View>
                        </View>
                        )
             
            })}

            <TouchableOpacity
                style={{marginRight:20,marginTop:10}}
                onPress={()=>{
                    navigation.navigate("MyOrder")
                }}
                >
                    <Text style={{textAlign:'right',fontFamily:'DRLCircular-Bold',fontSize:14,color:colors.darkBlue}}>View All</Text>
                </TouchableOpacity>
            </View>
        )
    }



    function renderInvoiceSection(){
        let recentOrdersTrim= recentInvoices.slice(0,5)
         return(
             <View style={{marginTop:20}}>
                 <Text style={{fontFamily:'DRLCircular-Bold',fontSize:20,paddingBottom:10,borderWidthBottom:0.5,borderColor:colors.textColor}}>Recent Invoices</Text>
             
             {recentOrdersTrim.map((item,index)=>{
                
                     return(
                         <View>
                         <View style={{flex:1, flexDirection: 'column',
              backgroundColor: colors.whiteGradient, margin:10}}>
             <View style={{flexDirection:"row", alignItems: 'center',
             borderColor: colors.lightGrey, backgroundColor:colors.shopCategoryBackground, 
             }}>
             {/* <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source= {{uri: BASE_URL_IMAGE+ utils.getAttributeFromCustom(item, 'image')}}/> */}
             {/* <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source={require('../../images/Group_741.png')}/> */}
             <View style={{flexDirection: 'column', padding:10, }}>
                
             {item.extension_attributes !==undefined && item.extension_attributes.order_increment_id !==undefined &&
                 <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,}}>
                  <Text style={{fontFamily: 'DRLCircular-Bold',}}>Order# </Text>{item.extension_attributes.order_increment_id}
                 </Text>}

                 {item.extension_attributes !==undefined && item.extension_attributes.sap_id !==undefined &&
                 <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,marginTop:3}}>
                 <Text style={{fontFamily: 'DRLCircular-Bold',}}>Sales Order Number# </Text>{item.extension_attributes.sap_id}
                 </Text>}

                 <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,marginTop:3}}>
                 <Text style={{fontFamily: 'DRLCircular-Bold',}}>Invoice# </Text>{item.increment_id}
                 </Text>
 
                 <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Book', fontSize:16, color: colors.textColor,}}>
                 <Text style={{fontFamily: 'DRLCircular-Bold',}}>Status:</Text> {renderInvoiceStatus(item.state)}
                 </Text>
 
                 <Text  numberOfLines={2} style={{fontFamily: 'DRLCircular-Bold', fontSize:18, marginTop:5, color: colors.textColor}}>
                Invoice Value: ${item.base_grand_total}
                 </Text>

                 <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>
                    {
                        dispatch(getAdminTokenForPrintInvoice(item.entity_id))
                       
                }}
                >
                <Text style={{fontFamily:'DRLCircular-Bold',fontSize:16,color:colors.blue,}}>Print this Invoice</Text>
                </TouchableOpacity>
             
 
             </View>
 
           
             </View>
 
             </View>
                         </View>
                         )
              
             })}
 
             <TouchableOpacity
                 style={{marginRight:20,marginTop:10}}
                 onPress={()=>{
                     navigation.navigate("MyOrder")
                 }}
                 >
                     <Text style={{textAlign:'right',fontFamily:'DRLCircular-Bold',fontSize:14,color:colors.darkBlue}}>View All</Text>
                 </TouchableOpacity>
             </View>
         )
     }
 
    
    function renderDefaultAddress () {
        let billAdd=getAddressBilling();
        let shipAdd =getAddressShippingg();
        if(billAdd.length===0 && shipAdd.length===0)
        {
            return null;
        }
        else{
        return(
           <View style={{flex:1, alignItems: 'center', 
            }}>
               
                {billAdd.length>0 && <View style={{borderColor:colors.grey, borderWidth:1,
                     backgroundColor: colors.white,
                      width:'90%', height:150}}>
                  <View style={{backgroundColor: colors.stepsColor, width:200,
                     alignItems: 'center', justifyContent: 'center', padding:5}}>    
                  <Text style={{  fontFamily: 'DRLCircular-Book', fontSize:14, color: colors.white, }}>Default Billing Address</Text>
                  </View>   
                    <View style={{flexDirection:'row', marginTop:5,paddingLeft:20}}>
                
                    <Text numberOfLines={5}>
                    <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize:18}}>{getNameFromAddress("billing")}</Text>
                    <Text style={{fontFamily: 'DRLCircular-Book', fontSize:16}}>{billAdd}</Text>
                    </Text>
                    </View>
                    {/* <TouchableOpacity style={{position: 'absolute', right:50, top:10}} onPress={()=>{
                         navigation.navigate("AddAddress",{isShipping:false,isBilling:true,isNew:false,isEdit:false,index:0})
                    }}> 
                    <Image resizeMode='contain'  source={require('../../images/edit.png')}/>
                    </TouchableOpacity>  */}
                    {/* <TouchableOpacity style={{position: 'absolute', right:10, top:10}} onPress={()=>{
                         dispatch(deleteAddressByAdminToken(getAddressIDBilling()))
                         Toast.show("Address Deleted", Toast.SHORT);
                    }}> 
                    <Image resizeMode='contain'  source={require('../../images/bin.png')}/>
                </TouchableOpacity> */}
                </View>}


                <View style={{height:10}}></View>

               {shipAdd.length>0 && <View style={{height: 150, borderWidth:1, borderColor:colors.grey, backgroundColor: colors.white,
                      width:'90%'}}>
                    <View style={{backgroundColor: colors.stepsColor, width:200,
                        borderWidth:1, borderColor: colors.lightGrey,
                     alignItems: 'center', justifyContent: 'center', padding:5}}>    
                  <Text style={{  fontFamily: 'DRLCircular-Book', fontSize:14, color: colors.white, }}>Default Shipping Address</Text>
                  </View> 
                    <View style={{flexDirection:'row', marginTop:5,paddingLeft:20}}>
                   
                        <Text numberOfLines={5}>
                    <Text style={{ fontFamily: 'DRLCircular-Bold', fontSize:18}}>{getNameFromAddress("shipping")}</Text>
                    <Text style={{fontFamily: 'DRLCircular-Book', fontSize:16}}>{shipAdd}</Text>
                    </Text>
                 </View>

                 {/* <TouchableOpacity style={{position: 'absolute', right:50, top:10}} onPress={()=>{
                      navigation.navigate("AddAddress",{isShipping:true,isBilling:false,isNew:false,isEdit:false,index:0})
                }}> 
                <Image resizeMode='contain'  source={require('../../images/edit.png')}/>
                </TouchableOpacity>  */}

                {/* <TouchableOpacity style={{position: 'absolute', right:10, top:10}} onPress={()=>{
                     dispatch(deleteAddressByAdminToken(getAddressIDShipping()))
                     Toast.show("Address Deleted", Toast.SHORT);
                }}> 
                <Image resizeMode='contain'  source={require('../../images/bin.png')}/>
                </TouchableOpacity> */}
                </View>}

               
            </View>
        )
            }
    }

    function getNameFromAddress(status){
        let name= '';
        if(loginData.customerInfo !== undefined){
        for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){
            if(status==='billing'){
            if(loginData.customerInfo.addresses[i].default_billing){
                name= loginData.customerInfo.addresses[i].firstname+ ' '+loginData.customerInfo.addresses[i].lastname+"\n"
            }  
            }
            else if (status==='shipping') {
                if(loginData.customerInfo.addresses[i].default_shipping){
                    name= loginData.customerInfo.addresses[i].firstname+ ' '+loginData.customerInfo.addresses[i].lastname+"\n"
                } 
            }

        }
        }
     return name;
    }

    let defaultBillingIndex=0
    function getAddressBilling(){
        let address= '';
        if(loginData.customerInfo !== undefined){
        for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){
            if(loginData.customerInfo.addresses[i].default_billing){

                if(utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status") !=="NA" && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")) !==undefined
                && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")).label==="Approved"
                ){
                    defaultBillingIndex=i;

                if(loginData.customerInfo.addresses[i].street !== undefined && loginData.customerInfo.addresses[i].street.length>0 ){
                    address = address + loginData.customerInfo.addresses[i].street[0]+ "\n"
                }
              

               if(loginData.customerInfo.addresses[i].street !== undefined && loginData.customerInfo.addresses[i].street.length>0 ){
                    address = address + loginData.customerInfo.addresses[i].street[0]+ "\n"
                }
                if(loginData.customerInfo.addresses[i].city !== undefined && loginData.customerInfo.addresses[i].city.length>0 ){
                    address = address + loginData.customerInfo.addresses[i].city+ " "
                }
                if(loginData.customerInfo.addresses[i].region !== undefined && loginData.customerInfo.addresses[i].region.region !== undefined  ){
                    address = address + loginData.customerInfo.addresses[i].region.region+ " "
                }

                if(loginData.customerInfo.addresses[i].postcode !== undefined  ){
                    address = address + loginData.customerInfo.addresses[i].postcode+ "\n"
                    address = address + "United States" + "\n"
                }
                if(loginData.customerInfo.addresses[i].telephone !== undefined  ){
                    address = address +loginData.customerInfo.addresses[i].telephone+ "\n"
                }
            }
            }   
        }
        }
     return address;
        
    }

    let defaultShippingIndex=0
    function getAddressShippingg(){
        let address= '';
        if(loginData.customerInfo !== undefined){
        for(let i=0; loginData.customerInfo.addresses !== undefined && i<loginData.customerInfo.addresses.length; i++){
            if(loginData.customerInfo.addresses[i].default_shipping){
           
                if(utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status") !=="NA" && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")) !==undefined
                && loginData.addressLabels.find(element=>element.value===utils.getAttributeFromCustom(loginData.customerInfo.addresses[i],"address_status")).label==="Approved"
                ){
                    defaultShippingIndex=i;

                if(loginData.customerInfo.addresses[i].street !== undefined && loginData.customerInfo.addresses[i].street.length>0 ){
                    address = address + loginData.customerInfo.addresses[i].street[0]+ "\n"
                }
                if(loginData.customerInfo.addresses[i].city !== undefined && loginData.customerInfo.addresses[i].city.length>0 ){
                    address = address + loginData.customerInfo.addresses[i].city+ " "
                }
                if(loginData.customerInfo.addresses[i].region !== undefined && loginData.customerInfo.addresses[i].region.region !== undefined  ){
                    address = address + loginData.customerInfo.addresses[i].region.region+ " "
                }
                if(loginData.customerInfo.addresses[i].postcode !== undefined  ){
                    address = address + loginData.customerInfo.addresses[i].postcode+ "\n"
                    address = address + "United States" + "\n"
                }
                if(loginData.customerInfo.addresses[i].telephone !== undefined  ){
                    address = address +loginData.customerInfo.addresses[i].telephone+ "\n"
                }
            }
            }   
        }
        }
     return address;
    }

    function renderBanner(){
        return(
            <View style={{backgroundColor:colors.bannerDarkBlue,margin:20,borderRadius:10,height:150,padding:10}}>
              
              <View style={{flexDirection:'row'}}>
                  <Image source={require('../../images/Tablet.png')}/>
                  <View style={{marginLeft:20,width:'70%'}}>
              <Text style={{fontFamily:'DRLCircular-Book',fontSize:22,color:colors.white}}>Running low on a specific drug?</Text>
              <Text style={{fontFamily:'DRLCircular-Book',fontSize:14,color:colors.white}}>Get express shipping within 24 hours contact us</Text>
              </View>
              
              </View>

              <TouchableOpacity
              onPress={()=>{
                  navigation.navigate('ContactUs')
                 // navigation.navigate('Help')
              }}
              style={{width:150,justifyContent:'center',alignItems:'center',borderRadius:20,backgroundColor:colors.white,height:30,alignSelf:'center',marginTop:10}}>
                  <Text style={{fontFamily:'DRLCircular-Book',color:colors.textColor}}>Contact Us</Text>
              </TouchableOpacity>
              
            </View>
        )
    }



   
    return ( 
        <ViewWithSpinner
            style={styles.container}                     
            > 
            <StatusBar
                 backgroundColor={colors.lightBlue}
                barStyle="light-content"
            />
            <LinearGradient colors={['#FFFFFF', '#F6FBFF', '#F6FBFF' ]}  style={styles.homeLinearGradient}>
            

            <CustomeHeader 
            back = {"back"}
             title= {"Dashboard"}  
            isHome={true} 
            addToCart ={"addToCart"} 
            addToWishList = {"addToWishList"}
            addToLocation={'addToLocation'}
            /> 

           
            <ScrollView>
                <View style={{marginHorizontal:20,marginVertical:10}}>
              {/* {renderAccountSection()}
              {renderAddressSection()} */}
              {recentOrders.length>0 && renderOrdersSection()}

              {renderBanner()}

              {recentInvoices.length>0 && renderInvoiceSection()}
              </View>
           


            </ScrollView>
            </LinearGradient>
        </ViewWithSpinner>
    );    
}

// const errorHandledComponent = withErrorHandler(dashboard);

export default dashboard;
