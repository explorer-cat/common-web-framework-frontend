export const utils = {}
let allSymbol = [];

//현재 사용자가 웹 화면에서 보고있는지, 디바이스 화면에서 보고있는지 확인
utils.isWeb = () => {
    if(!window.ReactNativeWebView) {
        return true;
    } else {
        return false;
    }
}

/**
 * 이메일 주소를 검증하는 함수입니다.
 * @auther 최성우
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} - 이메일 주소가 유효한 경우 true, 그렇지 않으면 false
 */

utils.checkEmailValid = (email) => {
    // 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // 정규식 테스트
  return emailRegex.test(email);
}

//세션에 현재 사용자 정보를 업데이트함.
utils.updateUserInfoSession = async (idx,callback) => {
    let user;
    // userApi.getUserInfo(idx).then((user)=>{
    //     // console.log("useruser : ",user)
    //     removeSessionItem("userInfo")
    //     setSessionItem("userInfo",user.data);
    //     return callback(user.data);
    // })

}

/**
 * 레전더리한 함수! 주어진 리스트에서 특정 키의 값을 찾아냅니다.
 * @param {Array} list 찾을 리스트
 * @param {string} propertyName 찾을 키 이름
 * @param {any} propertyValue 찾을 값
 * @returns {Object|undefined} 찾은 객체, 찾지 못한 경우 undefined
 */

utils.findObjectByProperty = (list, propertyName, propertyValue) => {
    let value = list.find(item => item[propertyName] === propertyValue);
    return value ? value : '';
}

/**
 * 배열 내에서 특정 키의 값을 찾는 함수
 * @param {Array} array 대상 배열
 * @param {string} keyToFind 찾고자 하는 키
 * @returns {Array} 찾은 값들의 배열
 * @example
 * const array = [
 *   { key: 1, test: 2 },
 *   { key: 3, test: 4 },
 *   { key: 1, test: 6 },
 * ];
 * const elementsWithKeyOne = findElementsByKey(array, 'key', 1);
 * console.log(elementsWithKeyOne); // [{ key: 1, test: 2 }, { key: 1, test: 6 }]
 * @author 최성우
 * @updated 23.11.30
 */
utils.findElementsByKey = (array, keyToFind, valueToFind) => {
    const foundElements = [];

    for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        if (obj.hasOwnProperty(keyToFind) && obj[keyToFind] === valueToFind) {
            foundElements.push(obj);
        }
    }

    return foundElements;
}


/**
 * 객체 내에 특정 키가 있는지 확인하는 함수
 * @param {Object} obj 대상 객체
 * @param {string} key 찾고자 하는 키
 * @returns {boolean} 키의 존재 여부를 나타내는 불리언 값
 * @example
 * const obj = { error: { message: "This is not a verified IP.", name: "no_authorization_ip" } };
 * console.log(utils.isHasObjectKey(obj, 'error')); // true
 * console.log(utils.isHasObjectKey(obj, 'message')); // false
 * @author 최성우
 * @updated 23.11.30
 */
utils.isHasObjectKey  = (obj,key) => {
    return key in obj;
}


/**
 * 객체 내에서 주어진 값에 해당하는 키들을 찾는 함수
 * @param {Object} obj 대상 객체
 * @param {*} value 찾고자 하는 값
 * @returns {Array} 주어진 값과 일치하는 키들의 배열
 * @example
 * const obj = {
 *   service: false,
 *   marketting: 'hello',
 *   gps: 'world',
 *   notification: true,
 * };
 * const keysWithGivenValue = findKeysByValue(obj, 'world');
 * console.log(keysWithGivenValue); // ['gps']
 * @uthor 최성우
 * @updated 23.11.30
 */
utils.findKeysByValue = (obj, value) => {
    const keys = [];

    for (const [key, val] of Object.entries(obj)) {
        if (val === value) {
            keys.push(key);
        }
    }

    return keys.length > 0 ? keys : null; // 값이 없으면 null 반환
}



