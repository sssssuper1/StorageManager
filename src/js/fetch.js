export default (url, method, params1, callback, err) => {
    // let oCookie if(cookie.userId){   cookieStr={     userId: cookie.userId   } }
    var myHeaders = new Headers({'User-Agent': 'TDJAPP', 'Accept': 'application/json', "Content-Type": "application/json", "Access-Control-Allow-Origin": "*"})
    if (method.toLowerCase() == 'post') {
        fetch(url, {
            method: method,
            headers: myHeaders,
            credentials:'include',
            body: JSON.stringify(params1)
        }).then((response) => response.json()).then((responseData) => {
            if (typeof responseData == 'object') {
                callback(responseData)
            }
        }).catch((error) => {
            if (typeof error == 'object') {
                err(error)
            }

        }).done();
    } else {
        fetch(url, {
            method: method,
            mode: 'no-cors',
            headers: myHeaders,
            credentials:'include',
        }).then((response) => response.json()).then((responseData) => {
            if (typeof responseData == 'object') {
                callback(responseData)
            }
        }).catch((error) => {
            if (typeof error == 'object') {
                err(error);
            }
        }).done();
    }
}