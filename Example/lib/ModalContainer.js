import React from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  Dimensions,
  ListView,
  View,
  ViewPagerAndroid,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  ViewPropTypes
} from 'react-native';

import { BottomBar } from './bar';
import { Photo } from './media/index.js';

export default class ModalContainer extends React.Component {

  static propTypes = {
    style: ViewPropTypes.style,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    mediaList: PropTypes.array.isRequired,
    onClose:PropTypes.func,
    initialIndex: PropTypes.number,
    displayBottomBar:PropTypes.bool,
    useCircleProgress: PropTypes.bool,
    onPhotoLongPress: PropTypes.func,
    delayLongPress: PropTypes.number,
    imageErrorTitle: PropTypes.string
  };

  static defaultProps = {
    initialIndex: 0,
    displayBottomBar:true,
    onClose:()=>{},
    onPhotoLongPress: () => {},
    delayLongPress: 1000,
    imageErrorTitle:'Load failed'
  };

  constructor(props, context) {
    super(props, context);

    this._renderRow = this._renderRow.bind(this);
    // this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onPageSelected = this._onPageSelected.bind(this);
    this._onPhotoLongPress = this._onPhotoLongPress.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: props.initialIndex,
      currentMedia: props.mediaList[props.initialIndex]
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('didUpdateDimensions', () => {
      this.photoRefs.map(p => p && p.forceUpdate());
      this.openPage(this.state.currentIndex, false);
    });

    this.openPage(this.state.currentIndex, false)
  }

  openPage(index, animated) {
    if (!this.scrollView) {
      return;
    }

    if (Platform.OS === 'ios') {
      const screenWidth = Dimensions.get('window').width;
      this.scrollView.scrollTo({
        x: index * screenWidth,
        animated,
      });
    } else {
      this.scrollView.setPageWithoutAnimation(index);
    }

    this._updatePageIndex(index);
  }

  _updatePageIndex(index) {
    this.setState({
      currentIndex: index,
      currentMedia: this.props.mediaList[index],
    }, () => {
      this._triggerPhotoLoad(index);
    });
  }

  _triggerPhotoLoad(index) {
    const photo = this.photoRefs[index];
    if (photo) {
      photo.load();
    } else {
      // HACK: photo might be undefined when user taps a photo from gridview
      // that hasn't been rendered yet.
      // photo is rendered after listView's scrollTo method call
      // and i'm deferring photo load method for that.
      setTimeout(this._triggerPhotoLoad.bind(this, index), 200);
    }
  }

  _onScroll(e) {
    const event = e.nativeEvent;
    const layoutWidth = event.layoutMeasurement.width || Dimensions.get('window').width;
    const newIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);

    this._onPageSelected(newIndex);
  }

  _onPageSelected(page) {
    const { currentIndex } = this.state;
    let newIndex = page;

    // handle ViewPagerAndroid argument
    if (typeof newIndex === 'object') {
      newIndex = newIndex.nativeEvent.position;
    }

    if (currentIndex !== newIndex) {
      this._updatePageIndex(newIndex);
    }
  }

  _onPhotoLongPress() {
    const onPhotoLongPress = this.props.onPhotoLongPress;
    const { currentMedia, currentIndex } = this.state;
    onPhotoLongPress(currentMedia, currentIndex);
  }

  _renderRow(media: Object, sectionID: number, rowID: number) {
    const {
      useCircleProgress,
      onClose,
      imageErrorTitle
    } = this.props;

    return (
      <View key={`row_${rowID}`} style={styles.flex}>
        <TouchableWithoutFeedback
          onPress={onClose}
          // onLongPress={this._onPhotoLongPress}
          // delayLongPress={this.props.delayLongPress}
        >
          <Photo
            ref={ref => this.photoRefs[rowID] = ref}
            lazyLoad
            useCircleProgress={useCircleProgress}
            uri={media.photo}
            imageErrorTitle={imageErrorTitle}
            onClose={onClose} // just for image load failed ,touch to close modal.
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _renderScrollableContent() {
    const { dataSource, mediaList } = this.props;

    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          style={styles.flex}
          ref={scrollView => this.scrollView = scrollView}
          onPageSelected={this._onPageSelected}
        >
          {mediaList.map((child, idx) => this._renderRow(child, 0, idx))}
        </ViewPagerAndroid>
      );
    }

    return (
      <ListView
        ref={scrollView => this.scrollView = scrollView}
        dataSource={dataSource}
        renderRow={this._renderRow}
        onScroll={this._onScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        scrollEventThrottle={16}
      />
    );
  }

  render() {
    const { currentIndex } = this.state;
    const BottomBarComponent = this.props.bottomBarComponent || BottomBar;
    const { displayBottomBar,mediaList } = this.props;
    return (
      <View style={styles.flex}>
        {this._renderScrollableContent()}
        <BottomBarComponent
          labelText={`${currentIndex + 1}/${mediaList.length}`}
          displayd={displayBottomBar}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor:'#000'
  },
});
