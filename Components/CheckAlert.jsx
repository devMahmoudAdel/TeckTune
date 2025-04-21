import { View, Text } from 'react-native'
import React from 'react'

export default function CheckAlert(props) {
    const {state,title} = props;
  return (
    <>{Swal.fire({
        position: "center",
        icon: state,
        title: title,
        showConfirmButton: false,
        timer: 1500
      })};
      </>
  )
}