function degreesToBearing(deg) {
    switch (true) {
        case deg > 348.75 && deg <= 11.25:
            dir = "N";
            break;
        case deg > 11.25 && deg <= 33.75:
            dir = "NNE";
            break;
        case deg > 33.75 && deg <= 56.25:
            dir = "NE";
            break;
        case deg > 56.25 && deg <= 78.75:
            dir = "ENE";
            break;
        case deg > 78.75 && deg <= 101.25:
            dir = "E";
            break;
        case deg > 101.25 && deg <= 123.75:
            dir = "ESE";
            break;
        case deg > 123.75 && deg <= 146.25:
            dir = "SE";
            break;
        case deg > 146.25 && deg <= 168.75:
            dir = "SSE";
            break;
        case deg > 168.75 && deg <= 191.25:
            dir = "S";
            break;
        case deg > 191.25 && deg <= 213.75:
            dir = "SSW";
            break;
        case deg > 213.75 && deg <= 236.25:
            dir = "SW";
            break;
        case deg > 236.25 && deg <= 258.75:
            dir = "WSW";
            break;
        case deg > 258.75 && deg <= 281.25:
            dir = "W";
            break;
        case deg > 281.25 && deg <= 303.75:
            dir = "WNW";
            break;
        case deg > 303.75 && deg <= 326.25:
            dir = "NW";
            break;
        case deg > 326.25 && deg <= 348.75:
            dir = "NNW";
            break;
        default:
            dir = null;
            break;
    }
    return dir;
}
