import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { colors, spacing } from '@/theme';

interface ImageCropperProps {
  imageUri: string;
  onCropChange: (cropArea: CropArea) => void;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_PADDING = spacing[4];
const MAX_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2;

export function ImageCropper({ imageUri, onCropChange }: ImageCropperProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 20,
    y: 20,
    width: MAX_WIDTH - 40,
    height: MAX_WIDTH - 40,
  });

  const handleImageLoad = (event: {
    nativeEvent: { source: { width: number; height: number } };
  }) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = width / height;

    let displayWidth = MAX_WIDTH;
    let displayHeight = MAX_WIDTH / aspectRatio;

    if (displayHeight > MAX_WIDTH) {
      displayHeight = MAX_WIDTH;
      displayWidth = MAX_WIDTH * aspectRatio;
    }

    setImageDimensions({ width: displayWidth, height: displayHeight });

    // Set initial crop area to 80% of image
    const initialCrop = {
      x: displayWidth * 0.1,
      y: displayHeight * 0.1,
      width: displayWidth * 0.8,
      height: displayHeight * 0.8,
    };
    setCropArea(initialCrop);
    onCropChange(initialCrop);
  };

  // Pan responder for dragging the entire crop area
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(
        0,
        Math.min(imageDimensions.width - cropArea.width, cropArea.x + gestureState.dx)
      );
      const newY = Math.max(
        0,
        Math.min(imageDimensions.height - cropArea.height, cropArea.y + gestureState.dy)
      );

      const newCrop = {
        ...cropArea,
        x: newX,
        y: newY,
      };
      setCropArea(newCrop);
      onCropChange(newCrop);
    },
  });

  // Pan responder for corner handles
  const createCornerResponder = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newCrop = { ...cropArea };
        const minSize = 50;

        switch (corner) {
          case 'tl':
            newCrop.x = Math.max(0, cropArea.x + gestureState.dx);
            newCrop.y = Math.max(0, cropArea.y + gestureState.dy);
            newCrop.width = Math.max(minSize, cropArea.width - gestureState.dx);
            newCrop.height = Math.max(minSize, cropArea.height - gestureState.dy);
            break;
          case 'tr':
            newCrop.y = Math.max(0, cropArea.y + gestureState.dy);
            newCrop.width = Math.max(
              minSize,
              Math.min(imageDimensions.width - cropArea.x, cropArea.width + gestureState.dx)
            );
            newCrop.height = Math.max(minSize, cropArea.height - gestureState.dy);
            break;
          case 'bl':
            newCrop.x = Math.max(0, cropArea.x + gestureState.dx);
            newCrop.width = Math.max(minSize, cropArea.width - gestureState.dx);
            newCrop.height = Math.max(
              minSize,
              Math.min(imageDimensions.height - cropArea.y, cropArea.height + gestureState.dy)
            );
            break;
          case 'br':
            newCrop.width = Math.max(
              minSize,
              Math.min(imageDimensions.width - cropArea.x, cropArea.width + gestureState.dx)
            );
            newCrop.height = Math.max(
              minSize,
              Math.min(imageDimensions.height - cropArea.y, cropArea.height + gestureState.dy)
            );
            break;
        }

        setCropArea(newCrop);
        onCropChange(newCrop);
      },
    });
  };

  const tlResponder = createCornerResponder('tl');
  const trResponder = createCornerResponder('tr');
  const blResponder = createCornerResponder('bl');
  const brResponder = createCornerResponder('br');

  if (imageDimensions.width === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: imageUri }}
          style={styles.hiddenImage}
          onLoad={handleImageLoad}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { width: imageDimensions.width, height: imageDimensions.height }]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width: imageDimensions.width, height: imageDimensions.height }]}
        resizeMode="contain"
      />

      {/* Dark overlay */}
      <View style={StyleSheet.absoluteFill}>
        {/* Top overlay */}
        <View style={[styles.overlay, { height: cropArea.y }]} />

        {/* Middle section */}
        <View style={{ flexDirection: 'row', height: cropArea.height }}>
          {/* Left overlay */}
          <View style={[styles.overlay, { width: cropArea.x }]} />

          {/* Crop area */}
          <View
            style={[
              styles.cropArea,
              {
                width: cropArea.width,
                height: cropArea.height,
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Corner handles */}
            <View style={[styles.handle, styles.handleTopLeft]} {...tlResponder.panHandlers} />
            <View style={[styles.handle, styles.handleTopRight]} {...trResponder.panHandlers} />
            <View style={[styles.handle, styles.handleBottomLeft]} {...blResponder.panHandlers} />
            <View style={[styles.handle, styles.handleBottomRight]} {...brResponder.panHandlers} />

            {/* Grid lines */}
            <View style={styles.gridContainer}>
              <View style={[styles.gridLine, styles.gridVertical1]} />
              <View style={[styles.gridLine, styles.gridVertical2]} />
              <View style={[styles.gridLine, styles.gridHorizontal1]} />
              <View style={[styles.gridLine, styles.gridHorizontal2]} />
            </View>
          </View>

          {/* Right overlay */}
          <View style={[styles.overlay, { flex: 1 }]} />
        </View>

        {/* Bottom overlay */}
        <View style={[styles.overlay, { flex: 1 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
  },
  hiddenImage: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  image: {
    backgroundColor: colors.neutral[100],
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropArea: {
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: 12,
  },
  handleTopLeft: {
    top: -12,
    left: -12,
  },
  handleTopRight: {
    top: -12,
    right: -12,
  },
  handleBottomLeft: {
    bottom: -12,
    left: -12,
  },
  handleBottomRight: {
    bottom: -12,
    right: -12,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridVertical1: {
    left: '33.33%',
    width: 1,
    height: '100%',
  },
  gridVertical2: {
    left: '66.66%',
    width: 1,
    height: '100%',
  },
  gridHorizontal1: {
    top: '33.33%',
    height: 1,
    width: '100%',
  },
  gridHorizontal2: {
    top: '66.66%',
    height: 1,
    width: '100%',
  },
});
