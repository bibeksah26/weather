const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

let currTab=userTab;
const API_KEY="e81c759e76b3e322a13374cf5ad93cfd";
currTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currTab){
        currTab.classList.remove("current-tab");
        currTab=clickedTab;
        currTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //isme hum abhi yourweather wale section me hai to hume weather display krna hoga uske liye hume coordinates
            // chahiye jo local storage me ho sakta 
            //hai
            getFromSessionStorage();

        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input tab
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    //pass clicked tab as input tab 
    switchTab(searchTab);
})


function getFromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }

    else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    //try block

    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //first,fetch elements

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");


    cityName.innerText= weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geolocation support available
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    const userCoordinates={
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
     
    if(cityName === ""){
        return;
    }

    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
     grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data= await response.json();
        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        //find out
    }
}




























// const API_KEY = "e81c759e76b3e322a13374cf5ad93cfd";

// async function showWeather() {
//     let city="goa";

//     const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data= await response.json();
//     console.log("Weather data:->" , data);

//     let newPara=document.createElement('p');

//     newPara.textContent=`${data?.main?.temp.toFixed(2)} C`;

//     document.body.appendChild(newPara);
// }