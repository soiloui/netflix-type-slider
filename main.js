const slider = document.querySelector("#soil-slider");
const slider2 = document.querySelector("#soil-slider-2");

const defaultSliderOptions = {
  breakpoints: {
    xs: {
      screenWidth: 0,
      itemsInRow: 3,
    },
    sm: {
      screenWidth: 950,
      itemsInRow: 4,
    },
    lg: {
      screenWidth: 1350,
      itemsInRow: 5,
    },
    xl: {
      screenWidth: 1800,
      itemsInRow: 6,
    },
  },
};

const sliderOptions2 = {
  breakpoints: {
    mobile: {
      screenWidth: 0,
      itemsInRow: 3,
    },
    tablet: {
      screenWidth: 768,
      itemsInRow: 3,
    },
    desktop: {
      screenWidth: 1200,
      itemsInRow: 4,
    },
  },
};

soilNetflixSlider(slider, defaultSliderOptions);
setSliderItems(slider2, defaultSliderOptions, 15);

function setSliderItems(slider, sliderOptions, amountOfItems) {
  const sliderTrack = slider.querySelector(".slider__track");
  const sliderSpinner = slider.querySelector(".spinner");
  let apiData;
  const SPINNER_ON = "ON";
  const SPINNER_OFF = "OFF";

  init();

  function init() {
    handleSpinner(SPINNER_ON);
    getProductsAndSetSliderItems();
  }

  function getProductsAndSetSliderItems() {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((json) => {
        apiData = json;
        handleSpinner(SPINNER_OFF);
        setSliderItems();
      });
  }

  function setSliderItems() {
    const products = apiData.products;
    const sliderItemsFragment = document.createDocumentFragment();

    products.forEach((product, index) => {
      if (index < amountOfItems) {
        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");

        const sliderItemThumbnailWrapper = document.createElement("div");
        sliderItemThumbnailWrapper.classList.add("slider-item__thumbnail");

        const sliderItemThumbnail = document.createElement("img");
        sliderItemThumbnail.src = product.images[0];

        sliderItemThumbnailWrapper.appendChild(sliderItemThumbnail);
        sliderItem.appendChild(sliderItemThumbnailWrapper);
        sliderItemsFragment.appendChild(sliderItem);
      }
    });

    sliderTrack.appendChild(sliderItemsFragment);
    activateSlider();
  }

  function activateSlider() {
    soilNetflixSlider(slider, sliderOptions);
  }

  function handleSpinner(action) {
    if (!sliderSpinner) return;

    if (action === SPINNER_ON) {
      sliderSpinner.classList.add("spinner--active");
    }

    if (action === SPINNER_OFF) {
      sliderSpinner.classList.remove("spinner--active");
    }
  }
}

