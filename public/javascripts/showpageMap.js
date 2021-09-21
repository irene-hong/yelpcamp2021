mapboxgl.accessToken = mpbToken;

const map = new mapboxgl.Map({
    container: 'campground-map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#DAA520"
}).setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h6 class="text-muted">${camp.title}</h6>`
        )
    )
    .addTo(map);
