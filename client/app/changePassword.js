const handlePasswordChange = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({width:'hide'}, 350);
    
    if($('currPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
        handleError('All fields required');
        return false;
    }

    if ($('#newPass').val() !== $('#newPass2').val()) {
        handleError('Passwords do no match');
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changePassForm').serialize(), function(){
        handleError('Password changed');
    });

    return false;
};

const ChangePassword = (props) => {
    return (
        <form id='changePassForm' name='changePassForm' action='changePassword' onSubmit={handlePasswordChange} method='POST'>
            <label htmlFor='currPass'> Current Password: </label>
            <input id='currPass' type='password' name='currPass' placeholder='current password' />
            <label htmlFor='newPass'> New Password: </label>
            <input id='newPass' type='password' name='newPass' placeholder='new password'/>
            <label htmlFor='newPass2'> Confirm New Password: </label>
            <input id='newPass2' type='password' name='newPass2' placeholder='confirm new pass'/>
            <input type='hidden' name='_csrf' value={props.csrf} placeholder={props.csrf}/>
            <input className='submitForm' type='submit' value='Change'/>
        </form>
    );
};

const PassTitle = (props) => {
    return (
        <h2 id="changePassTitle">Change Password</h2>
    );
};

const createPassTitle = () => {
    ReactDOM.render(
        <PassTitle />,
        document.querySelector('#makeBeer')
    );
};

const createChangePasswordForm = (csrf) => {
    ReactDOM.render(
        <ChangePassword csrf={csrf} />,
        document.querySelector('#beers')
    );
};

const createChangePasswordView = (csrf) => {
    createPassTitle();
	createChangePasswordForm(csrf);
};

const handleChangePasswordClick = (csrf) => {
	const changePass = document.querySelector('#changePassword');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createChangePasswordView(csrf);
	});
};

const getCSRFToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        handleChangePasswordClick(result.csrfToken);
    });
};

$(document).ready(function() {
    getCSRFToken();
});