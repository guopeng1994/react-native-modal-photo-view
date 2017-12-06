import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

export default class BottomBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    labelText:PropTypes.string
  };

  static defaultProps = {
    displayed: true,
    labelText:''
  };

  render() {
    const { displayed,labelText } = this.props;
    return (
      <View
        style={styles.container}
      >
        {
          displayed ? 
          <View style={styles.captionContainer}>
            <Text style={styles.caption} numberOfLines={1}>{labelText}</Text>
          </View>
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    position: 'absolute',
    left: 0,
    bottom:40,
    zIndex:9999
  },
  captionContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  caption: {
    color: '#fff',
    fontSize:14
  }
});
