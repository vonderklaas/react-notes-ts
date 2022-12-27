import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { Note } from '../App';

type NoteLayoutProps = {
  notes: Note[];
};

export const NoteLayout = ({ notes }: NoteLayoutProps) => {
  // Get id from the URL
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);

  if (note === null) {
    return <Navigate to='/' replace />;
  }

  return <Outlet context={note} />;
};

// Helper function
export const useNote = () => {
  return useOutletContext<Note>();
};
