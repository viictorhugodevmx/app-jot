import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Note } from '../data/notes';

type NoteCardProps = {
  note: Note;
  onPress: () => void;
  onLongPress: () => void;
};

export function NoteCard({
  note,
  onPress,
  onLongPress,
}: NoteCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>{note.createdAt}</Text>
      </View>

      <Text
        numberOfLines={3}
        style={styles.content}
      >
        {note.content}
      </Text>

      <Text style={styles.hint}>
        Tap to edit · Hold to delete
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#292F3A',
    borderRadius: 20,
    backgroundColor: '#181C23',
  },
  cardPressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737C8C',
  },
  content: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#9BA3B0',
  },
  hint: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#596170',
  },
});
