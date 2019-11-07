'use strict';

var handleBeer = function handleBeer(e) {
    e.preventDefault();

    $('#beerMessage').animate({ width: 'hide' }, 350);

    if ($('#beerName').val() == '' || $('#beerAge').val() == '' || $('#beerHeight').val() === '') {
        handleError('RAWR! All fields are required');
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
            'Age: '
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
        return React.createElement(
            'div',
            { key: beer._id, className: 'beer' },
            React.createElement('img', { src: '/assets/img/domoFace.jpeg', alt: 'beer face', className: 'beerFace' }),
            React.createElement(
                'h3',
                { className: 'beerName' },
                ' Name: ',
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
