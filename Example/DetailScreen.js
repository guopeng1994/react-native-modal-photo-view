import React, { Component } from 'react';
import { ActionSheetIOS, Platform } from 'react-native';
import PhotoBrowser from './lib/index.js'

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {
      media,
      initialIndex
    } = this.props.navigation.state.params.example;

    return (
      <PhotoBrowser
        onClose={()=>console.log('goback')}
        displayCloseBtn={true}
        diaplayBottomBar={true}
        mediaList={media}
        initialIndex={initialIndex}
        useCircleProgress
      />
    );
  }
}
