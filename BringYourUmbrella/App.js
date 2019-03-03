/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { WeatherWidget, temperature, precipitation, humidity } from 'react-native-weather';
import LocationItem from './components/LocationItem'
import DefaultPreference from 'react-native-default-preference';

type Props = {};
export default class App extends Component<Props> {

  state = {
    latitude: null,
    longitude: null
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ latitude: JSON.stringify(position.coords.latitude)});
        this.setState({ longitude: JSON.stringify(position.coords.longitude)});
      },
      error => Alert.alert("Please enable location services"),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }


  render() {
    return (
      <View style={styles.locationPrompt}>
        <WeatherWidget
          api = {"3a80ec57abc9400a446bdf8a2fafccd7"}
          lat = {DefaultPreference.get('latitude')}
          lng = {DefaultPreference.get('longitude')}
          // lat = {35.7813}
          // lng = {-78.641678}
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
