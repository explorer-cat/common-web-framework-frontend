import { api } from '../utils/customAxios';
import {utils} from "../utils/utils";
export const adminApi = {}
const path = '/api/v1/admin'

adminApi.getMember = (requestData) => {
    return new Promise((resolve, reject) => {
        api.get('/api/v1/admin/getMember', { params: requestData }).then(res => {
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    alert("오류 발생");
                    reject(new Error("Response status is not 200"));
                }
            })
            .catch(error => {
                console.error("Error occurred:", error);
                // alert("서버 요청 중 오류가 발생했습니다.");
                reject(error); // 에러를 상위로 전달
            });
    });
};

adminApi.insertMember = async (requestData) => {
    return new Promise((resolve, reject) => {

        //권한을 선택하지 않은경우 일반 사용자로 자동 삽입
        if(!requestData.LEVEL) {
            requestData.LEVEL = 1;
        }

        api.post(path + '/insertMember', requestData)
            .then(res => {
                const data = res.data;
                if (res.status === 200) {
                    resolve(data)
                }
            })
    })
}

adminApi.modifyMember = async (requestData) => {
    return new Promise((resolve, reject) => {
        if(requestData.NAME.length > 10) {
            alert("이름은 10자 이하만 가능합니다.")
            return;
        }
        if(!requestData.EMAIL || requestData.EMAIL.length <= 0) {
            alert("이메일을 입력해주세요.")
            return;
        }
        if(!utils.validateEmail(requestData.EMAIL)) {
            alert("이메일 형식을 확인해주세요.")
            return;
        }
        if(!requestData.NAME || requestData.NAME.length <= 0) {
            alert("사용자 이름을 입력해주세요.")
            return;
        }
        if(requestData.NAME.length > 10) {
            alert("사용자 이름은 10자 이하만 입력해주세요.")
            return;
        }
        if(!requestData.DEPT || requestData.DEPT <= 0) {
            alert("사용자 부서를 선택해주세요.")
            return;
        }
        if(!requestData.POSITION || requestData.POSITION <= 0) {
            alert("사용자 직급을 선택해주세요.")
            return;
        }


        //권한을 선택하지 않은경우 일반 사용자로 자동 삽입
        if(!requestData.LEVEL) {
            requestData.LEVEL = 1;
        }

        api.post(path + '/modifyMember', requestData).then(res => {
                const data = res.data;
                if (res.status === 200) {
                    resolve(data)
                }
            })
    })
}

adminApi.deleteMember = async (requestData) => {
    return new Promise((resolve,reject) => {
        api.post(path + '/deleteMember', requestData)
            .then(res => {
                if(res.status === 200) {
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}

adminApi.getSysPosition = async (requestData) => {
    return new Promise((resolve,reject) => {
        api.get(path + '/sysPosition',requestData)
            .then(res => {
                console.log('res', res);
                if(res.status === 200) {
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}


adminApi.insertSysPosition = async (requestData) => {
    return new Promise((resolve,reject) => {
        api.post(path + '/insertSysPosition',requestData)
            .then(res => {
                if(res.status === 200) {
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}

adminApi.getSysAuth = async () => {
    return new Promise((resolve,reject) => {
        api.get(path + '/sysAuth')
            .then(res => {
                if(res.status === 200) {
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}

adminApi.getSysDept = async () => {
    return new Promise((resolve,reject) => {
        api.get(path + '/sysDept')
            .then(res => {
                if(res.status === 200) {
                    console.log("res",res)
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}


adminApi.getSysTreeDept = async () => {
    return new Promise((resolve,reject) => {
        api.get(path + '/treeDept')
            .then(res => {
                if(res.status === 200) {
                    console.log("res",res)
                    resolve(res.data)
                } else {
                    alert("오류 발생");
                }
            })
    })
}




adminApi.insertDept = async (requestData) => {
    return new Promise((resolve, reject) => {

        api.post(path + '/insertSysDept', requestData)
            .then(res => {
                const data = res.data;
                if (res.status === 200) {
                    resolve(data)
                }
            })
    })
}



