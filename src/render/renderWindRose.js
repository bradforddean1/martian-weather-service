function renderWindRose(ctx, data) {
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    new Chart(ctx, {
        data: data,
        type: "polarArea",
        options: options,
    });
}
