import {Ionicons} from '@expo/vector-icons';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import {createBrowserApp} from '@react-navigation/web';
// import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {Platform} from 'react-native';

const createApp = Platform.select({
  // web: createBrowserApp,
  default: createAppContainer,
});
// const createMaterialTopTabNavigator = createBottomTabNavigator;

import {Colors} from './constants';
import Screens from './screens';
import QRCheckinScannerModalNavigation from './screens/QRScreens/CheckIn';
import QRContactScannerModalNavigation from './screens/QRScreens/Contact';
import QRScannerModalNavigation from './screens/QRScreens/Identify';

class DynamicScheduleNavigation extends React.Component {
  state = {
    navigator: null,
  };

  componentDidMount() {
    this.initializeNavigatorFromSchedule();
  }

  componentDidUpdate() {
    // @todo: if schedule changes, re-render navigator? probably only if days changed tho
  }

  initializeNavigatorFromSchedule() {
    // @todo: get schedule from network or disk
    const fullSchedule = this.props.screenProps.event.groupedSchedule; // Schedule.events[0].groupedSchedule;

    // Sort schedule
    let navSchedule = {};
    _.each(fullSchedule, day => {
      navSchedule[day.title] = {
        screen: Screens.ScheduleDay({
          day: day.title,
          date: moment(new Date(day.date)).format('ddd'),
        }),
      };
    });

    const navigator = createAppContainer(
      createMaterialTopTabNavigator(navSchedule, {
        tabBarOptions: {
          style: {backgroundColor: '#333'},
          activeTintColor: '#fff',
        },
        defaultNavigationOptions: ({navigation}) => ({
          tabBarLabel: navigation.state.routeName.substring(0, 3).toUpperCase(),
        }),
      })
    );

    this.setState({navigator});
  }

  render() {
    if (!this.state.navigator) {
      // @todo: show a loading state
      return null;
    }

    let Navigator = this.state.navigator;
    return (
      <Navigator
        detached
        screenProps={{
          ...this.props.screenProps,
          parentNavigation: this.props.navigation,
        }}
      />
    );
  }
}

const DefaultStackConfig = {
  cardStyle: {
    backgroundColor: '#fafafa',
  },
  defaultNavigationOptions: ({navigation}) => ({
    title: navigation.state.routeName,
    headerStyle: {
      borderBottomWidth: 0,
      shadowRadius: 0,
      backgroundColor: Colors.blue,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  }),
};

const MenuNavigation = createStackNavigator(
  {
    Menu: Screens.Menu,
    Speakers: Screens.Speakers,
    Crew: Screens.Crew,
    Sponsors: Screens.Sponsors,
    Attendees: Screens.Attendees,
    AttendeeDetail: Screens.AttendeeDetail,
  },
  DefaultStackConfig
);

const ScheduleStackNavigator = createStackNavigator(
  {
    Schedule: DynamicScheduleNavigation,
  },
  DefaultStackConfig
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: Screens.Profile,
  },
  DefaultStackConfig
);

const ContactsNavigator = createStackNavigator(
  {
    Contacts: Screens.Contacts,
  },
  DefaultStackConfig
);

const StaffCheckinListsNavigation = createStackNavigator(
  {
    StaffCheckinListsList: Screens.StaffCheckinLists,
  },
  DefaultStackConfig
);

const PrimaryTabNavigator = createBottomTabNavigator(
  {
    Home: Screens.Home,

    Profile: ProfileNavigator,
    Schedule: ScheduleStackNavigator,

    Contacts: ContactsNavigator,
    Menu: MenuNavigation,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Profile') {
          iconName = `ios-contact${focused ? '' : ''}`;
        } else if (routeName === 'Schedule') {
          iconName = `ios-calendar${focused ? '' : ''}`;
        } else if (routeName === 'Contacts') {
          iconName = `ios-contacts${focused ? '' : ''}`;
        } else if (routeName === 'Menu') {
          iconName = 'md-menu';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={32} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      style: {backgroundColor: '#333'},
      activeTintColor: '#fff',
    },
  }
);

const Navigation = createStackNavigator(
  {
    Primary: PrimaryTabNavigator,
    AttendeeDetail: Screens.AttendeeDetail,
    TicketInstructions: Screens.TicketInstructions,

    CheckedInAttendeeInfo: Screens.CheckedInAttendeeInfo,
    QRScanner: QRScannerModalNavigation,
    QRCheckinScanner: QRCheckinScannerModalNavigation,
    QRContactScanner: QRContactScannerModalNavigation,
    StaffCheckinLists: StaffCheckinListsNavigation,

    Details: Screens.Details,
  },
  {
    ...DefaultStackConfig,
    headerMode: 'none',
    mode: 'modal',
  }
);

export default createApp(Navigation);
