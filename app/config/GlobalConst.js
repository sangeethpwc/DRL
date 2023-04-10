import { Dimensions } from "react-native";

var deviceWidth = Dimensions.get("window").width;
module.exports = {
  DeviceWidth: deviceWidth,
  deviceId: "",
  tokenUploadSuccess: false,
  ApiAccessToken: "",
  LoginToken: "",
  TokenURL: "",
  // AdminToken: "",
  LoggedInStatus: false,
  errorStatus: 200,
  cartId: "",
  customerId: "",
  region: [],
  AppVersion: "7.2",
  customerStatus: "",
  customerGroup: "",
  creds: {},
  statusLabels: [],
  featuredValue: "",

  today: "",
  notifDataNoUserInteraction: "",
  AppToken: "",
  TabPressed: false,
  accepted: false,
  appVerisonMismatch: false,
  storedVersions: {},
  tcVersionMismatch: false,

  analyticsEnabled: false,
};
