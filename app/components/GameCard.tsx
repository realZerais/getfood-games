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
      <TouchableOpacity className="border p-4 rounded-md mt-6 w-3/4" >
        <Text className="text-lg" style={{
          color: 'black',
          fontSize: 18,
          fontWeight: 'bold',
          padding: 10,
          borderRadius: 5,
        }}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );
};
