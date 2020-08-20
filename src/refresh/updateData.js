/**
 * Calls refreshDataArr, fetchMartianData, fetchTerranData, pushMartianData, and, pushTerranData to clear the STORE< onject, obtain frsh data from teran and earth API, and repopulate store with API data.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
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
