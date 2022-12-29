import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// Custom Hook
import { useLocalStorage } from './hooks/useLocalStorage';
import { NewNote } from './components/NewNote';
import { NoteList } from './components/NoteList';
import { NoteLayout } from './components/NoteLayout';
import { Note } from './components/Note';
import { EditNote } from './components/EditNote';

export type Note = {
  id: string;
  title: string;
  markdown: string;
  tags: Tag[];
};

export type RawNote = {
  id: string;
  title: string;
  markdown: string;
  tagIds: string[];
};

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData): void => {
    setNotes((previousNotes) => {
      return [
        ...previousNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((previousNotes) => {
      return previousNotes.map((note) =>
        note.id === id
          ? { ...note, ...data, tagIds: tags.map((tag) => tag.id) }
          : note
      );
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const onAddTag = (tag: Tag): void => {
    setTags((previousValues) => [...previousValues, tag]);
  };

  const updateTag = (id: string, label: string): void => {
    setTags((prevTags) =>
      prevTags.map((tag) => (tag.id === id ? { ...tag, label } : tag))
    );
  };

  const deleteTag = (id: string): void => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path='/'
          element={
            <NoteList
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
              availableTags={tags}
              notes={notesWithTags}
            />
          }
        />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={onAddTag}
              availableTags={tags}
            />
          }
        />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />}></Route>
          <Route
            path='edit'
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={onAddTag}
                availableTags={tags}
              />
            }
          ></Route>
        </Route>
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Container>
  );
};

export default App;
