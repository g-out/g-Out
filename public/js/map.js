mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhZnJhbmNlcyIsImEiOiJjanY5Z3Fmc3gwb3NmM3ltanphbmhlbjJ2In0.RurxxVNW1-cb21xzVvvdeg';
// This adds the map to your page
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v10',
  // initial position in [lon, lat] format
  center: [-3.703252, 40.425530],
  // initial zoom
  zoom: 12
});


map.on('load', function(e) {
  // Add the data to your map as a layer
  map.addSource('places', {
    type: 'geojson',
    data: places
  });
  buildLocationList(places);
});

function buildLocationList(data) {
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    // Shorten data.feature.properties to `prop` so we're not
    // writing this long form over and over again.
    var prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;

    // Create a new link with the class 'title' for each store
    // and fill it with the store address
    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.name;

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = '<b>Address: </b>' + prop.address;
    if (prop.phone) {
      details.innerHTML += ' · <b>Phone: </b>' + prop.phone;
    }
    if(prop.description){
      details.innerHTML += '<p>' + prop.description + '</p>';
    }

    details.innerHTML += '<div><i class="fas fa-heart black heart" data-local-id="' + prop.placeID + '" onclick="onClickLikeLocal(event)" ></i><p class="likes">${conteo_de_likes_helpers} likes</p></div>'

    // Add an event listener for the links in the sidebar listing
    link.addEventListener('click', function(e) {
      // Update the currentFeature to the store associated with the clicked link
      var clickedListing = data.features[this.dataPosition];
      // 1. Fly to the point associated with the clicked link
      flyToStore(clickedListing);
      // 2. Close all other popups and display popup for clicked store
      createPopUp(clickedListing);
      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  
  }
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<img src="'+currentFeature.properties.image+'"><h3 style="font-size: 22px"><a href="/local/'+ currentFeature.properties.placeID + '">'+currentFeature.properties.name+'</a></h3>' +
      '<span style="color: black">' + currentFeature.properties.address + '</span>')
    .addTo(map);
}


places.features.forEach(function (marker) {
  // Create a div element for the marker
  var el = document.createElement('div');
  // Add a class called 'marker' to each div
  switch (marker.type) {
    case "bar":
      el.className = 'markerBar';
    break;
    case "Restaurant":
      el.className = 'markerRestaurant';
    break;
    case "night_club":
      el.className = 'markerNight_club';
    break;
    case "cafe":
    console.log('cafe')
      el.className = 'markerCoffe';
    break;
  }
  // By default the image for your custom marker will be anchored
  // by its center. Adjust the position accordingly
  // Create the custom markers, set their position, and add to map
  new mapboxgl.Marker(el, { offset: [0, -23] })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);


  el.addEventListener('click', function (e) {
    var activeItem = document.getElementsByClassName('active');
    // 1. Fly to the point
    flyToStore(marker);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(marker);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    e.stopPropagation();
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    var listing = document.getElementById('listing-' + i);
    console.log(listing);
    listing.classList.add('active');
  });
});
