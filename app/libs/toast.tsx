import Toast from 'react-native-toast-message';

export const toastShow = (
  type: string,
  text1: string,
  text2?: string | undefined,
) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};

export const toastHide = () => {
  Toast.hide();
};
