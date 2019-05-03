import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';

import {Colors, FontSizes} from '../constants';
import {
  conferenceHasEnded,
  convertUtcDateToEventTimezoneDaytime,
} from '../utils';
import {RegularText} from './StyledText';
import TicketCard from './TicketCard';

export default class Tickets extends React.Component {
  render() {
    let tix = this.props.tickets || [];
    return (
      <View style={[{marginHorizontal: 10}, this.props.style]}>
        <Title>My Tickets</Title>
        {tix.map(ticket =>
          ticket ? (
            <TicketCard
              key={ticket.ref}
              ticket={ticket}
              style={{marginTop: 10, marginBottom: 10}}
            />
          ) : null
        )}
      </View>
    );
  }

  _renderDateTime() {
    if (conferenceHasEnded()) {
      return null;
    }

    const {dateTime} = this.state;

    if (dateTime) {
      return (
        <RegularText style={styles.time}>
          {convertUtcDateToEventTimezoneDaytime(dateTime)}
        </RegularText>
      );
    } else {
      // handle after conf thing
    }
  }
}

const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
});
