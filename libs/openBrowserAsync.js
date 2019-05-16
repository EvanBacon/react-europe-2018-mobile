import {WebBrowser, Linking} from 'expo';

export async function openBrowserAsync(url) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (e) {
    Linking.openURL(url);
  }
}
