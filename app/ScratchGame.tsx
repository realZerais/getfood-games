import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated, Alert } from 'react-native';
import 'nativewind';

const ScratchCardGame: React.FC = () => {
  const [isScratched, setIsScratched] = useState(false);
  const [reward, setReward] = useState('');
  const [scratchProgress, setScratchProgress] = useState(new Animated.Value(1));

  const rewards = ['10% Off', 'Free Delivery', '100 Points', 'Buy 1 Get 1 Free', '20% Off'];

  const generateReward = () => {
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const touchX = gestureState.moveX;
      const touchY = gestureState.moveY;

      if (touchX && touchY) {
        Animated.timing(scratchProgress, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setIsScratched(true);
          generateReward();
        });
      }
    },
  });

  const handlePress = () => {
    if (isScratched) {
      Alert.alert('Reward', `You won: ${reward}`);
    } else {
      Alert.alert('Scratch Card', 'Scratch the card to reveal your reward!');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold mb-5">Daily Scratch Card</Text>
      <TouchableOpacity className="w-72 h-48 justify-center items-center bg-white rounded-lg shadow-lg" onPress={handlePress}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[{ opacity: scratchProgress }, { position: 'absolute', width: '100%', height: '100%' }]}
          className="bg-gray-400 rounded-lg"
        />
        {isScratched && (
          <View className="justify-center items-center">
            <Text className="text-4xl font-bold text-red-500">{reward}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ScratchCardGame;
