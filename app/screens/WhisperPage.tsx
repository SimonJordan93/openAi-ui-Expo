import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { useApi } from "../hooks/useApi";

const WhisperPage = () => {
  // State to hold the result from the speech-to-text conversion.
  const [result, setResult] = useState("Say something !");

  // Loading state to indicate whether an API request is ongoing.
  const [loading, setLoading] = useState(false);

  // State to hold the recording instance.
  const [recording, setRecording] = useState<Audio.Recording>();

  // Import the speechToText function from the custom hook.
  const { speechToText } = useApi();

  // Function to handle the beginning of an audio recording.
  const startRecording = async () => {
    try {
      // Request audio recording permissions.
      await Audio.requestPermissionsAsync();

      // Set the audio mode to support recording on iOS devices.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start the recording and save the instance to the state.
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      // Log any error that occurs during the recording process.
      console.log(err);
    }
  };

  // Function to handle stopping the audio recording.
  const stopRecording = async () => {
    // Stop the recording.
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();

    // Reset the audio mode to disallow recording.
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    // Trigger the upload function to send the audio for processing.
    uploadAudio();
  };

  // Function to handle uploading the audio and getting the converted text.
  const uploadAudio = async () => {
    // Retrieve the file URI of the recorded audio.
    const uri = recording?.getURI();

    // If no URI exists, exit the function.
    if (!uri) {
      return;
    }

    // Set loading state to true while processing is happening.
    setLoading(true);
    try {
      // Use the speechToText function to convert the audio to text.
      const result = await speechToText(uri);
      console.log(result);

      // Update the state with the result.
      setResult(result.text);
    } catch (error) {
      // Log any error that occurs during the speech-to-text conversion.
      console.log(error);
    }
    // Reset the loading state to false once processing completes.
    setLoading(false);
  };

  // Render the UI of the page.
  return (
    <View style={styles.container}>
      {/* Render the "Start recording" button if not currently recording. */}
      {!recording && (
        <TouchableOpacity
          style={styles.button}
          onPress={startRecording}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Start recording</Text>
        </TouchableOpacity>
      )}

      {/* Render the "Stop recording" button if currently recording. */}
      {recording && (
        <TouchableOpacity
          style={styles.buttonStop}
          onPress={stopRecording}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Stop recording</Text>
        </TouchableOpacity>
      )}

      {/* Display a loading spinner if the app is processing the audio. */}
      {loading && <ActivityIndicator style={{ marginTop: 10 }} size="large" />}

      {/* Display the resulting text after speech-to-text conversion. */}
      {result && <Text style={styles.text}>{result}</Text>}
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
