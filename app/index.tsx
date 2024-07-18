import React from 'react';
import { Text, View } from 'react-native';
import { GameCard } from './components/GameCard';


export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-start bg-white">
      <GameCard title="Guessing Game" linkTo="/GuessingGame" />
      <GameCard title="Hangman" linkTo="/Hangman" />
      <GameCard title="Spin The Wheel" linkTo="/SpinTheWheel" />
      <GameCard title="Scratch Game" linkTo="/ScratchGame" />
      <GameCard title="Match The Vegetables" linkTo="/MemoryMatch" />
    </View>
  );
}

