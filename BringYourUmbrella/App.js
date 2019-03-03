/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {PushNotificationIOS, StyleSheet, Text, View, Alert, TouchableOpacity, TextInput, ScrollView, Button, ActivityIndicator, AsyncStorage} from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { WeatherWidget, temperature, precipitation } from 'react-native-weather';
import LocationItem from './components/LocationItem'

// const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
// const lastAddr = {description: 'Last Address', geometry: { location: { lat: JSON.stringify(this.state.latitude), lng: JSON.stringify(this.state.longitude) } }};
type Props = {};
var message = "";
export default class App extends Component<Props> {

  state = {
    latitude: null,
    longitude: null
  }
  
  async getData() {
    AsyncStorage.getItem("latitude").then((value) => {
      this.setState({"latitude": value});
    })
    AsyncStorage.getItem("longitude").then((value) => {
      this.setState({"longitude": value});
    })
  }
  
  findCoordinates = () => {
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({ latitude: JSON.stringify(position.coords.latitude)});
    //     this.setState({ longitude: JSON.stringify(position.coords.longitude)});
    //   },
    //   error => Alert.alert("Please enable location services"),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
    if(temperature < 55)
    {
      message = "It is chilling out there. Make sure you carry your coat!";
    }
    else if( temperature >= 55 && temperature <= 77)
    {
      message = "It is going to be a pleasant day, make sure you take your sunglasses!";
    }
    else if(temperature >= 77)
    {
      message = "It a hot day outside, make sure you carry your sunscreen!";
    }
    if(precipitation > 50 && precipitation < 70)
    {
      message = "There might be showers today, make sure you carry an umbrella";
    }
    else if(precipitation > 70)
    {
      message = "Rain predicted! Don't forget to take your umbrella!"
    }
    this.getData();
    Alert.alert("Saved Lat: ", this.state.latitude)
    Alert.alert("Saved Lng: ", this.state.longitude)
  };

  sendNotification = () => {
    // this.getData();
    // PushNotificationIOS.requestPermissions();
    // let desiredNotificationDate = new Date(Date.now() + 60 * 1000);
    // // let desiredNotificationDate = new Date().getHours(21);
    // let fireDateVar = desiredNotificationDate.getTime()
    // PushNotificationIOS.scheduleLocalNotification({
    //   alertBody: message,
    //   fireDate: fireDateVar,
    //   repeatInterval: 'day'
    // });
  }
  
  render() {
    return (
      <View style={styles.locationPrompt}>
        <WeatherWidget
          api = {"3a80ec57abc9400a446bdf8a2fafccd7"}
          lat = {51.5074}
          lng = {0.1278}
          style = {styles.weatherWidget}
        />
        <TouchableOpacity
         style={styles.currentLoc}
         onPress={this.findCoordinates}>
         <Text> Use current location </Text>
       </TouchableOpacity>
       <Button onPress = {this.sendNotification} title = "Send Notification"/>
        <Text style={styles.homeLoc}>Edit your home location here</Text>
        <GoogleAutoComplete apiKey={"AIzaSyATU8DzZYhal2hVPBUES5MvdF0HdbcdeM4"} debounce={500} minLength={3}>
          {({
            handleTextChange,
            locationResults,
            fetchDetails,
            isSearching,
            inputValue,
            clearSearchs
          }) => (
            <React.Fragment>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Search a places"
                  onChangeText={handleTextChange}
                  value={inputValue}
                />
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSearchs}>
                  <Text> Clear </Text>
                </TouchableOpacity>
              </View>
              {isSearching && <ActivityIndicator size="large" color="red" />}
              <ScrollView style = {styles.ScrollView}>
                {locationResults.map(el => (
                  <LocationItem
                    {...el}
                    key={el.id}
                    fetchDetails={fetchDetails}
                  />
                ))}
              </ScrollView>
            </React.Fragment>
          )}
        </GoogleAutoComplete>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  locationPrompt: {
    flex: 1,
    marginTop:50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  homeLoc: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 10
  },
  textInput: {
    marginLeft: 20,
    marginRight: 0,
    height: 38,
    textAlign: 'left',
    width: 300,
    color: '#5d5d5d',
    fontSize: 16
  },
  currentLoc: {
    marginTop: 50,
    color: 'red',
    fontSize: 16,
    marginBottom: 50
  },
  weatherWidget: {
    // marginTop: 20
  },
  inputWrapper: {
    flexDirection: 'row',
    marginLeft: 0
  },
  clearButton: {
    marginRight: 10,
    marginLeft: 10,
    marginTop:10
  },
  ScrollView: {
    width: 400,
    textAlign: 'left',
    marginLeft: 70,
  }
});
