import axios from 'axios';

export const axiosInstance = axios.create({});

export const requestConnector = (method, url, headers, params, bodyData) => {
  console.log('Inside Axios.............',method, url ,headers,params,bodyData);
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    params: params ? params : null,
    headers: headers ? headers : null,
  });
};
