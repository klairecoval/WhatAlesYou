'use strict';

var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    var currPass = document.querySelector('#password').value;
    var newPass = document.querySelector('#newPassword').value;
    var newPass2 = document.querySelector('#newPassword2').value;

    if (currPass.val() == '' || newPass.val() == '' || newPass2.val() == '') {
        handleError('All fields required');
        return false;
    }

    if (newPass !== newPass2) {
        handleError('Passwords do no match');
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changePassForm').serialize(), function () {
        handleError('Password changed');
    });

    return false;
};

var ChangePassword = function ChangePassword(props) {
    return React.createElement(
        'form',
        { id: 'changePassForm', name: 'changePassForm', action: 'changePassword', onSubmit: handlePasswordChange, method: 'POST' },
        React.createElement(
            'label',
            { htmlFor: 'password' },
            ' Current Password: '
        ),
        React.createElement('input', { id: 'password', type: 'password', name: 'password', placeholder: 'current password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPassword' },
            ' New Password: '
        ),
        React.createElement('input', { id: 'newPassword', type: 'password', name: 'newPassword', placeholder: 'new password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPassword2' },
            ' Confirm New Password: '
        ),
        React.createElement('input', { id: 'newPassword2', type: 'password', name: 'newPassword2', placeholder: 'confirm new password' }),
        React.createElement('input', { className: 'submitForm', type: 'submit', value: 'Change Password' })
    );
};

var PassTitle = function PassTitle(props) {
    return React.createElement(
        'h2',
        null,
        'Change Password'
    );
};

var createPassTitle = function createPassTitle() {
    ReactDOM.render(React.createElement(PassTitle, null), document.querySelector('#makeBeer'));
};

var createChangePasswordForm = function createChangePasswordForm() {
    ReactDOM.render(React.createElement(ChangePassword, null), document.querySelector('#beers'));
};

var createChangePasswordView = function createChangePasswordView() {
    createPassTitle();
    createChangePasswordForm();
};

var handleChangePasswordClick = function handleChangePasswordClick() {
    var changePass = document.querySelector('#changePassword');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createChangePasswordView();
    });
};
'use strict';

var handleBeer = function handleBeer(e) {
    e.preventDefault();

    $('#beerMessage').animate({ width: 'hide' }, 350);

    if ($('#beerName').val() == '' || $('#beerBrewer').val() == '' || $('#beerType').val() == '' || $('#beerABV').val() == '' || $('#beerIBU').val() == '' || $('#beerNotes').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', $('#beerForm').attr('action'), $('#beerForm').serialize(), function () {
        loadBeersFromServer();
    });

    return false;
};

var deleteBeer = function deleteBeer(e) {
    var id = e.target.parentElement.querySelector('.beerId').innerText;
    var _csrf = document.querySelector('input[name="_csrf"]').value;

    sendAjax('DELETE', '/deleteBeer', { id: id, _csrf: _csrf }, function (data) {
        loadBeersFromServer();
    });
};

var BeerForm = function BeerForm(props) {
    return React.createElement(
        'form',
        { id: 'beerForm',
            onSubmit: handleBeer,
            name: 'beerForm',
            action: '/maker',
            method: 'POST',
            className: 'beerForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'beerName', type: 'text', name: 'name', placeholder: 'Beer Name' }),
        React.createElement(
            'label',
            { htmlFor: 'brewer' },
            'Brewer: '
        ),
        React.createElement('input', { id: 'beerBrewer', type: 'text', name: 'brewer', placeholder: 'Brewer' }),
        React.createElement(
            'label',
            { htmlFor: 'type' },
            'Type: '
        ),
        React.createElement('input', { id: 'beerType', type: 'text', name: 'type', placeholder: 'Type' }),
        React.createElement(
            'label',
            { htmlFor: 'abv' },
            'ABV: '
        ),
        React.createElement('input', { id: 'beerABV', type: 'text', name: 'abv', placeholder: 'ABV' }),
        React.createElement(
            'label',
            { htmlFor: 'ibu' },
            'IBU: '
        ),
        React.createElement('input', { id: 'beerIBU', type: 'text', name: 'ibu', placeholder: 'IBU' }),
        React.createElement(
            'label',
            { htmlFor: 'notes' },
            'Notes: '
        ),
        React.createElement('input', { id: 'beerNotes', type: 'text', name: 'notes', placeholder: 'Notes' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeBeerSubmit', type: 'submit', value: 'Log Beer' })
    );
};

var BeerList = function BeerList(props) {
    if (props.beers.length === 0) {
        return React.createElement(
            'div',
            { className: 'beersList' },
            React.createElement(
                'h3',
                { className: 'emptyBeer' },
                'No Beers Yet'
            )
        );
    }

    var beerNodes = props.beers.map(function (beer) {
        console.log(beer.notes);
        return React.createElement(
            'div',
            { key: beer._id, className: 'beer' },
            React.createElement('img', { src: '/assets/img/beerIcon.png', alt: 'beer face', className: 'beerDefaultIcon' }),
            React.createElement(
                'h3',
                { className: 'beerName' },
                ' ',
                beer.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'beerBrewer' },
                ' Brewer: ',
                beer.brewer,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'beerType' },
                ' Type: ',
                beer.type,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'beerABV' },
                ' ABV: ',
                beer.abv,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'beerIBU' },
                ' IBU: ',
                beer.ibu,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'beerNotes' },
                ' Type: ',
                beer.notes,
                ' '
            ),
            React.createElement(
                'button',
                { className: 'deleteBeer', onClick: deleteBeer },
                'Remove'
            ),
            React.createElement(
                'span',
                { className: 'beerId' },
                beer._id
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'beerList' },
        beerNodes
    );
};

