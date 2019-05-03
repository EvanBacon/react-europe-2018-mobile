import React from 'react';

import {TouchableOpacity as RectButton, ScrollView} from 'react-native';

import ReactMarkdown from 'react-markdown';

const Markdown = ({children}) => <ReactMarkdown source={children} />;

export {RectButton, ScrollView, Markdown};
