import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ImageBackground, Image } from 'react-native';

const NUM_TILES = 4; // Adjust this for different puzzle sizes
const TILE_SIZE = 75; // Adjust this for different tile sizes
const TARGET_IMAGE_SIZE = 100; // Size of the target image

interface Tile {
  key: number;
  position: number;
}

// Define multiple puzzle images
const puzzleImages = [
  require('../assets/sliding_tiles/apple.jpg'),
  require('../assets/sliding_tiles/kiwi.jpg'),
  require('../assets/sliding_tiles/orange.jpg'),
  require('../assets/sliding_tiles/dragon-fruit.jpg'),
];

const App = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [solved, setSolved] = useState<boolean>(false);
  const [rerender, setRerender] = useState<number>(0); // State to force re-render
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null); // Initialize timer ID as null
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Track current puzzle image index

  useEffect(() => {
    initializeTiles();
  }, [currentImageIndex]); // Reload tiles when image index changes

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timerOn && !solved) {
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000); // Set interval to 1000 milliseconds (1 second)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerOn, solved]);

  const initializeTiles = () => {
    let initialTiles: Tile[] = [];
    let numbers = Array.from({ length: NUM_TILES * NUM_TILES - 1 }, (_, index) => index + 1);
    numbers.push(0); // Empty tile

    // Shuffle numbers randomly
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Create tiles based on shuffled numbers
    for (let i = 0; i < NUM_TILES * NUM_TILES; i++) {
      initialTiles.push({ key: numbers[i], position: i });
    }

    setTiles(initialTiles);
    setSolved(false);
    setRerender(prev => prev + 1); // Increment rerender key to force UI update
    setElapsedTime(0); // Reset elapsed time
    setTimerOn(true); // Start the timer
  };

  const swapTiles = (emptyIndex: number, tileIndex: number) => {
    const updatedTiles = [...tiles];
    [updatedTiles[emptyIndex], updatedTiles[tileIndex]] = [updatedTiles[tileIndex], updatedTiles[emptyIndex]];

    // Update positions after swapping
    updatedTiles.forEach((tile, index) => {
      tile.position = index;
    });

    setTiles(updatedTiles);
    checkSolved(updatedTiles);
    setRerender(prev => prev + 1); // Increment rerender key to force UI update
  };

  const checkSolved = (currentTiles: Tile[]) => {
    const isSolved = currentTiles.every((tile, index) => tile.key === index + 1 || tile.key === 0);
    setSolved(isSolved);
    setTimerOn(false); // Stop the timer when solved
    setModalVisible(isSolved); // Show modal when solved
  };

  const moveTile = (position: number) => {
    const emptyIndex = tiles.findIndex(tile => tile.key === 0);
    const tileIndex = tiles.findIndex(tile => tile.position === position);
    if (canMoveTile(emptyIndex, tileIndex)) {
      swapTiles(emptyIndex, tileIndex);
      setTimerOn(true); // Ensure timer remains on after each move
    }
  };

  const canMoveTile = (emptyIndex: number, tileIndex: number): boolean => {
    const emptyPosition = tiles[emptyIndex].position;
    const tilePosition = tiles[tileIndex].position;
    return (
      Math.abs(emptyPosition - tilePosition) === 1 || // Check horizontally adjacent
      Math.abs(emptyPosition - tilePosition) === NUM_TILES // Check vertically adjacent
    );
  };

  const renderTiles = () => {
    return tiles.map(tile => {
      const leftPosition = (tile.position % NUM_TILES) * TILE_SIZE;
      const topPosition = Math.floor(tile.position / NUM_TILES) * TILE_SIZE;

      // Calculate the position of the slice within the puzzle image
      const sliceLeft = (tile.key % NUM_TILES) * TILE_SIZE;
      const sliceTop = Math.floor(tile.key / NUM_TILES) * TILE_SIZE;

      return (
        <TouchableOpacity
          key={tile.key.toString()}
          style={[styles.tile, {
            left: leftPosition,
            top: topPosition,
          }]}
          onPress={() => moveTile(tile.position)}
        >
          {tile.key !== 0 && (
            <ImageBackground
              source={puzzleImages[currentImageIndex]}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                overflow: 'hidden',
              }}
              imageStyle={{
                resizeMode: 'cover',
                position: 'absolute',
                left: -sliceLeft,
                top: -sliceTop,
                width: NUM_TILES * TILE_SIZE,
                height: NUM_TILES * TILE_SIZE,
              }}
            />
          )}
        </TouchableOpacity>
      );
    });
  };

  const restartGame = () => {
    setModalVisible(false); // Hide modal
    initializeTiles(); // Restart the game
  };

  const nextPicture = () => {
    const newIndex = (currentImageIndex + 1) % puzzleImages.length;
    setCurrentImageIndex(newIndex);
    restartGame(); // Restart the game with the new image
  };

  return (
    <View key={rerender} style={styles.container}>
      <Text style={styles.title}>Sliding Tile Puzzle</Text>
      <Text style={styles.title}> Time: {elapsedTime} seconds</Text>
      <View style={styles.board}>
        {renderTiles()}
      </View>
      <Image
        source={puzzleImages[currentImageIndex]}
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          width: TARGET_IMAGE_SIZE,
          height: TARGET_IMAGE_SIZE,
          resizeMode: 'cover',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#999',
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Congratulations!</Text>
            <Text style={styles.modalText}>You have finished the puzzle in {elapsedTime} seconds.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restartGame}>
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <TouchableOpacity style={styles.button1} onPress={initializeTiles}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={nextPicture}>
        <Text style={styles.buttonText}>Next Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  board: {
    position: 'relative',
    width: NUM_TILES * TILE_SIZE + 10,
    height: NUM_TILES * TILE_SIZE + 10,
    backgroundColor: '#000',
    borderWidth: 6,
    borderColor: '#000',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4287f5',
    borderRadius: 5,
    marginLeft: 10,
    
  },
  button1: {
    position: 'absolute',
  
    bottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4287f5',
    borderRadius: 5,
    marginLeft: 10,
    width: 140,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4287f5',
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;