function soilNetflixSlider(slider, sliderOptions) {
  const sliderTrack = slider.querySelector(".slider__track");
  const sliderIndicators = slider.querySelector(".slider__indicators");
  const sliderItems = slider.querySelectorAll(".slider-item");
  const sliderControlPrev = slider.querySelector(".slider__control--prev");
  const sliderControlNext = slider.querySelector(".slider__control--next");
  const sliderItemsCount = sliderItems.length;

  const PREV = "PREV";
  const NEXT = "NEXT";
  const SLIDER_ITEM_CLASS = "slider-item";
  const INDICATOR_CLASS = "slider__indicator";
  const INDICATOR_CLASS_ACTIVE = "slider__indicator--active";
  const CONTROL_CLASS_ACTIVE = "slider__control--active";
  const SLIDER_ITEM_NUMBER_CLASS = "slider-item__number";
  const SLIDER_ITEM_NUMBER_ICON_CLASS = "slider-item__number-icon";
  const SLIDER_TYPE_CLASSES = {
    NUMBERS: "slider--numbers",
  };

  let totalSlides;
  let totalSlidesDecimals;
  let totalSlidesCeil;
  let itemsInRow;
  let currentSlide = 0;
  let hasSlideEverChanged = false;
  let isClonedItemsPositioned = false;
  let isSliderDuringTransition = false;

  init();

  function init() {
    checkScreenWidth();
    setListeners();
    checkSliderType();
  }

  // function firstSlideChange() {
  //   sliderControlPrev.classList.add(CONTROL_CLASS_ACTIVE);

  //   createTrackClone();

  //   sliderTrack.addEventListener("transitionend", () => {
  //     const translatePercentMaker = -100;
  //     const currentSlideWithClones = totalSlides + currentSlide + 1;
  //     xPos = currentSlideWithClones * translatePercentMaker;

  //     sliderTrack.classList.add("remove-transition");
  //     sliderTrack.style.transform = `translateX(${xPos}%)`;

  //     if (!hasSlideEverChanged) {
  //       sliderTrack.classList.remove("remove-transition");
  //       hasSlideEverChanged = true;
  //     }
  //   });
  // }

  function calculateSlider() {
    totalSlides = (sliderItemsCount / itemsInRow).toFixed(3) - 1;
    totalSlidesDecimals = (totalSlides - Math.floor(totalSlides)).toFixed(3);
    totalSlidesCeil = Math.ceil(totalSlides);

    setItemsWidth();
    setTrackPosition();
    createIndicators();
    setActiveIndicator();
  }

  function setListeners() {
    window.addEventListener("resize", function () {
      checkScreenWidth();
    });

    sliderControlPrev.addEventListener("click", function () {
      handleSliderControl(PREV);
    });

    sliderControlNext.addEventListener("click", function () {
      handleSliderControl(NEXT);
    });

    sliderTrack.addEventListener("transitionend", () => {
      isSliderDuringTransition = false;

      if (currentSlide === 0) {
        if (!isClonedItemsPositioned && hasSlideEverChanged) {
          sliderTrack.classList.add("remove-transition");

          const translatePercentMaker = -100;
          xPos = (totalSlides + 1) * translatePercentMaker;
          sliderTrack.style.transform = `translateX(${xPos}%)`;
        }
      }

      if (currentSlide === totalSlides) {
        if (!isClonedItemsPositioned) {
          sliderTrack.classList.add("remove-transition");

          const translatePercentMaker = -100;
          xPos = ((totalSlides + 1) * 1 + currentSlide) * translatePercentMaker;
          sliderTrack.style.transform = `translateX(${xPos}%)`;
        }
      }
    });
  }

  function checkScreenWidth() {
    let checkItemsInRow;

    Object.keys(sliderOptions.breakpoints).forEach((breakpoint) => {
      const cuurentScreenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      const breakpointWidth = sliderOptions.breakpoints[breakpoint].screenWidth;

      if (cuurentScreenWidth >= breakpointWidth) {
        checkItemsInRow = sliderOptions.breakpoints[breakpoint].itemsInRow;
      }
    });

    if (itemsInRow != checkItemsInRow) {
      itemsInRow = checkItemsInRow;
      calculateSlider();
    }
  }

  function setTrackPosition(dir) {
    const translatePercentMaker = -100;
    let xPos;

    xPos = currentSlide * translatePercentMaker;

    if (dir) {
      if (!hasSlideEverChanged) {
        sliderControlPrev.classList.add(CONTROL_CLASS_ACTIVE);
        createTrackClone();
        sliderTrack.addEventListener("transitionend", handleFirstSlideChange);
      }

      if (hasSlideEverChanged && !isClonedItemsPositioned) {
        sliderTrack.classList.remove("remove-transition");
        sliderTrack.removeEventListener(
          "transitionend",
          handleFirstSlideChange
        );
        isClonedItemsPositioned = true;
      }
    }

    if (dir === PREV) {
      xPos = (totalSlides + 1 + currentSlide) * translatePercentMaker;

      if (currentSlide === totalSlides) {
        isClonedItemsPositioned = false;
        xPos = totalSlides * translatePercentMaker;
      }
    }

    if (dir === NEXT) {
      if (hasSlideEverChanged) {
        const currentSlideWithClones = totalSlides + 1 + currentSlide;
        xPos = currentSlideWithClones * translatePercentMaker;

        if (currentSlide === 0) {
          isClonedItemsPositioned = false;
          xPos = (totalSlides + 1) * 2 * translatePercentMaker;
        }
      }
    }

    sliderTrack.style.transform = `translateX(${xPos}%)`;

    function handleFirstSlideChange() {
      if (hasSlideEverChanged) return;

      const currentSlideWithClones = totalSlides + 1 + currentSlide;
      xPos = currentSlideWithClones * translatePercentMaker;

      sliderTrack.classList.add("remove-transition");
      sliderTrack.style.transform = `translateX(${xPos}%)`;

      hasSlideEverChanged = true;
    }
  }

  function handleSliderControl(action) {
    if (isSliderDuringTransition) return;

    if (action === PREV) {
      currentSlide--;

      if (currentSlide < 0) {
        if (currentSlide <= -1) currentSlide = totalSlides;
        else currentSlide = 0;
      }
    }

    if (action === NEXT) {
      currentSlide++;

      if (currentSlide > totalSlides) {
        if (currentSlide - totalSlides >= 1) currentSlide = 0;
        else currentSlide = totalSlides;
      }
    }

    isSliderDuringTransition = true;

    setTrackPosition(action);
    setActiveIndicator();
  }

  function setItemsWidth() {
    const itemWidthPercent = (100 / itemsInRow).toFixed(3);
    const allSliderItems = document.querySelectorAll(`.${SLIDER_ITEM_CLASS}`);

    allSliderItems.forEach((sliderItem) => {
      sliderItem.style.minWidth = `${itemWidthPercent}%`;
    });
  }

  function createTrackClone() {
    const itemsClonesFragment = document.createDocumentFragment();

    sliderItems.forEach((item) => {
      const clonedItem = item.cloneNode(true);
      clonedItem.classList.add("clone");
      itemsClonesFragment.appendChild(clonedItem);
    });

    const itemsClonesFragment2 = itemsClonesFragment.cloneNode(true);

    sliderTrack.appendChild(itemsClonesFragment);
    sliderTrack.insertBefore(itemsClonesFragment2, sliderTrack.firstChild);
  }

  function checkSliderType() {
    if (slider.classList.contains(SLIDER_TYPE_CLASSES.NUMBERS)) {
      createItemsNumbers();
    }
  }

  function createItemsNumbers() {
    sliderItems.forEach((item, index) => {
      const itemNumber = document.createElement("div");
      const itemNumberIcon = document.createElement("img");
      itemNumber.classList.add(SLIDER_ITEM_NUMBER_CLASS);
      itemNumberIcon.classList.add(SLIDER_ITEM_NUMBER_ICON_CLASS);

      itemNumberIcon.src = `./assets/svg/rank-${index + 1}.svg`;

      itemNumber.appendChild(itemNumberIcon);
      item.insertBefore(itemNumber, item.firstChild);
    });
  }

  function setActiveIndicator() {
    const indicators = sliderIndicators.querySelectorAll(`.${INDICATOR_CLASS}`);

    indicators.forEach((indicator) => {
      indicator.classList.remove(INDICATOR_CLASS_ACTIVE);
    });

    indicators[Math.ceil(currentSlide)].classList.add(INDICATOR_CLASS_ACTIVE);
  }

  function createIndicators() {
    const indicatorsFragment = document.createDocumentFragment();

    sliderIndicators.innerHTML = "";

    for (let i = 0; i <= totalSlidesCeil; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add(INDICATOR_CLASS);
      indicatorsFragment.appendChild(indicator);
    }

    sliderIndicators.appendChild(indicatorsFragment);
  }
}