/**
 * 배열 안의 각 객체에 특정 키와 값을 추가하는 함수
 * @param {Array} list 대상 배열
 * @param {string} key 추가할 키
 * @param {any} value 추가할 값
 * @returns {void}
 * @example
 * const list = [{}, {}, {}];
 * addKeyValueToList(list, 'name', 'John');
 * console.log(list); // [{ name: 'John' }, { name: 'John' }, { name: 'John' }]
 * @author 최성우
 * @updated 2023-11-30
 */
utils.addKeyValueToList = (list, key, value) => {
    list.forEach(item => {
        item[key] = value;
    });
}


/**
 * 배열 내에서 특정 키의 값을 찾아 해당 값을 변경하는 함수 (깊이 있는 객체 내의 특정 키 변경)
 * @param {Array} array 대상 배열
 * @param {string} keyToFind 찾고자 하는 키
 * @param {*} valueToFind 찾고자 하는 값
 * @param {string} innerKeyToChange 변경할 내부 키
 * @param {*} newInnerValue 변경할 내부 키의 새로운 값
 * @returns {Array} 변경된 값들의 배열
 * @example
 * const array = [
 *   { checked: true, key: 0, nestedObj: { innerKey: 'oldValue' } },
 *   // 다른 객체들...
 * ];
 * const modifiedArray = findAndModifyInnerKey(array, 'key', 0, 'innerKey', 'newValue');
 * console.log(modifiedArray); // 변경된 배열 출력
 * @author 최성우
 * @updated 23.11.30
 */
utils.findAndModifyInnerKey = (array, keyToFind, valueToFind, innerKeyToChange, newInnerValue) => {
    return array.map(obj => {
        if (obj.hasOwnProperty(keyToFind) && obj[keyToFind] === valueToFind) {
            const updatedObj = { ...obj };
            if (updatedObj.hasOwnProperty(innerKeyToChange)) {
                updatedObj[innerKeyToChange] = newInnerValue;
            }
            return updatedObj;
        }
        return obj;
    });
}


/**
 * 특정 키의 값을 기준으로 배열에서 객체를 필터링하여 제거하는 함수
 * @param {Object[]} arr 필터링할 객체들이 포함된 배열
 * @param {string} key 객체에서 값을 확인할 키
 * @param {any[]} valueToRemove 제거할 값들을 포함하는 배열
 * @returns {Object[]} 주어진 키의 값이 `valueToRemove` 배열에 포함되지 않는 객체들로 구성된 새로운 배열
 * @example
 * const data = [
 *     { id: 1, name: 'Alice' },
 *     { id: 2, name: 'Bob' },
 *     { id: 3, name: 'Charlie' }
 * ];
 * const idsToRemove = [1, 3];
 * const filteredData = utils.removeObjectsWithValue(data, 'id', idsToRemove);
 * console.log(filteredData); // [{ id: 2, name: 'Bob' }]
 * @author [Your Name]
 * @updated [Date]
 */
utils.removeObjectsWithValue = (arr, key, valueToRemove) => {
    console.log("arr",arr)
    if(!arr || arr.length <= 0) {
        return arr;
    } else {
        return arr.filter(obj => !valueToRemove.includes(obj[key]));
    }
}





/**
 * 이메일 유효성을 검사하는 함수
 * @param {string} email 확인할 이메일 주소
 * @returns {boolean} 유효한 이메일인지 여부를 나타내는 부울 값
 * @example
 * const emailToValidate = 'example@email.com';
 * const isValidEmail = validateEmail(emailToValidate);
 * console.log(isValidEmail); // true 또는 false를 반환
 * @author 최성우
 * @updated 23.12.08
 */


utils.validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}



/**
 * 비밀번호 유효성을 검사하는 함수
 * @param {string} password 확인할 비밀번호
 * @returns {boolean} 유효한 비밀번호인지 여부를 나타내는 부울 값
 * @example
 * const passwordToValidate = 'Password1!';
 * const isValidPassword = validatePassword(passwordToValidate);
 * console.log(isValidPassword); // true 또는 false를 반환
 * @author 최성우
 * @updated 23.12.08
 */

utils.validatePassword = (password) => {
    // 정규식 패턴
    var pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    // 패턴과 일치하는지 확인
    return pattern.test(password);
}



