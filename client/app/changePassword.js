const handlePasswordChange = (e) => {
    e.preventDefault();

    const currPass = document.querySelector('#password').value;
	const newPass = document.querySelector('#newPassword').value;
	const newPass2 = document.querySelector('#newPassword2').value;
    const changePassForm = document.querySelector('#changePassForm');
    
    if(currPass.val() == '' || newPass.val() == '' || newPass2.val() == '')
    {
        handleError('All fields required');
        return false;
    }

    if (newPass !== newPass2) {
        handleError('Passwords Do Not Match');
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changePassForm').serialize(), redirect);

    return false;
};

const ChangePassword = (props) => {
    return (
        <div>
            <form id='changePassForm' name='changePassForm' action='changePassword' onSubmit={handlePasswordChange} method='POST'>''
                <label htmlFor='password'> Current Password: </label>
                <input id='password' type='password' name='password' placeholder='current password' />
                <label htmlFor='newPassword'> New Password: </label>
                <input id='newPassword' type='password' name='newPassword' placeholder='new password'/>
                <label htmlFor='newPassword2'> Confirm New Password: </label>
                <input id='newPassword2' type='password' name='newPassword2' placeholder='confirm new password'/>
                <input className='submitForm' type='submit' value='Change Password'/>
            </form>
        </div>
    );
};

const createChangePassForm = () => {
    ReactDOM.render(
        <ChangePassword />,
        document.querySelector('#beers')
    );
};

const handleChangePasswordClick = () => {
	const changePass = document.querySelector('#changePassword');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createChangePassForm();
	});
};