import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GameCard } from './components/GameCard';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Get Food Games' }} />
      <ScrollView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-start bg-white">
        
        <GameCard title="Guessing Game" linkTo="/GuessingGame" />
        <GameCard title="Hangman" linkTo="/Hangman" />
        <GameCard title="Spin The Wheel" linkTo="/SpinTheWheel" />
        <GameCard title="Scratch Game" linkTo="/ScratchGame" />
        <GameCard title="Match The Vegetables" linkTo="/MemoryMatch" />
        <GameCard title="Food Typing Race" linkTo="/FoodTypingRace" />
        <GameCard title="Number Sliding Tiles" linkTo="/number_tiles" />
        <GameCard title="Picture Sliding Tiles" linkTo="/pic_tiles" />
      </View> 
      </ScrollView>
  
    </>
  );
}