var loadBeersFromServer = function loadBeersFromServer() {
    sendAjax('GET', '/getBeers', null, function (data) {
        ReactDOM.render(React.createElement(BeerList, { beers: data.beers }), document.querySelector('#beers'));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(BeerForm, { csrf: csrf }), document.querySelector('#makeBeer'));

    ReactDOM.render(React.createElement(BeerList, { beers: [] }), document.querySelector('#beers'));

    handlePairingsClick();
    handleUpgradeClick();
    handleChangePasswordClick();
    loadBeersFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var PairingsContainer = function PairingsContainer(props) {
    if (props.pairs.length === 0) {
        return React.createElement(
            'div',
            null,
            'No pairs...yet!'
        );
    }
    var pairsList = props.pairs.map(function (pair) {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                pair.beer,
                ' pairs well with ',
                pair.food
            )
        );
    });
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            null,
            'Pairings'
        ),
        React.createElement(
            'h4',
            null,
            'Ever wondered what foods would pair best with your favorite types of beers? If so, look no further!'
        ),
        pairsList
    );
};

var loadPairsFromServer = function loadPairsFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getPairs');

    var setPairs = function setPairs() {
        var pairResponse = JSON.parse(xhr.response);

        ReactDOM.render(React.createElement(PairingsContainer, { pairs: pairResponse }), document.getElementById('beers'));
    };

    xhr.onload = setPairs;
    xhr.send();
};

var PairingsTitle = function PairingsTitle(props) {
    return React.createElement(
        'h2',
        null,
        'Food-Beer Pairings'
    );
};

var createPairingsTitle = function createPairingsTitle() {
    ReactDOM.render(React.createElement(PairingsTitle, null), document.querySelector('#makeBeer'));
};

var createPairingContainer = function createPairingContainer() {
    ReactDOM.render(React.createElement(PairingsContainer, { pairs: [] }), document.getElementById('beers'));

    loadPairsFromServer();
};

var createPairingsView = function createPairingsView() {
    createPairingsTitle();
    createPairingContainer();
};

var handlePairingsClick = function handlePairingsClick() {
    var changePass = document.querySelector('#pairings');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createPairingsView();
    });
};
'use strict';

var UpgradeAccount = function UpgradeAccount(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            'Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15 and remove ads.'
        ),
        React.createElement(
            'p',
            null,
            'For a one-time fee of $10 USD, you can increase your storage size so you never have to quench your thirst for more beers! '
        ),
        React.createElement(
            'a',
            { href: '#' },
            'Upgrade'
        )
    );
};

var UpgradeTitle = function UpgradeTitle(props) {
    return React.createElement(
        'h2',
        null,
        'Upgrade Account'
    );
};

var createUpgradeTitle = function createUpgradeTitle() {
    ReactDOM.render(React.createElement(UpgradeTitle, null), document.querySelector('#makeBeer'));
};

var createUpgradeAccountInfo = function createUpgradeAccountInfo() {
    ReactDOM.render(React.createElement(UpgradeAccount, null), document.querySelector('#beers'));
};

var createUpgradeView = function createUpgradeView() {
    createUpgradeTitle();
    createUpgradeAccountInfo();
};

var handleUpgradeClick = function handleUpgradeClick() {
    var changePass = document.querySelector('#upgrade');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createUpgradeView();
    });
};
"use strict";
'use strict';

var handleError = function handleError(message) {
    $('#errorMessage').text(message);
    $('#beerMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $('#beerMessage').animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

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
