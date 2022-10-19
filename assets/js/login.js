const APIHOST = 'http://127.0.0.1:8000';

$(document).ready(function() {
    if(typeof $.cookie('access') !== 'undefined' || typeof $.cookie('refresh') !== 'undefined' )
        window.location.href="dashboard.html";
});

$('form').validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: 'required',
    },
    messages: {
        email: {
            required: 'Please enter your email address',
            email: 'Please a valid email address'
        },
        password: 'Please enter your password'
    },
    submitHandler: function(form) {
        let fd=new FormData(form);
        fd.set('email', fd.get('email').toLowerCase());
        $.ajax({
            type: 'POST',
            url: `${APIHOST}/api/accounts/login/`,
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: () => { $(form).children('input, button').attr('disabled', true); $(form).children('.alert').hide()},
            success: function(response) {
                console.log(response);
                if($('#remember-me-check').is(':checked'))
                    $.cookie('refresh', response.refresh, {expires: 30, path: '/'});
                else 
                    $.cookie('refresh', response.refresh, {expires: 1, path: '/'});
                $.cookie('access', response.access, {expires: 0.00347222, path: '/'});
                $.cookie('user', JSON.stringify(response.user), {expires: 1, path: '/'});
                $(form).children('input, button').attr('disabled', false);
                window.location.href="dashboard.html";
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                $(form).children('input, button').attr('disabled', false);
                if(jqXHR.status === 401)
                    $(form).children('.alert').text('Login Failed! Incorrect email or password.').fadeIn(500);
                else if(jqXHR.status === 0)
                    $(form).children('.alert').text('Can\'t connect to server right now. Please try after some time').fadeIn(500);
                else
                    $(form).children('.alert').text('Something went wrong. Please try after some time').fadeIn(500);
            }
        })
    }
});