import AsyncStorage from '@react-native-async-storage/async-storage';
const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // console.log("valuee",value)
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };

  const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Data removed successfully');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  export { storeData, getData, removeData, clearAllData };