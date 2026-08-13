export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

import styles from "./MainTable.module.css";

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div key={column.header}>
            <h3>{column.header}</h3>
          </div>
        ))}
      </div>

      {data.map((item, index) => (
        <div className={styles.tableRow} key={index}>
          {columns.map((column) => (
            <div key={column.header}>{column.render(item)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
