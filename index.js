//Map to initialize
let map;

const EBIRDAPI = "HIDDEN"; 
const GOOGLEMAPSAPI = "HIDDEN";


//Function to create map with correct zoom and location
function initMap() {
  const location = { lat: 42.4534, lng: -76.4735 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: location,
  });
}

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEMAPSAPI}&callback=initMap`;
document.head.appendChild(script);

//Function to give user directions to marker
function getDirections(lat, lng) {
  const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(directionsURL, "_blank");
}

//Setup for eBird api - setting api token
const myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", EBIRDAPI);

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};


//Fetching data from eBird api
fetch("https://api.ebird.org/v2/data/obs/US-NY-109/recent/notable?detail=full", requestOptions)
  .then((res) => {
    return res.json();
  })

//Looping through data and taking out bird name and location
.then((data) => {
    data.forEach((bird) => {
        const birdName = bird.comName;
        const birdLat = bird.lat;
        const birdLng = bird.lng;

        //Setting marker with bird name at location
        const marker = new google.maps.Marker({
          position: { lat: birdLat, lng: birdLng },
          map: map,
          title: birdName,
        });

        /* Displays window when you click on marker - 
         * shows bird name and shows button to get directions */
        const infowindow = new google.maps.InfoWindow({
          content: `
            <div class="info">
              <p>${birdName}</p>
              <button onclick="getDirections(${birdLat}, ${birdLng})" class="dirBut">Get Directions</button>
            </div>
          `,
        });

        marker.addListener("click", function () {
          infowindow.open(map, marker);
        });
      });
    })
    .catch((error) => console.log('error', error));
