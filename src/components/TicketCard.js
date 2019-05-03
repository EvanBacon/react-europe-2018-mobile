import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Button, Card} from 'react-native-paper';
import QRCode from 'react-native-qrcode';
import {withNavigation} from 'react-navigation';

import {Colors, FontSizes} from '../constants';
import {RegularText} from './StyledText';

@withNavigation
export default class TicketCard extends React.Component {
  render() {
    const {ticket} = this.props;

    return (
      <Card key={ticket.id}>
        <Card.Content>
          <Card.Title>This ticket gives you access to:</Card.Title>
          {ticket.checkinLists.map(ch => (
            <Card.Title key={ch.id}>✓ {ch.name}</Card.Title>
          ))}
          <QRCode
            style={{flex: 1}}
            value={ticket.ref}
            size={300}
            bgColor="black"
            fgColor="white"
          />
          <Card.Actions>
            <Button onPress={this._handlePress}>Read useful info</Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    );
  }

  _handlePress = () => {
    this.props.navigation.navigate('TicketInstructions', {
      ticket: this.props.ticket,
    });
  };
  _renderPlaceholderForNextYear = () => {
    return (
      <View style={[styles.button, this.props.style]}>
        <RegularText style={styles.nextYear}>See you in 2019!</RegularText>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
  headerRowAvatarContainer: {
    paddingRight: 10,
  },
  headerRowInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  speakerName: {
    fontSize: FontSizes.bodyTitle,
  },
  organizationName: {
    color: Colors.faint,
    fontSize: FontSizes.bodyLarge,
  },
  ticketInfoRow: {
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  ticketTitle: {
    fontSize: FontSizes.bodyTitle,
  },
  ticketLocation: {
    fontSize: FontSizes.bodyLarge,
    color: Colors.faint,
    marginTop: 10,
  },
  nextYear: {
    textAlign: 'center',
    fontSize: FontSizes.title,
    marginVertical: 10,
  },
  button: {
    padding: 15,
    ...Platform.select({
      ios: {
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: {width: 2, height: 2},
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  },
});
