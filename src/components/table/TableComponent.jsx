import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Avatar, List, Skeleton, Switch,Pagination } from 'antd';

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
  background-color :#fff;
  border-bottom:1px solid #f4f4f4;
  color:#868686;
  font-size:13px;

  &:hover {
    background-color: ${(props) => (props.isCheckbox ? '#f4f4f4' : '#ddd')};
  }
`;

const StyledTd = styled.td`
  padding: 10px;
  font-size:12px;
  color:#344767;
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  color: ${(props) => (props.active ? '#fff' : '#000')};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

// Table Component
const TableComponent = ({ data, loading ,columns,  showCheckbox = true , onSelectRows, pageInfo, handlePageChange}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const pageSize = pageInfo.pageSize;
  const currentPage = pageInfo.pageNum;
  const total = pageInfo.total;
  
  const originalData = [...data];

  const sortedData = (() => {
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
  })();

  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentData = sortedData.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    if (currentData.length > 0) {
      const allKeys = currentData.map(row => row[columns[0].key]);
      setSelectAll(allKeys.every(key => selectedRows.has(key)));
    } else {
      setSelectAll(false); // 데이터가 없으면 전체 선택을 false로 설정
    }
  }, [selectedRows, currentData, columns]);
  

  const handleSort = (columnKey) => {
    let direction = 'ascending';
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'none';
      } else {
        direction = 'ascending';
      }
    }

    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (rowKey, event) => {
    if (event.target.type === 'checkbox') {
      return; // 체크박스 클릭 시 행 클릭 이벤트를 실행하지 않습니다.
    }

    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowKey)) {
        newSelection.delete(rowKey);
      } else {
        newSelection.add(rowKey);
      }

      // 선택된 행을 부모 컴포넌트로 전달
      onSelectRows([...newSelection]); 

      return newSelection;
    });
  };

  // 전체 선택 체크박스 처리
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      onSelectRows([]); // 전체 선택 해제 시 빈 배열 전달
    } else {
      const allKeys = currentData.map(row => row[columns[0].key]);
      setSelectedRows(new Set(allKeys));
      onSelectRows(allKeys); // 전체 선택 시 모든 키 전달
    }
  };

  const handleCheckboxChange = (rowKey, event) => {
    event.stopPropagation();
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowKey)) {
        newSelection.delete(rowKey);
      } else {
        newSelection.add(rowKey);
      }

      // 선택된 행을 부모 컴포넌트로 전달
      onSelectRows([...newSelection]); 

      return newSelection;
    });
  };

  //로딩중인 경우 스켈레톤 화면 출력
  if(!loading) {
    return (
      <TableWrapper>
        <StyledTable style = {{display:'flex', gap:20, flexDirection:'column'}}>
          <Skeleton active/> 
          <Skeleton active/> 
        </StyledTable>

      <PaginationWrapper>
          <Skeleton.Button active/>
      </PaginationWrapper>
    </TableWrapper>
    )
  } else {
    return (
      <TableWrapper>
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
                .filter((column) => !column.hidden) // Filter out hidden columns
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
                      checked={selectedRows.has(row[columns[0].key])}
                      onChange={(event) => handleCheckboxChange(row[columns[0].key], event)}
                    />
                  </CheckboxTd>
                )}
                {columns
                  .filter((column) => !column.hidden) // Filter out hidden columns
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
  
        <PaginationWrapper>
        <Pagination
              total={total}
              showTotal={(total) => `Total ${total} items`}
              defaultPageSize={pageSize}
              defaultCurrent={1}
              onChange={(index) => {
                handlePageChange(index)
              }}
            />
        </PaginationWrapper>
      </TableWrapper>
    );
  }
};

export default TableComponent;
