import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path } from 'react-native-svg';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

interface Segment {
  color: string;
  d: string;
}

const CircleSpinner: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [isNoWinner, setIsNoWinner] = useState(false);
  const centerX = 150; // Assuming centerX is 150 (adjust as needed)
  const centerY = 150; // Assuming centerY is 150 (adjust as needed)

  const spinWheel = () => {
    // Randomly generate a spin duration between 2 and 5 seconds
    const spinDuration = Math.random() * 5000 + 2000;

    // Animate the angle using a basic setInterval loop
    setTimeout(() => {
      clearInterval(animationId);
      // Update other states (e.g., isNoWinner) as needed
      setIsModalVisible(true); // Show modal after winningColor update
    }, spinDuration);
  
    let animationId = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 10) % 360); // Update angle by 10 degrees
  
      const segmentAngle = 360 / colors.length;
      const finalSegmentAngle = angle % segmentAngle;
      const segmentIndex = Math.floor(finalSegmentAngle / (segmentAngle / colors.length));
  
      if (segmentIndex >= 0 && segmentIndex < colors.length) {
        setWinningColor(colors[segmentIndex]);
      } else {
        setWinningColor('No Winner');
      }
    }, 10);
  
    // Stop the animation after spin duration
    setTimeout(() => {
      clearInterval(animationId);
    }, spinDuration);
  }

  const renderSegments = (): React.ReactNode[] => {
    const arcLength = 360 / colors.length;
    const radius = 125;

    return colors.map((color, index) => {
      const startAngle = index * arcLength;
      const endAngle = startAngle + arcLength;
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const startX = centerX + radius * Math.cos(startAngle * (Math.PI / 180));
      const startY = centerY + radius * Math.sin(startAngle * (Math.PI / 180));
      const endX = centerX + radius * Math.cos(endAngle * (Math.PI / 180));
      const endY = centerY + radius * Math.sin(endAngle * (Math.PI / 180)); // Corrected typo

      const pathData = `
        M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z
      `;

      const rotationTransform = `rotate(${angle} ${centerX} ${centerY})`;

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSpin = () => {
    spinWheel();
    // setIsModalVisible(true); // Show modal after spin
  };

  // Define an interface for Modal props
  interface ModalProps {
    winningColor: string | null; // Winning color can be a string or null
    onClose: () => void; // Function to handle modal closing
  }

  // Basic Modal Component
  const YourModalComponent: React.FC<ModalProps> = ({ winningColor, onClose }) => {
    return (
      <Modal animationType="slide" visible={true} onRequestClose={onClose} style={{ flex: 0 }}>
        <View style={{marginTop: '70%', justifyContent: 'center', alignItems: 'center', height: 200, width: '100%', backgroundColor: '#000' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: winningColor ? winningColor : '#000', }}>
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
      {/* <Polygon
          // Adjusted points for arrow at top (modify as needed)
          points={`<span class="math-inline">\{centerX\},</span>{centerY - radius * 0.2} 
                  <span class="math-inline">\{centerX \+ 5\},</span>{centerY} 
                  <span class="math-inline">\{centerX \- 5\},</span>{centerY}`} // Triangle shape
          fill="black"
          transform={`translate(${centerX}, ${centerY}) rotate(-90)`} // Adjusted for triangle
        /> */}
    </Svg>
      <TouchableOpacity onPress={spinWheel} style={{ marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>SPIN</Text>
      </TouchableOpacity>
      {isModalVisible && winningColor !== null && (
    <YourModalComponent winningColor={winningColor} onClose={() => setIsModalVisible(false)} />
  )}
      </View>
  );
};

export default CircleSpinner;


