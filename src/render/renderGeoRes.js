function renderGeoRes(submit = false) {
    //prettier-ignore
    console.log('renderGeoRes submit', submit)
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
