const logout = async () => {
    removeCookie("jwt")
    window.location.href = "/"
}