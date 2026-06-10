import React from 'react';
import styles from './Table.module.css';

export function Table({ columns, children }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Tr({ onClick, children }) {
  return (
    <tr
      className={onClick ? styles.clickable : ''}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ mono, small, muted, children, style }) {
  return (
    <td
      className={[
        mono  ? styles.mono  : '',
        small ? styles.small : '',
        muted ? styles.muted : '',
      ].join(' ')}
      style={style}
    >
      {children}
    </td>
  );
}
