import { useNavigate } from "react-router";
import styles from "./MainTable.module.css";

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export default function Table<T>({ data, columns }: TableProps<T>) {
  const navigate = useNavigate();

  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div key={column.header}>
            <h3>{column.header}</h3>
          </div>
        ))}
      </div>

      <div className={styles.tableRows}>
        {data.map((item, index) => (
          <div
            className={styles.tableRow}
            key={index}
            onClick={
              item.hasOwnProperty("redirect")
                ? //@ts-ignore
                  () => navigate(item.redirect)
                : null
            }
          >
            {columns.map((column) => (
              <div key={column.header}>{column.render(item)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
