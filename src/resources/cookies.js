const getCookie = (name) => {
    const cookie = document.cookie.split('; ')
    .find((row) => row.startsWith(name+'='))
    ?.split('=')[1];
    return cookie
}

const removeCookie = (name) => {
    document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

const setCookie = (name, value) => {
    document.cookie = name + "=" + value 
}