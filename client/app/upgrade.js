// create upgrade page info
// hide error message for now
const UpgradeAccount = (props) => {
    $('#beerMessage').animate({width:'hide'}, 350);
    return (
        <div id="upgradeContent">
            <h3>Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15!</h3>
            <p>For a one-time fee of $10 USD, you can increase your storage size so you never have to quelch your thirst for more beers! </p>
            <button className="upgradeButton">Upgrade</button>
        </div>
    );
};

// create title for upgrade page
const UpgradeTitle = (props) => {
    return (
        <h2 id="upgradeTitle">Upgrade Account</h2>
    );
};

// place title for page in top center of view
const createUpgradeTitle = () => {
    if(document.querySelector('#makeBeer')) {
        ReactDOM.render(
            <UpgradeTitle />,
            document.querySelector('#makeBeer')
        );
    } else {
        ReactDOM.render(
            <UpgradeTitle />,
            document.querySelector('#makeBrewery')
        );
    }
};

// create upgrade content in center of page
const createUpgradeAccountInfo = () => {
    if(document.querySelector('#beers')) {
        ReactDOM.render(
            <UpgradeAccount />,
            document.querySelector('#beers')
        );
    } else {
        ReactDOM.render(
            <UpgradeAccount />,
            document.querySelector('#breweries')
        );
    }
};

// call title and main info functions
const createUpgradeView = () => {
    createUpgradeTitle();
	createUpgradeAccountInfo();
};

// create view when gear icon clicked
const handleUpgradeClick = () => {
	const upgrade = document.querySelector('#upgrade');
	
	upgrade.addEventListener('click', e => {
		e.preventDefault();
        createUpgradeView();
	});
};
