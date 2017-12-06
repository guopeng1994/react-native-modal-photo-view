import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';

import * as Progress from 'react-native-progress';

export default class Photo extends Component {

  static propTypes = {
    /*
     * image uri or opaque type that is passed as source object to image component
     */
    uri: PropTypes.oneOfType([
      // assets or http url
      PropTypes.string,
      // Opaque type returned by require('./image.jpg')
      PropTypes.number,
    ]).isRequired,

    //image load error or failed title
    imageErrorTitle: PropTypes.string,
    /*
     * image resizeMode
     */
    resizeMode: PropTypes.string,

    onClose: PropTypes.func,

    /*
     * when lazyLoad is true,
     * image is not loaded until 'load' method is manually executed
     */
    lazyLoad: PropTypes.bool,

    /*
     * image tag generated using require(asset_path)
     */
    progressImage: PropTypes.number,

    /*
     * displays Progress.Circle instead of default Progress.Bar
     * it's ignored when progressImage is also passed.
     * iOS only
     */
    useCircleProgress: PropTypes.bool,
  };

  static defaultProps = {
    resizeMode: 'contain',
    lazyLoad: false,
    imageErrorTitle: 'Load Failed',
    onClose: () => { }
  };

  constructor(props) {
    super(props);

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);

    const { lazyLoad, uri } = props;
    
    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false,
      imageWidth:'100%',
      imageHeight:0
    };
  }

  componentWillMount() {
    const imageUrl = this.props.uri;
    const screenWidth = Dimensions.get('window').width;
    if (typeof imageUrl === 'string') {
      Image.getSize(imageUrl, (width, height) => {
        const imageHeight = screenWidth * height / width;
        this.setState({
          imageWidth:screenWidth,
          imageHeight
        });
      }, err => { 
        this.setState({
          imageWidth: 0,
          imageHeight:0
        });
      });
    } else { 
      const imageInfo = Image.resolveAssetSource(imageUrl);
      const width = imageInfo.width;
      const imageHeight = screenWidth * imageInfo.height / width;
      this.setState({
          imageWidth:screenWidth,
          imageHeight
        })
    }
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri
      })
    }
  }

  _onProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress,
      });
    }
  }

  _onError() {
    this.setState({
      error: true,
      progress: 1,
    });
  }

  _onLoad() {
    this.setState({
      progress: 1,
    });
  }

  _renderProgressIndicator() {
    const { progressImage, useCircleProgress } = this.props;
    const { progress } = this.state;

    if (progress < 1) {
      if (progressImage) {
        return (
          <Image
            source={progressImage}
          />
        );
      }

      if (Platform.OS === 'android') {
        return (
          <ActivityIndicator animating={true} size={30} />
        );
      }

      const ProgressElement = useCircleProgress ? Progress.Circle : Progress.Bar;
      return (
        <ProgressElement
          progress={progress}
          thickness={20}
          color={'#fff'}
        />
      );
    }
    return null;
  }

  _renderErrorIcon() {
    const { imageErrorTitle, onClose } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.errBox}>
          <Image
            source={require('../../Assets/image-error.png')}
          />
          <Text style={styles.errText}>{imageErrorTitle}</Text>
        </View>
      </TouchableWithoutFeedback>  
    );
  }

  render() {
    const { resizeMode } = this.props;
    const { uri, error, imageHeight, imageWidth} = this.state;

    let source;
    if (uri) {
      // create source objects for http/asset strings
      // or directly pass uri number for local files
      source = typeof uri === 'string' ? { uri } : uri;
    }

    const screenHeight = Dimensions.get('window').height;
    console.log(error);
    return (
      <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer,imageHeight <= screenHeight ? styles.shortImageView : null]}>
        {error ? this._renderErrorIcon() : this._renderProgressIndicator()}
        <Image
          {...this.props}
          style={{height:imageHeight,width:imageWidth}}
          source={source}
          onProgress={this._onProgress}
          onError={this._onError}
          onLoad={this._onLoad}
          resizeMode={resizeMode}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  shortImageView:{
    flex:1
  },
  errBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width:'100%'
  },
  errText: {
    color: '#fff',
    fontSize: 14,
    marginTop:10
  }
});
