import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Spacing } from '../theme/colors';
import { Zap, ChevronRight } from 'lucide-react-native';

const BikeCard = ({ name, model, status, lastActive, imageUri, onPress }) => {
  const { colors } = React.useContext(ThemeContext);
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image 
            source={typeof imageUri === 'number' ? imageUri : { uri: imageUri }} 
            style={styles.image} 
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
             <Zap size={32} color={colors.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.model}>{model}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {status} • <Text style={styles.lastActive}>{lastActive}</Text>
          </Text>
        </View>
      </View>

      <ChevronRight size={24} color={colors.primary} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const getStyles = (Colors) => StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    height: 60,
  },
  name: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  model: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  lastActive: {
    color: Colors.textSecondary,
  },
  chevron: {
    marginLeft: Spacing.sm,
  }
});

export default BikeCard;
