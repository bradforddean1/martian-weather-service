function renderData() {
    const measure = STATE.activemeasure;

    function getUnitContainer() {
        if (measure == "at") {
            return `
            <div class="container unit">
                <button class="left ${
                    STATE.isFarenheight ? "" : "toggle-on"
                }" data-measure="at">°C</button>
                <button class="right ${
                    STATE.isFarenheight ? "toggle-on" : ""
                }" data-measure="at">°F</button>
            </div>`;
        }

        if (measure == "pressure") {
            return `
            <div class="container unit">
                <button class="toggle-on" data-measure="at">hPh</button>
            </div>`;
        }

        if (measure == "wind") {
            return `
            <div class="container unit">
                <button class="left ${
                    STATE.isMph ? "" : "toggle-on"
                }" data-measure="wind">kPh</button>
                <button class="right ${
                    STATE.isMph ? "toggle-on" : ""
                }" data-measure="wind">mPh</button>
            </div>`;
        }
    }

    return `
        <div class='container graph'>
            ${getUnitContainer()}
            <div class="chart-container fill">
                <canvas id="myChart"></canvas>
            </div>
            <!-- width="400" height="400" -->
            <div class="legend" id="legend"></div>
        </div>`;
}
