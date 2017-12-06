import React, { Component } from 'react';
import {
  ActionSheetIOS,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  StatusBar
} from 'react-native';
import PhotoBrowser from './lib/index.js';

const EXAMPLES = [
  {
    title: 'Single photo',
    description: 'with caption, no grid button',
    media: [
      {
        photo:
          'http://img3.imgtn.bdimg.com/it/u=2625580273,1265311250&fm=27&gp=0.jpg'
      },
    ],
  },
  {
    title: 'Multiple photos',
    description: 'with captions and nav arrows',
    media: [
      {
        photo:
          'https://blog.hittail.com/wp-content/uploads/sites/8/2013/01/hidden-value-of-long-tail-seo-1000.png'
      },
      {
        photo: require('./media/broadchurch_thumbnail.png')
      },
      {
        photo:
          'http://attachments.gfan.com/forum/attachments2/201301/27/20251961x1xt010vs1x6sc.jpg'
      },
    ],
  }
];

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(){
    super();
    this.state = {
      visible:false,
      currentExample:[]
    }
  }

  renderExampleRow = example => {
    const { navigate } = this.props.navigation;
    const { title, description } = example;

    return (
      <TouchableOpacity
        key={`example_${title}`}
        onPress={() => {
          this.setState({
            visible:true,
            currentExample:example
          });
        }}
      >
        <View style={styles.row}>
          <Text style={styles.rowTitle}>
            {title}
          </Text>
          <Text style={styles.rowDescription}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {EXAMPLES.map(this.renderExampleRow)}
        <PhotoBrowser
            visible={this.state.visible}
            onClose={() => {
              this.setState({
                visible: false
              })
            }}
            displayCloseBtn={true}
            diaplayBottomBar={true}
            mediaList={this.state.currentExample.media}
            initialIndex={0}
            imageErrorTitle='加载失败'
            useCircleProgress
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 14,
  },
  rowDescription: {
    fontSize: 12,
  },
});
