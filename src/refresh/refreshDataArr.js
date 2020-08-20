/**
 * Accesses the STORE object and removes values for each measure.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 *
 */
function refreshDataArr() {
    for (let [planetName, planetData] of Object.entries(STORE)) {
        Object.keys(planetData).forEach((measure) => {
            STORE[planetName][measure].length = 0;
        });
    }
}
