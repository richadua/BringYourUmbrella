/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const lastAddr = {description: 'Last Address', geometry: { location: { lat: JSON.stringify(latitude), lng: JSON.stringify(longitude) } }};

var latitude;
var longitude;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.locationPrompt}>
        <Text style={styles.welcome}>Set your home location here:</Text>
        <GooglePlacesAutocomplete
        placeholder='Type the address'
        minLength={2}
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = null) => {
          latitude = details.geometry.location.lat
          longitude = details.geometry.location.lng
          Alert.alert(JSON.stringify(latitude))
        }}
        getDefaultValue={() => {
          return '';
        }}
        query={{
          key: 'AIzaSyATU8DzZYhal2hVPBUES5MvdF0HdbcdeM4',
          language: 'en'
        }}
        style={[styles.description, styles.textInputContainer, styles.textInput, styles.container]}
        currentLocation={true}
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch'
        GooglePlacesSearchQuery={{
          rankby: 'distance'
        }}
        
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        predefinedPlaces={[homePlace, lastAddr]}
        predefinedPlacesAlwaysVisible={true}
      />
      </View>
      );
  }
}

const styles = StyleSheet.create({
  locationPrompt: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 150,
    marginBottom: 10
  },
  description: {
    fontWeight: 'bold',
  },
  // predefinedPlacesDescription: {
  //   color: '#1faadb',
  // },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth:0
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16
  },
});
