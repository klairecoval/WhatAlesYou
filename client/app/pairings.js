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

const PairingsTitle = (props) => {
    return (
        <h2 id="pairingsTitle">Food-Beer Pairings</h2>
    );
};

const createPairingsTitle = () => {
    ReactDOM.render(
        <PairingsTitle />,
        document.querySelector('#makeBeer')
    );
};

const createPairingContainer = () => {
    ReactDOM.render(
        <PairingsContainer pairs={[]} />, 
        document.getElementById('beers')
    );

    loadPairsFromServer();
};

const createPairingsView = () => {
    createPairingsTitle();
	createPairingContainer();
};

const handlePairingsClick = () => {
	const changePass = document.querySelector('#pairings');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createPairingsView();
	});
};