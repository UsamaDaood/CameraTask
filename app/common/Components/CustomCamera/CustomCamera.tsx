import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Colors from '../../../libs/Colors';
import {PRIMARY_FONT_REGULAR} from '../../../constants/fonts';
interface CameraProps {
  textString: string;

  onModalCancel: any;
  PendingView: any;
  onRecordDone: any;
  onCroppingDone: any;
  isVideo: boolean;
  cropperRotateButtonsHidden: any;
  hideBottomControls: any;
  freeStyleCropEnabled: boolean;
  isVideoPresent: boolean;
  onRecordingStart: any;
}

const CustomCamera = ({
  onModalCancel,
  PendingView,
  onRecordDone,
  onCroppingDone,
  isVideo,
  cropperRotateButtonsHidden,
  hideBottomControls,
  freeStyleCropEnabled,
  isVideoPresent,
  onRecordingStart,
}: CameraProps) => {
  const [timerCount, setTimer] = useState(10);
  const [showText, setShowText] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [imagePreview, setImagePreview] = useState<boolean>(false);
  const [captureURI, setCaptureURI] = useState<any>();

  const displayTimer = () => {
    console.log('LOG:: OKAY TOMiR');
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second

    return () => {
      clearInterval(interval);
    };
  };

  // Blinking Animation
  const blinkingText = () => {
    let interval22 = setInterval(() => {
      timerCount == 0 && clearInterval(interval22);
      setShowText(showText => !showText);
    }, 500); //each count lasts for a half second
    return () => clearInterval(interval22);
  };

  // Rendering of CameraView

  const renderCameraView = () => {
    return (
      <RNCamera
        style={{width: '100%', height: '100%'}}
        type={RNCamera.Constants.Type.back}
        captureAudio={true}
        defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onRecordingStart={onRecordingStart}>
        {({camera, status, recordAudioPermissionStatus}) => {
          return (
            <View style={styles.cameraViewStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: Platform.OS == 'ios' ? 30 : 0,
                }}>
                {isVideo && (
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30,
                    }}>
                    <TouchableOpacity onPress={() => onModalCancel()}>
                      <Text style={{fontSize: 16, color: Colors.whiteColor}}>
                        {' '}
                        {showTimer && '00:' + timerCount}{' '}
                        {showText && (
                          <Text style={{color: 'red', fontWeight: 'bold'}}>
                            {' '}
                            Recording
                          </Text>
                        )}{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: 30,
                    marginRight: 30,
                  }}>
                  <TouchableOpacity onPress={() => onModalCancel()}>
                    <Text style={{fontSize: 16, color: Colors.whiteColor}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Button for capture Image */}
              <View
                style={{
                  alignSelf: 'center',
                  marginBottom: 30,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onLongPress={async () => {
                    console.log('LOGG: PRESS IN ' + isVideoPresent);
                    if (isVideo) {
                      // If Video type
                      setShowTimer(true);
                      displayTimer();
                      blinkingText();
                      console.log('LOG:: OKAY TIMER ' + timerCount);
                      try {
                        const options = {
                          maxFileSize: 60 * 1024 * 1024,
                          maxDuration: 10,
                        };
                        const data = await camera.recordAsync(options);
                        onRecordDone(data);
                      } catch (c) {
                        console.log(
                          'LOGG:: OKAY audioStatus Error ' + JSON.stringify(c),
                        );
                      }
                    }
                    //} // end else part....
                  }}
                  onPress={async () => {
                    const options = {quality: 0.5, base64: true};
                    const data = await camera.takePictureAsync(options);
                    setTimeout(() => {
                      // write your functions
                      setImagePreview(true);
                      setCaptureURI(data.uri);
                    }, 500);
                  }}
                  onPressOut={async () => {
                    const options = {quality: 0.5, base64: true};
                    console.log('LOG:: OKAY TIMER OUT PRESS ' + timerCount);
                    try {
                      const data11 = await camera.stopRecording();
                    } catch (c) {
                      console.log(
                        'LOGG:: OKAY audioStatus Error1111 ' +
                          JSON.stringify(c),
                      );
                    }
                  }}>
                  <Image
                    source={require('../../../../assets/images/png/cameraIcon/cameraIcon.png')}
                    style={{width: 70, height: 70}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </RNCamera>
    );
  };

  // rendering of Image PreView
  const renderImagePreview = () => {
    return (
      <View style={styles.imagePreviewStyle}>
        <Image
          source={{uri: captureURI}}
          style={{width: '100%', height: '80%', marginBottom: 30}}
          resizeMode={'contain'}
        />
        {/* render Bottom Options Retake or Use Photo */}
        <View style={styles.optionStyle}>
          {/* Retake Option */}
          <TouchableOpacity
            onPress={() => {
              setImagePreview(!imagePreview);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../../assets/images/png/retake_icon/retake_icon.png')}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
              <Text style={styles.textStyleOption}>Retake</Text>
            </View>
          </TouchableOpacity>

          {/* Use Photo Option */}
          <TouchableOpacity
            onPress={() => {
              onCroppingDone(captureURI);
              onModalCancel();
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../../assets/images/png/ic_done/ic_done.png')}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
              <Text style={styles.textStyleOption}>Use photo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>{imagePreview ? renderImagePreview() : renderCameraView()}</View>
  );
};
const styles = StyleSheet.create({
  cameraViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  textStyle: {
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: PRIMARY_FONT_REGULAR,
  },
  imagePreviewStyle: {
    backgroundColor: Colors.black,
    width: '100%',
    height: '100%',
  },
  optionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  imageStyle: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  textStyleOption: {
    color: Colors.whiteColor,
  },
});

export default CustomCamera;
