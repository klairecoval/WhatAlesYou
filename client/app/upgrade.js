const handleAccountUpgrade = (e) => {
    e.preventDefault();

    sendAjax('POST', '/upgrade', null, function() {
        console.log('here?');
    });
};

const UpgradeAccount = (props) => {
    return (
        <div>
            <h2>Upgrade Account</h2>
            <h4>Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15 and remove ads.</h4>
            <p>For a one-time fee of $10 USD, you can increase your storage size so you never have to quench your thirst for more beers! </p>
            <a href='#' onClick={handleAccountUpgrade}>Upgrade</a>
        </div>
    );
};

const createUpgradeAccountInfo = () => {
	ReactDOM.render(
		<UpgradeAccount />,
		document.querySelector('#beers')
	);
};
