const socket = io();

const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let userMarker;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });

            if (userMarker) {
                userMarker.setLatLng([latitude, longitude]);
            } else {
                userMarker = L.marker([latitude, longitude]).addTo(map);
                map.setView([latitude, longitude], 13);
            }
        },
        (error) => {
            console.error('Error getting location:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        }
    );
}

socket.on('location-update', (location) => {
    const { latitude, longitude } = location;

    if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
    } else {
        userMarker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
    }
});
