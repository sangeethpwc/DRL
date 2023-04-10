import React, { useState, useEffect }  from 'react';
import { View, StyleSheet, Image,  Text } from 'react-native';
import { Button, Card } from 'native-base';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Divider,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import colors from './Colors';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import {useSelector} from 'react-redux'


export function DrawerContent({props}) {

  const navigation = useNavigation();
  const [isExpended, setExpaned] = useState(false);

  const isDrawerOpen = useIsDrawerOpen();
 

 const setShopByCategory = () =>{
      if(isExpended){
          setExpaned(false)
      }
      else{
          setExpaned(true)
      }
    };

    const customer = useSelector((state) => state.authenticatedUser);
    
    // {
  return (
    <DrawerContentScrollView >      
      <View
        style={
          styles.drawerContent
        }
      >
        
        <TouchableHighlight>
        <View style={styles.viewHeader}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={
            require('../../app/images/about_pwc.png')
            }
            size={80}
          />
          <View style={{marginLeft:10}}>
          <Title style={styles.title}>{customer.customerInfo.firstname} {customer.customerInfo.lastname}</Title>
          <Text style={styles.caption}>{customer.customerInfo.addresses[0].company}</Text>
          <Text style={styles.caption}>{customer.customerInfo.email}</Text>
          </View>
          <View style={{position: 'absolute', height: '100%', right:0, justifyContent: 'center', alignItems: 'center' }}> 
          <Image
          source={ require('../../app/images/forward_small.png')}
          ></Image>
          </View>
          </View>   
         <Divider style={{marginTop:20}}/>
        </View>
        </TouchableHighlight>
        <Drawer.Section style={styles.drawerSection } >
           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}
           >
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Home</Text>
             </View>
           </TouchableHighlight>  
           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}} underlayColor={colors.grey}
             
             >
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Dashboard</Text>
             </View>
           </TouchableHighlight> 
           <View style={isExpended ? {backgroundColor:colors.white, borderRadius:15, marginLeft:10, marginRight:10}: {}} >
           <TouchableOpacity  style={{borderRadius:5, marginLeft:15, marginRight:5}} underlayColor={colors.grey} activeOpacity={.9}
             onPress= {setShopByCategory}
             >
            <View style={styles.button}> 
            <View style={{position: 'absolute', height: '100%', right:10, justifyContent: 'center', alignItems: 'center' }}> 
             <Image source={isExpended? require('../../app/images/top_small.png'): require('../../app/images/bottom_small.png') }>
            </Image>
            </View>
             <Text style={{color:colors.darkBlue, fontSize:14}}>Shop by Category</Text>
             </View>
           </TouchableOpacity> 
           <Collapsible collapsed={!isExpended}>
           <View style={isExpended ? {}: {height:0}}>
             <TouchableOpacity style={{borderRadius:5, marginLeft:15, marginRight:5}}>
             <View style={styles.shopCategory}> 
             <Text style={{color:colors.darkGrey, fontSize:14}}>Dosage Form</Text>
             <View style={{position: 'absolute', height: '100%', right:10, justifyContent: 'center', alignItems: 'center' }}> 
             <Image
               source={isExpended? require('../../app/images/forward_grey_small.png'): require('../../app/images/forward_small.png') }
              ></Image>
            </View>
             </View>
             </TouchableOpacity>
             <TouchableOpacity  style={{borderRadius:5, marginLeft:15, marginRight:5}}>
             <View style={styles.shopCategory}> 
             <Text style={{color:colors.darkGrey, fontSize:14}}>Therapeutic Class</Text>
             <View style={{position: 'absolute', height: '100%', right:10, justifyContent: 'center', alignItems: 'center' }}> 
             <Image
               source={isExpended? require('../../app/images/forward_grey_small.png'): require('../../app/images/forward_small.png') }
              ></Image>
            </View>
             </View>
             </TouchableOpacity>
            
            </View>
           </Collapsible>
          </View>

           
           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Brands</Text>
             </View>
           </TouchableHighlight>
           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>New Products</Text>
             </View>
           </TouchableHighlight>
        </Drawer.Section>
        <Drawer.Section >
          <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>My Orders</Text>
             </View>
           </TouchableHighlight>

           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>My Cart</Text>
             </View>
           </TouchableHighlight>



<TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>My Favourites</Text>
             </View>
           </TouchableHighlight>


<TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>My Order Book</Text>
             </View>
           </TouchableHighlight>

    
<TouchableHighlight onPress={()=>navigation.navigate('ShippingAddresses')}  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Shipping Address</Text>
             </View>
           </TouchableHighlight>

           <TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Manage Users & Roles</Text>
             </View>
           </TouchableHighlight>


<TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Invoice History</Text>
             </View>
           </TouchableHighlight>

    
        </Drawer.Section>

        <Drawer.Section >
    
<TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>News & Media</Text>
             </View>
           </TouchableHighlight>

<TouchableHighlight  style={{borderRadius:5, marginLeft:15, marginRight:5}}  underlayColor={colors.grey}>
            <View style={styles.button}> 
             <Text style={{color:colors.darkBlue, fontSize:14}}>Notification</Text>
             </View>
           </TouchableHighlight>

           </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,    
  },
  drawerHeader: {
    flex: 1,  
    flexDirection: 'row',
  },
  button: { 
    marginLeft:10,
    height:35,  
    justifyContent: 'center',
 
  },
  shopCategory:{
    marginLeft:30,
    height:35,  
    justifyContent: 'center',

  },
  viewHeader:{
    padding:10,
  },
  userInfoSection: {
    flexDirection: 'row', 
  },
  title: {
    fontWeight: 'bold',    
    fontFamily: 'DRLCircular-Bold',
  },
  caption: {
    fontSize: 14,
    fontFamily: 'DRLCircular-Light',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
   margin:0,
   padding:0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent
