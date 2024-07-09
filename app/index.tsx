import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'nativewind';  // Import nativewind

type Level = 'easy' | 'medium' | 'hard';

const Game: React.FC = () => {
  const [number, setNumber] = useState<string>('');
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [range, setRange] = useState<number>(0);

  const handleGuess = () => {
    const guess = parseInt(number);
    setAttempts(attempts + 1);
    setAttemptsLeft(attemptsLeft - 1);

    if (guess < randomNumber) {
      Alert.alert('Too low!', 'Try a higher number.');
    } else if (guess > randomNumber) {
      Alert.alert('Too high!', 'Try a lower number.');
    } else {
      Alert.alert(`Correct!`, `You guessed the number in ${attempts + 1} attempts.`, [
        { text: 'Play Again', onPress: resetGame }
      ]);
    }

    if (attemptsLeft - 1 <= 0) {
      Alert.alert(`Game Over`, `You've used all ${maxAttempts} attempts. The number was ${randomNumber}.`, [
        { text: 'Try Again', onPress: resetGame }
      ]);
    }

    setNumber('');
  };

  const resetGame = () => {
    setGameStarted(false);
    setAttempts(0);
    setAttemptsLeft(0);
    setMaxAttempts(0);
    setRange(0);
  };

  const startGame = (level: Level) => {
    let maxNum = 0;
    let maxTries = 0;
    switch(level) {
      case 'easy':
        maxNum = 25;
        maxTries = 10;
        break;
      case 'medium':
        maxNum = 50;
        maxTries = 5;
        break;
      case 'hard':
        maxNum = 100;
        maxTries = 3;
        break;
    }
    setRange(maxNum);
    setMaxAttempts(maxTries);
    setAttemptsLeft(maxTries);
    setRandomNumber(Math.floor(Math.random() * (maxNum + 1)));
    setGameStarted(true);
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      {!gameStarted ? (
        <View>
          <Text className="text-2xl mb-4">Select Difficulty Level</Text>
          {['easy', 'medium', 'hard'].map((level) => (
            <TouchableOpacity
              key={level}
              className="bg-blue-500 p-4 mb-2 rounded"
              onPress={() => startGame(level as Level)}
            >
              <Text className="text-white text-center capitalize">{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="w-full items-center">
          <Text className="text-2xl mb-4">Number Guessing Game</Text>
          <Text className="text-lg mb-2">Range: 0 - {range}</Text>
          <Text className="text-lg mb-4">Attempts Left: {attemptsLeft}</Text>
          <TextInput
            className="border border-gray-400 p-2 mb-4 w-3/4"
            keyboardType="number-pad"
            value={number}
            onChangeText={setNumber}
            placeholder="Enter your guess"
          />
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded"
            onPress={handleGuess}
          >
            <Text className="text-white text-center">Guess</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default Game;
