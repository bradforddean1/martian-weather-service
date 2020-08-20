/**
 * Attempts to match the input to an actual location using the google geocding api.
 * With a successful match will set the standardized Postal Address, as well as Latitude and Longitude coordinates to the STORE variable.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @param {string} – The location submitted by the user
 * @return {Promise} Promise object with boolean indicating success or fail.
 *
 */
function geolocate(location) {
    let params = {
        address: encodeURI(location),
        key: "AIzaSyBDJyedOS2VN3Fxz4eutyeM1_grLUQfp7s",
    };

    params = formatQueryParams(params);

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.status == "ZERO_RESULTS") {
                throw new Error("No Result");
            }

            STORE.earthWeather.location.lat =
                responseJson.results[0].geometry.location.lat;
            STORE.earthWeather.location.lon =
                responseJson.results[0].geometry.location.lng;
            STORE.earthWeather.location.address =
                responseJson.results[0].formatted_address;

            return true;
        })
        .catch((err) => {
            STORE.earthWeather.location.lat = null;
            STORE.earthWeather.location.lon = null;
            STORE.earthWeather.location.address = "";
            return false;
        });
}
