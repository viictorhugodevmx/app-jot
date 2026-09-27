import { useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { NoteCard } from './src/components/NoteCard';
import {
  INITIAL_NOTES,
  Note,
} from './src/data/notes';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isEditing = editingNoteId !== null;

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0;

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredNotes = notes.filter((note) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
      note.title.toLowerCase().includes(normalizedSearch) ||
      note.content.toLowerCase().includes(normalizedSearch)
    );
  });

  function resetForm() {
    setTitle('');
    setContent('');
    setEditingNoteId(null);
    Keyboard.dismiss();
  }

  function handleSubmitNote() {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      return;
    }

    if (editingNoteId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title: cleanTitle,
                content: cleanContent,
              }
            : note,
        ),
      );

      resetForm();
      return;
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: cleanTitle,
      content: cleanContent,
      createdAt: 'Now',
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setSearchQuery('');
    resetForm();
  }

  function handleEditNote(note: Note) {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSearchQuery('');
  }

  function handleDeleteNote(note: Note) {
    Alert.alert(
      'Delete note',
      `Do you want to delete "${note.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotes((currentNotes) =>
              currentNotes.filter(
                (currentNote) => currentNote.id !== note.id,
              ),
            );

            if (editingNoteId === note.id) {
              resetForm();
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.screen}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={filteredNotes}
            keyExtractor={(note) => note.id}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onPress={() => handleEditNote(item)}
                onLongPress={() => handleDeleteNote(item)}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.eyebrow}>
                  QUICK NOTES
                </Text>

                <Text style={styles.title}>Jot</Text>

                <Text style={styles.subtitle}>
                  Capture it now. Organize it later.
                </Text>

                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>
                    YOUR NOTES
                  </Text>

                  <Text style={styles.summaryValue}>
                    {notes.length}
                  </Text>
                </View>

                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search notes..."
                  placeholderTextColor="#69717F"
                  returnKeyType="search"
                  style={styles.searchInput}
                />

                <View
                  style={[
                    styles.formCard,
                    isEditing && styles.formCardEditing,
                  ]}
                >
                  <Text style={styles.formLabel}>
                    {isEditing ? 'EDIT NOTE' : 'NEW NOTE'}
                  </Text>

                  <Text style={styles.formTitle}>
                    {isEditing
                      ? 'Update your thought'
                      : "What's on your mind?"}
                  </Text>

                  {isEditing && (
                    <Text style={styles.editingHint}>
                      You're editing an existing note.
                    </Text>
                  )}

                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Note title"
                    placeholderTextColor="#69717F"
                    returnKeyType="next"
                    style={styles.titleInput}
                  />

                  <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your note..."
                    placeholderTextColor="#69717F"
                    multiline
                    textAlignVertical="top"
                    style={styles.contentInput}
                  />

                  <Pressable
                    disabled={!canSubmit}
                    onPress={handleSubmitNote}
                    style={({ pressed }) => [
                      styles.addButton,
                      !canSubmit && styles.addButtonDisabled,
                      pressed &&
                        canSubmit &&
                        styles.addButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addButtonText,
                        !canSubmit &&
                          styles.addButtonTextDisabled,
                      ]}
                    >
                      {isEditing ? 'Save Changes' : 'Add Note'}
                    </Text>
                  </Pressable>

                  {isEditing && (
                    <Pressable
                      onPress={resetForm}
                      style={({ pressed }) => [
                        styles.cancelButton,
                        pressed && styles.cancelButtonPressed,
                      ]}
                    >
                      <Text style={styles.cancelButtonText}>
                        Cancel Editing
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Recent notes
                  </Text>

                  <Text style={styles.sectionCount}>
                    {filteredNotes.length}
                  </Text>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔎</Text>

                <Text style={styles.emptyTitle}>
                  No notes found
                </Text>

                <Text style={styles.emptyText}>
                  Try a different search.
                </Text>
              </View>
            }
            ListFooterComponent={
              filteredNotes.length > 0 ? (
                <View style={styles.footer}>
                  <Text style={styles.footerEmoji}>
                    ✍️
                  </Text>

                  <Text style={styles.footerText}>
                    Your next idea deserves a place to live.
                  </Text>
                </View>
              ) : null
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />

          <StatusBar style="light" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F1217',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#7D8696',
  },
  title: {
    marginTop: 8,
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#98A0AD',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFB84D',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#563700',
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#251600',
  },
  searchInput: {
    minHeight: 52,
    marginTop: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#303743',
    borderRadius: 14,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#181C23',
  },
  formCard: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#292F3A',
    borderRadius: 20,
    backgroundColor: '#181C23',
  },
  formCardEditing: {
    borderColor: '#FFB84D',
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#7D8696',
  },
  formTitle: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editingHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#FFB84D',
  },
  titleInput: {
    minHeight: 52,
    marginTop: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#303743',
    borderRadius: 14,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#0F1217',
  },
  contentInput: {
    minHeight: 120,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#303743',
    borderRadius: 14,
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    backgroundColor: '#0F1217',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#FFB84D',
  },
  addButtonDisabled: {
    backgroundColor: '#292E37',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#251600',
  },
  addButtonTextDisabled: {
    color: '#666E7B',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3A414D',
    borderRadius: 14,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9BA3B0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#747D8C',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 34,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#7D8696',
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
    padding: 20,
  },
  footerEmoji: {
    fontSize: 28,
  },
  footerText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    color: '#747D8C',
  },
});
