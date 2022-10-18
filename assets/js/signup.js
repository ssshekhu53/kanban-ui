const APIHOST = 'http://127.0.0.1:8000';

$(document).ready(function() {
    if(typeof $.cookie('access') !== 'undefined' || typeof $.cookie('refresh') !== 'undefined' )
        window.location.href="dashboard.html";
});

$('form').validate({
    rules: {
        name: 'required',
        phone: 'required',
        email: 'required',
        password: 'required',
        password2: {
            required: true,
            samePassword: true,
        },
        agreementCheck: 'isChecked',
    },
    messages: {
        name: 'Please enter company\'s name',
        email: 'Please enter company\'s email address',
        email: 'Please enter company\'s email address',
        password: 'Please create password',
        password2: {
            required: 'Please confirm password',
        },
        agreementCheck: 'Please check to aggree terms and conditions'
    },
    submitHandler: function(form) {
        let fd=new FormData(form);
        console.log(fd);
        $.ajax({
            type: 'POST',
            url: `${APIHOST}/api/accounts/register/`,
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: () => { $(form).children('input, button').attr('disabled', true); $(form).children('.alert').hide(); $(form).children('.alert').removeClass('alert-danger'); $(form).children('.alert').removeClass('alert-success');},
            success: function(response) {
                console.log(response);
                $.cookie('refresh', response.token.refresh, {expires: 1, path: '/'});
                $.cookie('access', response.token.access, {expires: 0.00347222, path: '/'});
                $.cookie('user', JSON.stringify(response.token.user), {expires: 1, path: '/'});
                $(form).children('input, button').attr('disabled', false);
                $(form).children('.alert').addClass('alert-success').text('Account created successfully').fadeIn(500);
                $(form).trigger('reset');
                setTimeout(() => {window.location.href="account-verification.html";}, 1500);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                $(form).children('input, button').attr('disabled', false);
                $(form).children('.alert').addClass('alert-danger').text('Sign up failed! Email already exists.').fadeIn(500);
            }
        })
    }
});

jQuery.validator.addMethod("samePassword", function(value, element) {
    return value === $('#inputPassword').val();
}, "Both passwords are not same");

jQuery.validator.addMethod("isChecked", function(value, element) {
    return $(element).is(':checked');
}, "Both passwords are not same");
