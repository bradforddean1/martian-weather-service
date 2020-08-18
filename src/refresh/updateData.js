function updateData() {
    refreshDataArr();

    const response = [fetchMartianData(), fetchTerranData()];

    return Promise.all(response).then(function (values) {
        if (values[0]) {
            pushMartianData(values[0]);
        }
        if (values[1]) {
            pushTerranData(values[1].data);
        }
    });
}
