
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
                    <img src='/assets/img/beerIcon.png' alt='beer face' className='beerDefaultIcon'/>
                    <h3 className='beerName'> {rec.name} </h3>
                    <h3 className='beerBrewer'> Brewer: {rec.brewer} </h3>
                    <h3 className='beerType'> Type: {rec.type} </h3>
                    <h3 className='beerABV'> ABV: {rec.abv} </h3>
                    <h3 className='beerIBU'> IBU: {rec.ibu} </h3>
                    <h3 className='beerNotes'> Type: {rec.notes} </h3>
                    <span className='beerId'>{rec._id}</span>
            </div>
        );
    });
    return (
        <div>
            {recsList}
        </div>
    ); 
};

const loadRecs = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getRecs');

    const setRecs = () => {
        const recsResponse = JSON.parse(xhr.response);

        ReactDOM.render(
            <RecsContainer recs={recsResponse} />,
            document.getElementById('beers')
        );
    };

    xhr.onload = setRecs;
    xhr.send();
};

const RecsTitle = (props) => {
    return (
        <h2 id="recsTitle">Recommended Beers</h2>
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

    loadRecs();
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