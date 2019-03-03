/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTPushNotificationManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"BringYourUmbrella"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [self scheduleNotification];
  return YES;
}

- (NSMutableArray *) getWeatherDataFrom:(NSString *)url{
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  [request setHTTPMethod:@"GET"];
  [request setURL:[NSURL URLWithString:url]];
  
  NSError *error = nil;
  NSHTTPURLResponse *responseCode = nil;
  
  NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];
  
  if([responseCode statusCode] != 200){
    NSLog(@"Error getting %@, HTTP status code %i", url, [responseCode statusCode]);
    return nil;
  }
  
  NSMutableArray *arrResult = [NSMutableArray array];
  for (NSDictionary *dict in oResponseData) {
    [arrResult addObject:dict];
  }
  
  return arrResult;
}

- (void)scheduleNotification
{
   NSString *latVal = [[NSUserDefaults standardUserDefaults] objectForKey: @"latitude"];
   NSString *lngVal = [[NSUserDefaults standardUserDefaults] objectForKey: @"longitude"];
   NSString *urlString = [[NSString alloc] initWithFormat:@"https://api.darksky.net/forecast/3a80ec57abc9400a446bdf8a2fafccd7/%@/%@", latVal, lngVal];
   NSMutableArray *response = [self getWeatherDataFrom: urlString];
  
   int temperature = [[response objectAtIndex:0] objectForKey:@"temperature"];
   int precipitation = (int)[[response objectAtIndex:0] objectForKey:@"humidity"] * 100;
  
   NSString *message = [[NSString alloc] init];
  
   if (precipitation < 50) {
     if(temperature < 55)
     {
       message = @"It is chilling out there. Make sure you carry your coat!";
     }
     else if( temperature >= 55 && temperature <= 77)
     {
       message = @"It is going to be a pleasant day, make sure you take your sunglasses!";
     }
     else if(temperature >= 77)
     {
       message = @"It a hot day outside, make sure you carry your sunscreen!";
     }
   } else if(precipitation > 50 && precipitation < 70)
   {
     if(temperature < 55)
     {
       message = @"It is chilling out there with showers. Make sure you carry your coat and umbrella!";
     }
     else if( temperature >= 55 && temperature <= 77)
     {
       message = @"It is going to be a pleasant day, make sure you take your sunglasses with umbrella!";
     }
     else if(temperature >= 77)
     {
       message = @"It a hot day outside, make sure you carry your sunscreen and an umbrella!";
     }
   } else if(precipitation > 70)
   {
     if(temperature < 55)
     {
       message = @"It is chilling out there with rain prediction. Make sure you carry your umbrella and coat!";
     }
     else if( temperature >= 55 && temperature <= 77)
     {
       message = @"Rain predicted! Don't forget to take your umbrella!";
     }
     else if(temperature >= 77)
     {
       message = @"It a hot day outside with rain predictions, make sure you carry your umbrella!";
     }
   }
  
//    UIAlertView *alertView = [[UIAlertView alloc]initWithTitle:
//                            @"Weather Today" message:[NSString stringWithFormat:@"%i", precipitation] delegate:self
//                                           cancelButtonTitle:@"Cancel" otherButtonTitles:@"Ok", nil];
//   [alertView show];
  
  [[UIApplication sharedApplication] cancelAllLocalNotifications];
  
  UILocalNotification *notif = [[UILocalNotification alloc] init];
  
  notif.alertTitle = @"Weather Today";
  notif.alertBody = message;
  notif.soundName = UILocalNotificationDefaultSoundName;
  
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDateComponents *components = [[NSDateComponents alloc] init];
  
  components = [[NSCalendar currentCalendar] components:NSDayCalendarUnit | NSMonthCalendarUnit | NSYearCalendarUnit fromDate:[NSDate date]];
  
  NSInteger day = [components day];
  NSInteger month = [components month];
  NSInteger year = [components year];
  
  [components setDay: day];
  [components setMonth: month];
  [components setYear: year];
  [components setHour: 12];
  [components setMinute: 58];
  [components setSecond: 0];
  [calendar setTimeZone: [NSTimeZone systemTimeZone]];
  NSDate *dateToFire = [calendar dateFromComponents:components];
  
  notif.fireDate = dateToFire;
  notif.timeZone = [NSTimeZone systemTimeZone];
  notif.repeatInterval = NSDayCalendarUnit;
  
  [[UIApplication sharedApplication] scheduleLocalNotification:notif];
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end

