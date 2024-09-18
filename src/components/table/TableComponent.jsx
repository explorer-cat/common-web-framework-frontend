import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';

// Styled components
const TableWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  overflow-x: auto;
  border-radius: 6px;
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  padding: 10px;
  text-align: ${(props) => (props.isCheckbox ? 'center' : props.textAlign || 'left')};
  width: ${(props) => (props.isCheckbox ? '50px' : props.width || 'auto')};
  background-color: #fff;
  border-bottom: 1px solid #f4f4f4;
  color: #868686;
  font-size: 13px;

  &:hover {
    background-color: ${(props) => (props.isCheckbox ? '#f4f4f4' : '#ddd')};
  }
`;

const StyledTd = styled.td`
  padding: 10px;
  font-size: 12px;
  color: #344767;
  text-align: ${(props) => (props.isCheckbox ? props.textAlign : props.textAlign || 'left')};
`;

const StyledTr = styled.tr`
  &:nth-child(even) {
    background-color: #F2FDFF;
  }
  &:hover {
    background-color: #e0e0e0;
    border-radius: 6px;
  }
`;

const CheckboxTd = styled(StyledTd)`
  text-align: center;
`;

// Table Component
const TableComponent = ({ style, data, loading, columns, showCheckbox = true, rowSelection }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const originalData = [...data];

  useEffect(() => {
    console.log('rowSelection', rowSelection);
    setSelectedRows(rowSelection.selectedRowKeys);
  }, [rowSelection]);

  // Sorting
  const sortedData = useMemo(() => {
    if (sortConfig.direction === 'none') {
      return originalData;
    }
    return [...data].sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [data, sortConfig]);

  const currentData = sortedData;

  useEffect(() => {
    if (currentData.length > 0) {
      const allKeys = currentData.map(row => row[columns[0].key]);
      setSelectAll(allKeys.every(key => selectedRows.includes(key)));
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, currentData, columns]);

  // Handle sorting
  const handleSort = (columnKey) => {
    let direction = 'ascending';
    if (sortConfig.key === columnKey) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    setSortConfig({ key: columnKey, direction });
  };

  // Handle row click
  const handleRowClick = (rowKey, event) => {
    if (event.target.type === 'checkbox') {
      return;
    }

    setSelectedRows(prev => {
      const isSelected = prev.includes(rowKey);
      const newSelection = isSelected ? prev.filter(key => key !== rowKey) : [...prev, rowKey];

      rowSelection.onChange(newSelection);
      return newSelection;
    });
  };

  // Handle select all change
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]);
      rowSelection.onChange([]);
    } else {
      const allKeys = currentData.map(row => row[columns[0].key]);
      setSelectedRows(allKeys);
      rowSelection.onChange(allKeys);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (rowKey, event) => {
    event.stopPropagation();
    setSelectedRows(prev => {
      const isSelected = prev.includes(rowKey);
      const newSelection = isSelected ? prev.filter(key => key !== rowKey) : [...prev, rowKey];

      rowSelection.onChange(newSelection);
      return newSelection;
    });
  };

  if (loading) {
    return (
      <TableWrapper>
        <StyledTable style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
          <Skeleton active />
          <Skeleton active />
        </StyledTable>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper style={style}>
      <StyledTable>
        <thead>
          <tr>
            {showCheckbox && (
              <StyledTh isCheckbox>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </StyledTh>
            )}
            {columns
              .filter((column) => !column.hidden)
              .map((column, index) => (
                <StyledTh
                  key={index}
                  width={column.width}
                  textAlign={column.textAlign}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : ''}</span>
                  )}
                </StyledTh>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <StyledTr
              key={rowIndex}
              onClick={(event) => handleRowClick(row[columns[0].key], event)}
            >
              {showCheckbox && (
                <CheckboxTd>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row[columns[0].key])}
                    onChange={(event) => handleCheckboxChange(row[columns[0].key], event)}
                  />
                </CheckboxTd>
              )}
              {columns
                .filter((column) => !column.hidden)
                .map((column, colIndex) => (
                  <StyledTd
                    key={colIndex}
                    isCheckbox={showCheckbox && colIndex === 0}
                    textAlign={column.textAlign}
                  >
                    {row[column.key]}
                  </StyledTd>
                ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default TableComponent;
