import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';


type Level = 'easy' | 'medium' | 'hard';

const Game: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const handleGuess = (guess: number) => {
    setAttempts(attempts + 1);
    setAttemptsLeft(attemptsLeft - 1);
    setNumbers(numbers.filter((num) => num !== guess)); // Remove the chosen number

    if (guess < randomNumber) {
      Alert.alert('Too low!', 'Try a higher number.');
    } else if (guess > randomNumber) {
      Alert.alert('Too high!', 'Try a lower number.');
    } else {
      Alert.alert(`Correct!`, `You guessed the number in ${attempts + 1} attempts.`, [
        { text: 'Play Again', onPress: resetGame }
      ]);
    }

    if (attemptsLeft - 1 <= 0 && guess !== randomNumber) {
      Alert.alert(`Game Over`, `You've used all ${maxAttempts} attempts. The number was ${randomNumber}.`, [
        { text: 'Try Again', onPress: resetGame }
      ]);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setAttempts(0);
    setAttemptsLeft(0);
    setMaxAttempts(0);
    setNumbers([]);
  };

  const startGame = (level: Level) => {
    let maxNum = 0;
    let maxTries = 5;
    switch(level) {
      case 'easy':
        maxNum = 10;
        break;
      case 'medium':
        maxNum = 15;
        break;
      case 'hard':
        maxNum = 20;
        break;
    }
    setNumbers(Array.from({ length: maxNum }, (_, i) => i + 1));
    setMaxAttempts(maxTries);
    setAttemptsLeft(maxTries);
    setRandomNumber(Math.floor(Math.random() * maxNum) + 1);
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
              className="border p-4 mb-2 rounded"
              onPress={() => startGame(level as Level)}
            >
              <Text className="text-black text-center capitalize">{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="w-full items-center">
          <Text className="text-2xl mb-4">Number Guessing Game</Text>
          <Text className="text-lg mb-2">Range: 1 - {numbers.length + attempts}</Text>
          <Text className="text-lg mb-4">Attempts Left: {attemptsLeft}</Text>
          <View className="flex-wrap flex-row justify-center">
            {numbers.map((num) => (
              <TouchableOpacity
                key={num}
                className="bg-red-600 p-4 m-2 rounded"
                onPress={() => handleGuess(num)}
              >
                <Text className="text-white text-center">{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default Game;
