import {clearUser} from '../../slices/authenticationSlice';
import GlobalConst from '../../config/GlobalConst';
import utils from '../../utilities/utils';
import {
  setServiceRequestsActive,
  setServiceRequestsHistory,
} from '../../slices/profileSlices';
import {fetchingDataDone} from '../../slices/productSlices';
import {setRecentOrdersSuccess, clearOrders} from '../../slices/homesSlices';
import {clearToken} from '../../services/operations/getToken';

export function resetAllInfo() {
  return async dispatch => {
    try {
      GlobalConst.customerStatus = '';
      GlobalConst.tokenUploadSuccess = false;

      utils._clearCartId();
      dispatch(setServiceRequestsActive([]));
      dispatch(setServiceRequestsHistory([]));
      dispatch(setRecentOrdersSuccess([]));
      dispatch(clearUser());
      dispatch(fetchingDataDone());
      dispatch(clearOrders());
      //  dispatch(clearQuestionnaire());
      const header = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '' + GlobalConst.LoginToken + '',
      };
      dispatch(clearToken(header));
      GlobalConst.LoginToken = '';
    } catch (err) {}
  };
}
