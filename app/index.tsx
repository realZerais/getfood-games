import React from 'react';
import { Text, View } from 'react-native';
import { GameCard } from './components/GameCard';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-start bg-white">
      <Text className="text-xl mb-4 text-center font-bold mt-5">Grab Food Games</Text>
      <GameCard title="Guessing Game" linkTo="/GuessingGame" />
      <GameCard title="Hangman" linkTo="/Hangman" />
      <GameCard title="Spin The Wheel" linkTo="/SpinTheWheel" />
      <GameCard title="Scratch Game" linkTo="/ScratchGame" />
    </View>
  );
}

