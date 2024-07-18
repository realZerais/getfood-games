import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path } from 'react-native-svg';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

const CircleSpinner: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const centerX = 150; // Assuming centerX is 150 (adjust as needed)
  const centerY = 150; // Assuming centerY is 150 (adjust as needed)

  const spinWheel = useCallback(() => {
    const spinDuration = Math.random() * 5000 + 2000;
  
    let animationId = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 10) % 360);
    }, 10);
  
    setTimeout(() => {
      clearInterval(animationId);
      setAngle((prevAngle) => {
        const segmentAngle = 360 / colors.length;
        const finalSegmentAngle = (360 - (prevAngle % 360)) % 360; // Calculate the angle at 0 degrees
        const segmentIndex = Math.floor(finalSegmentAngle / segmentAngle);
        console.log('Final prevAngle:', prevAngle);
        console.log('Final segmentIndex:', segmentIndex);
        if (segmentIndex >= 0 && segmentIndex < colors.length) {
          setWinningColor(colors[segmentIndex]);
        } else {
          setWinningColor('No Winner');
        }
        setIsSpinning(false);
        setIsModalVisible(true);
        return prevAngle;
      });
    }, spinDuration);
  }, [setAngle, setWinningColor, setIsModalVisible]);
  

  const renderSegments = (): React.ReactNode[] => {
    const arcLength = 360 / colors.length;
    const radius = 150;
  
    return colors.map((color, index) => {
      const startAngle = index * arcLength;
      const endAngle = startAngle + arcLength;
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  
      const startX = centerX + radius * Math.cos(startAngle * (Math.PI / 180));
      const startY = centerY + radius * Math.sin(startAngle * (Math.PI / 180));
      const endX = centerX + radius * Math.cos(endAngle * (Math.PI / 180));
      const endY = centerY + radius * Math.sin(endAngle * (Math.PI / 180)); // Corrected typo
  
      // Adjust initial rotation to align red at the top
      const initialRotation = -90;
      const rotationTransform = `rotate(${angle + initialRotation} ${centerX} ${centerY})`;
  
      const pathData = `
        M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z
      `;
  
      return (
        <Path
          key={color}
          d={pathData}
          fill={color}
          transform={rotationTransform}
        />
      );
    });
  };
  
  

  const handleSpin = () => {
    if (!isSpinning) { // Check if the wheel is not spinning
      setIsSpinning(true); // Set spinning state to true
      spinWheel();
    }
  };

  const YourModalComponent: React.FC<{ winningColor: string | null; onClose: () => void; }> = ({ winningColor, onClose }) => {
    console.log('Modal winningColor:', winningColor);
    return (
      <Modal animationType="slide" visible={true} onRequestClose={onClose} style={{ flex: 0 }}>
        <View style={{ marginTop: '70%', justifyContent: 'center', alignItems: 'center', height: 200, width: '100%', backgroundColor: '#000' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: winningColor ? winningColor : '#000' }}>
            You Won: {winningColor}!
          </Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, padding: 10, backgroundColor: '#007bff' }}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Text style={{ marginBottom: 50, fontSize: 36, fontWeight: 'bold' }}>Spin The Wheel</Text>
      <Svg width={300} height={300} viewBox="0 0 300 300">
        <Path d="M 150 0 L 160 20 L 140 20 Z" fill="black" transform="rotate(180 150 10)" />
        <Defs>
          <ClipPath id="circleClip">
            <Circle cx="150" cy="150" r="125" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#circleClip)">
          {renderSegments()}
        </G>
        {/* Circle outline without clip path */}
        <Circle cx="150" cy="150" r="125" fill="transparent" strokeWidth={2} stroke="black" />
      </Svg>
      <TouchableOpacity onPress={handleSpin} style={{ marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}>
      <Text style={{ color: 'white' }}>{isSpinning ? 'Spinning...' : 'SPIN'}</Text>
      </TouchableOpacity>
      {isModalVisible && winningColor !== null && (
        <YourModalComponent winningColor={winningColor} onClose={() => setIsModalVisible(false)} />
      )}
    </View>
  );
};

export default CircleSpinner;