/**
 * 오늘 날짜와 오늘 날짜로부터 3달 전의 날짜를 'yyyy-mm-dd' 형식으로 반환하는 함수
 * @returns {object} 시작일과 종료일을 포함하는 객체
 * @property {string} START_DATE 오늘 날짜로부터 3달 전의 날짜를 'yyyy-mm-dd' 형식으로 표현한 문자열
 * @property {string} END_DATE 오늘 날짜를 'yyyy-mm-dd' 형식으로 표현한 문자열
 * @example
 * const dates = getFormattedDates();
 * console.log(dates.START_DATE); // '2023-12-28' 과 같은 문자열 반환
 * console.log(dates.END_DATE); // '2024-03-28' 과 같은 문자열 반환
 * @author 최성우
 * @updated 24.03.28
 */
utils.getDateFickerFormattedDates = () => {
    // 오늘 날짜를 얻어옵니다.
    const today = new Date();

    // 오늘 날짜를 'yyyy-mm-dd' 형식의 문자열로 변환합니다.
    const formattedToday = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    // 3달 전의 날짜를 계산합니다.
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

    // 3달 전의 날짜를 'yyyy-mm-dd' 형식의 문자열로 변환합니다.
    const formattedThreeMonthsAgo = threeMonthsAgo.getFullYear() + '-' + ('0' + (threeMonthsAgo.getMonth() + 1)).slice(-2) + '-' + ('0' + threeMonthsAgo.getDate()).slice(-2);

    // 결과를 객체로 반환합니다.
    return {
        start_default_date: formattedThreeMonthsAgo,
        end_default_date: formattedToday
    };
}

utils.getTickerName = (ticker) => {
    switch(ticker) {
        case "KRW-BTC":
            return "비트코인";
        case "KRW-ETH":
            return "이더리움";
        case "KRW-DOT":
            return "폴카닷";
        case "KRW-SOL":
            return "솔라나";
        case "KRW-BCH":
            return "비트코인캐시";
        case "KRW-ETC":
            return "이더리움 클래식";
        case "KRW-ADA":
            return "에이다";
        case "KRW-LINK":
            return "체인링크";
        case "KRW-STX":
            return "스택스";
        case "KRW-VET":
            return "비체인";
        case "KRW-AVAX":
            return "아발란체";
        case "KRW-FLOW":
            return "플로우";
        case "KRW-EGLD":
            return "멀티버스엑스";
        case "KRW-GRT":
            return "더그래프";
        case "KRW-ANKR":
            return "앵커";
        case "KRW-ARB":
            return "아비트럼";
        case "KRW-NEAR":
            return "니어프로토콜";
        case "KRW-THETA":
            return "세타토큰";
        case "KRW-AAVE":
            return "에이브";
        case "KRW-HBAR":
            return "헤데라";
        case "KRW-AXS":
            return "엑시인피니티";
        case "KRW-EOS":
            return "이오스";
        case "KRW-BAT":
            return "베이직어텐션토큰";
        case "KRW-STORJ":
            return "스토리지";
        case "KRW-NEO":
            return "네오";
        case "KRW-SAND":
            return "샌드박스";
        case "KRW-CHZ":
            return "칠리즈";
        case "KRW-ZRX":
            return "제로엑스";
        case "KRW-XEC":
            return "이캐시";
        case "KRW-GMT":
            return "스테픈";
        case "KRW-BTG":
            return "비트코인골드";
        case "KRW-POLYX":
            return "폴리매쉬";
        case "KRW-ONG":
            return "온톨로지가스";
        case "KRW-MTL":
            return "메탈";
        case "KRW-ARK":
            return "아크";
        case "KRW-QTUM":
            return "퀀텀";
        case "KRW-WAXP":
            return "왁스";
        case "KRW-ZIL":
            return "질리카";
        case "KRW-1INCH":
            return "1인치네트워크";
        case "KRW-IQ":
            return "아이큐"
        case "KRW-POWR":
            return "파워렛저"
        case "KRW-APT":
            return "앱토스"
        case "KRW-STG":
            return "스타게이트"
        case "KRW-BLUR":
            return "블러"
        case "KRW-PYTH":
            return "피스네트워크"
        case "KRW-TAIKO":
            return "타이코"
        case "KRW-MINA":
            return "미나"
        case "KRW-ATOM":
            return "코스모스"
        case "KRW-SUI":
            return "수이"
        case "KRW-SEI":
            return "세이"
        case "KRW-ZETA":
            return "제타체인"
        case "KRW-IMX":
            return "이뮤터블엑스"
        case "KRW-AKT":
             return "아카시네트워크"
        case "KRW-GAME2":
            return "게임빌드"
        case "KRW-MATIC":
            return "폴리곤"
        case "KRW-MANA":
            return "디센트럴렌드"
        default:
            return ticker
    }
}

 //업비트 전체 자산 정보 가져오기
