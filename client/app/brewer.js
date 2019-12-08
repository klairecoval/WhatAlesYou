// check if brewery has all fields required
const handleBrewery = (e) => {
    e.preventDefault();

    $('#beerMessage').animate({height:'hide'}, 350);

    if($('#breweryName').val() == '' || $('#breweryAddress').val() == '' ||
        $('#breweryLink').val() == '' || $('#breweryNotes').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', $('#breweryForm').attr('action'), $('#breweryForm').serialize(), function() {
        loadBreweriesFromServer();
    });

    return false;
};

// delete beer by id
// reload after to update displayed beers
const deleteBrewery = (e) => {
	const id = e.target.parentElement.querySelector('.breweryId').innerText;
	const _csrf = document.querySelector('input[name="_csrf"]').value;
	
	sendAjax('DELETE', '/deleteBrewery', {id, _csrf}, data => {
		loadBreweriesFromServer();
	});
};

// search for a brewery by name
// reload displayed breweries to clear and only display searched
const searchBrewery = (e) => {
    e.preventDefault();
    $('#beerMessage').animate({height:'hide'}, 350);

    if($('#searchBrewery').val() == '') {
        handleError('Name is required for search');
        return false;
    }

    const search = e.target.parentElement.querySelector('#searchBrewery').value;

    sendAjax('GET', '/searchBrewery', {search}, (data) => {
        ReactDOM.render(
            <BreweryList breweries={data.breweries} />, document.querySelector('#breweries')
        );
    });
};

// create brewery form inside of a modal
const BreweryForm = (props) => {
    return (
        <div>
            <h1 id='makerTitle'>Breweries</h1>
            <form
                id='searchBreweryForm'
                onSubmit={searchBrewery}
                name='searchForm'
                action='/searchBrewery'
                method='POST'
                className='searchBreweryForm' >
                <label htmlFor='search'>Name: </label>
                <input id='searchBrewery' type='text' name='search' placeholder='Search' />
                <input className='searchBrewerySubmit' type='submit' value='Search' />
            </form>

            <button id="newBreweryBtn">New Brewery</button>
            <div id="newBreweryWindow" className="breweryWindow">
                <div className="newBreweryContent">
                    <form id='breweryForm'
                        onSubmit={handleBrewery}
                        name='breweryForm'
                        action='/breweries'
                        method='POST'
                        className='breweryForm' >
                            <span className="close">&times;</span>
                            <label htmlFor='name'>Name: </label>
                            <input id='breweryName' type='text' name='name' placeholder='Brewery Name' />
                            <label htmlFor='address'>Address: </label>
                            <input id='breweryAddress' type='text' name='address' placeholder='Address' />
                            <label htmlFor='link'>Link: </label>
                            <input id='breweryLink' type='text' name='link' placeholder='Link' />
                            <label htmlFor='notes'>Notes: </label>
                            <input id='breweryNotes' type='text' name='notes' placeholder='Notes' />
                            <label htmlFor='rating'>Rating: </label>
                            <div className='ratingSelect'>
                                <select id='breweryRating' name='rating' >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <input type='hidden' name='_csrf' value={props.csrf} />
                            <input className='makeBrewerySubmit' type='submit' value='Log Brewery' />
                    </form>
                </div>
            </div>
        </div>
    );
};

// create list of breweries
// if no breweries, create simple h3 saying no data
const BreweryList = function(props) {
    if(props.breweries.length === 0) {
        return (
            <div className='breweriesList'>
                <h3 className='emptyBrewery'>No Breweries Logged...Yet</h3>
            </div>
        );
    }

    const breweryNodes = props.breweries.sort(function(a,b){
        return a.name.localeCompare(b.name);
    })
    .map(function(brew) {
        return (
            <div key={brew._id} className='brewery'>
                <img src='/assets/img/brew.png' alt='brewery' className='breweryDefaultIcon'/>
                <button className='deleteBrewery' onClick={deleteBrewery}>&times;</button>
                <h3 className='breweryName'> {brew.name} </h3>
                <div className='breweryGroup1'>
                    <p className='breweryAddress'> <strong>Address:</strong> {brew.address} </p>
                    <p className='breweryLink'> <strong>Link: </strong><a href={brew.link}>{brew.link}</a> </p>
                </div>
                <div className='breweryGroup2'>
                    <p className='breweryNotes'> <strong>Notes:</strong> {brew.notes} </p>
                    <p className='breweryRating'> <strong>Rating:</strong> {brew.rating}/5 </p>
                </div>
                <span className='breweryId'>{brew._id}</span>
            </div>
        );
    });

    return (
        <div className='breweryList'>
            {breweryNodes}
            <p className='totalCount'>{props.breweries.length} breweries</p>
        </div>
    );
};

// load in breweries from server
// place them in center of page
const loadBreweriesFromServer = () => {
    sendAjax('GET', '/getBreweries', null, (data) => {
        ReactDOM.render(
            <BreweryList breweries={data.breweries} />, document.querySelector('#breweries')
        );
    });
};

// handle new brewery button (create modal)
const logNewBrewery = () => {
    const modal = document.getElementById("newBreweryWindow");
    const btn = document.getElementById("newBreweryBtn");
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

// render main page view of breweries
// load in all functions required to handle clicks for new views
const setupBrew = function(csrf) {
    if(document.querySelector('#makeBrewery')) {
        ReactDOM.render(
            <BreweryForm csrf={csrf} />, document.querySelector('#makeBrewery')
        );
        ReactDOM.render(
            <BreweryList breweries={[]} />, document.querySelector('#breweries')
        );
    
        loadBreweriesFromServer();
        logNewBrewery();
        handleRecipesClick();
        handlePairingsClick();
        handleUpgradeClick();
        handleChangePasswordClick(csrf);
    }
};

// get csrf token
const getBrewToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setupBrew(result.csrfToken);
    });
};

// instantiate above
$(document).ready(function() {
    getBrewToken();
});