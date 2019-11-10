const handlePasswordChange = (e) => {
    e.preventDefault();

    const currPass = document.querySelector('#password').value;
	const newPass = document.querySelector('#newPassword').value;
	const newPass2 = document.querySelector('#newPassword2').value;
    
    if(currPass.val() == '' || newPass.val() == '' || newPass2.val() == '')
    {
        handleError('All fields required');
        return false;
    }

    if (newPass !== newPass2) {
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
            <label htmlFor='password'> Current Password: </label>
            <input id='password' type='password' name='password' placeholder='current password' />
            <label htmlFor='newPassword'> New Password: </label>
            <input id='newPassword' type='password' name='newPassword' placeholder='new password'/>
            <label htmlFor='newPassword2'> Confirm New Password: </label>
            <input id='newPassword2' type='password' name='newPassword2' placeholder='confirm new password'/>
            <input className='submitForm' type='submit' value='Change Password'/>
        </form>
    );
};

const PassTitle = (props) => {
    return (
        <h2>Change Password</h2>
    );
};

const createPassTitle = () => {
    ReactDOM.render(
        <PassTitle />,
        document.querySelector('#makeBeer')
    );
};

const createChangePasswordForm = () => {
    ReactDOM.render(
        <ChangePassword />,
        document.querySelector('#beers')
    );
};

const createChangePasswordView = () => {
    createPassTitle();
	createChangePasswordForm();
};

const handleChangePasswordClick = () => {
	const changePass = document.querySelector('#changePassword');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createChangePasswordView();
	});
};