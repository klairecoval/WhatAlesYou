const RecipesContainer = (props) => {
    if(props.recipes.length === 0) {
        return (
            <div>No recipes...yet!</div>
        );
    }
    const recipesList = props.recipes.map((recipe) => {
        return (
            <div className="recipe">
                <h4><a href={recipe.link}>{recipe.name}</a></h4>
                <p>{recipe.description}</p>
            </div>
        );
    });
    return (
        <div>
            <h2>Have a lot of left-over beer? Cook it up!</h2>
            {recipesList}
        </div>
    );
};

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

const RecipesTitle = (props) => {
    return (
        <h2 id="recipesTitle">Beer-Based Recipes</h2>
    );
};

const createRecipesTitle = () => {
    ReactDOM.render(
        <RecipesTitle />,
        document.querySelector('#makeBeer')
    );
};

const createRecipesContainer = () => {
    ReactDOM.render(
        <RecipesContainer recipes={[]} />, 
        document.getElementById('beers')
    );

    loadRecipesFromServer();
};

const createRecipesView = () => {
    createRecipesTitle();
	createRecipesContainer();
};

const handleRecipesClick = () => {
	const changePass = document.querySelector('#recipes');
	
	changePass.addEventListener('click', e => {
		e.preventDefault();
		createRecipesView();
	});
};