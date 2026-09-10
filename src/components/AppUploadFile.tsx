import { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "./ThemedView";
import { useTheme } from "@contexts/ThemeContext";
import { Colors } from "@theme/colors";
import { FileUploadIcon } from "../svg/file-upload";
import { ThemedText } from "./ThemedText";
import { XMarkIcon } from "../svg/xmark";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const AppUploadFile = () => {
  const { colorScheme } = useTheme();
  const [imageUris, setImageUris] = useState<string[]>([]);

  const handleImagePicker = async () => {
    const remainingSlots = MAX_IMAGES - imageUris.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${MAX_IMAGES} photos.`,
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Allow photo library access to select an image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (result.canceled || !result.assets) return;

      const validAssets: string[] = [];
      let hasOversizedImage = false;

      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
          hasOversizedImage = true;
        } else {
          validAssets.push(asset.uri);
        }
      }

      if (hasOversizedImage) {
        Alert.alert(
          "Some images skipped",
          "One or more selected images exceeded the 5MB limit.",
        );
      }

      if (validAssets.length > 0) {
        setImageUris((prev) => [...prev, ...validAssets].slice(0, MAX_IMAGES));
      }
    } catch {
      Alert.alert("Unable to select image", "Please try again.");
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    setImageUris((prev) => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      <TouchableOpacity
        onPress={handleImagePicker}
        activeOpacity={0.7}
        disabled={imageUris.length >= MAX_IMAGES}
        style={[
          styles.uploadButtonContainer,
          {
            backgroundColor: Colors[colorScheme].cardContentBackground,
            borderColor: Colors[colorScheme].border,
            opacity: imageUris.length >= MAX_IMAGES ? 0.6 : 1,
          },
        ]}
      >
        <ThemedView style={styles.contentContainer}>
          <FileUploadIcon height={24} width={24} />
          <ThemedText style={styles.contentTitle}>
            {imageUris.length >= MAX_IMAGES
              ? "Maximum limit reached"
              : "Tap to upload photos"}
          </ThemedText>
          <ThemedText style={styles.contentSubtitle}>
            {`${imageUris.length}/${MAX_IMAGES} selected (JPG, PNG up to 5MB)`}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>

      {imageUris.length > 0 && (
        <ThemedView
          style={[styles.previewRow, { backgroundColor: "transparent" }]}
        >
          {imageUris.map((uri, index) => (
            <View key={`img-${uri}-${index}`} style={styles.thumbnailContainer}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                accessibilityLabel="Remove image"
                onPress={() => handleRemoveImage(index)}
                style={styles.removeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <XMarkIcon height={12} width={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default AppUploadFile;

const styles = StyleSheet.create({
  container: {},
  uploadButtonContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1.5,
    borderRadius: 10,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    paddingTop: 8, // Gives space for top overflow delete button
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    position: "relative",
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D64545",
    zIndex: 10,
    elevation: 3,
  },
  contentContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  contentTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    marginTop: 8,
  },
  contentSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
