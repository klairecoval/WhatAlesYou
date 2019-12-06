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
                <img src={pair.image} className="pairImg"/>
                <p id="pairTitle"><strong>{pair.beer}</strong> pair well with {pair.food}</p>
                <p id="subtext">{pair.about}</p>
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
        
        if(document.getElementById('beers')) {
            ReactDOM.render(
                <PairingsContainer pairs={pairResponse} />,
                document.getElementById('beers')
            );
        } else {
            ReactDOM.render(
                <PairingsContainer pairs={pairResponse} />,
                document.getElementById('breweries')
            );
        }
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
    if(document.querySelector('#makeBeer')) {
        ReactDOM.render(
            <PairingsTitle />,
            document.querySelector('#makeBeer')
        );
    } else {
        ReactDOM.render(
            <PairingsTitle />,
            document.querySelector('#makeBrewery')
        );
    }
};

// actually create pairings in center of page
const createPairingContainer = () => {
    if(document.getElementById('beers')) {
        ReactDOM.render(
            <PairingsContainer pairs={[]} />, 
            document.getElementById('beers')
        );
    } else {
        ReactDOM.render(
            <PairingsContainer pairs={[]} />, 
            document.getElementById('breweries')
        );
    }

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