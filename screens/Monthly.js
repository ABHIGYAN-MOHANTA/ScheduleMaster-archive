import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Monthly = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [monthlyEvents, setMonthlyEvents] = useState([]);

  useEffect(() => {
    loadMonthlyEvents();
  }, []);

  useEffect(() => {
    saveMonthlyEvents();
  }, [monthlyEvents]);

  const loadMonthlyEvents = async () => {
    try {
      const storedMonthlyEvents = await AsyncStorage.getItem("monthlyEvents");
      if (storedMonthlyEvents) {
        setMonthlyEvents(JSON.parse(storedMonthlyEvents));
      }
    } catch (error) {
      console.error("Error loading monthlyEvents:", error);
    }
  };

  const saveMonthlyEvents = async () => {
    try {
      await AsyncStorage.setItem(
        "monthlyEvents",
        JSON.stringify(monthlyEvents)
      );
    } catch (error) {
      console.error("Error saving monthlyEvents:", error);
    }
  };

  const handleAddEvent = () => {
    if (
      eventTitle.trim() === "" ||
      startTime.trim() === "" ||
      endTime.trim() === ""
    ) {
      return;
    }
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      startTime,
      endTime,
    };
    setMonthlyEvents([...monthlyEvents, newEvent]);
    setEventTitle("");
    setStartTime("");
    setEndTime("");
  };

  const handleDeleteEvent = (id) => {
    const updatedMonthlyEvents = monthlyEvents.filter(
      (event) => event.id !== id
    );
    setMonthlyEvents(updatedMonthlyEvents);
  };

  const handleDeleteAllMonthlyEvents = () => {
    setMonthlyEvents([]);
    AsyncStorage.removeItem("monthlyEvents");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.inputTwo}
            placeholder="Start Time"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={styles.inputTwo}
            placeholder="End Time"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>Add Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={handleDeleteAllMonthlyEvents}
          >
            <Text style={styles.deleteAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={monthlyEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.eventTime}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
              <Ionicons name="ios-trash" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6F61",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteAllButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteAllButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  eventInfo: {
    flex: 1,
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  innerInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputTwo: {
    width: "49%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    color: "#333",
  },
});

export default Monthly;
