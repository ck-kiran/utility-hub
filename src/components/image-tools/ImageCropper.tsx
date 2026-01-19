import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { colors, spacing } from '@/theme';

interface ImageCropperProps {
  imageUri: string;
  onCropChange: (cropArea: CropArea) => void;
  aspectRatio?: number | null; // e.g., 16/9, 1, 4/3, null = free
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
const MIN_SIZE = 50;

export function ImageCropper({ imageUri, onCropChange, aspectRatio }: ImageCropperProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 20,
    y: 20,
    width: MAX_WIDTH - 40,
    height: MAX_WIDTH - 40,
  });

  // Store initial crop area when gesture starts
  const initialCrop = useRef<CropArea>(cropArea);

  const handleImageLoad = (event: {
    nativeEvent: { source: { width: number; height: number } };
  }) => {
    const { width, height } = event.nativeEvent.source;
    const imageAspectRatio = width / height;

    let displayWidth = MAX_WIDTH;
    let displayHeight = MAX_WIDTH / imageAspectRatio;

    if (displayHeight > MAX_WIDTH) {
      displayHeight = MAX_WIDTH;
      displayWidth = MAX_WIDTH * imageAspectRatio;
    }

    setImageDimensions({ width: displayWidth, height: displayHeight });

    // Set initial crop area to 80% of image
    let cropWidth = displayWidth * 0.8;
    let cropHeight = displayHeight * 0.8;

    // Apply aspect ratio if provided
    if (aspectRatio) {
      const availableWidth = displayWidth * 0.8;
      const availableHeight = displayHeight * 0.8;

      if (availableWidth / availableHeight > aspectRatio) {
        // Height is the limiting factor
        cropHeight = availableHeight;
        cropWidth = cropHeight * aspectRatio;
      } else {
        // Width is the limiting factor
        cropWidth = availableWidth;
        cropHeight = cropWidth / aspectRatio;
      }
    }

    const initialCropArea = {
      x: (displayWidth - cropWidth) / 2,
      y: (displayHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    };

    setCropArea(initialCropArea);
    onCropChange(initialCropArea);
  };

  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (imageDimensions.width === 0) return;

    let newWidth = cropArea.width;
    let newHeight = cropArea.height;

    if (aspectRatio) {
      // Adjust to match aspect ratio, keeping width constant
      newHeight = newWidth / aspectRatio;

      // If height exceeds bounds, adjust width instead
      if (newHeight > imageDimensions.height - cropArea.y) {
        newHeight = imageDimensions.height - cropArea.y;
        newWidth = newHeight * aspectRatio;
      }

      // If width exceeds bounds, scale down proportionally
      if (newWidth > imageDimensions.width - cropArea.x) {
        newWidth = imageDimensions.width - cropArea.x;
        newHeight = newWidth / aspectRatio;
      }
    }

    // Center if possible
    const newX = Math.max(0, Math.min(cropArea.x, imageDimensions.width - newWidth));
    const newY = Math.max(0, Math.min(cropArea.y, imageDimensions.height - newHeight));

    const newCrop = { x: newX, y: newY, width: newWidth, height: newHeight };
    setCropArea(newCrop);
    onCropChange(newCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio]);

  // Pan responder for dragging the entire crop area
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      initialCrop.current = { ...cropArea };
    },
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(
        0,
        Math.min(
          imageDimensions.width - initialCrop.current.width,
          initialCrop.current.x + gestureState.dx
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          imageDimensions.height - initialCrop.current.height,
          initialCrop.current.y + gestureState.dy
        )
      );

      const newCrop = {
        ...initialCrop.current,
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
      onPanResponderGrant: () => {
        initialCrop.current = { ...cropArea };
      },
      onPanResponderMove: (_, gestureState) => {
        let newCrop = { ...initialCrop.current };

        switch (corner) {
          case 'tl': {
            // Calculate new position and size
            const newX = Math.max(0, initialCrop.current.x + gestureState.dx);
            const newY = Math.max(0, initialCrop.current.y + gestureState.dy);
            const deltaX = newX - initialCrop.current.x;
            const deltaY = newY - initialCrop.current.y;

            newCrop.x = newX;
            newCrop.y = newY;
            newCrop.width = Math.max(MIN_SIZE, initialCrop.current.width - deltaX);
            newCrop.height = Math.max(MIN_SIZE, initialCrop.current.height - deltaY);

            // Apply aspect ratio constraint
            if (aspectRatio) {
              const targetHeight = newCrop.width / aspectRatio;
              if (targetHeight > MIN_SIZE) {
                newCrop.height = targetHeight;
                newCrop.y = initialCrop.current.y + initialCrop.current.height - targetHeight;
              }
            }
            break;
          }
          case 'tr': {
            const newY = Math.max(0, initialCrop.current.y + gestureState.dy);
            const deltaY = newY - initialCrop.current.y;

            newCrop.y = newY;
            newCrop.width = Math.max(
              MIN_SIZE,
              Math.min(
                imageDimensions.width - initialCrop.current.x,
                initialCrop.current.width + gestureState.dx
              )
            );
            newCrop.height = Math.max(MIN_SIZE, initialCrop.current.height - deltaY);

            // Apply aspect ratio constraint
            if (aspectRatio) {
              const targetHeight = newCrop.width / aspectRatio;
              if (targetHeight > MIN_SIZE) {
                newCrop.height = targetHeight;
                newCrop.y = initialCrop.current.y + initialCrop.current.height - targetHeight;
              }
            }
            break;
          }
          case 'bl': {
            const newX = Math.max(0, initialCrop.current.x + gestureState.dx);
            const deltaX = newX - initialCrop.current.x;

            newCrop.x = newX;
            newCrop.width = Math.max(MIN_SIZE, initialCrop.current.width - deltaX);
            newCrop.height = Math.max(
              MIN_SIZE,
              Math.min(
                imageDimensions.height - initialCrop.current.y,
                initialCrop.current.height + gestureState.dy
              )
            );

            // Apply aspect ratio constraint
            if (aspectRatio) {
              const targetHeight = newCrop.width / aspectRatio;
              if (targetHeight > MIN_SIZE) {
                newCrop.height = Math.min(
                  targetHeight,
                  imageDimensions.height - initialCrop.current.y
                );
              }
            }
            break;
          }
          case 'br': {
            newCrop.width = Math.max(
              MIN_SIZE,
              Math.min(
                imageDimensions.width - initialCrop.current.x,
                initialCrop.current.width + gestureState.dx
              )
            );
            newCrop.height = Math.max(
              MIN_SIZE,
              Math.min(
                imageDimensions.height - initialCrop.current.y,
                initialCrop.current.height + gestureState.dy
              )
            );

            // Apply aspect ratio constraint
            if (aspectRatio) {
              const targetHeight = newCrop.width / aspectRatio;
              if (targetHeight > MIN_SIZE) {
                newCrop.height = Math.min(
                  targetHeight,
                  imageDimensions.height - initialCrop.current.y
                );
              }
            }
            break;
          }
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
    zIndex: 10,
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
