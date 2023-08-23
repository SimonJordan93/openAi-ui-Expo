// Import necessary components and hooks from React Native and other libraries
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

// Importing AsyncStorage for local storage operations.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import constant for key name under which API key will be stored in AsyncStorage
import { STORAGE_API_KEY } from "../constants/constants";

// Importing a Toast notification component for user feedback.
import Toast from "react-native-root-toast";

// TextInput from the gesture handler is used for user input.
import { TextInput } from "react-native-gesture-handler";

// useNavigation hook is to access the navigation object to handle screen transitions.
import { useNavigation } from "@react-navigation/native";

const SettingsPage = () => {
  // State variable to hold the current value of the API key.
  const [apiKey, setApiKey] = useState("");

  // State variable to check if an API key exists or not.
  const [hasKey, setHasKey] = useState(false);

  // Getting the navigation object to add listeners.
  const navigation = useNavigation();

  // useEffect to add a listener to the navigation.
  // This listener triggers every time the screen gets focus.
  useEffect(() => {
    // Adding a listener to fetch the API key whenever this screen gains focus.
    const unsubscribe = navigation.addListener("focus", () => {
      loadApiKey();
    });

    // Cleanup function to remove the listener when the component is unmounted.
    return unsubscribe;
  }, [navigation]);

  // Function to fetch the API key from local storage.
  const loadApiKey = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_API_KEY);

      // If a value (API key) is found, update the state.
      if (value !== null) {
        setApiKey(value);
        setHasKey(true);
      } else {
        // If no API key is found, reset the state.
        setHasKey(false);
        setApiKey("");
      }
    } catch (e) {
      // In case of any error while fetching, show an alert.
      Alert.alert("Error", "Could not load API key from storage");
    }
  };

  // Function to save the API key to local storage.
  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_API_KEY, apiKey);
      // Update the state to reflect that the API key now exists.
      setHasKey(true);

      // Show a feedback toast to the user indicating success.
      Toast.show("API key saved", {
        duration: Toast.durations.SHORT,
      });
    } catch (e) {
      // In case of any error while saving, show an alert.
      Alert.alert("Error", "Could not save API key to storage");
    }
  };

  // Function to remove the API key from local storage.
  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY);
      // Reset the state to reflect that the API key has been removed.
      setHasKey(false);
      setApiKey("");

      // Show a feedback toast to the user indicating success.
      // (Note: You might want to update the message here as it says "API key saved" which can be confusing.)
      Toast.show("API key saved", {
        duration: Toast.durations.SHORT,
      });
    } catch (e) {
      // In case of any error while removing, show an alert.
      Alert.alert("Error", "Could not remove API key from storage");
    }
  };

  // The rendered component.
  return (
    <View style={styles.container}>
      {hasKey && (
        <>
          {/* If the API key exists, show the user they're set and give an option to remove the key. */}
          <Text style={styles.label}>You are all set !</Text>
          <TouchableOpacity onPress={removeApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}

      {!hasKey && (
        <>
          {/* If no API key is found, allow the user to input and save a new key. */}
          <Text style={styles.label}>API Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            placeholder="Enter your API Key"
          ></TextInput>
          <TouchableOpacity onPress={saveApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
});

export default SettingsPage;
function useLayoutEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
