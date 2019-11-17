// safety check that pairings exist/are loaded
// create pairings list
const PairingsContainer = (props) => {
    $('#beerMessage').animate({width:'hide'}, 350);

    if(props.pairs.length === 0) {
        return (
            <div>No pairs...yet!</div>
        );
    }
    const pairsList = props.pairs.map((pair) => {
        return (
            <div className="pairing">
                <h4>{pair.beer} pairs well with {pair.food}</h4>
            </div>
        );
    });
    return (
        <div>
            {pairsList}
        </div>
    );
};

// load in pairings from server
const loadPairsFromServer = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getPairs');

    const setPairs = () => {
        const pairResponse = JSON.parse(xhr.response);

        ReactDOM.render(
            <PairingsContainer pairs={pairResponse} />,
            document.getElementById('beers')
        );
    };

    xhr.onload = setPairs;
    xhr.send();
};

// create title for pairings page to replace new beer button
const PairingsTitle = (props) => {
    return (
        <h2 id="pairingsTitle">Food-Beer Pairings</h2>
    );
};

// create title at top of page, below nav
const createPairingsTitle = () => {
    ReactDOM.render(
        <PairingsTitle />,
        document.querySelector('#makeBeer')
    );
};

// actually create pairings in center of page
const createPairingContainer = () => {
    ReactDOM.render(
        <PairingsContainer pairs={[]} />, 
        document.getElementById('beers')
    );

    loadPairsFromServer();
};

// create total pairings view (call both needed functions)
const createPairingsView = () => {
    createPairingsTitle();
	createPairingContainer();
};

// when drink and burger icon clicked, create view
const handlePairingsClick = () => {
	const changePass = document.querySelector('#pairings');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createPairingsView();
	});
};