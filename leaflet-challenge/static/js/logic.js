// Determining marker size based on Magnitude
function createMarkerSize(magnitude) {
    return magnitude * 3;
}

// Determining color based on depth
function createColor(depth) {
    if (depth <= 10) return "#69fa02";
    else if (depth <= 30) return "#b0fa02";
    else if (depth <= 50) return "#facd02";
    else if (depth <= 70) return "#fa9f02";
    else if (depth <= 90) return "#fa7602";
    else return "#fa2b02";
}

// Creating the Tile Layer for the map
const USmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Creating the map object
const map = L.map("map", {
    center: [40, -105],
    zoom: 5,
    layers: [USmap] // Initializing the map with only the USmap layer
});

// Base maps object for layer control
const baseMaps = {
    "OpenStreetMap": USmap
};

// Overlay object for the earthquake layer
let earthquakeLayer = L.layerGroup();

// Creating Layer Control (to toggle between layers)
L.control.layers(baseMaps, {
    "Earthquakes": earthquakeLayer
}, {
    collapsed: false
}).addTo(map);

// Adding a legend to the map
const legend = L.control({position: "bottomright"});
legend.onAdd = function(map) {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<div><span style="background: rgb(105, 250, 2);"></span> -10–10</div>';
    div.innerHTML += '<div><span style="background: rgb(176,250,2);"></span> 10–30</div>';
    div.innerHTML += '<div><span style="background: rgb(250,205,2);"></span> 30–50</div>';
    div.innerHTML += '<div><span style="background: rgb(250,159,2);"></span> 50–70</div>';
    div.innerHTML += '<div><span style="background: rgb(250,118,2);"></span> 70–90</div>';
    div.innerHTML += '<div><span style="background: rgb(250,43,2);"></span> 90+</div>';
    return div;
};
legend.addTo(map);

// Function to create earthquake markers and add them to the map
function createMarkers(response) {
    const features = response.features;
    console.log("Features Array:", features);
    features.forEach(feature => {
        const [longitude, latitude, depth] = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const location = feature.properties.place;

        console.log(`Creating marker for ${location} | Mag: ${magnitude} | Depth: ${depth}`);
        const marker = L.circleMarker([latitude, longitude], {
            radius: createMarkerSize(magnitude),
            fillColor: createColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(
            `<h3>Location: ${location}</h3>
             <h4>Magnitude: ${magnitude}</h4>
             <h4>Depth: ${depth} km</h4>`
        );
        earthquakeLayer.addLayer(marker); // Add the marker to the earthquake layer
    });

    earthquakeLayer.addTo(map); // Add the earthquake layer to the map after all markers are created
}

// Fetching the earthquake data and calling createMarkers function
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);
