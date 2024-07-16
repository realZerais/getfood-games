import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

type GameCardProps = {
  title: string;
  linkTo: string;
};

export const GameCard: React.FC<GameCardProps> = ({ title, linkTo }) => {
  return (
    <Link href={linkTo} asChild>
      <TouchableOpacity className="bg-gray-200 p-4 rounded-md my-2 w-3/4">
        <Text className="text-lg">{title}</Text>
      </TouchableOpacity>
    </Link>
  );
};
