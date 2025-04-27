import { Text, View } from 'react-native'
import React, { Component } from 'react'
import APPP from './src/navHost/navContainer'

export class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <APPP />
      </View>
    )
  }
}

export default App