/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import CustomCamera from '../../common/Components/CustomCamera/CustomCamera';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../../libs/Colors';
interface SignInProps {
  navigation: any;
}
const first = {
  image: require('../../../assets/images/png/ic_plus_post.png'),
  type: 'image',
};
const Home: React.FC<SignInProps> = ({navigation}) => {
  const [isCameraDisplay, setIsCameraDisplay] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [mediaArr, setMediaArr] = useState([first]);
  const bottomSheetRef = useRef<any>();
  const demoImagePreview =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAKlBMVEX////p6Oj19fXy8fHu7u7r6er5+fn8/Pzv7+/r6+vn5ubz8/P6+fr9/P0SPnzDAAACrUlEQVR4nO3c4ZaTMBBA4QKVlFbf/3V1dXu2ZGZCspLOwLnf37K412ASoMfLBQAAAAAAAAAAAAAAAAAAAAAAAAAAACXzGELHwusQwukLf1BIIYXuKKSQQn8UUlhbeLukN/rpUvhO5y+cHQqXjn+OROFeKOyHwr1Q+D/SeFuW65j0T09QOD3P+1A/PnxhWl5OrA3j0QvTsKIccfTC7J7lKo84eOE8ZObiIQcsnPLCSRxy8MIlL5TnPnZhygOHQUynFO6lU6G8SoMXNr/BFIVyuQhVON9bH3CMeaH8OwpVuDQ/w/mVF8pDIhWO+iAUZYOo/HSkQvOXLFmt+XK9D1X4HI7vJ6o/GacwlX9RW7ot94+zTvotcJzCx9cBcvtcltI8J+MWP07hanvSmlgSpvA2dEqMUpjf6FnXXLsoheL94m6JQQrFvbr+VOnysdluvIKDFIodtJn4aP1HGqNQDqFxMf+dcu9NC2aMQmUIB/XB2ed5tN2ZJUShuAcyE2fzE1OEQnmn/iTGarHOYYtQ+LJf20h8GWxrrhUCFIq7WDNx/eCpckoNULjer5USs+e/dVOqf6HyRNDoEGtKVaJ/YXkIh5erUX5zrGbVcC9UF3t1qLQjK1YN98Kar/T9G0V1TdmeUr0LK4bwM9FaU7YSvQvNxT7PsCekjVXDudDar8lE8abwS3lKdS6sDSzTv4QRorB6CDeU3gX4Fu4U+GfVsOcb18LClruVvWp4Fm7t19pYU6pn4Y5DWEj0LCwsAN+irxpnKtRXjVMVqqvGuQq3HjafoDDYt016FA7iof/pCsWqccLC+3pKdS1cOlktjN53wP1RuBcK+6FwLxT241L41v84aXIo9EMhhRT6o5BCCv1RSGHJOEVQfFkMAAAAAAAAAAAAAAAAAAAAAAAAAACw6Tc89C+gXlz0SwAAAABJRU5ErkJggg==';
  const [imageClickIndex, setImageClickIndex] = useState<number | undefined>();
  // Rendering of Media View.
  const renderMediaView = () => {
    return (
      <View style={styles.listViewStyle}>
        <FlatList
          data={mediaArr}
          renderItem={({item, index}) => renderImageItem(item, index)}
          horizontal={true}
        />
        <Text style={styles.cameraStatementStyle}>
          You can add multiple Images from Camera.{' '}
        </Text>
      </View>
    );
  };

  // Rendering of Selecting Image
  const renderImageItem = (item: any, index: number) => {
    return (
      <View style={{marginHorizontal: 4}}>
        {index == 0 ? (
          <TouchableOpacity
            onPress={() => {
              setIsCameraDisplay(true);
            }}>
            <Image
              source={item.image}
              style={{width: 50, height: 50, borderColor: Colors.black}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        ) : (
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current.open();
                setImageClickIndex(index);
              }}>
              <Image
                source={{uri: item.image}}
                style={styles.selectingImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const onCapturingDone = (data: any) => {
    var imageArr = [...mediaArr];
    imageArr.push({image: data, type: 'image'});

    setMediaArr(imageArr);
    console.log('LOG:: NEW ARRAY UPDATED ' + JSON.stringify(mediaArr));
  };

  // rendering of Camera Modal
  const renderCameraModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraDisplay}
        onRequestClose={() => {
          setIsCameraDisplay(!isCameraDisplay);
        }}>
        <CustomCamera
          PendingView={<Text>Loading</Text>}
          onModalCancel={() => setIsCameraDisplay(!isCameraDisplay)}
          isVideo={true}
          onCroppingDone={onCapturingDone}
          //isVideoPresent={getIfVideoAlreadyPresent()}
          cropperRotateButtonsHidden={true}
          hideBottomControls={true}
          freeStyleCropEnabled={true}
        />
      </Modal>
    );
  };

  // render Preview Modal
  const renderPreviewModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isPreview}
        onRequestClose={() => {
          setIsPreview(!isPreview);
        }}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              setIsPreview(!isPreview);
            }}>
            <Image
              source={require('../../../assets/images/png/ic_cancel.png')}
              style={styles.cancelImageStyle}
            />
          </TouchableOpacity>

          {imageClickIndex && (
            <Image
              source={{
                uri: mediaArr[imageClickIndex]
                  ? mediaArr[imageClickIndex].image
                  : demoImagePreview,
              }}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </View>
      </Modal>
    );
  };

  // render Bottom Sheet for Options
  // Render Bottom Sheet.
  const renderBottomSheet = () => {
    return (
      <RBSheet
        ref={bottomSheetRef}
        height={90}
        openDuration={200}
        customStyles={{
          container: {
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderTopEndRadius: 25,
            borderTopStartRadius: 25,
          },
        }}>
        <View style={styles.tabViewStyle}>
          {/* Delete Button */}
          <TouchableOpacity
            style={styles.tabStyle}
            onPress={() => {
              // Open Camera.
              bottomSheetRef.current.close();
              // imageClickIndex, setImageClickIndex
              console.log('OL ' + imageClickIndex);
              var preArr = [...mediaArr];
              preArr.splice(imageClickIndex, 1);
              setMediaArr(preArr);
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: Colors.whiteColor,
              }}>
              Delete
            </Text>
          </TouchableOpacity>

          {/* Preview Button */}
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current.close();
              setTimeout(() => {
                setIsPreview(true);
              }, 1000);
            }}
            style={[
              styles.tabStyle,
              {
                backgroundColor: Colors.whiteColor,
                borderWidth: 1,
                borderColor: Colors.primaryDisable,
              },
            ]}>
            <Text style={{fontWeight: 'bold', color: Colors.black}}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  return (
    <View style={{flexDirection: 'column'}}>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 20,
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../assets/images/png/usama_img.png')}
          style={{width: 80, height: 80, borderRadius: 50}}
          resizeMode={'contain'}
        />
        <Text style={styles.nameStyle}>Usama Daood</Text>
        <Text
          style={[styles.nameStyle, {fontSize: 12, color: Colors.darkGray}]}>
          Sr. React Native Software Engineer
        </Text>
      </View>

      {renderMediaView()}
      {/* Rendering of Modal Camera */}
      {renderCameraModal()}
      {/* rendering Image Preview Modal */}
      {renderPreviewModal()}
      {/* rendering of Bottom Sheet */}
      {renderBottomSheet()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperView: {
    flex: 1,
    padding: 15,
  },
  selectingImage: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#000',
  },
  trashImageStyle: {
    width: 25,
    height: 25,
    borderColor: Colors.black,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
  },
  tabStyle: {
    flex: 0.5,
    backgroundColor: Colors.primaryDisable,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  tabViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    marginTop: 15,
  },
  bottomSheetView: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  cancelImageStyle: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginRight: 20,
  },
  nameStyle: {
    alignSelf: 'center',
    fontSize: 20,
    color: Colors.black,
    fontWeight: 'bold',
  },
  cameraStatementStyle: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  listViewStyle: {
    flexDirection: 'column',
    marginBottom: 10,
    paddingTop: 20,
  },
});

export default Home;
