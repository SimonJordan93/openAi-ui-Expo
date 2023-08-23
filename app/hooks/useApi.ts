// Importing necessary modules
import AsyncStorage from "@react-native-async-storage/async-storage"; // Persistent storage in React Native
import { useEffect, useState } from "react"; // React hooks for side effects and state management
import { BehaviorSubject } from "rxjs"; // Observable pattern for managing data streams
import { OpenAI } from "openai"; // OpenAI SDK for working with the OpenAI API
import { STORAGE_API_KEY } from "../constants/constants"; // Constants file where API Key is defined
import { Alert } from "react-native"; // React Native component to display alerts

// Enumeration to define message creators
export enum Creator {
  Me = 0,
  Bot = 1,
}

// Interface for messages
export interface Message {
  text: string; // Content of the message
  from: Creator; // Who sent the message (Me or Bot)
}

// Observable subject to hold the array of messages and notify changes
let messageSubject: BehaviorSubject<Message[]>;

export const useApi = () => {
  // Initial dummy message from the bot
  const dummyMessages = [
    {
      text: "Hello, how can i help you today?",
      from: Creator.Bot,
    },
  ];

  // State hook to hold the current array of messages
  const [messages, setMessages] = useState<Message[]>();

  // Ensure single instance of messageSubject, initialize if it doesn't exist
  if (!messageSubject) {
    messageSubject = new BehaviorSubject<Message[]>(dummyMessages);
  }

  // Side effect to subscribe to changes in the messageSubject
  useEffect(() => {
    const subscription = messageSubject.subscribe((messages) => {
      console.log("NEW MESSAGE");
      setMessages(messages); // Update the state with new messages
    });

    // Cleanup function to unsubscribe when component is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to get a completion/response from the OpenAI API based on a given prompt
  const getCompletion = async (prompt: string) => {
    // Retrieve the API key from storage
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    // If the API key is not present, show an error alert
    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    // Add the user's own message to the messageSubject
    const newMessage = {
      text: prompt,
      from: Creator.Me,
    };
    messageSubject.next([...messageSubject.value, newMessage]);

    // Initialize OpenAI instance with the API key
    const openai = new OpenAI({ apiKey });

    // Get a completion from the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Using the GPT-3.5 model
      messages: [{ role: "user", content: prompt }], // Sending the user's message as the input
    });

    // Extract the bot's response from the API's result
    const response =
      completion.choices[0].message?.content?.trim() ||
      "Sorry we have an issue !"; // Default error message

    // Add the bot's response to the messageSubject
    const botMessage = {
      text: response,
      from: Creator.Bot,
    };
    messageSubject.next([...messageSubject.value, botMessage]);

    return true;
  };

  // Function to generate an image based on a given prompt
  const generateImage = async (prompt: string) => {
    // Retrieve the API key from storage
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    // If the API key is not present, show an error alert
    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    const openai = new OpenAI({ apiKey });

    // Generate an image using the OpenAI API
    const completion = await openai.images.generate({
      prompt: prompt,
      n: 1, // Number of images to generate
      size: "1024x1024", // Image size
    });
    return completion.data[0].url; // Return the URL of the generated image
  };

  // Function to convert speech (audio) to text using the OpenAI API
  const speechToText = async (audioUri: string) => {
    // Retrieve the API key from storage
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    // If the API key is not present, show an error alert
    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    // Prepare the audio data for sending to the API
    const formData = new FormData();
    const imageData = {
      uri: audioUri,
      type: "audio/x-m4a", // Specify the type of audio
      name: "audio.m4a",
    };
    formData.append("file", imageData as unknown as Blob);
    formData.append("model", "whisper-1"); // Using the whisper model

    // Send the audio data to the OpenAI API for transcription
    return fetch(`https://api.openai.com/v1/audio/transcriptions`, {
      method: "POST", // HTTP method
      headers: {
        Authorization: `Bearer ${apiKey}`, // Authorization header with API key
        "Content-Type": "multipart/form-data", // Content type header
      },
      body: formData, // Attach the form data in the body
    }).then((response) => response.json()); // Return the API's JSON response
  };

  // Return the API functions and messages state for use in components
  return {
    messages,
    getCompletion,
    generateImage,
    speechToText,
  };
};
