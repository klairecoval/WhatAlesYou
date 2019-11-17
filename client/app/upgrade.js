const UpgradeAccount = (props) => {
    $('#beerMessage').animate({width:'hide'}, 350);

    return (
        <div id="upgradeContent">
            <h3>Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15!</h3>
            <p>For a one-time fee of $10 USD, you can increase your storage size so you never have to quelch your thirst for more beers! </p>
            <button className="upgradeButton" >Upgrade</button>
        </div>
    );
};

const UpgradeTitle = (props) => {
    return (
        <h2 id="upgradeTitle">Upgrade Account</h2>
    );
};

const createUpgradeTitle = () => {
    ReactDOM.render(
        <UpgradeTitle />,
        document.querySelector('#makeBeer')
    );
};


const createUpgradeAccountInfo = () => {
	ReactDOM.render(
		<UpgradeAccount />,
		document.querySelector('#beers')
	);
};

const createUpgradeView = () => {
    createUpgradeTitle();
	createUpgradeAccountInfo();
};

const handleUpgradeClick = () => {
	const changePass = document.querySelector('#upgrade');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
        createUpgradeView();
	});
};
