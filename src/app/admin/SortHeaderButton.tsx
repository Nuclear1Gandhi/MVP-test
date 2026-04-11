export type SortColumn = "identifier" | "type" | "user" | "submitted";

export type SortDirection = "asc" | "desc";

export type SortHeaderButtonProps = {
  column: SortColumn;
  label: string;
  activeColumn: SortColumn;
  sortDir: SortDirection;
  onSort: (column: SortColumn) => void;
};

/**
 * * Accessible sort control for a column header.
 */
export function SortHeaderButton({
  column,
  label,
  activeColumn,
  sortDir,
  onSort,
}: SortHeaderButtonProps) {
  const isActive = activeColumn === column;
  const ariaSort = isActive
    ? sortDir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th className="p-3 font-medium text-app-text" scope="col" aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => {
          onSort(column);
        }}
        className="inline-flex cursor-pointer select-none items-center gap-1 rounded-md px-1.5 py-1 -mx-1.5 -my-1 text-left transition-[color,background-color] duration-150 ease-out hover:bg-app-offset hover:text-app-primary active:bg-app-dynamic"
      >
        {label}
        {isActive ? (sortDir === "asc" ? "↑" : "↓") : null}
      </button>
    </th>
  );
}
