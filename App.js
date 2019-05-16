import {Ionicons} from '@expo/vector-icons';
import {AppLoading, Asset, Font, Linking, SplashScreen, Updates} from 'expo';
import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {Animated, AsyncStorage, Platform, View} from 'react-native';
import {Assets as StackAssets} from 'react-navigation-stack';

import {GQL} from './src/constants';
import GET_SCHEDULE from './src/data/schedulequery';
import AppNavigator from './src/Navigation';
import {saveSchedule, setEvent} from './src/utils';
import client from './src/utils/gqlClient';
import {loadSavedTalksAsync} from './src/utils/storage';

const SHOULD_ANIMATE_IN = true;
export default class App extends React.Component {
  state = {
    isAppReady: false,
    isSplashReady: false,
    isSplashAnimationComplete: false,
  };

  splashVisibility = new Animated.Value(1);

  componentDidMount() {
    this._loadResourcesAsync();

    if (Platform.OS !== 'web') {
      Updates.addListener(({type}) => {
        if (type === Updates.EventType.DOWNLOAD_FINISHED) {
          if (this.state.isAppReady) {
            this._promptForReload();
          } else {
            this._shouldPromptForReload = true;
          }
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isAppReady && this.state.isAppReady) {
      if (this._shouldPromptForReload) {
        this._shouldPromptForReload = false;
        setTimeout(this._promptForReload, 1000);
      }
    }
  }

  _promptForReload = () => {
    /*Alert.alert(
      'A schedule update is available',
      'You need to restart the app to get the new schedule.',
      [
        { text: 'Restart the app now', onPress: () => Updates.reload() },
        { text: "I'll do it later", onPress: () => {} },
      ]
    );*/
  };

  _loadResourcesAsync = async () => {
    SplashScreen.hide();
    try {
      await Promise.all([
        this._loadEventAsync(),
        Font.loadAsync({
          'open-sans-bold': require('./src/assets/OpenSans-Bold.ttf'),
          'open-sans': require('./src/assets/OpenSans-Regular.ttf'),
          'open-sans-semibold': require('./src/assets/OpenSans-SemiBold.ttf'),
          ...Ionicons.font,
        }),
        ...this._loadAssetsAsync(),
        loadSavedTalksAsync(),
        this._loadLinkingUrlAsync(),
      ]);
    } catch (e) {
      console.error(e);
      // if we can't load any data we should probably just not load the app
      // and give people an option to hit reload
    } finally {
      if (SHOULD_ANIMATE_IN) {
        this.setState({isAppReady: true}, () => {
          Animated.timing(this.splashVisibility, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            this.setState({isSplashAnimationComplete: true});
          });
        });
      } else {
        this.setState({isAppReady: true, isSplashAnimationComplete: true});
      }
    }
  };

  _loadLinkingUrlAsync = async () => {
    if (Platform.OS !== 'web') {
      const initialLinkingUri = await Linking.getInitialURL();
      console.log(initialLinkingUri);
      this.setState({initialLinkingUri: initialLinkingUri});
    }
  };

  _loadEventAsync = async () => {
    console.time('_loadEventAsync');
    let diskFetcher = this._fetchEventFromDiskAsync();
    let networkFetcher = this._fetchEventFromNetworkAsync();
    let quickestResult = await Promise.race([diskFetcher, networkFetcher]);
    if (!quickestResult) {
      let slowestResult = await networkFetcher;
      if (!slowestResult) {
        // alert('oh no! unable to get data');
      }
    }
    console.timeEnd('_loadEventAsync');
  };

  _fetchEventFromDiskAsync = async () => {
    let schedule = await AsyncStorage.getItem('@MySuperStore:schedule');
    const event = JSON.parse(schedule);

    if (event && event.slug) {
      this._setEvent(event);
      return event;
    } else {
      return null;
    }
  };

  _fetchEventFromNetworkAsync = async () => {
    let result = await client.query({
      query: GET_SCHEDULE,
      variables: {slug: GQL.slug},
    });
    if (result && result.data && result.data.events && result.data.events[0]) {
      let event = result.data.events[0];
      this._setEvent(event);
      return event;
    } else {
      return null;
    }
  };

  _setEvent = event => {
    setEvent(event);
    saveSchedule(event);
    this.setState({schedule: event});
  };

  _loadAssetsAsync = () => {
    if (Platform.OS === 'web') return [];
    return [
      Asset.fromModule(require('./src/assets/logo.png')).downloadAsync(),
      Asset.loadAsync(StackAssets),
    ];
  };

  _cacheSplashResourcesAsync = () => {
    const splash = require('./src/assets/splash-icon.png');
    return Asset.fromModule(splash).downloadAsync();
  };

  render() {
    if (Platform.OS !== 'web' && !this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          autoHideSplash={false}
          onError={console.error}
          onFinish={() => {
            this.setState({isSplashReady: true});
          }}
        />
      );
    }

    return (
      <ApolloProvider client={client}>
        {this.state.schedule ? (
          <AppNavigator
            screenProps={{
              event: this.state.schedule,
            }}
          />
        ) : (
          <View />
        )}
      </ApolloProvider>
    );
  }
}
