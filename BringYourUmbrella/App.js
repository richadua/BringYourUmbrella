/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableOpacity, TextInput, ScrollView, Button, ActivityIndicator} from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { WeatherWidget } from 'react-native-weather';
import LocationItem from './components/LocationItem'

// const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
// const lastAddr = {description: 'Last Address', geometry: { location: { lat: JSON.stringify(this.state.latitude), lng: JSON.stringify(this.state.longitude) } }};

type Props = {};
export default class App extends Component<Props> {
  
  state = {
    latitude: null,
    longitude: null
  };

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ latitude: JSON.stringify(position.coords.latitude)});
        this.setState({ longitude: JSON.stringify(position.coords.longitude)});
      },
      error => Alert.alert("Please enable location services"),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  
  save() {
	  var KeyValue = [['latitude', this.state.latitude], ['longtitude', this.state.longitude]]
	  AsyncStorage.multiSet(KeyValue, function(errs){
      if(errs){
        return;
      }
      alert('Lat&Lon store success');
    });
  }
  
  render() {
    return (
      <View style={styles.locationPrompt}>
        <WeatherWidget
          api = {"3a80ec57abc9400a446bdf8a2fafccd7"}
          lat = {37.8267}
          lng = {-122.4233}
          style = {styles.weatherWidget}
        />
        <TouchableOpacity
         style={styles.currentLoc}
         onPress={this.findCoordinates}>
         <Text> Use current location </Text>
       </TouchableOpacity>
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
    marginTop: 50
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
    marginLeft: 70
  }
});
