import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import Home from '../screens/Home';
const Stack = createNativeStackNavigator();
function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={
        {
          //headerShown: false,
        }
      }>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

export default () => <AppNavigator />;
