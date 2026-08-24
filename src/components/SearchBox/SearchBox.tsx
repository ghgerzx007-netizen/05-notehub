import css from "./SearchBox.module.css";
interface SearchBoxProps {
  searchValue: string;
  onSearch: (value: string) => void;
}
export default function SearchBox({ searchValue, onSearch }: SearchBoxProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <div className={css.searchBox}>
      <input
        value={searchValue}
        type="text"
        placeholder="Search notes..."
        onChange={handleSearchChange}
      />
    </div>
  );
}
