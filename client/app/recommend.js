
const RecsContainer = (props) => {
    $('#beerMessage').animate({width:'hide'}, 350);

    if(props.recs.length === 0) {
        return (
            <div>No recommendations...yet!</div>
        );
    }
    const recsList = props.recs.map((rec) => {
        return (
            <div className="recommendation">
                <p>{rec.name}</p>
            </div>
        );
    });
    return (
        <div>
            {recsList}
        </div>
    ); 
};

const RecsTitle = (props) => {
    return (
        <h2 id="recsTitle">Recommendations from Other Users</h2>
    );
};

// create title at top of page, below nav
const createRecsTitle = () => {
    ReactDOM.render(
        <RecsTitle />,
        document.querySelector('#makeBeer')
    );
};

const createRecsContainer = () => {
    ReactDOM.render(
        <RecsContainer recs={[]} />, 
        document.getElementById('beers')
    );

    // loadRecs();
};

const createRecsView = () => {
    createRecsTitle();
    createRecsContainer();
};

// when drink and burger icon clicked, create view
const handleRecsClick = () => {
	const changePass = document.querySelector('#rec');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createRecsView();
	});
};