// -------------------------- UNUSED --------------------------

// const SLIDER_ITEM_NUMBER_VALUE_CLASS = "slider-item__number-value";

// function adjustFontSizeToContainer(container, textElem) {
//   let containerWidth;
//   let containerHeight;
//   let textElemWidth;
//   let textElemHeight;
//   let currentFontSize;

//   calculateSizes();

//   function calculateSizes() {
//     containerWidth = container.offsetWidth;
//     containerHeight = container.offsetHeight;
//     textElemWidth = textElem.offsetWidth;
//     textElemHeight = textElem.offsetHeight;
//     currentFontSize = parseInt(
//       getComputedStyle(textElem).fontSize.split("px")[0]
//     );

//     checkSizes();
//   }

//   function checkSizes() {
//     if (containerHeight > textElemHeight) {
//       currentFontSize++;
//       textElem.style.fontSize = `${currentFontSize}px`;
//       calculateSizes();
//     } else {
//       sliderItems.forEach((item) => {
//         const itemNumber = item.querySelector(
//           `.${SLIDER_ITEM_NUMBER_VALUE_CLASS}`
//         );
//         itemNumber.style.fontSize = `${currentFontSize}px`;
//       });
//     }
//   }
// }

// function createItemsNumbersOLD() {
//   sliderItems.forEach((item, index) => {
//     const itemNumber = document.createElement("div");
//     const itemNumberValue = document.createElement("div");
//     itemNumber.classList.add(SLIDER_ITEM_NUMBER_CLASS);
//     itemNumberValue.classList.add(SLIDER_ITEM_NUMBER_VALUE_CLASS);

//     itemNumberValue.innerText = index + 1;

//     itemNumber.appendChild(itemNumberValue);
//     item.insertBefore(itemNumber, item.firstChild);
//   });

//   adjustFontSizeToContainer(
//     sliderItems[0].firstChild,
//     sliderItems[0].firstChild.firstChild
//   );
// }

// function setTrackHeight() {
//   sliderTrack.style.height = `${trackHeight}px`;
// }
