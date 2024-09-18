import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

// result[DepartmentVO(deptSeq = 1, deptName = 기획부, parentDeptSeq = 0, children = []), DepartmentVO(deptSeq = 2, deptName = 개발부, parentDeptSeq = 0, children = [DepartmentVO(deptSeq = 4, deptName = 서비스 운영팀, parentDeptSeq = 2, children = []), DepartmentVO(deptSeq = 3, deptName = 서비스 개발팀, parentDeptSeq = 2, children = []), DepartmentVO(deptSeq = 3, deptName = 서비스 개발팀, parentDeptSeq = 2, children = [DepartmentVO(deptSeq = 133, deptName = SI 1파트, parentDeptSeq = 3, children = []), DepartmentVO(deptSeq = 133, deptName = SI 1파트, parentDeptSeq = 3, children = [])]), DepartmentVO(deptSeq = 4, deptName = 서비스 운영팀, parentDeptSeq = 2, children = [DepartmentVO(deptSeq = 6, deptName = QA팀, parentDeptSeq = 4, children = []), DepartmentVO(deptSeq = 5, deptName = 인프라팀, parentDeptSeq = 4, children = []), DepartmentVO(deptSeq = 5, deptName = 인프라팀, parentDeptSeq = 4, children = [DepartmentVO(deptSeq = 123, deptName = OA파트, parentDeptSeq = 5, children = []), DepartmentVO(deptSeq = 63, deptName = 인프라2파트, parentDeptSeq = 5, children = []), DepartmentVO(deptSeq = 63, deptName = 인프라2파트, parentDeptSeq = 5, children = []), DepartmentVO(deptSeq = 123, deptName = OA파트, parentDeptSeq = 5, children = [])]), DepartmentVO(deptSeq = 6, deptName = QA팀, parentDeptSeq = 4, children = [])])]), DepartmentVO(deptSeq = 8, deptName = 디자인부, parentDeptSeq = 0, children = []), DepartmentVO(deptSeq = 9, deptName = 영업부, parentDeptSeq = 0, children = [DepartmentVO(deptSeq = 13, deptName = 영업지원팀, parentDeptSeq = 9, children = []), DepartmentVO(deptSeq = 10, deptName = 마케팅팀, parentDeptSeq = 9, children = []), DepartmentVO(deptSeq = 10, deptName = 마케팅팀, parentDeptSeq = 9, children = [DepartmentVO(deptSeq = 132, deptName = 마케팅2파트, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 131, deptName = 마케팅1파트, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 12, deptName = 오프라인 마케팅, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 11, deptName = 온라인 마케팅, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 11, deptName = 온라인 마케팅, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 12, deptName = 오프라인 마케팅, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 131, deptName = 마케팅1파트, parentDeptSeq = 10, children = []), DepartmentVO(deptSeq = 132, deptName = 마케팅2파트, parentDeptSeq = 10, children = [])]), DepartmentVO(deptSeq = 13, deptName = 영업지원팀, parentDeptSeq = 9, children = [])]), DepartmentVO(deptSeq = 14, deptName = 인사부, parentDeptSeq = 0, children = [DepartmentVO(deptSeq = 16, deptName = 평가팀, parentDeptSeq = 14, children = []), DepartmentVO(deptSeq = 15, deptName = 채용팀, parentDeptSeq = 14, children = []), DepartmentVO(deptSeq = 15, deptName = 채용팀, parentDeptSeq = 14, children = []), DepartmentVO(deptSeq = 16, deptName = 평가팀, parentDeptSeq = 14, children = [])]), DepartmentVO(deptSeq = 17, deptName = 재무부, parentDeptSeq = 0, children = [DepartmentVO(deptSeq = 130, deptName = 세무팀, parentDeptSeq = 17, children = []), DepartmentVO(deptSeq = 129, deptName = 회계팀, parentDeptSeq = 17, children = []), DepartmentVO(deptSeq = 129, deptName = 회계팀, parentDeptSeq = 17, children = []), DepartmentVO(deptSeq = 130, deptName = 세무팀, parentDeptSeq = 17, children = [])])]



const { Search } = Input;

// function transformKeys(obj) {
//   if (Array.isArray(obj)) {
//       return obj.map(item => transformKeys(item));
//   } else if (typeof obj === 'object' && obj !== null) {
//       const newObj = {};
//       Object.keys(obj).forEach(key => {
//           // "deptSeq" 키를 "key"로 변환합니다.
//           const newKey = key === 'deptSeq' ? 'key' : key;
//           if (typeof obj[key] === 'object' && obj[key] !== null) {
//               newObj[newKey] = transformKeys(obj[key]);
//           } else {
//               newObj[newKey] = obj[key];
//           }
//       });
//       return newObj;
//   } else {
//       return obj;
//   }
// }

