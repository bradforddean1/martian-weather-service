function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(
        (key) => `${key}=${params[key]}`
    );
    return queryItems.join("&");
}
