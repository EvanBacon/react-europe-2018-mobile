import React from 'react';
import {Animated, AsyncStorage, Platform, View} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {Button, Card, Title} from 'react-native-paper';
import {withNavigation} from 'react-navigation';

import AnimatedScrollView from '../components/AnimatedScrollView';
import {Markdown} from '../components/PlatformComponents';
import {Colors, Layout} from '../constants';
import NavigationService from '../NavigationService';

class TicketInstructions extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const {scrollY} = this.state;

    return (
      <View style={{flex: 1}}>
        <AnimatedScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 20 + Layout.notchHeight / 2}}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: scrollY}},
              },
            ],
            {useNativeDriver: true}
          )}>
          <View
            style={{
              backgroundColor: Colors.blue,
              padding: 10,
              paddingTop: Layout.headerHeight - 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />

          <DeferredTicketInstructionsContent />
          <OverscrollView />
        </AnimatedScrollView>
      </View>
    );
  }
}

@withNavigation
class DeferredTicketInstructionsContent extends React.Component {
  state = {
    tickets: [],
    ready: Platform.OS === 'android' ? false : true,
  };
  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      this.setState({tickets: JSON.parse(value)});
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.getTickets();
  }

  componentDidMount() {
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ready: true});
    }, 200);
  }

  render() {
    const params = this.props.navigation.state.params || {};
    const ticket = params.ticket;
    console.log('params', params);
    if (!this.state.ready) {
      return null;
    }

    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Card>
          <Card.Content>
            <Title>{ticket.firstName + ' ' + ticket.lastName} </Title>
            <Title>Ticket Ref: {ticket.ref} </Title>
            <Markdown>{ticket.mobileMessage}</Markdown>
          </Card.Content>
        </Card>
        <Button
          raised
          onPress={() => {
            NavigationService.goBack();
          }}>
          Close
        </Button>
      </AnimatableView>
    );
  }
}

const OverscrollView = () => (
  <View
    style={{
      position: 'absolute',
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue,
    }}
  />
);

export default TicketInstructions;
