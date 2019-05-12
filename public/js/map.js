mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhZnJhbmNlcyIsImEiOiJjanY5Z3Fmc3gwb3NmM3ltanphbmhlbjJ2In0.RurxxVNW1-cb21xzVvvdeg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  zoom: 16,
  pitch: 45,
  bearing: -17.6,
});

navigator.geolocation.getCurrentPosition(pos=>map.setCenter([pos.coords.longitude, pos.coords.latitude]));

map.on('load', mapOptions);

function mapOptions() {
  map.addSource('places', {
    type: 'geojson',
    data: places,
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.setLayoutProperty('country-label', 'text-field', ['get', 'name_es'])

  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
  }));

  var marker = new mapboxgl.Marker({
    draggable: true
  })
    .setLngLat([-3.703252, 40.425530])
    .addTo(map);

  function onDragEnd() {
    let lngLat = marker.getLngLat();
    //aqui tengo las coordenadas para mandarlo

  }

  marker.on('dragend', onDragEnd);
  let layers = map.getStyle().layers;

  let labelLayerId;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',

      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "height"]
      ],
      'fill-extrusion-base': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
      ],
      'fill-extrusion-opacity': .6
    }
  }, labelLayerId);
  buildLocationList(places);
}

function buildLocationList(data) {

  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties;
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));

    listing.className = 'item';
    listing.id = 'listing-' + i;

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.name;

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = '<b>Address: </b>' + prop.address;
    if (prop.phone) { details.innerHTML += ' · <b>Phone: </b>' + prop.phone }
    if (prop.description) { details.innerHTML += '<p>' + prop.description + '</p>' }

    const userLike = prop.favorites.map(favorite => favorite.user)
    let classlike = ''
    if (userLike.includes(prop.userLoginID)) { classlike = 'red' } else { classlike = 'black' }

    details.innerHTML += '<div><i class="fas fa-heart heart ' + classlike + '" data-local-id="' + prop.placeID + '" onclick="onClickLikeLocal(event)" ></i><p class="likes">' + prop.favorites.length + ' likes</p></div>'

    link.addEventListener('click', function (e) {
      var clickedListing = data.features[this.dataPosition];
      flyToStore(clickedListing);
      createPopUp(clickedListing);

      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) { activeItem[0].classList.remove('active'); }

      this.parentNode.classList.add('active');
    });
  }
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 17
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({
    closeOnClick: false
  })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<img src="' + currentFeature.properties.image + '"><h3 style="font-size: 22px"><a href="/local/' + currentFeature.properties.placeID + '">' + currentFeature.properties.name + '</a></h3>' +
      '<span style="color: black">' + currentFeature.properties.address + '</span>')
    .addTo(map);
}


places.features.forEach(function (marker) {
  var el = document.createElement('div');
  switch (marker.type) {
    case "bar":
      el.className = 'markerBar';
      break;
    case "night_club":
      el.className = 'markerNight_club';
      break;
    case "cafe":
      el.className = 'markerCoffe';
      break;
    case "Restaurant":
      el.className = 'markerRestaurant';
      break;
  }

  new mapboxgl.Marker(el, {
    offset: [0, -23]
  })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);


  el.addEventListener('click', function (e) {
    var activeItem = document.getElementsByClassName('active');
    flyToStore(marker);
    createPopUp(marker);
    e.stopPropagation();
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    var listing = document.getElementById('listing-' + i);
    console.log(listing);
    listing.classList.add('active');
  });
});