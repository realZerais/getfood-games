import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

const NUM_TILES = 4; // Adjust this for different puzzle sizes
const TILE_SIZE = 75; // Adjust this for different tile sizes

interface Tile {
  key: number;
  position: number;
}

const App = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [solved, setSolved] = useState<boolean>(false);
  const [rerender, setRerender] = useState<number>(0); // State to force re-render
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null); // Initialize timer ID as null
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    initializeTiles();
  }, []);

  useEffect(() => {
    if (timerOn && !solved) {
      const id = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      setTimerId(id);
    } else {
      if (timerId) clearInterval(timerId);
    }

    return () => {
      if (timerId) clearInterval(timerId);
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
      // Ensure timer remains on after each move
      setTimerOn(true);
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
    return tiles.map(tile => (
      <TouchableOpacity
        key={tile.key.toString()} // Ensure each key is unique
        style={[styles.tile, {
          left: (tile.position % NUM_TILES) * TILE_SIZE,
          top: Math.floor(tile.position / NUM_TILES) * TILE_SIZE,
          backgroundColor: tile.key === 0 ? 'transparent' : '#4287f5',
        }]}
        onPress={() => moveTile(tile.position)}
      >
        <Text style={styles.tileText}>{tile.key !== 0 ? tile.key.toString() : ''}</Text>
      </TouchableOpacity>
    ));
  };

  const restartGame = () => {
    setModalVisible(false); // Hide modal
    initializeTiles(); // Restart the game
  };

  return (
    <View key={rerender} style={styles.container}>
      <Text style={styles.title}>Sliding Tile Puzzle</Text>
      <Text style={styles.title}> Time: {elapsedTime} seconds</Text>
      <View style={styles.board}>
        {renderTiles()}
      </View>
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
      <TouchableOpacity style={styles.button} onPress={initializeTiles}>
        <Text style={styles.buttonText}>Restart</Text>
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
    width: NUM_TILES * TILE_SIZE,
    height: NUM_TILES * TILE_SIZE,
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#999',
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
  tileText: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4287f5',
    borderRadius: 5,
  },
  buttonText: {
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
 