function getItem(storage, key) {
    const jsonStr = storage.getItem(key);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
}

function setItem(storage, key, value) {
    const str = (value === undefined) ? null : value;
    storage.setItem(key, JSON.stringify(str));
}

function removeItem(storage, key) {
    storage.removeItem(key);
}

export function getLocalItem(key) {
    return getItem(localStorage, key);
}

export function setLocalItem(key, value) {
    setItem(localStorage, key, value);
}

export function removeLocalItem(key) {
    removeItem(localStorage, key);
}

export function getSessionItem(key) {
    return getItem(sessionStorage, key);
}

export function setSessionItem(key, value) {
    setItem(sessionStorage, key, value);
}

export function removeSessionItem(key) {
    removeItem(sessionStorage, key);
}

// 쿠키 설정
export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 쿠키 가져오기
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 쿠키 삭제
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// 로컬 스토리지에서 쿠키로 값 설정
export function setCookieFromLocal(name, key, days) {
    const value = getLocalItem(key);
    if (value) {
        setCookie(name, JSON.stringify(value), days);
    }
}

// 쿠키에서 로컬 스토리지로 값 설정
export function setLocalFromCookie(name, key) {
    const value = getCookie(name);
    if (value) {
        setLocalItem(key, JSON.parse(value));
    }
}
