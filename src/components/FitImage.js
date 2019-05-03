import * as PropTypes from 'prop-types';
import {Component} from 'react';
import * as React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';

const propTypes = {
  ...Image.propTypes,
  indicator: PropTypes.bool,
  indicatorColor: PropTypes.string,
  indicatorSize: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'large']),
    PropTypes.number,
  ]),
  originalHeight: PropTypes.number,
  originalWidth: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class FitImage extends Component {
  static propTypes = propTypes;
  ImageComponent = ImageBackground || Image;

  constructor(props) {
    super(props);

    this.style = StyleSheet.flatten(props.style);

    if (this.style) {
      const size = [this.style.width, this.style.height];

      if (size.filter(Boolean).length === 1) {
        throw new Error(
          'Props error: size props must be present ' +
            'none or both of width and height.'
        );
      }

      if (this.style.width) {
        this.sizeStyle = {width: this.style.width};
      } else {
        this.sizeStyle = {flexGrow: 1};
      }
    }

    const originalSize = [props.originalWidth, props.originalHeight];
    if (originalSize.filter(Boolean).length === 1) {
      throw new Error(
        'Props error: originalSize props must be present ' +
          'none or both of originalWidth and originalHeight.'
      );
    }

    this.isFirstLoad = true;

    this.state = {
      isLoading: false,
      layoutWidth: 0,
      originalHeight: 0,
      originalWidth: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (this.props.originalWidth && this.props.originalHeight) {
      return;
    }

    this.fetchOriginalSizeFromRemoteImage();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const ImageComponent = this.ImageComponent;

    return (
      <ImageComponent
        {...this.props}
        onLayout={this.onLayout}
        onLoad={this.onLoad}
        onLoadStart={this.onLoadStart}
        source={this.props.source}
        style={[
          this.style,
          this.sizeStyle,
          {height: this.getHeight()},
          styles.container,
        ]}>
        {this.shouldDisplayIndicator()
          ? this.renderActivityIndicator()
          : this.props.children}
      </ImageComponent>
    );
  }

  shouldDisplayIndicator = () => {
    return this.state.isLoading && this.props.indicator !== false;
  };

  onLoad = () => {
    if (this.state.isLoading) {
      this.setState({isLoading: false});
    }

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad();
    }
  };

  onLoadStart = () => {
    if (this.isFirstLoad) {
      this.setState({isLoading: true});
      this.isFirstLoad = false;
    }
  };

  getHeight = () => {
    if (this.style && this.style.height) {
      return Number(this.style.height);
    }

    return Math.round(this.getOriginalHeight() * this.getRatio());
  };

  getOriginalHeight = () =>
    this.props.originalHeight || this.state.originalHeight || 0;

  getOriginalWidth = () =>
    this.props.originalWidth || this.state.originalWidth || 0;

  getRatio = () => {
    if (this.getOriginalWidth() === 0) {
      return 0;
    }

    return this.state.layoutWidth / this.getOriginalWidth();
  };

  onLayout = event => {
    const {width: layoutWidth} = event.nativeEvent.layout;

    this.setState({layoutWidth});
  };

  fetchOriginalSizeFromRemoteImage = () => {
    let uri;

    if (this.props.source instanceof Array) {
      uri = this.props.source[0].uri;
    } else {
      uri = this.props.source.uri;
    }

    if (!uri) {
      return;
    }

    Image.getSize(
      uri,
      (originalWidth, originalHeight) => {
        if (!this.mounted) {
          return;
        }

        this.setOriginalSize(originalWidth, originalHeight);
      },
      () => null
    );
  };

  setOriginalSize = (originalWidth, originalHeight) => {
    this.setState({
      originalHeight,
      originalWidth,
    });
  };

  renderActivityIndicator = () => {
    return (
      <ActivityIndicator
        color={this.props.indicatorColor}
        size={this.props.indicatorSize}
      />
    );
  };
}

export default FitImage;
