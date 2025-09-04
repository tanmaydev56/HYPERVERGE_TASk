// components/FaceLivenessCamera.tsx
import React, { useRef, } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { PropsCAMERA } from "@/constants/types";



export default function FaceLivenessCamera({ onCapture }: PropsCAMERA) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  /* ---------- Permission gate ---------- */
  if (!permission) return <Text className="text-center mt-10">Loading…</Text>;
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white mb-4">Camera permission required</Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded"
          onPress={requestPermission}
        >
          <Text className="text-white">Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------- Capture & compress ---------- */
  const takeSelfie = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (!photo) return;

      // Resize + compress
      const compressed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 640 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Ensure ≤ 250 kB
      const { size } = await FileSystem.getInfoAsync(compressed.uri);
      if (size && size > 250 * 1024) {
        const extra = await ImageManipulator.manipulateAsync(
          compressed.uri,
          [],
          { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
        );
        onCapture(extra.uri);
      } else {
        onCapture(compressed.uri);
      }
    } catch (err) {
      Alert.alert("Camera error", err instanceof Error ? err.message : String(err));
    }
  };

  /* ---------- Render ---------- */
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing="front"
      >
        {/* Shutter button */}
        <View className="absolute bottom-10 w-full items-center">
          <TouchableOpacity
            className="bg-primary rounded-full w-20 h-20 items-center justify-center"
            onPress={takeSelfie}
          >
            <Text className="text-white text-xl">📸</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}