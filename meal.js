//1- Link to get a random meal
//https://www.themealdb.com/api/json/v1/1/random.php

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=

const mealsElement = document.getElementById('meals');
const favoritesElement = document.querySelector('.favorites');
const searchBtn = document.querySelector('#search');
const searchTerm = document.querySelector('#search-term');

function initMain ()
{
getRandomMeal();
updateFavoriteMeals();

searchBtn.addEventListener('click', async()=>{

    mealsElement.innerHTML = "";

    const searchWord = searchTerm.value;

    const meals = await getMealBySearch(searchWord);
    
    if (meals)
    {
        for(let i = 0; i< meals.length; i++ )
        {
            addMeal(meals[i]);
        }
    }
})
}

async function getRandomMeal()
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    
    const randomData =await resp.json();
   
    const randomMeal = randomData.meals[0];
    console.log(randomMeal);

    mealsElement.innerHTML = "";
    addMeal(randomMeal, true);   

}

function addMeal(mealData, random = false)
{
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = ` <div class="meal-header">
                            ${
                        random? `<span class="random">Meal of the Day</span>`:""
                            }
                         <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        </div>
                        <div class="meal-body">
                            <h3>${mealData.strMeal}</h3>
                            <button class="fav-btn">
                            <i class="fas fa-heart"></i>
                            </button>
                         </div>`;

let favoriteButton = meal.querySelector(".fav-btn");
favoriteButton.addEventListener("click", ()=> {
    if(favoriteButton.classList.contains('active'))
{
    //To deactivate the button make the color grey 
    favoriteButton.classList.remove('active');
    removeMealFromLocalStorage(mealData.idMeal);
}
else
{
    //we need to activate the button by making the color red
    favoriteButton.classList.add('active')
    addMealToLocalStorage(mealData.idMeal);
}

    updateFavoriteMeals()
});

mealsElement.appendChild(meal);

const mealHeader = meal.querySelector(".meal-header");
mealHeader.addEventListener('click', () =>{
    openMealDetailsPage(mealData);
});

}

function addMealToLocalStorage(mealId)
{

    const mealIds =getMealsFromLocalStorage();

    localStorage.setItem('mealIds',JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLocalStorage(mealId)
{
    const mealIds =getMealsFromLocalStorage(); 
    localStorage.setItem('mealIds',JSON.stringify(
        mealIds.filter(id => id!=mealId)
    ));
}

function getMealsFromLocalStorage()
{
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null? [] : mealIds
}

async function updateFavoriteMeals()
{
    favoritesElement.innerHTML = "";
    const mealIds = getMealsFromLocalStorage();

    for (let i=0; i<mealIds.length; i++)
    {
        let tmpMeal = await getMealByID(mealIds[i]);

        addMealToFavorites(tmpMeal);
    }
}
async function getMealByID(id)
{
    
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    
    const respData = await resp.json();
   
    const meal = respData.meals && respData.meals.length > 0 ? respData.meals[0] : null;
    //console.log(meal);

    return meal
    
}

    function addMealToFavorites(mealData)
{

    const favoriteMeal = document.createElement('li');
    favoriteMeal.innerHTML = `
                <img id="fav-img" 
                    src="${mealData.strMealThumb}" 
                     alt="${mealData.strMealThumb}">
                <span>${mealData.strMealThumb}</span>
                <button class="clear"><i class="fas fa-window-close"></i></button>`

    const clearBtn = favoriteMeal.querySelector('.clear');
    clearBtn.addEventListener("click", ()=>{
        removeMealFromLocalStorage(mealData.idMeal);
        updateFavoriteMeals();
    });           
    favoritesElement.appendChild(favoriteMeal);

    const favId = favoriteMeal.querySelector("#fav-img");
    favId.addEventListener('click', () =>{
        openMealDetailsPage(mealData);

    })

}

async function getMealBySearch(term)
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
    
    const respData =await resp.json();
   
    const meals = respData.meals;

    return meals;
}

function openMealDetailsPage(mealData)
{
    window.open("details.html?mealId="+ mealData.idMeal, "_self")
}


function initDetailsPage()
{
    const urlParams = new URLSearchParams(window.location.search);
    //console.log(window.location.href);
    const mealId = urlParams.get('mealId');
   // console.log(mealId);

    showMealDetails(mealId);
}

async function showMealDetails(mealId)
{
    let tmpMeal = await getMealByID(mealId);
    console.log(tmpMeal);

    const mealDetailsContainer = document.querySelector('.meal-container');

    mealDetailsContainer.innerHTML = `<a href="meal.html">Home</a>
    <div class="meal-info">
        <div>
            <h1>${tmpMeal.strMeal}</h1>
            <img src="${tmpMeal.strMealThumb}" alt="$tmpMeal.strMeal">
        </div>
        <div>
            <p>${tmpMeal.strInstructions}</p>
                <ul>
                    <li>Ingredient /measure</li>
                    <li>Ingredient /measure</li>
                    <li>Ingredient /measure</li>
                </ul>
        </div>
    </div>`;
}

