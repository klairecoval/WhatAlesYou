const UpgradeAccount = (props) => {
    return (
        <div>
            <h4>Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15 and remove ads.</h4>
            <p>For a one-time fee of $10 USD, you can increase your storage size so you never have to quench your thirst for more beers! </p>
            <a href='#'>Upgrade</a>
        </div>
    );
};

const UpgradeTitle = (props) => {
    return (
        <h2>Upgrade Account</h2>
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
