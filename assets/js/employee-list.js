$(document).ready(function() {
    let accessToken = getAccessToken();

    $.ajax({
        'type': 'get',
        'url': `${APIHOST}/api/accounts/employees/`,
        'headers': {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            console.table(response.data);
            let tbody="";
            response.data.forEach(function(value, index) {
                tbody+=tableTemplate(value);
            });
            $('table tbody').html(tbody);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })
});

function tableTemplate(data) {
    return `<tr>
                <td class="">${data.name}</td>
                <td class="text-primary">${data.email}</td>
                <td class="text-dark">${data.phone}</td>
                <td class="">${new Date(data.date_joined).toLocaleString()}</td>
                <td><label class="badge ${!data.is_active?'badge-warning': 'badge-primary'}">${!data.is_active?'Inactive':'Active'}</label></td>
            </tr>`
}