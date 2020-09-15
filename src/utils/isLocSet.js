/**
 * Checks all of location properties to determine if all 3 are set.
 * @returns {boolean} - Returns true if all 3 locaton properties are set.
 */
const isLocSet = function (address, lat, lon) {
    if (address && lat && lon) {
        return true;
    }
    return false;
};

export default isLocSet;
