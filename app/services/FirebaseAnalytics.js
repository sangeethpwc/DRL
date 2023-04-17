import analytics from '@react-native-firebase/analytics';

//............................Purchase complete...........................

export async function logPurchaseToAnalytics(
  value,
  orderNum,
  items,
  shippingAmt,
) {
  try {
    console.log('Inside logPurchaseToAnalytics..... ', value, orderNum);
    const itemsArr = [];
    items.map(item => {
      itemsArr.push({
        item_id: item.sku,
        item_name: item.name,
        price: item.base_price,
        quantity: item.qty_ordered,
      });
    });
    console.log('Items arr generated......', itemsArr);
    await analytics().logPurchase({
      value: value,
      currency: 'USD',
      transaction_id: orderNum,
      items: itemsArr,
      shipping: shippingAmt,
    });
  } catch (e) {
    console.log('logPurchaseToAnalytics error......', e);
  }
}

//...................................... Add to cart.............................

export async function logAddCartToAnalytics(value, item, qty) {
  try {
    console.log('Inside logAddCartToAnalytics..... ', value, item);
    const itemsArr = [];
    itemsArr.push({
      item_id: item.sku,
      item_name: item.name,
      price: item.price,
      quantity: qty,
    });

    console.log('Items arr generated......', itemsArr);
    await analytics().logAddToCart({
      value: value,
      currency: 'USD',
      items: itemsArr,
    });
  } catch (e) {
    console.log('logAddCartToAnalytics error......', e);
  }
}

//...........................Remove from cart.....................................

export async function logRemoveCartToAnalytics(value, item) {
  try {
    console.log('Inside logRemoveCartToAnalytics..... ', value, item);
    const itemsArr = [];
    itemsArr.push({
      item_id: item.sku,
      item_name: item.name,
      price: item.price,
      quantity: item.qty,
    });

    console.log('Items arr generated......', itemsArr);
    await analytics().logRemoveFromCart({
      value: value,
      currency: 'USD',
      items: itemsArr,
    });
  } catch (e) {
    console.log('logRemoveCartToAnalytics error......', e);
  }
}

//.............................................View Cart...............................

export async function logViewCartToAnalytics(value, items) {
  try {
    console.log('Inside logViewCartToAnalytics..... ', value, item);
    const itemsArr = [];
    items.map(item => {
      itemsArr.push({
        item_id: item.sku,
        item_name: item.name,
        price: item.base_price,
        quantity: item.qty,
      });
    });

    console.log('Items arr generated......', itemsArr);
    await analytics().logViewCart({
      value: value,
      currency: 'USD',
      items: itemsArr,
    });
  } catch (e) {
    console.log('logViewCartToAnalytics error......', e);
  }
}

//.................................... Add to wishlist.................................

export async function logAddWishlistToAnalytics(value, item) {
  try {
    console.log('Inside logAddWishlistToAnalytics..... ', value, item);
    const itemsArr = [];
    itemsArr.push({
      item_id: item.sku,
      item_name: item.name,
      price: item.base_price,
      quantity: item.qty,
    });

    console.log('Items arr generated......', itemsArr);
    await analytics().logAddToWishlist({
      value: value,
      currency: 'USD',
      items: itemsArr,
    });
  } catch (e) {
    console.log('logAddWishlistToAnalytics error......', e);
  }
}

//................................View an item..........................................

export async function logViewItemToAnalytics(value, item) {
  try {
    console.log('Inside logViewItemToAnalytics..... ', value, item);
    const itemsArr = [];

    itemsArr.push({
      item_id: item.sku,
      item_name: item.name,
      price: item.base_price,
      quantity: item.qty,
    });

    console.log('Items arr generated......', itemsArr);
    await analytics().logViewItem({
      value: value,
      currency: 'USD',
      items: itemsArr,
    });
  } catch (e) {
    console.log('logViewItemToAnalytics error......', e);
  }
}
