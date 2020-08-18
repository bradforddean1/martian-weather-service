function refreshDataArr() {
    for (let [planetName, planetData] of Object.entries(STORE)) {
        Object.keys(planetData).forEach((measure) => {
            STORE[planetName][measure].length = 0;
        });
    }
}
