/**
 * Renders a dynamic content section with chart and data table (defined in renderChart) and unit selector.
 */
function renderData(measure = "at") {
    function getUnitContainer() {
        if (measure == "at") {
            return `
            <div class="container unit">
                <button class="left ${
                    STORE.isFarenheight ? "" : "toggle-on"
                }" data-measure="at">°C</button>
                <button class="right ${
                    STORE.isFarenheight ? "toggle-on" : ""
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
                    STORE.isMph ? "" : "toggle-on"
                }" data-measure="wind">kPh</button>
                <button class="right ${
                    STORE.isMph ? "toggle-on" : ""
                }" data-measure="wind">mPh</button>
            </div>`;
        }
    }

    const html = `
        <div class='container graph'>
            ${getUnitContainer()}
            <div class="chart-container fill">
                <canvas id="myChart"></canvas>
            </div>
            <!-- width="400" height="400" -->
            <div class="legend" id="legend"></div>
        </div>`;

    return html;
}
