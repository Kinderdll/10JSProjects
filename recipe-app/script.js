const meals = document.getElementById("meals");
const favoriteContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup'); 
const mealInfoEl = document.getElementById('meal-info'); 



getRandomMeal();
fetchFavMeals();



async function getRandomMeal(){
    const randomMeal =  await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await randomMeal.json();
    const _randomMeal = respData.meals[0];

    loadRandomMeal(_randomMeal, true);

}


async function getMealById(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const respData = await resp.json();
    
    return  respData.meals[0];
}

async function getMealsBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
    const respData = await resp.json();

    return respData.meals;

     
}

function loadRandomMeal(mealData , random = false){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = ` <div class="meal" id="meal">
    <div class="meal-header">
        ${random ? `<span class="random">Random Recipe </span>`:''} 
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart">
            </i>
        </button>
    </div>
</div>`

const btn = meal.querySelector('.meal-body .fav-btn'); 

btn.addEventListener("click",()=>{
    if(btn.classList.contains('active')){
        removeMealLS(mealData.idMeal);
        btn.classList.remove("active");
    }
    else
    {
        addMealLS(mealData.idMeal);
        btn.classList.add("active");
    }

    fetchFavMeals();


});
meal.addEventListener("click",()=>{
    showMealInfo(mealData);
    })


meals.appendChild(meal);

}

function addMealLS(mealID){
    const mealIds = getMealsFromLS();
    localStorage.setItem("mealIDs", JSON.stringify([...mealIds, mealID]));
}

function removeMealLS(mealID){
    const mealIDS = getMealsFromLS();

    localStorage.setItem("mealIDs",
    JSON.stringify(mealIDS.filter((id)=>id !==mealID)));
}

function getMealsFromLS(){
     const mealIds = JSON.parse(localStorage.getItem("mealIDs"));

     return mealIds === null ? [] : mealIds;
    }   

async function fetchFavMeals(){
    favoriteContainer.innerHTML="";
    const mealIDs = getMealsFromLS();

    for(let i=0;i<mealIDs.length;i++){
        const mealId = mealIDs[i];
        meal = await getMealById(mealId);

        addMealToFav(meal);
    }
}

function addMealToFav(mealData){
    const favMeal = document.createElement('li');

    favMeal.innerHTML = ` 
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i>
    </button>`;

    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click',()=>{
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    })

    favMeal.addEventListener("click",()=>{
        showMealInfo(mealData);
    })
    

favoriteContainer.appendChild(favMeal);

}


function showMealInfo(mealData){

    mealInfoEl.innerHTML=``;
    const mealEL = document.createElement('div');


    const ingredients=[];
    for(let i=1;i<20;i++){
        if(mealData["strIngredient"+i]){
            ingredients.push(
                `${mealData["strIngredient"+i]}-
                ${mealData["strMeasure"+i]}`
            );
        }
        else{
            break;
        }
    }



    mealEL.innerHTML=`
    <h1>${mealData.strMeal}</h1>
    <img 
        src=${mealData.strMealThumb} alt="">    
    <p>${mealData.strInstructions}</p>
    <h3>Ingredients</h3>
    <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
    </ul>`;

    mealInfoEl.appendChild(mealEL);

    mealPopup.classList.remove('hidden');
}
searchBtn.addEventListener("click",async () => {
    meals.innerHTML="";
    const search = searchTerm.value;
    const _searchMeals = await getMealsBySearch(search);
    if(_searchMeals){
        _searchMeals.forEach((_meal) => {
            loadRandomMeal(_meal);
          })
    }
    
    
});

popupCloseBtn.addEventListener("click",()=>{
    mealPopup.style.opacity=0;
    mealPopup.classList.add('hidden');
})