// check if all fields have values
// if not, return proper error message
// if there are beers, load them in
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

// delete a beer by id
// reload beers to update view
const deleteBeer = (e) => {
	const id = e.target.parentElement.querySelector('.beerId').innerText;
	const _csrf = document.querySelector('input[name="_csrf"]').value;
	
	sendAjax('DELETE', '/deleteBeer', {id, _csrf}, data => {
		loadBeersFromServer();
	});
};

// search for a beer
// reload displayed beers
const searchBeer = (e) => {
    e.preventDefault();
    $('#beerMessage').animate({height:'hide'}, 350);

    if($('#searchBeer').val() == '') {
        handleError('Name is required for search');
        return false;
    }

    const search = e.target.parentElement.querySelector('#searchBeer').value;


    sendAjax('GET', '/searchBeer', {search}, (data) => {
        ReactDOM.render(
            <BeerList beers={data.beers} />, document.querySelector('#beers')
        );
    });
};

// create beer form inside of a modal
const BeerForm = (props) => {
    return (
        <div>
            <h1 id='makerTitle'>Beers</h1>
            <form
                id='searchBeerForm'
                onSubmit={searchBeer}
                name='searchForm'
                action='/searchBeer'
                method='POST'
                className='searchBeerForm' >
                <label htmlFor='search'>Name: </label>
                <input id='searchBeer' type='text' name='search' placeholder='Search' />
                <input className='searchBeerSubmit' type='submit' value='Search' />
            </form>

            <button id="newBeerBtn">New Beer</button>
            <div id="newBeerWindow" className="beerWindow">
                <div className="newBeerContent">
                    <form id='beerForm'
                        onSubmit={handleBeer}
                        name='beerForm'
                        action='/maker'
                        method='POST'
                        className='beerForm' >
                            <span className="close">&times;</span>
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
                            <label htmlFor='rating'>Rating: </label>
                            <div className='ratingSelect'>
                                <select id='beerRating' name='rating' >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <input type='hidden' name='_csrf' value={props.csrf} />
                            <input className='makeBeerSubmit' type='submit' value='Log Beer' />
                    </form>
                </div>
            </div>
        </div>
    );
};

// create list of beers
// if no beers, create simple h3 saying no data
const BeerList = function(props) {
    if(props.beers.length === 0) {
        return (
            <div className='beersList'>
                <h3 className='emptyBeer'>No Beers Yet</h3>
            </div>
        );
    }

    const beerNodes = props.beers.sort(function(a,b){
        return a.name.localeCompare(b.name);
    })
    .map(function(beer) {
        return (
            <div key={beer._id} className='beer'>
                <img src='/assets/img/beerIcon.png' alt='beer face' className='beerDefaultIcon'/>
                <button className='deleteBeer' onClick={deleteBeer}>&times;</button>
                <h3 className='beerName'> {beer.name} </h3>
                <div className='beerGroup1'>
                    <p className='beerBrewer'> <strong>Brewer:</strong> {beer.brewer} </p>
                    <p className='beerType'> <strong>Type:</strong> {beer.type} </p>
                    <p className='beerABV'> <strong>ABV:</strong> {beer.abv} </p>
                </div>
                <div className='beerGroup2'>
                    <p className='beerIBU'> <strong>IBU:</strong> {beer.ibu} </p>
                    <p className='beerNotes'> <strong>Type:</strong> {beer.notes} </p>
                    <p className='beerRating'> <strong>Rating:</strong> {beer.rating} </p>
                </div>
                <span className='beerId'>{beer._id}</span>
            </div>
        );
    });

    return (
        <div className='beerList'>
            {beerNodes}
            <p className='totalCount'>{props.beers.length} beers</p>
        </div>
    );
};

// load in beers from server
// place them in center of page
const loadBeersFromServer = () => {
    sendAjax('GET', '/getBeers', null, (data) => {
        ReactDOM.render(
            <BeerList beers={data.beers} />, document.querySelector('#beers')
        );
    });
};

// handle new beer button (create modal)
const logNewBeer = () => {
    const modal = document.getElementById("newBeerWindow");
    const btn = document.getElementById("newBeerBtn");
    const span = document.getElementsByClassName("close")[0];
    
    btn.onclick = function() {
      modal.style.display = "block";
    }
    
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // if user clicks outside the modal, close
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
};

// render main page view of beers
// load in all functions required to handle clicks for new views
const setup = function(csrf) {
    if(document.querySelector('#makeBeer')) {
        ReactDOM.render(
            <BeerForm csrf={csrf} />, document.querySelector('#makeBeer')
        );
    
        ReactDOM.render(
            <BeerList beers={[]} />, document.querySelector('#beers')
        );
    
        loadBeersFromServer();
        logNewBeer();
        handleRecipesClick();
        handlePairingsClick();
        handleUpgradeClick();
        handleChangePasswordClick(csrf);
    }
};

// get csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// instantiate above
$(document).ready(function() {
    getToken();
});