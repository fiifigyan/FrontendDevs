import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const CalendarView = ({ events, selectedDate, handleDayPress }) => (
  <View style={styles.container}>
    <Calendar
      onDayPress={handleDayPress}
      markedDates={{
        ...Object.keys(events).reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: 'blue' };
          return acc;
        }, {}),
        [selectedDate]: { selected: true, selectedColor: 'blue' },
      }}
      theme={{
        todayTextColor: '#007BFF',
        arrowColor: '#007BFF',
      }}
    />
    <View style={styles.eventList}>
      <Text style={styles.eventHeader}>
        Events on {selectedDate || 'Select a Date'}
      </Text>
      {selectedDate && events[selectedDate] ? (
        <FlatList
          data={events[selectedDate]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTime}>{item.time}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noEvents}>No events for this day.</Text>
      )}
    </View>
  </View>
);

const Attendance = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Attendance Section</Text>
    {/* Add Attendance content here */}
  </View>
);

const Timetable = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Timetable Section</Text>
    {/* Add Timetable content here */}
  </View>
);

const Events = ({ events }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>All Events</Text>
    <FlatList
      data={Object.entries(events).flatMap(([date, eventList]) =>
        eventList.map((event) => ({
          ...event,
          date,
        }))
      )}
      keyExtractor={(item, index) => `${item.date}-${index}`}
      renderItem={({ item }) => (
        <View style={styles.eventItem}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventTime}>
            {item.date} - {item.time}
          </Text>
        </View>
      )}
    />
  </View>
);

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    '2024-12-15': [{ title: 'Math Exam', time: '10:00 AM' }],
    '2024-12-20': [{ title: 'Christmas Party', time: '2:00 PM' }],
  });

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { backgroundColor: '#f9f9f9' },
        tabBarIndicatorStyle: { backgroundColor: '#007BFF' },
      }}
    >
      <Tab.Screen
        name="Calendar"
        children={() => (
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            handleDayPress={handleDayPress}
          />
        )}
      />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Timetable" component={Timetable} />
      <Tab.Screen name="Events" children={() => <Events events={events} />}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventList: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  eventHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 12,
    color: 'gray',
  },
  noEvents: {
    fontSize: 14,
    color: 'gray',
  },
});

export default CalendarScreen;
