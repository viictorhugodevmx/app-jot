export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to Jot',
    content: 'Capture ideas before they disappear.',
    createdAt: 'Today',
  },
  {
    id: 'note-2',
    title: 'React Native Lab',
    content: 'Keep building small apps and learning one concept at a time.',
    createdAt: 'Today',
  },
];
