import { useState } from "react";
import css from "../App/App.module.css";
import NoteForm from "../NoteForm/NoteForm.tsx";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import { fetchNotes } from "../services/noteService.ts";
import { useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList.tsx";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Modal from "../Modal/Modal.tsx";
import { useDebounce } from "use-debounce";


type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const {
    data: fetchNotesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", page, debouncedSearchValue],
    queryFn: () => fetchNotes(page, debouncedSearchValue),
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
          <SearchBox searchValue={searchValue} onSearch={setSearchValue}   />
          {!isLoading && !isError && totalPages > 1 && (
            <ReactPaginate 
              pageCount={totalPages} 
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→" className={css.next}
              previousLabel="←" 
            />
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
