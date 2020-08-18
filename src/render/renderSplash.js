function renderSplash() {
    $("#js-content-wrapper").html(`
        <header class="bg-dark splash">
            <div class="container">
                <h1>Martian Weather Service</h1>
            </div>
        </header>
        <hr>
        <main class="container fill">
            <div class="graphic-back fill">
                <div class="gradient-back"></div>
                <div class="wrapper centered-content">
                    <form id="js-comp-earth-to-mars" class="container splash-content action="sumbit">
                        <div class="container vbox">
                            <p class="splash-summary">
                                Compare your local weather to the weather at Elysium
                                Planitia, Mars.
                            </p>
                            <input type="text" name="location" title="location" id="js-location-selector" placeholder="Type a location..." required>
                            <div id="js-geo-result-cont" class="container">
                                <span id="js-geo-result" class="geo-result"></span>
                            </div>
                        </div>
                        <button type="submit">Compare to Mars</button>
                    </form>
                </div>
            </div>
        </main>
    `);

    // <select name="location" id="location-selector" required>
    //     <option value="nyc">New York City</option>
    //     <option value="la">Los Angeles</option>
    // </select>
}
