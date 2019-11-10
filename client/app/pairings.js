const PairingsContainter = (props) => {
    if(props.pairs.length === 0) {
        return (
            <div>No pairs...yet!</div>
        );
    }
    const pairsList = props.pairs.map((pair) => {
        return (
            <div>
                <h4>{pair.beer} pairs well with {pair.food}</h4>
            </div>
        );
    });
    return (
        <div>
            <h2>Pairings</h2>
            <h4>Ever wondered what foods would pair best with your favorite types of beers? If so, look no further!</h4>
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
            <PairingsContainter pairs={pairResponse} />,
            document.getElementById('beers')
        );
    };

    xhr.onload = setPairs;
    xhr.send();
};

const init = () => {
    ReactDOM.render(
        <PairingsContainter songs={[]} />, 
        document.getElementById('beers')
    );

    loadPairsFromServer();
};

window.onload = init;