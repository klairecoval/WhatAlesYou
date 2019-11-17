'use strict';

// check if existing user has entered data into all fields
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '') {
        handleError('Username or password is empty.');
        return false;
    }

    console.log($('input[name=_csrf').val());

    sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

    return false;
};

// check if new user has filled out all fields
// check if pass and confirmed pass match
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleError('All fields are required.');
        return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
        handleError('Passwords do not match.');
        return false;
    }

    sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

    return false;
};

// create login form with username and pass
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        'form',
        { id: 'loginForm', name: 'loginForm',
            onSubmit: handleLogin,
            action: '/login',
            method: 'POST',
            className: 'mainForm' },
        React.createElement(
            'label',
            { htmlFor: 'username' },
            'Username: '
        ),
        React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
        React.createElement(
            'label',
            { htmlFor: 'pass' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign in' })
    );
};

// create signup window with username, pass, and confirmed pass
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        'form',
        { id: 'signupForm', name: 'signupForm',
            onSubmit: handleSignup,
            action: '/signup',
            method: 'POST',
            className: 'mainForm' },
        React.createElement(
            'label',
            { htmlFor: 'username' },
            'Username: '
        ),
        React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
        React.createElement(
            'label',
            { htmlFor: 'pass' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
        React.createElement(
            'label',
            { htmlFor: 'pass2' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign up' })
    );
};

// create login view in center of page
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

// create signup view in center of page
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

// depending on if login or signup icon pressed, create corresponding view
var setup = function setup(csrf) {
    var loginButton = document.querySelector('#loginButton');
    var signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener('click', function (e) {
        e.preventDefault();
        createLoginWindow();
        return false;
    });

    createLoginWindow(csrf);
};

// get csrf token
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

// load in csrf token
$(document).ready(function () {
    getToken();
});
'use strict';

// helper function to create an error message with desired error text
var handleError = function handleError(message) {
    $('#errorMessage').text(message);
    $('#beerMessage').animate({ height: 'toggle' }, 350);
};

// redirect page and hide error
var redirect = function redirect(response) {
    $('#beerMessage').animate({ height: 'hide' }, 350);
    window.location = response.redirect;
};

// send ajax data and handle error
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
