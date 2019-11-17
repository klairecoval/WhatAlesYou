// check if existing user has entered data into all fields
const handleLogin = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({height: 'hide'}, 350);

    if($('#user').val() == '' || $('#pass').val() == '') {
        handleError('Username or password is empty.');
        return false;
    }

    console.log($('input[name=_csrf').val());

    sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

    return false;
};

// check if new user has filled out all fields
// check if pass and confirmed pass match
const handleSignup = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({height: 'hide'}, 350);

    if($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleError('All fields are required.');
        return false;
    }

    if($('#pass').val() !== $('#pass2').val()) {
        handleError('Passwords do not match.');
        return false;
    }

    sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

    return false;
};

// create login form with username and pass
const LoginWindow = (props) => {
    return (
        <form id='loginForm' name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='Sign in' />
        </form>
    );
};

// create signup window with username, pass, and confirmed pass
const SignupWindow = (props) => {
    return (
        <form id='signupForm' name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='Sign up' />
        </form>
    );
};

// create login view in center of page
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

// create signup view in center of page
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

// depending on if login or signup icon pressed, create corresponding view
const setup = (csrf) => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        createLoginWindow();
        return false;
    });

    createLoginWindow(csrf);
};

// get csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// load in csrf token
$(document).ready(function() {
    getToken();
});