const DeptTree = ({
  selectValue,
  type = 2, //0 =dept, 1 = member , 2 = all
   deptTreeData,
  clickDeptCallback,
  clickMemberCallback,
  outLine  = true,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // const [deptTreeData,setDeptTreeData] = useState([])

  useEffect(() => {
    loadDeptTereData();

    if(selectValue) {
      if(selectValue.type === "-1") {
        console.log("selectValue", selectValue)
      } else {
        setExpandedKeys([selectValue.dept.key])
      }
    }
  }, []);

  const loadDeptTereData = async () => {
    try {
      setExpandedKeys([]);


            //부서 리스트 조회
      adminApi.getSysTreeDept().then((result) => {
        if(result.success) {
          console.log("deptTreeData",deptTreeData)
          // console.log("result.data",  transformKeys(result.data))
          // setDeptTreeData(result.data)
          // setDeptTreeData(result.data);
          // console.log("result.data",removeDuplicateSync(result.data))
          // setDeptTreeData(removeDuplicateSync(result.data))

  // 중복이 제거된 데이터를 얻습니다.
        // const resulzt = removeDuplicates(result.data);
        // console.log(JSON.stringify(result, null, 2));
                  // console.log("clean",resulzt)
          // setDeptTreeData(result.data)
          // setDeptTreeData(result.data)
        }
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = useCallback((e) => {
    const { value } = e.target;

    setSearchValue(value);
    const keys = [];

    const loop = (data, parentKey = '') => {

      data.forEach((item) => {
        if (item.children) {
          loop(item.children, item.key);
        }
        //팀 이름 검색인경우
        if(!item.type || item.type !== -1 ) {
          if (item.title.includes(value) ) {
            // Add all parent keys to expandedKeys
            let parent = item;
            while (parent) {
              keys.push(parent.key);
              parent = data.find((d) => d.key === parent.path);
            }
          }
        } else {
          const findValue = item.name+' '+ item.position +(item.title.length > 0 ? '/'+item.title : '')

          if (findValue.includes(value) ) {
            // Add all parent keys to expandedKeys
            let parent = item;
            while (parent) {
              keys.push(parent.key);
              parent = data.find((d) => d.key === parent.path);
            }
          }
        }
      });
    };

    loop(deptTreeData);

    console.log("keys : ",keys)
    // 검색어가 비어있는 경우 전체 트리를 닫음
    if (value === '') {
      setExpandedKeys([]);
    } else {
      setExpandedKeys(keys);
    }
    setAutoExpandParent(true);
  }, [deptTreeData]);


  const countChildren = (node) => {
    if (node.children) {
      let count = 0;
      node.children.forEach((child) => {
        count += 1 + countChildren(child);
      });
      return count;
    }
    return 0;
  };

const countPeople = (node) => {
  if (node.children) {
    let count = 0;
    node.children.forEach((child) => {
      if (child.type === -1) {
        count += 1;
      }
      count += countPeople(child);
    });
    return count;
  }
  return 0;
};


  //조직도 트리상 조직원인지, 팀인지를 구분해서 렌더링 해주는 필터
const filterMemberOrDept = (item) => {
  const key = item.key;
  const strTitle = item.type !== -1 ? item.title : item.name + ' ' + item.position + (item.title.length > 0 ? '/' + item.title : '');
  const index = strTitle?.indexOf(searchValue);
  const beforeStr = strTitle?.substring(0, index);
  const afterStr = strTitle?.slice(index + searchValue.length);

  const count = countPeople(item); // 변경된 부분

  if (index > -1) {
    if (item.type && item.type === -1) {
      //tree컴포넌트 타입이 0 이면 팀만 선택할수있음.

        return (
          <span onClick={() => clickMemberCallback(item)}>
            {beforeStr}
            <span className="site-tree-search-value" style={{ color: '#f50' }}>{searchValue}2</span>
            {afterStr}
          </span>
        );

      } else {
      return (
        <span style={{ fontWeight: "500" }} onClick={() => clickDeptCallback(item)}>
          {beforeStr}
          <span className="site-tree-search-value" style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
          {count > 0 && ` (${count}명)`}
        </span>
      );
    }
  } else {

    return (
      item.type && item.type === -1  && (type === 1 || type === 2) ? (
        <span onClick={() => clickMemberCallback(item)}>
          {strTitle}
        </span>

      ) : (
        <span style={{ fontWeight: "500" }} onClick={() => clickDeptCallback(item)}>
          {strTitle} {count > 0 && ` (${count}명)`}
        </span>
      ));
  }
};


  const renderTreeNodes = (data) =>
    data.map((item) => {
      const title = filterMemberOrDept(item);

      if (item.children) {
        return { title, key: item.key, children: renderTreeNodes(item.children) };
      }
      return { title, key: item.key };
    });

  const treeData = useMemo(() => renderTreeNodes(deptTreeData), [searchValue, deptTreeData]);

  return (
    <div style={{
      width: 300,
      height: 500,
      padding: 20,
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "scroll",
    }}>
      <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        showLine={outLine}
        switcherIcon={<DownOutlined />}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        defaultSelectedKeys={[selectValue?.dept.key ? selectValue.dept.key.toString() : '']}
      />
    </div>
  );
};

export default DeptTree;
