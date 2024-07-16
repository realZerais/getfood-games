import React from 'react';
import { Text, View } from 'react-native';
import { GameCard } from './components/GameCard';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl mb-4 text-center">Choose a Game</Text>
      <GameCard title="Game 1" linkTo="/game1" />
      <GameCard title="Game 2" linkTo="/game2" />
    </View>
  );
}
