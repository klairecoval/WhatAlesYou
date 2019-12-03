// check if user has entered values into all fields
// check if values are valid (match, etc)
// return error messages if not correct
// return success message if all requirements met
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

// create change password form with current pass, new pass, confirm new pass
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

// create change pass page title
const PassTitle = (props) => {
    return (
        <h2 id="changePassTitle">Settings</h2>
    );
};

// place new title on top of page, below nav bar
const createPassTitle = () => {
    ReactDOM.render(
        <PassTitle />,
        document.querySelector('#makeBeer')
    );
};

// create pass form in main center of page
const createChangePasswordForm = (csrf) => {
    ReactDOM.render(
        <ChangePassword csrf={csrf} />,
        document.querySelector('#beers')
    );
};

// create total view
const createChangePasswordView = (csrf) => {
    createPassTitle();
	createChangePasswordForm(csrf);
};

// when gear icon clicked, create view
const handleChangePasswordClick = (csrf) => {
	const changePass = document.querySelector('#changePassword');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createChangePasswordView(csrf);
	});
};