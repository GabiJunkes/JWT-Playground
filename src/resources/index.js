// ---------
// API calls
// ---------
const login = async() => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    let status = 0
    await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: await JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        status = response.status
        return response.json()
    })
    .then((data) => {
        let type = "danger"
        if (status==200) {
            type = "success"
            setCookie("jwt", data.jwt);
            document.getElementById('email').value = ""
            document.getElementById('password').value = ""
        } 
        setToast(data.message, type)
    })
    setLogoutButton()
    setJwtField()
    await getSecret()
    return false
}

const validateJwt = async() => {
    let status = 0
    const jwt = getCookie("jwt")
    await fetch('http://localhost:3000/api/validade', {
        method: 'POST',
        body: await JSON.stringify({
            jwt: jwt,
        }),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        status = response.status
        return response.json()
    })
    .then((data) => {
        let type = "danger"
        if (status==200) {
            type = "success"
        } 
        setToast(data.message, type)
    })
    return false
}

const changeSecret = async() => {
    let status = 0
    const jwtSecret = document.getElementById("jwtSecret").value
    await fetch('http://localhost:3000/api/secret', {
        method: 'POST',
        body: await JSON.stringify({
            secret: jwtSecret,
        }),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        status = response.status
        return response.json()
    })
    .then((data) => {
        let type = "danger"
        if (status==200) {
            type = "success"
        }
        setToast(data.message, type)
    })
    .catch((error) => console.log(error))
    await getSecret()
    return false
}

const getSecret = async() => {
    await fetch('http://localhost:3000/api/secret', {
        method: 'GET'
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        document.getElementById("jwtSecret").value = data.jwtSecret
    })
}

// ---------
// DOM Calls
// ---------

const logout = async () => {
    removeCookie("jwt")
    setToast('Successfully logged out.', 'success')
    setLogoutButton()
    setJwtField()
    await getSecret()
}

// Configures toast to display message and color of bg
const setToast = async (text, type) => {
    const toast = document.getElementById("toast")
    const toastBody = document.getElementById("toast-body")

    if (toast.classList.contains("text-bg-success")) {
        toast.classList.remove("text-bg-success")
    }
    if (toast.classList.contains("text-bg-danger")) {
        toast.classList.remove("text-bg-danger")
    }
    toast.classList.add("text-bg-"+type)

    toastBody.innerText = text

    const toastBootstrap = new bootstrap.Toast(toast)
    toastBootstrap.show()

}

// changes JWT cookie value
const changeJWT = () => {
    setCookie("jwt", document.getElementById("jwtInput").value)
    setToast(decodeURIComponent("JWT was successfully updated."), 'success')
    document.getElementById("jwtInput").value = ""
    setJwtField()
}

// Hides logout button if logged in
const setLogoutButton = () => {
    if (getCookie("jwt")) {
        document.getElementById("logoutButton").classList.remove("d-none")
    }else{
        document.getElementById("logoutButton").classList.add("d-none")
    }
}

// Check if there is a cookie named error and display it with a toast element
const checkErrorCookies = () => {
    const errorMessage = getCookie("error")
    if (errorMessage){
        setToast(decodeURIComponent(errorMessage), 'danger')
        removeCookie("error")
    }
}

// Populates the JWT field with the token itself and the decoded result
const setJwtField = () => {
    const jwt = getCookie("jwt")
    if (jwt) {
        document.getElementById("loginCol").classList.add("d-none")
        document.getElementById("jwtCol").classList.remove("d-none")
        document.getElementById("jwtP").innerText = jwt
        try{
            let decoded = b64DecodeUnicode(jwt.split(".")[1]).replaceAll(",", ",<br>&emsp;",)
            decoded = decoded.replaceAll("{", "{<br>&emsp;",)
            decoded = decoded.replaceAll("}", "<br>}",)
            decoded = decoded.replaceAll(":", " : ",)
            document.getElementById("jwtCode").innerHTML = decoded
        }catch(e){
            document.getElementById("jwtCode").innerHTML = "Error"
        }
    }else{
        document.getElementById("loginCol").classList.remove("d-none")
        document.getElementById("jwtCol").classList.add("d-none")
    }
}

// Functions to execute when page loads
const onLoad = async () => {
    checkErrorCookies()
    setLogoutButton()
    setJwtField()
    await getSecret()
}

// ---------

document.getElementById("loginForm").addEventListener('submit', (e) => {
    e.preventDefault();
});

document.getElementById("secretForm").addEventListener('submit', (e) => {
    e.preventDefault();
});

// ---------

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}