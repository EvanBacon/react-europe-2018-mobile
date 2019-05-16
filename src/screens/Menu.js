import {Ionicons} from '@expo/vector-icons';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CachedImage from '../components/CachedImage';
import {Colors, Layout} from '../constants';

const ListHeaderComponent = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: 240 + Layout.notchHeight,
      minHeight: 240 + Layout.notchHeight,
    }}>
    <CachedImage
      source={require('../assets/hero.png')}
      style={[
        StyleSheet.absoluteFill,
        {
          overflow: 'hidden',
          resizeMode: 'cover',
          position: 'absolute',
        },
      ]}
    />
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
      ]}
    />
    <Image
      source={require('../assets/logo.png')}
      style={[
        {
          width: 220,
          height: 100,
          resizeMode: 'contain',
        },
      ]}
    />
  </View>
);

class MenuScreen extends Component {
  static navigationOptions = {
    title: 'Menu',
  };

  getIconName = key => {
    if (key === 'Speakers') return 'ios-microphone';
    if (key === 'Crew') return 'ios-information-circle';
    if (key === 'Sponsors') return 'ios-beer';
    if (key === 'Attendees') return 'ios-people';
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" />
        <FlatList
          style={{flex: 1}}
          data={[
            {key: 'Speakers'},
            {key: 'Crew'},
            {key: 'Sponsors'},
            {key: 'Attendees'},
          ]}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: '#cdcdcd',
              }}
            />
          )}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(item.key)}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name={`${this.getIconName(item.key)}`}
                  size={24}
                  color={Colors.blue}
                />
                <Text style={{fontSize: 20, marginHorizontal: 16, flex: 1}}>
                  {item.key}
                </Text>
                <Ionicons name="ios-arrow-forward" size={24} color="#999" />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

MenuScreen.path = '';

export default MenuScreen;
