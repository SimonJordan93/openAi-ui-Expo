import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { useApi } from "../hooks/useApi";

const WhisperPage = () => {
  const [result, setResult] = useState("Test");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const { speechToText } = useApi();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    console.log(uri);
    uploadAudio();
  };

  const uploadAudio = async () => {
    const uri = recording?.getURI();
    console.log(uri);

    if (!uri) {
      return;
    }

    setLoading(true);
    try {
      const result = await speechToText(uri);
      console.log(result);
      setResult(result.text);
    } catch (error) {
      console.log(error);
    }
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      {!recording && (
        <TouchableOpacity
          style={styles.button}
          onPress={startRecording}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Start recording</Text>
        </TouchableOpacity>
      )}
      {recording && (
        <TouchableOpacity
          style={styles.buttonStop}
          onPress={stopRecording}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Stop recording</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderradius: 10,
  },
  buttonStop: {
    backgroundColor: "crimson",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default WhisperPage;
