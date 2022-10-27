const APIHOST = 'http://127.0.0.1:8000';

function sessionCheck() {
    if(typeof $.cookie('access') === 'undefined' && typeof $.cookie('refresh') === 'undefined')
        window.location.href="index.html";
    if(typeof $.cookie('access') === 'undefined' && typeof $.cookie('refresh') !== 'undefined') {
        $.post(`${APIHOST}/api/accounts/token/refresh/`, {refresh: $.cookie('refresh')}, function(response){$.cookie('access', response.access, {expires: 0.00347222, path: '/'});});
    }
}

function getAccessToken() {
    return $.cookie('access');
}

function getRefreshToken() {
    return $.cookie('refresh');
}

function getToken() {
    return {'access': getAccessToken(), 'refresh': getRefreshToken()};
}