utils.getUpbitCoinListAll = (callback) => {
    console.log('allSymbol',allSymbol)
    if(allSymbol.length == 0) {
        fetch("https://api.upbit.com/v1/market/all").then((response) => response.json()).then(result => {
            result.map((info) => {
                allSymbol.push(info.market);
            })
            return callback(allSymbol);
        })
    }  else {
        return callback(allSymbol);
    }
}


/**
 * 숫자를 한국 원화(KRW) 형식으로 포맷팅하는 함수, 소수점 자릿수 지정 가능
 * @param {number} number 포맷팅할 숫자
 * @param {number} [decimalPlaces=0] 소수점 자리 수 (기본값: 0)
 * @returns {string} 포맷팅된 한국 원화 형식의 문자열
 * @example
 * const formattedNumber1 = utils.formatToKRW(1234567.89);
 * console.log(formattedNumber1); // "1,234,568" (소수점 없이)
 * 
 * const formattedNumber2 = utils.formatToKRW(1234567.89, 2);
 * console.log(formattedNumber2); // "1,234,567.89" (소수점 둘 자리까지)
 * @author [Your Name]
 * @updated [Date]
 */
utils.formatToKRW = (input, decimalPlaces = 0) => {
    // 입력 값이 문자열인 경우 숫자로 변환
    // const number = typeof input === 'string' ? parseFloat(input) : Number(input);

    // // NaN 처리: 입력 값이 숫자가 아닌 경우 처리
    // if (isNaN(number)) {
    //     throw new Error('Invalid input: not a number');
    // }
    const number =  parseFloat(input)
    // 소수점을 지정한 자리까지 표현하고 문자열로 변환
    const formattedNumber = number.toFixed(decimalPlaces);

    // 한국 원화(KRW) 형식으로 포맷팅
    return new Intl.NumberFormat('ko-KR').format(formattedNumber);
};

/**
 * 주어진 배열에서 특정 키를 가진 객체를 교체하거나, 없으면 새로 추가하는 함수
 * @param {Array<Object>} arr - 객체들을 담고 있는 배열
 * @param {Object} newObj - 교체하거나 추가할 새로운 객체 (첫 번째 키를 기준으로 찾음)
 * @returns {Array<Object>} 업데이트된 배열
 * @example
 * let arr = [{key: 1, test: 1}, {key: 2}, {key: 3}];
 * let newObj = {key: 1, newTest: 42};
 * arr = updateOrAddObject(arr, newObj);
 * console.log(arr); 
 * // 출력: [{key: 1, newTest: 42}, {key: 2}, {key: 3}]
 * 
 * newObj = {key: 4, anotherTest: 99};
 * arr = updateOrAddObject(arr, newObj);
 * console.log(arr); 
 * // 출력: [{key: 1, newTest: 42}, {key: 2}, {key: 3}, {key: 4, anotherTest: 99}]
 * @author [Your Name]
 * @updated [Date]
 */

utils.updateOrAddObject = (arr, newObj) => {
    const key = Object.keys(newObj)[0]; // 새로운 객체의 key를 가져옴
    const index = arr.findIndex(obj => obj[key] !== undefined);

    if (index !== -1) {
        // key가 존재하는 객체를 찾은 경우, 해당 객체를 새로운 객체로 교체
        arr.splice(index, 1, newObj);
    } else {
        // key가 존재하지 않는 경우, 새로운 객체를 추가
        arr.push(newObj);
    }

    return arr;
}
