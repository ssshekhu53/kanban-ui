$('form#add-employee-form').validate({
    rules: {
        name: 'required',
        phone: 'required',
        email: {
            required: true,
            email: true
        },
        password: 'required',
        password2: {
            required: true,
            samePassword: true,
        },
    },
    messages: {
        name: 'Please enter employee\'s name',
        email: {
            required: 'Please enter employee\'s email address',
            email: 'Please a valid email address'
        },
        phone: 'Please enter employee\'s phone no.',
        password: 'Please create password',
        password2: {
            required: 'Please confirm password',
        },
    },
    submitHandler: function(form) {
        let fd=new FormData(form);
        fd.set('email', fd.get('email').toLowerCase());
        sessionCheck();
        let accessToken=getAccessToken();
        console.log(fd);
        $.ajax({
            type: 'POST',
            url: `${APIHOST}/api/accounts/add-employee/`,
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            beforeSend: () => { $(form).children('.form-spinner').show(); $(form).children('.alert').hide(); $(form).children('.alert').removeClass('alert-danger'); $(form).children('.alert').removeClass('alert-success');},
            success: function(response) {
                console.log(response);
                $(form).children('.form-spinner').hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Employee added successfully',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Add More Employee',
                    cancelButtonText: 'Go To Employee List'
                }).then((result) => {
                    if(result.isConfirmed) {
                        $(form).trigger('reset');
                        $(form).find('input[name="name"]').focus();
                    }
                    else {
                        window.location.href="./employee-list.html"
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                $(form).children('.form-spinner').hide();
                if(jqXHR.status === 500)
                    $(form).children('.alert').addClass('alert-danger').text('Failed! Can\'t add employee. Email already exists.').fadeIn(500);
                else if(jqXHR.status === 0)
                    $(form).children('.alert').addClass('alert-danger').text('Can\'t connect to server right now. Please try after some time').fadeIn(500);
                else
                    $(form).children('.alert').addClass('alert-danger').text('Something went wrong. Please try after some time').fadeIn(500);
            }
        })
    }
});

jQuery.validator.addMethod("samePassword", function(value, element) {
    return value === $('#inputPassword').val();
}, "Both passwords are not same");