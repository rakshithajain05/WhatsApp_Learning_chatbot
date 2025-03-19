import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const subjects = [
  'General',
  'Mathematics',
  'Science',
  'Language',
  'History',
  'Geography',
];

type SubjectSelectorProps = {
  currentSubject: string;
  onSelectSubject: (subject: string) => void;
};

export function SubjectSelector({ currentSubject, onSelectSubject }: SubjectSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject}
          style={[
            styles.subjectButton,
            currentSubject === subject && styles.selectedSubject,
          ]}
          onPress={() => onSelectSubject(subject)}
        >
          <Text
            style={[
              styles.subjectText,
              currentSubject === subject && styles.selectedSubjectText,
            ]}
          >
            {subject}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  selectedSubject: {
    backgroundColor: '#128C7E',
  },
  subjectText: {
    color: '#333',
    fontSize: 14,
  },
  selectedSubjectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});