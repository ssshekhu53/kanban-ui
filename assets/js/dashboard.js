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

$(document).ready(function() {
    sessionCheck();
    let user=JSON.parse($.cookie('user'));
    $('.user-name').text(user.name);
    $('.user-email').text(user.email);
});

$(document).on('click', '#sign-out-btn', function(e) {
    e.preventDefault();
    sessionCheck();

    let refresh=getRefreshToken();
    let button=this;
    $.ajax({
        type: 'POST',
        url: `${APIHOST}/api/accounts/logout/`,
        data: {token: refresh},
        beforeSend: () => {$(button).attr('disabled', true)},
        dataType: 'json',
        success: function(response) {
            $.removeCookie('refresh', {path: '/'});
            $.removeCookie('access', {path: '/'});
            $.removeCookie('user', {path: '/'});
            window.location.href="index.html";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })
})