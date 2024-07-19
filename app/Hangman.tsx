import React from 'react';
import { View, Text, StatusBar, useColorScheme } from 'react-native';
import Hangman from './hangman/index'

export default function HangmanGame() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Hangman />
    </View>
  );
}
