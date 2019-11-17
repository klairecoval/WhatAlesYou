// helper function to create an error message with desired error text
const handleError = (message) => {
    $('#errorMessage').text(message);
    $('#beerMessage').animate({height: 'toggle'}, 350);
};

// redirect page and hide error
const redirect = (response) => {
    $('#beerMessage').animate({height: 'hide'}, 350);
    window.location = response.redirect;
};

// send ajax data and handle error
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};