// safety check recipes exist or are loaded
// create individual recipe cards
const RecipesContainer = (props) => {
    $('#beerMessage').animate({width:'hide'}, 350);

    if(props.recipes.length === 0) {
        return (
            <div>No recipes...yet!</div>
        );
    }
    const recipesList = props.recipes.map((recipe) => {
        return (
            <div className="recipe">
                <img src={recipe.image} className="recipeImg"/>
                <h4><a href={recipe.link}>{recipe.name}</a></h4>
                <p>{recipe.description}</p>
            </div>
        );
    });
    return (
        <div>
            {recipesList}
        </div>
    );
};

// load in recipes from server
const loadRecipesFromServer = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getRecipes');

    const setRecipes = () => {
        const recipesResponse = JSON.parse(xhr.response);

        ReactDOM.render(
            <RecipesContainer recipes={recipesResponse} />,
            document.getElementById('beers')
        );
    };

    xhr.onload = setRecipes;
    xhr.send();
};

// create header title for view
const RecipesTitle = (props) => {
    return (
        <h2 id="recipesTitle">Beer-Based Recipes</h2>
    );
};

// place title in center top of page, below nav bar
const createRecipesTitle = () => {
    ReactDOM.render(
        <RecipesTitle />,
        document.querySelector('#makeBeer')
    );
};

// create recipes in center of page
const createRecipesContainer = () => {
    ReactDOM.render(
        <RecipesContainer recipes={[]} />, 
        document.getElementById('beers')
    );

    loadRecipesFromServer();
};

// call both functions for recipe view
const createRecipesView = () => {
    createRecipesTitle();
	createRecipesContainer();
};

// when chefs hat icon clicked, create view
const handleRecipesClick = () => {
	const changePass = document.querySelector('#recipes');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createRecipesView();
	});
};