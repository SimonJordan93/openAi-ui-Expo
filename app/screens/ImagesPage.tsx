import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useApi } from "../hooks/useApi";

const ImagesPage = () => {
  // useState hook initializes and manages component state.

  // State to manage the value of the TextInput.
  const [input, setInput] = useState("");

  // Using the custom hook to get the `generateImage` function.
  const { generateImage } = useApi();

  // State to hold the URL or path of the generated image.
  const [image, setImage] = useState("");

  // State to manage the loading status. Used to show or hide the ActivityIndicator.
  const [loading, setLoading] = useState(false);

  // Asynchronous function that handles the generation of the image based on the entered input.
  const onGenerateImage = async () => {
    setLoading(true); // Set loading to true to show the spinner.
    const image = await generateImage(input); // Call the API (or function) to generate the image.
    console.log(image); // Logging the generated image path or URL for debugging.

    // Updating the state with the generated image.
    setImage(image || "");

    setLoading(false); // Set loading to false to hide the spinner.
    setInput(""); // Resetting the input for a fresh prompt.
  };

  // The JSX returned defines the UI of the component.
  return (
    <View style={styles.container}>
      {/* TextInput for user to enter the prompt for image generation. */}
      <TextInput
        value={input} // Current value of the TextInput.
        onChangeText={setInput} // Function to update state on text change.
        style={styles.input} // Styling for the TextInput.
        placeholder="Enter your prompt here" // Placeholder text.
        editable={!loading} // Makes input non-editable during loading.
        autoCorrect={false} // Disables auto-correct feature.
      />

      {/* TouchableOpacity acts like a button to trigger the image generation. */}
      <TouchableOpacity
        style={styles.button}
        onPress={onGenerateImage} // Function called when the button is pressed.
        disabled={loading} // Disabling the button during loading.
      >
        <Text style={styles.buttonText}>Generate image</Text>
      </TouchableOpacity>

      {/* Loading spinner that's displayed while waiting for the image generation. */}
      {loading && <ActivityIndicator style={{ marginTop: 10 }} size="large" />}

      {/* Display the generated image if it's available. */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#18191a",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 20,
    resizeMode: "contain",
  },
});

export default ImagesPage;
