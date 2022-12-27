import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import { Routes, Route, Navigate } from 'react-router-dom';

import { useMemo } from 'react';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';

// Components / Pages
import { NewNote } from './components/NewNote';
import { NoteList } from './components/NoteList';
import { NoteLayout } from './components/NoteLayout';

import { v4 as uuidV4 } from 'uuid';
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
      return previousNotes.map((note) => {
        if (note.id === id) {
          // Saving all existing data and overwriting with new data
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  const onAddTag = (tag: Tag): void => {
    setTags((previousValues) => [...previousValues, tag]);
  };

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path='/'
          element={<NoteList availableTags={tags} notes={notesWithTags} />}
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
