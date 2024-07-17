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
      <TouchableOpacity className="bg-red-600 p-4 rounded-md my-2 w-3/4" >
        <Text className="text-lg" style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          padding: 10,
          backgroundColor: 'black',
          borderRadius: 5,
        }}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );
};
