const handleBeer = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({width:'hide'}, 350);

    if($('#beerName').val() == '' || $('#beerAge').val() == '' || $('#beerHeight').val() === '') {
        handleError('RAWR! All fields are required');
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
            <label htmlFor='age'>Age: </label>
            <input id='beerAge' type='text' name='age' placeholder='Beer Age' />
            <label htmlFor="height">Height: </label>
            <input id="beerHeight" type="text" name="height" placeholder="Beer Height" />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeBeerSubmit' type='submit' value='Make Beer' />
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
                <img src='/assets/img/domoFace.jpeg' alt='beer face' className='beerFace'/>
                <h3 className='beerName'> Name: {beer.name} </h3>
                <h3 className='beerAge'> Age: {beer.age} </h3>
                <h3 className='beerHeight'> Height: {beer.height} </h3>
                <button className="deleteBeer" onClick={deleteBeer}>Remove</button>
                <span className="beerId">{beer._id}</span>
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