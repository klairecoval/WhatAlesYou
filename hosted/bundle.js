'use strict';

var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    $('#beerMessage').animate({ width: 'hide' }, 350);

    if ($('currPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
        handleError('All fields required');
        return false;
    }

    if ($('#newPass').val() !== $('#newPass2').val()) {
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
            { htmlFor: 'currPass' },
            ' Current Password: '
        ),
        React.createElement('input', { id: 'currPass', type: 'password', name: 'currPass', placeholder: 'current password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPass' },
            ' New Password: '
        ),
        React.createElement('input', { id: 'newPass', type: 'password', name: 'newPass', placeholder: 'new password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPass2' },
            ' Confirm New Password: '
        ),
        React.createElement('input', { id: 'newPass2', type: 'password', name: 'newPass2', placeholder: 'confirm new pass' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf, placeholder: props.csrf }),
        React.createElement('input', { className: 'submitForm', type: 'submit', value: 'Change' })
    );
};

var PassTitle = function PassTitle(props) {
    return React.createElement(
        'h2',
        { id: 'changePassTitle' },
        'Change Password'
    );
};

var createPassTitle = function createPassTitle() {
    ReactDOM.render(React.createElement(PassTitle, null), document.querySelector('#makeBeer'));
};

var createChangePasswordForm = function createChangePasswordForm(csrf) {
    ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector('#beers'));
};

var createChangePasswordView = function createChangePasswordView(csrf) {
    createPassTitle();
    createChangePasswordForm(csrf);
};

var handleChangePasswordClick = function handleChangePasswordClick(csrf) {
    var changePass = document.querySelector('#changePassword');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createChangePasswordView(csrf);
    });
};

var getCSRFToken = function getCSRFToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        handleChangePasswordClick(result.csrfToken);
    });
};

$(document).ready(function () {
    getCSRFToken();
});
'use strict';

var handleBeer = function handleBeer(e) {
    e.preventDefault();

    $('#beerMessage').animate({ height: 'hide' }, 350);

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
        'div',
        null,
        React.createElement(
            'button',
            { id: 'newBeerBtn' },
            'New Beer'
        ),
        React.createElement(
            'div',
            { id: 'newBeerWindow', className: 'beerWindow' },
            React.createElement(
                'div',
                { className: 'newBeerContent' },
                React.createElement(
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
                ),
                React.createElement(
                    'span',
                    { className: 'close' },
                    '\xD7'
                )
            )
        )
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

var logNewBeer = function logNewBeer() {
    var modal = document.getElementById("newBeerWindow");

    // Get the button that opens the modal
    var btn = document.getElementById("newBeerBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(BeerForm, { csrf: csrf }), document.querySelector('#makeBeer'));

    ReactDOM.render(React.createElement(BeerList, { beers: [] }), document.querySelector('#beers'));

    logNewBeer();
    handleRecipesClick();
    handlePairingsClick();
    handleUpgradeClick();
    handleChangePasswordClick(csrf);
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
    $('#beerMessage').animate({ width: 'hide' }, 350);

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
            { className: 'pairing' },
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
        { id: 'pairingsTitle' },
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

var RecipesContainer = function RecipesContainer(props) {
    $('#beerMessage').animate({ width: 'hide' }, 350);

    if (props.recipes.length === 0) {
        return React.createElement(
            'div',
            null,
            'No recipes...yet!'
        );
    }
    var recipesList = props.recipes.map(function (recipe) {
        return React.createElement(
            'div',
            { className: 'recipe' },
            React.createElement(
                'h4',
                null,
                React.createElement(
                    'a',
                    { href: recipe.link },
                    recipe.name
                )
            ),
            React.createElement(
                'p',
                null,
                recipe.description
            )
        );
    });
    return React.createElement(
        'div',
        null,
        recipesList
    );
};

var loadRecipesFromServer = function loadRecipesFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getRecipes');

    var setRecipes = function setRecipes() {
        var recipesResponse = JSON.parse(xhr.response);

        ReactDOM.render(React.createElement(RecipesContainer, { recipes: recipesResponse }), document.getElementById('beers'));
    };

    xhr.onload = setRecipes;
    xhr.send();
};

var RecipesTitle = function RecipesTitle(props) {
    return React.createElement(
        'h2',
        { id: 'recipesTitle' },
        'Beer-Based Recipes'
    );
};

var createRecipesTitle = function createRecipesTitle() {
    ReactDOM.render(React.createElement(RecipesTitle, null), document.querySelector('#makeBeer'));
};

var createRecipesContainer = function createRecipesContainer() {
    ReactDOM.render(React.createElement(RecipesContainer, { recipes: [] }), document.getElementById('beers'));

    loadRecipesFromServer();
};

var createRecipesView = function createRecipesView() {
    createRecipesTitle();
    createRecipesContainer();
};

var handleRecipesClick = function handleRecipesClick() {
    var changePass = document.querySelector('#recipes');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createRecipesView();
    });
};
'use strict';

var UpgradeAccount = function UpgradeAccount(props) {
    $('#beerMessage').animate({ width: 'hide' }, 350);

    return React.createElement(
        'div',
        { id: 'upgradeContent' },
        React.createElement(
            'h3',
            null,
            'Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15!'
        ),
        React.createElement(
            'p',
            null,
            'For a one-time fee of $10 USD, you can increase your storage size so you never have to quelch your thirst for more beers! '
        ),
        React.createElement(
            'button',
            { className: 'upgradeButton' },
            'Upgrade'
        )
    );
};

var UpgradeTitle = function UpgradeTitle(props) {
    return React.createElement(
        'h2',
        { id: 'upgradeTitle' },
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
'use strict';

var handleError = function handleError(message) {
    $('#errorMessage').text(message);
    $('#beerMessage').animate({ height: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $('#beerMessage').animate({ height: 'hide' }, 350);
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
