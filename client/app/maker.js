const handleBeer = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({height:'hide'}, 350);

    if($('#beerName').val() == '' || $('#beerBrewer').val() == '' || $('#beerType').val() == '' ||
        $('#beerABV').val() == '' || $('#beerIBU').val() == '' || $('#beerNotes').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', $('#beerForm').attr('action'), $('#beerForm').serialize(), function() {
        loadBeersFromServer();
    });

    return false;
};

const deleteBeer = e => {
	const id = e.target.parentElement.querySelector('.beerId').innerText;
	const _csrf = document.querySelector('input[name="_csrf"]').value;
	
	sendAjax('DELETE', '/deleteBeer', {id, _csrf}, data => {
		loadBeersFromServer();
	});
};

const BeerForm = (props) => {
    return (
        <form id='beerForm'
        onSubmit={handleBeer}
        name='beerForm'
        action='/maker'
        method='POST'
        className='beerForm' >
            <label htmlFor='name'>Name: </label>
            <input id='beerName' type='text' name='name' placeholder='Beer Name' />
            <label htmlFor='brewer'>Brewer: </label>
            <input id='beerBrewer' type='text' name='brewer' placeholder='Brewer' />
            <label htmlFor='type'>Type: </label>
            <input id='beerType' type='text' name='type' placeholder='Type' />
            <label htmlFor='abv'>ABV: </label>
            <input id='beerABV' type='text' name='abv' placeholder='ABV' />
            <label htmlFor='ibu'>IBU: </label>
            <input id='beerIBU' type='text' name='ibu' placeholder='IBU' />
            <label htmlFor='notes'>Notes: </label>
            <input id='beerNotes' type='text' name='notes' placeholder='Notes' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeBeerSubmit' type='submit' value='Log Beer' />
        </form>
    );
};

const BeerList = function(props) {
    if(props.beers.length === 0) {
        return (
            <div className='beersList'>
                <h3 className='emptyBeer'>No Beers Yet</h3>
            </div>
        );
    }

    const beerNodes = props.beers.map(function(beer) {
        return (
            <div key={beer._id} className='beer'>
                <img src='/assets/img/beerIcon.png' alt='beer face' className='beerDefaultIcon'/>
                <h3 className='beerName'> {beer.name} </h3>
                <h3 className='beerBrewer'> Brewer: {beer.brewer} </h3>
                <h3 className='beerType'> Type: {beer.type} </h3>
                <h3 className='beerABV'> ABV: {beer.abv} </h3>
                <h3 className='beerIBU'> IBU: {beer.ibu} </h3>
                <h3 className='beerNotes'> Type: {beer.notes} </h3>
                <button className='deleteBeer' onClick={deleteBeer}>Remove</button>
                <span className='beerId'>{beer._id}</span>
            </div>
        );
    });

    return (
        <div className='beerList'>
            {beerNodes}
        </div>
    );
};

const loadBeersFromServer = () => {
    sendAjax('GET', '/getBeers', null, (data) => {
        ReactDOM.render(
            <BeerList beers={data.beers} />, document.querySelector('#beers')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <BeerForm csrf={csrf} />, document.querySelector('#makeBeer')
    );

    ReactDOM.render(
        <BeerList beers={[]} />, document.querySelector('#beers')
    );

    handleRecipesClick();
    handlePairingsClick();
    handleUpgradeClick();
    handleChangePasswordClick(csrf);
    loadBeersFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});