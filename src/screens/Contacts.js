import React from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {withNavigation} from 'react-navigation';

import MyContacts from '../components/MyContacts';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes} from '../constants';
import {RectButton} from '../components/PlatformComponents';

class Contacts extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <DeferredContactsContent />
        </ScrollView>
      </View>
    );
  }
}

@withNavigation
class DeferredContactsContent extends React.Component {
  state = {
    ready: Platform.OS === 'android' ? false : true,
    tickets: [],
    contacts: [],
  };

  async getTickets() {
    try {
      let value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
      if (value === null) {
        value = '[]';
      }
      this.setState({contacts: JSON.parse(value)});
    } catch (err) {
      console.log(err);
      this.setState({contacts: []});
    }
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');

      console.log('GETTING tickets', value);
      this.setState({tickets: JSON.parse(value)});
      this.tickets = JSON.parse(value);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.tickets = [];
  }

  componentDidMount() {
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this.getTickets.bind(this)
    );
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ready: true});
    }, 200);
  }
  componentWillUnmount() {
    this._sub.remove();
  }
  render() {
    if (!this.state.ready) {
      return null;
    }
    console.log('state', this.state);
    const tix = this.state.tickets || [];
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <MyContacts
          contacts={this.state.contacts}
          tickets={this.state.tickets}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                {"Scan a contact's QR code"}
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressProfileQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                You need to scan your ticket first
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        )}
      </AnimatableView>
    );
  }

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRContactScanner',
      key: 'QRContactScanner',
    });
  };

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRScanner',
      key: 'QRScanner',
    });
  };
}

const ClipBorderRadius = ({children, style}) => {
  return (
    <View style={[{borderRadius: BORDER_RADIUS, overflow: 'hidden'}, style]}>
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 17 * 1.5,
  },
  headerSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 7,
    lineHeight: 7 * 1.5,
  },
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center',
  },
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue,
  },
});

export default Contacts;
