import { useState } from "react";
import css from "../App/App.module.css";
import NoteForm from "../NoteForm/NoteForm.tsx";
import { fetchNotes } from "../../services/noteService.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList.tsx";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Modal from "../Modal/Modal.tsx";
import { useDebounce } from "use-debounce";
import Paginate from "../Pagination/Pagination.tsx";




export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
  }
  
  const {
    data: fetchNotesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", page, debouncedSearchValue],
    queryFn: () => fetchNotes(page, debouncedSearchValue),
    placeholderData: keepPreviousData,
    
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (isError) {
    return <div>Error occurred.</div>;
  }
  const notes = fetchNotesResponse?.notes ?? [];
  const totalPages = fetchNotesResponse?.totalPages ?? 1;
  
  return (
    <>
      <div className={css.app} >
        <header className={css.toolbar}>
          <SearchBox searchValue={searchValue} onSearch={handleSearch}  />
          {!isLoading && !isError && totalPages > 1 && (
            <Paginate totalPages={ totalPages } page={page} setPage={setPage} />
          )}
          <button onClick={() => setIsOpen(true)} className={css.button}>
            Create note +
          </button>
        </header>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <div className={css.modalContent}>
              <NoteForm onClose={() => setIsOpen(false)} />
            </div>
          </Modal>
        )}
        {notes.length === 0 && !isLoading && !isError ? (
          <p className={css.noNotes}>No notes found.</p>
        ) : (
          <NoteList notes={notes} />
        )}
      </div>
    </>
  );
}
