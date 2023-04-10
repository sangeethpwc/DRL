import React, { Component } from 'react';
import { Alert, AppState, BackHandler, View, StatusBar,} from 'react-native';
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureOverlayStyle,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription,
} from 'scandit-react-native-datacapture-barcode';
import {
  Brush,
  Color,
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

import { getProductsSearch_Scan } from '../services/operations/productApis';

import { useFocusEffect } from '@react-navigation/native';

import { requestCameraPermissionsIfNeeded } from './camera-permission-handler'
import { connect } from 'react-redux';

import colors from './Colors';
import CustomeHeader from './CustomeHeader';
import { constant } from 'lodash';
import { Toast } from 'native-base';

import { withNavigationFocus } from "react-navigation";

 class ScanTest extends Component  {

  constructor() {
    super();
    // Create data capture context using your license key.
    this.dataCaptureContext = DataCaptureContext.forLicenseKey('AX8CgwfeJft6PwqJ60X5nKMl408uOh5DnkUzLANl/DQWZBWpP0hmvQ10/J41GCAGxGlRBnZJ2AfgF744WFH1cAJ3hFfgarfqQTb56T1AO9DEWQnr+FT5tfsj8r8sNcxcuDR4/XxqrrkWBFadkVs7BBteLoclcAxs9lRzrlF6WGQeeNcnKS+dwZV3X1n3U1Td5kB0E/AhNBtGaVPy5VEPH75PTrrzZ2QdtyWPSUZqMiFRSz6EZ24dJCdsL0ATQ/W3mUfdmeV8LZUzcGyALQ+YRR0nVNSpYrY7umvlZGUQTwWud5LUXF2V/3hJ0UdKATR+E3yC3qghhzfVQb/4zFEHbZpZcQLzZPEhGW8j0Dsu35arZx67K3SGDRlmZJCLbHPJDGfAQ3gJ0M0faRBnDhF51Gxs8pKQdxtTNXhsTck6dHwIR7GDAlxbOnwArL2aJCIYKmlH+QIuL6u3fuIQYHO7EyN6FuDWY520DRGhwbwEyFWnf4ZziV8JQdNBYD4eZdyhBHVM4j9OBZdNWAmVvArquakT1/0NSsjm5itSGXYMwsenSgz/dYCnFjwQAV/6aQJTOoQUH0raImNKD6msS8fTdsaG/VwlE1MNk4+pOORwI8UqWP8onGDS/zWm6gZ0AkFe2kZ57SAIlQc8rTlCN2tgalZPMNSw9yD0bShvwL5MZx99W7lp9XRUvdTWNsUUHC8+55XReAR+Fsy8Da6bOq/VCQdqYdXVDbnE8Qy63BJ1rOwG1amqFAjnSFviJYNE2GfAQPMm2ZgJLcIVg8cRJhP6STWwCMVgU0pTbY/R/njI/zOwJlt1e98R68vAqh+22N9ymR2Md5EUUQDLPY3XmnExX8arcPU0GAiUjNxGzT/XB4kGAFkc/CIH0R8kfT1DPFx51Vf9e1D9xKyhTkw54VLBTmGT8ifBH180roKVINCgT9NO86njKwQIEAL8JR+yMG4IRuuPB7baS950xRxiSnm6EfH4lUmFwqfpQoaqMjKGdguSSU57vgi81SZeJOyi38J1oG1I8TJ9uidKugdMTaVfSadDW9t3/lxjtvzBpMGJJ1DcX6xy38CZ+piNZDhN5C77prWB0TVXVpHjFtGwAD4iukGvorgjKPqTnrP6eSZxygEwMhM2d9raQFM8xf+TScvixgfUUfsAQ915UEK2fJF63KqPivR0SeK0aN2s9RB48yxLfBHb8X/HhnfCrBT9b6arDiUXvP5UKvlX0schuw==');
    this.viewRef = React.createRef();

    console.log('trest');
    
  }

  backAction = () => {
    this.props.navigation.navigate('ScanTest');
    if(!this.barcodeCaptureMode.isEnabled){
      this.barcodeCaptureMode.isEnabled = true;
    }


    
    return true;
  };

  componentDidMount() {
    console.log('Resumed...');
    AppState.addEventListener('change', this.handleAppStateChange);
    this.setupScanning();
    this.startCapture();

    this.props.navigation.addListener('focus', 

    this.backAction
    
    );

    BackHandler.addEventListener("hardwareBackPress", this.backAction);
    
  }

  componentDidUpdate(prevProps) {

    console.log('Resumed...');

    if (prevProps.isFocused !== this.props.isFocused) {
      // Use the `this.props.isFocused` boolean
      // Call any action
      console.log('Resumed...');
    }
  }

  componentWillUnmount() {
    console.log('Paused...');
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.dataCaptureContext.dispose();

    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    // this.props.navigation.removeEventListener('focus',this.backAction);

  }

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.stopCapture();
    } else {
      this.startCapture();
    }
  }

  handleAPICall(barcodedata){

    console.log('barcodedata_length...' + barcodedata.length);

    const str = barcodedata;

    var withoutFirstAndLast = "";

    if(barcodedata.length === 13){
      console.log('barcode...13');
      withoutFirstAndLast = str.substring(2, str.length - 1);
    }else if(barcodedata.length === 16){
      console.log('barcode...16');
     withoutFirstAndLast = str.substring(5, str.length - 1);
    }
  
    console.log('withoutFirstAndLast........ '+ withoutFirstAndLast);

    this.props.signIn(withoutFirstAndLast);
    
  }

  startCapture() {
    this.startCamera(); 
    this.barcodeCaptureMode.isEnabled = true;
  }

  stopCapture() {
    this.barcodeCaptureMode.isEnabled = false;
    this.stopCamera();
  }

  stopCamera() {
    if (this.camera) {
      this.camera.switchToDesiredState(FrameSourceState.Off);
    }
  }

  startCamera() {
    if (!this.camera) {
      // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
      // default and must be turned on to start streaming frames to the data capture context for recognition.
      this.camera = Camera.default;
      this.dataCaptureContext.setFrameSource(this.camera);

      const cameraSettings = new CameraSettings();
      cameraSettings.preferredResolution = VideoResolution.Au;
      this.camera.applySettings(cameraSettings);
    }

    // Switch camera on to start streaming frames and enable the barcode capture mode.
    // The camera is started asynchronously and will take some time to completely turn on.
    requestCameraPermissionsIfNeeded()
      .then(() => this.camera.switchToDesiredState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp());
  }

  setupScanning() {

    console.log('Scanning Started...')
    // The barcode capturing process is configured through barcode capture settings
    // and are then applied to the barcode capture instance that manages barcode recognition.
    const settings = new BarcodeCaptureSettings();

    // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
    // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
    // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
    settings.enableSymbologies([
      Symbology.EAN13UPCA,
      Symbology.EAN8,
      Symbology.UPCE,
      Symbology.QR,
      Symbology.DataMatrix,
      Symbology.Code39,
      Symbology.Code128,
      Symbology.InterleavedTwoOfFive,
      Symbology.GS1DatabarExpanded,
      Symbology.GS1Databar,
      Symbology.GS1DatabarLimited
    ]);

    // Some linear/1d barcode symbologies allow you to encode variable-length data. By default, the Scandit
    // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
    // of these symbologies, and the length is falling outside the default range, you may need to adjust the "active
    // symbol counts" for this symbology. This is shown in the following few lines of code for one of the
    // variable-length symbologies.
    const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
    symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    // Create new barcode capture mode with the settings from above.
    this.barcodeCaptureMode = BarcodeCapture.forContext(this.dataCaptureContext, settings);

    // Register a listener to get informed whenever a new barcode got recognized.
    this.barcodeCaptureListener = {
      didScan: (_, session) => {
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SymbologyDescription(barcode.symbology);
        // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be processed
        // until the alert dialog is dismissed, we're showing the alert through a timeout and disabling the barcode
        // capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener callbacks for
        // longer periods of time. See the documentation to learn more about this.
        this.barcodeCaptureMode.isEnabled = false;

        const str = barcode.data;

        var withoutFirstAndLast = "";

        var withoutFirstAndLast_1 = "";
        var withoutFirstAndLast_2 = "";
        var withoutFirstAndLast_3 = "";
        
        var finalValue = "";

        if(barcode.data.length === 13){
          console.log('barcode...13');
          withoutFirstAndLast = str.substring(2, str.length - 1);

          console.log('barcode...13 -- ' + withoutFirstAndLast);

          withoutFirstAndLast_1 = withoutFirstAndLast.substring(0, withoutFirstAndLast.length -5);

          console.log('barcode...13_1' + withoutFirstAndLast_1);

          withoutFirstAndLast_2 = withoutFirstAndLast.substring(5, withoutFirstAndLast.length -2);

          withoutFirstAndLast_3 = withoutFirstAndLast.substring(8, withoutFirstAndLast.length -0);

          finalValue = withoutFirstAndLast_1 + '-' + withoutFirstAndLast_2 + '-' + withoutFirstAndLast_3;

        }else if(barcode.data.length === 16){
          console.log('barcode...16');
         withoutFirstAndLast = str.substring(5, str.length - 1);

          withoutFirstAndLast_1 = withoutFirstAndLast.substring(0, withoutFirstAndLast.length -5);

          withoutFirstAndLast_2 = withoutFirstAndLast.substring(5, withoutFirstAndLast.length -2);

          withoutFirstAndLast_3 = withoutFirstAndLast.substring(8, withoutFirstAndLast.length -0);

          finalValue = withoutFirstAndLast_1 + '-' + withoutFirstAndLast_2 + '-' + withoutFirstAndLast_3;

        }

        Alert.alert(
          null,
          `Do you want to add this NDC ${finalValue} to cart?`,

          // (${symbology.readableName})

          [{
            text: "Cancel",
            onPress: () =>{
              console.log("Cancel Pressed");
              this.barcodeCaptureMode.isEnabled = true;
            }
            
          },{ text: 'Add to cart', onPress: () => { 
            // this.barcodeCaptureMode.isEnabled = false;
            this.handleAPICall(barcode.data);
           
        this.props.navigation.navigate('MyCart');
            // this.props.navigation.goBack();
            this.barcodeCaptureMode.isEnabled = false;
           } },],
          { cancelable: false }
        );
      }
    };

    this.barcodeCaptureMode.addListener(this.barcodeCaptureListener);

    // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
    // the video preview, using the Frame overlay style. This is optional, but recommended for better visual feedback.
    this.overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        this.barcodeCaptureMode,
        this.viewRef.current,
        BarcodeCaptureOverlayStyle.Frame
    );
    this.overlay.viewfinder = new RectangularViewfinder(
        RectangularViewfinderStyle.Square,
        RectangularViewfinderLineStyle.Light,
    );

    this.overlay = this.overlay;
  }

  render() {

    return (

      <View style={{ height: '100%', backgroundColor: colors.white }}>

      <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />

      <CustomeHeader
        back={'back'}
        title={'Quick Order'}
        isHome={undefined}
        addToCart={'addToCart'}
        addToWishList={'addToWishList'}
        addToLocation={'addToLocation'}
      />

      <View style={{ flex: 1 }}>

      <DataCaptureView style={{ flex: 1 }} context={this.dataCaptureContext} ref={this.viewRef} />

      </View>

    </View>

    );
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      signIn: (barcodedata) =>  dispatch(getProductsSearch_Scan(barcodedata))
  }
};

// export default ScanTest;
export default connect(null, mapDispatchToProps)(ScanTest)

