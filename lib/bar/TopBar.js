import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default class TopBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    closeImage: PropTypes.any,
    onClose: PropTypes.func
  };

  static defaultProps = {
    displayed: false,
    closeImage: require('../../Assets/image-close.png')
  };

  renderCloseButton() {
    const { onClose, closeImage, displayed } = this.props;
    if (displayed && onClose) {
      return (
        <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
            <Image source={closeImage} style={styles.closeImage} />
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        {this.renderCloseButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:40,
    position: 'absolute',
    left: 0,
    top:20,
    zIndex:9999,
    justifyContent:'center',
    alignItems:'center'
  },
  closeContainer: {
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end',
    marginRight:20
  },
  closeImage:{
    width:30,
    height:30
  }
});
