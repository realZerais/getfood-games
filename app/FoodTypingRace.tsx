import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

// Define the TypeScript interface for food items
interface Food {
  name: string;
  image: any;
}

// Food array with local images
const foods: Food[] = [
  { name: 'Tomato', image: require('../assets/foods/Tomato.png') },
  { name: 'Green Apple', image: require('../assets/foods/Apple_Green.png') },
  { name: 'Banana', image: require('../assets/foods/Banana_Peeled.png') },
  { name: 'Blueberry', image: require('../assets/foods/Blueberry.png') },
  { name: 'Cabbage', image: require('../assets/foods/Cabbage.png') },
  { name: 'Carrot', image: require('../assets/foods/Carrot.png') },
  { name: 'Cauliflower', image: require('../assets/foods/Cauliflower.png') },
  { name: 'Cherry', image: require('../assets/foods/Cherry.png') },
  { name: 'Corn', image: require('../assets/foods/Corn.png') },
  { name: 'Pumpkin', image: require('../assets/foods/Pumpkin.png') },
];

const GameScreen = () => {
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [gameOver, setGameOver] = useState(false); // New state for game over

  useEffect(() => {
    // Start game with a new food item
    startNewRound();

    // Timer countdown
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setGameOver(true); // Set game over when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const startNewRound = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
    setUserInput('');
    setGameOver(false); // Reset game over state
  };

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === currentFood?.name.toLowerCase()) {
      setScore(score + 1);
      startNewRound();
    } else {
      Alert.alert('Incorrect!', 'Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Typing Race</Text>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Time's up!</Text>
          <Text style={styles.score}>Your score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={startNewRound}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        currentFood && (
          <View style={styles.gameContainer}>
            <Image source={currentFood.image} style={styles.foodImage} />
            <Text style={styles.foodName}>Type the name of this food:</Text>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type food name"
            />
            <TouchableOpacity style={styles.button} onPress={checkAnswer}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <Text style={styles.timer}>Time Remaining: {timer}s</Text>
            <Text style={styles.score}>Score: {score}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameContainer: {
    alignItems: 'center',
  },
  foodImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  foodName: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 2
  },
  timer: {
    fontSize: 18,
    marginTop: 10,
  },
  score: {
    fontSize: 18,
    marginTop: 10,
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default GameScreen;
