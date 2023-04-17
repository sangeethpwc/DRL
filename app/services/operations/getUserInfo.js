import {
  fetchingData,
  userDetailsSuccess,
  userDetailsFailure,
} from '../../slices/authenticationSlice';
import {requestConnector} from '../../services/restApiConnector';
import {EMPLOYEE_DETAILS} from '../../services/ApiServicePath';

export function getUserInfo(contactNumber) {
  return async dispatch => {
    try {
      dispatch(fetchingData());
      const response = await requestConnector(
        'POST',
        EMPLOYEE_DETAILS,
        null,
        null,
        {
          mob_num: contactNumber,
        },
      );

      dispatch(userDetailsSuccess(response.data));
    } catch (err) {
      dispatch(userDetailsFailure(err.toString()));
    }
  };
}
