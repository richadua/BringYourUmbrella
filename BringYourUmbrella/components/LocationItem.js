import React, { PureComponent } from 'react';
import { View, Alert, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import DefaultPreference from 'react-native-default-preference';

class LocationItem extends PureComponent {
    state = {
        latitude: null,
        longitude: null
      }
      
    _handlePress = async () => {
        const res = await this.props.fetchDetails(this.props.place_id)
        this.setState({ latitude: JSON.stringify(res.geometry.location.lat)});
        this.setState({ longitude: JSON.stringify(res.geometry.location.lng)});
        this.save();
    }

    render() {
        return (
        <TouchableOpacity style={styles.root} onPress={this._handlePress}>
            <Text>{this.props.description}</Text>
        </TouchableOpacity>
        );
    }

    save() {
        DefaultPreference.set("latitude", JSON.stringify(this.state.latitude));
        DefaultPreference.set("longitude", JSON.stringify(this.state.longitude));
        
        // var KeyValue = [[‘latitude’, this.state.latitude], [‘longtitude’, this.state.longitude]]
        // DefaultPreference.setName(‘Umbrella’);
        // var KeyValue = [['latitude', JSON.stringify(this.state.latitude), ['longtitude', JSON.stringify(this.state.longitude)]]
        // AsyncStorage.multiSet(KeyValue, function(errs){
        //     if(errs){
        //     return;
        //     }
        //     alert('Lat&Lon store success');
        // });
    }
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center'
  }
})

export default LocationItem;