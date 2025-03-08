import React from 'react';
import { View, Text } from 'react-native';
import AntDesign from "@expo/vector-icons/AntDesign";
const Stars = ({number}) => {
  const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(
        <AntDesign
          name="star"
          size={16}
          key={i}
          color={i <= number ? "#ffb305" : "grey"}
        />
      );
    }
  
  return (
    arr
  );
}

export default Stars;
