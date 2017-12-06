import React from 'react';
import PropTypes from 'prop-types';
import {
  ListView,
  Modal,
  StyleSheet,
  ViewPropTypes
} from 'react-native';

import { TopBar } from './bar';

import ModalContainer from './ModalContainer.js';

export default class PhotoBrowser extends React.Component {

  static propTypes = {
    style: ViewPropTypes.style,
    // Modal is visible
    visible:PropTypes.bool,

    //image load error or failed title
    imageErrorTitle: PropTypes.string,

    mediaList: PropTypes.array.isRequired,

    /*
     * set the current visible photo before displaying
     */
    initialIndex: PropTypes.number,

    /*
     * displays Progress.Circle instead of default Progress.Bar for full screen photos
     * iOS only
     */
    useCircleProgress: PropTypes.bool,

    /*
     * Called when done or back button is tapped.
     * Back button will not be displayed if this is null.
     */
    onClose: PropTypes.func,
  
    /*
     * Display top bar
     */
    displayCloseBtn: PropTypes.bool,
    /*
     * Display bottom bar
     */
    displayBottomBar: PropTypes.bool,
    /*
     * Applied on Photo components' parent TouchableOpacity
     */
    onPhotoLongPress: PropTypes.func,
    delayPhotoLongPress: PropTypes.number,
  };

  static defaultProps = {
    mediaList: [],
    initialIndex: 0,
    useCircleProgress: false,
    displayCloseBtn: false,
    displayBottomBar:true,
    onPhotoLongPress: () => {},
    delayPhotoLongPress: 1000,
    visible: false,
    imageErrorTitle:'Load failed'
  };

  constructor(props, context) {
    super(props, context);

    const { mediaList, initialIndex } = props;

    this.state = {
      dataSource: this._createDataSource(mediaList),
      mediaList,
      currentIndex: initialIndex,
      displayCloseBtn: props.displayCloseBtn,
    };
  }

  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.mediaList;
    this.setState({
      dataSource: this._createDataSource(mediaList),
      mediaList,
    });
  }

  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    return dataSource.cloneWithRows(list);
  }

  render() {
    const {
      useCircleProgress,
      onClose,
      style,
      displayCloseBtn,
      displayBottomBar,
      visible,
      imageErrorTitle
    } = this.props;
    const {
      dataSource,
      mediaList,
      currentIndex
    } = this.state;

    let ModalContainerBox;
    if (mediaList.length > 0) {
      ModalContainerBox = (
        <ModalContainer
          ref='ModalContainer'
          dataSource={dataSource}
          mediaList={mediaList}
          initialIndex={currentIndex}
          displayBottomBar={displayBottomBar}
          useCircleProgress={useCircleProgress}
          bottomBarComponent={this.props.bottomBarComponent}
          onClose={onClose}
          onPhotoLongPress={this.props.onPhotoLongPress}
          delayLongPress={this.props.delayPhotoLongPress}
          imageErrorTitle={imageErrorTitle}
        />
      );
    }

    const TopBarComponent = this.props.topBarComponent || TopBar;

    return (
      <Modal 
        visible={visible}
        transparent={false}
        style={[styles.container, style]}
        onRequestClose={onClose}
      >
        <TopBarComponent
          displayed={displayCloseBtn}
          onClose={onClose}
          height={40}
        />
        {ModalContainerBox}
      </Modal>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
