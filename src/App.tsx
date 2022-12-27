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
          <Route index element={<Note />}></Route>
          <Route path='edit' element={<h1>Edit</h1>}></Route>
        </Route>
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Container>
  );
};

export default App;
