import unitSelector from "../classes/unitSelector";

const selector = new unitSelector();

/**
 * Renders a dynamic content section with chart and data table (defined in renderChart) and unit selector.
 * @returns {string} - html string for the date rendering of a measure.
 */
const renderData = function (measure = "at") {
    const html = `
        <div class='container graph'>
            ${selector.getUnitContainer(measure)}
            <div class="chart-container fill">
                <canvas id="myChart"></canvas>
            </div>
            <!-- width="400" height="400" -->
            <div class="legend" id="legend"></div>
        </div>`;
    return html;
};

export default renderData;
