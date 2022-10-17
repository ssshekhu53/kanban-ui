const APIHOST = 'http://127.0.0.1:8000';

$(document).ready(function() {
    if(typeof $.cookie('access') === 'undefined' && typeof $.cookie('refresh') === 'undefined' )
        window.location.href="index.html";
    let user=JSON.parse($.cookie('user'));
    $('.user-name').text(user.name);
    $('.user-email').text(user.email);
});

$(document).on('click', '#sign-out-btn', function(e) {
    e.preventDefault();

    let refresh=$.cookie('refresh');
    let button=this;
    $.ajax({
        type: 'POST',
        url: `${APIHOST}/api/accounts/logout/`,
        data: {token: refresh},
        beforeSend: () => {$(button).attr('disabled', true)},
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