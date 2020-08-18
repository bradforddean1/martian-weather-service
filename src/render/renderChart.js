// Render
function renderChart(measure) {
    const data = getChartData(measure);
    const ctx = STATE.chartCtx;

    const options = {
        // maintainAspectRatio: false,

        // scales: {
        //     yAxes: [
        //         {
        //             scaleLabel: {
        //                 display: true,
        //                 labelString: "temp",
        //             },
        //         },
        //     ],
        // },

        legend: {
            display: measure == "wind" ? false : true,
            position: "bottom",
        },

        legendCallback: function (chart) {
            //chart.data.datasets.length
            return `<table>
                        <thead>
                            <tr>
                                <td></td>
                                <th>min</th>
                                <th>avg</th>
                                <th>max</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr class="mars">
                                <th class="js-legend-item">mars</th>
                                <td>${STORE.getMin(
                                    "martianWeather",
                                    measure
                                )}</td>
                                <td>${STORE.getAverage(
                                    "martianWeather",
                                    measure
                                )}</td>
                                <td>${STORE.getMax(
                                    "martianWeather",
                                    measure
                                )}</td>
                            </tr>
                            <tr class = "earth">
                                <th class="js-legend-item">earth</th>
                                <td>${STORE.getMin(
                                    "earthWeather",
                                    measure
                                )}</td>
                                <td>${STORE.getAverage(
                                    "earthWeather",
                                    measure
                                )}</td>
                                <td>${STORE.getMax(
                                    "earthWeather",
                                    measure
                                )}</td>
                            </tr>
                        <tbody>
                    </table>`;
        },
    };
    const chart = new Chart(ctx, {
        data: data,
        type: measure == "wind" ? "polarArea" : "line",
        options: options,
    });

    // Generate HTML legend
    STATE.chartLegend.html(chart.generateLegend());
}
