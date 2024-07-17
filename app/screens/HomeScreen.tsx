import React from 'react';
import { View, Text } from 'react-native';
import { GameCard } from '../components/GameCard';

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl mb-4">Choose a Game</Text>
      <GameCard title="Game 1" linkTo={''} />
      <GameCard title="Game 2" linkTo={''} />
      <GameCard title="Game 3" linkTo={''} />
    </View>
  );
};

export default HomeScreen;
