#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <TrustKit/TrustKit.h>

#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <Firebase.h>
@import Firebase;
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

#import <UIKit/UIKit.h>



#import <Foundation/Foundation.h>


#define SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)


static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate




- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  
 
  
  
  
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"DrReddysDirect"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Define UNUserNotificationCenter
  
  ///////////

  
  ///////////
  
//  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//   center.delegate = self;
  
//  [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
//          if( !error ) {
//              // required to get the app to do anything at all about push notifications
//              dispatch_async(dispatch_get_main_queue(), ^{
//                  [[UIApplication sharedApplication] registerForRemoteNotifications];
//              });
//              NSLog( @"Push registration success." );
//          } else {
//              NSLog( @"Push registration FAILED" );
//              NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
//              NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
//          }
//          }];
  
  
  if (launchOptions) { //launchOptions is not nil
         NSDictionary *userInfo = [launchOptions valueForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
         NSDictionary *apsInfo = [userInfo objectForKey:@"aps"];

         if (apsInfo) { //apsInfo is not nil
           
           
           
//           UIWindow* topWindow = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//           topWindow.rootViewController = [UIViewController new];
//           topWindow.windowLevel = UIWindowLevelAlert + 1;
//
////           [RNCPushNotificationIOS didReceiveNotificationResponse: [apsInfo valueForKey:@"alert"]];
//           UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Alert" message:[apsInfo valueForKey:@"alert"] preferredStyle:UIAlertControllerStyleAlert];
//
//           UIAlertAction *ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//                                   //button click event
//                               }];
//           UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:nil];
//           [alert addAction:cancel];
//           [alert addAction:ok];
//           [topWindow makeKeyAndVisible];
//           [topWindow.rootViewController presentViewController:alert animated:YES completion:nil];
         }
     }
  
//  if(SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(@"10.0")){
//      UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//      center.delegate = self;
//      [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
//           if( !error ){
//               [[UIApplication sharedApplication] registerForRemoteNotifications];
//
//           }
//       }];
//  }else{
//      UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//       center.delegate = self;
//  }
  
  
  
  
  
  
  ///
  // Initialize TrustKit
   NSDictionary *trustKitConfig =
     @{
     // Auto-swizzle NSURLSession delegates to add pinning validation
     kTSKSwizzleNetworkDelegates: @YES,

     kTSKPinnedDomains: @{

        // Pin invalid SPKI hashes to *.yahoo.com to demonstrate pinning failures
        @"mcstaging.drreddysdirect.com" : @{
            kTSKEnforcePinning:@YES,
            kTSKIncludeSubdomains:@YES,
            kTSKPublicKeyAlgorithms : @[kTSKAlgorithmRsa2048],

            // Wrong SPKI hashes to demonstrate pinning failure
            kTSKPublicKeyHashes : @[
               @"atD1rDM/bOFKKqPYEficCpEQMKa8ccOom9H0wlpUM9s=",
               @"zUIraRNo+4JoAYA7ROeWjARtIoN4rIEbCpfCRQT6N6A=",
               ],

           // Send reports for pinning failures
           // Email info@datatheorem.com if you need a free dashboard to see your App's reports
           kTSKReportUris: @[@""]
           },

      }
   };

   [TrustKit initSharedInstanceWithConfiguration :trustKitConfig];
  
  
  //
  
  [FIRApp configure];
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
   center.delegate = self;
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
    
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{

  
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
  :(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  
  [RNCPushNotificationIOS didReceiveNotificationResponse: response];
  completionHandler();
  NSLog(@"Userinfo %@",response.notification.request.content.userInfo);
}
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//didReceiveNotificationResponse:(UNNotificationResponse *)response
//         withCompletionHandler:(void (^)(void))completionHandler
//{
//  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
//}



//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
    NSLog(@"Userinfo %@",notification.request.content.userInfo);

      completionHandler(UNNotificationPresentationOptionAlert);
  
}

-(NSString *)stringFromDeviceToken:(NSData *)deviceToken {
  NSUInteger length = deviceToken.length;
  if (length == 0) {
      return nil;
  }
  const unsigned char *buffer = deviceToken.bytes;
  NSMutableString *hexString  = [NSMutableString stringWithCapacity:(length * 2)];
  for (int i = 0; i < length; ++i) {
      [hexString appendFormat:@"%02x", buffer[i]];
  }
  
  return [hexString copy];
}

//Push Notification
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNCPushNotificationIOS didReceiveLocalNotification: notification];
}
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//didReceiveNotificationResponse:(UNNotificationResponse *)response
//         withCompletionHandler:(void (^)(void))completionHandler
//{
//  [RNCPushNotificationIOS didReceiveLocalNotification: response.notification];
//}

//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
//                                                    fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{


- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {

}


@end


