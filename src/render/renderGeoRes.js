/**
 * Renders (or clears) the #js-geo-result-cont element html, when a valid location is recorded.  If no location is recorded (STORE.earthWeather.location) wll clear any location rendered.  If called with submit = true will render form validation errors pertaining to location recorded or lack there of.
 */
function renderGeoRes(submit = false) {
    //prettier-ignore
    const html = $("#js-geo-result-cont").html(`
        ${
            submit
                ? `<img id="js-geo-result-icon" class="geo-error" src="assets/error.png">`
                : ""
        }
        <span id="js-geo-result" class="geo-result ${
            submit ? "geo-error" : ""
        }">${submit ? "Address not found" : ""}</span>
    `);

    if (STORE.earthWeather.location.isLocSet() && !submit) {
        $(html)
            .find("#js-geo-result")
            .html("Comparing " + STORE.earthWeather.location.address);
    }
}
