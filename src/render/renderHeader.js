const renderHeader = () => {
  return `
    <header class="bg-dark">
            <div class="container" style="">
                <h2>
                    <span class="caption">comparing to:</span>
                    ${STORE.earthWeather.location.address}
                </h2>
                <a id="js-go-back" class="goBack" href="#">
                    <img src="assets/arrow_back.svg" alt="Go Back">
                </a>
            </div>
    </header>
  `;
}

export default renderHeader;
