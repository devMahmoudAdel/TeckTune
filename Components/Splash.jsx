import React from 'react';
import { View, Text ,StyleSheet,Image} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/splash-icon.png')} resizeMode='cover' />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200
  }
});
export default Splash;
