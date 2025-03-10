import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { frogCharacters, backgrounds } from './assets/imageData';
import { messages } from './assets/messages';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedFrog, setSelectedFrog] = useState(frogCharacters[0]);
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showFrogSelector, setShowFrogSelector] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showClickPrompt, setShowClickPrompt] = useState(true);

  // Load saved preferences
  useEffect(() => {
    loadSavedPreferences();
  }, []);

  const loadSavedPreferences = async () => {
    try {
      const savedFrogId = await AsyncStorage.getItem('selectedFrogId');
      const savedBackgroundId = await AsyncStorage.getItem('selectedBackgroundId');
      
      if (savedFrogId) {
        const frog = frogCharacters.find(f => f.id === parseInt(savedFrogId));
        if (frog) setSelectedFrog(frog);
      }
      
      if (savedBackgroundId) {
        const bg = backgrounds.find(b => b.id === parseInt(savedBackgroundId));
        if (bg) setSelectedBackground(bg);
      }
    } catch (error) {
      console.log('Error loading saved preferences:', error);
    }
  };

  const savePreferences = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  const handleFrogPress = () => {
    // Hide the click prompt when the frog is clicked
    setShowClickPrompt(false);
    
    // Get a random message
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
    setShowMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
      // Show the click prompt again after the message disappears
      setTimeout(() => setShowClickPrompt(true), 1000);
    }, 5000);
  };

  const handleFrogSelect = (frog) => {
    setSelectedFrog(frog);
    setShowFrogSelector(false);
    savePreferences('selectedFrogId', frog.id);
  };

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    setShowBackgroundSelector(false);
    savePreferences('selectedBackgroundId', background.id);
  };

  const renderFrogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.selectorItem} 
      onPress={() => handleFrogSelect(item)}
    >
      <Image source={item.image} style={styles.selectorImage} />
      <Text style={styles.selectorText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBackgroundItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.selectorItem} 
      onPress={() => handleBackgroundSelect(item)}
    >
      <Image source={item.image} style={styles.selectorImage} />
      <Text style={styles.selectorText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image */}
      <Image 
        source={selectedBackground.image} 
        style={styles.backgroundImage} 
        resizeMode="cover" 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>上岸蛙</Text>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Frog Character */}
        <TouchableOpacity 
          style={styles.frogContainer} 
          onPress={handleFrogPress}
          activeOpacity={0.7}
        >
          <Image 
            source={selectedFrog.image} 
            style={styles.frogImage} 
            resizeMode="contain" 
          />
          
          {/* Click Prompt */}
          {showClickPrompt && (
            <View style={styles.clickPromptContainer}>
              <Text style={styles.clickPromptText}>点我</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Message Bubble */}
        {showMessage && (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{currentMessage}</Text>
          </View>
        )}
      </View>
      
      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowFrogSelector(true)}
        >
          <Text style={styles.buttonText}>更换蛙蛙</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowBackgroundSelector(true)}
        >
          <Text style={styles.buttonText}>更换背景</Text>
        </TouchableOpacity>
      </View>
      
      {/* Frog Selector Modal */}
      <Modal
        visible={showFrogSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFrogSelector(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择蛙蛙</Text>
            
            <FlatList
              data={frogCharacters}
              renderItem={renderFrogItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.selectorList}
            />
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowFrogSelector(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Background Selector Modal */}
      <Modal
        visible={showBackgroundSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBackgroundSelector(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择背景</Text>
            
            <FlatList
              data={backgrounds}
              renderItem={renderBackgroundItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.selectorList}
            />
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowBackgroundSelector(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  frogContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frogImage: {
    width: '100%',
    height: '100%',
  },
  clickPromptContainer: {
    position: 'absolute',
    top: -30,
    right: -20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  clickPromptText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageBubble: {
    position: 'absolute',
    top: height * 0.15,
    right: width * 0.1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    maxWidth: width * 0.7,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  selectorList: {
    paddingVertical: 10,
  },
  selectorItem: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  selectorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  selectorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
}); 