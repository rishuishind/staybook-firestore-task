export const checkEmpty = (e: any) => {
  const hotelNameInput = e.currentTarget.elements.namedItem(
    "hotelname"
  ) as HTMLInputElement;
  const hotelEmailInput = e.currentTarget.elements.namedItem(
    "hotelemail"
  ) as HTMLInputElement;
  const hotelPhoneInput = e.currentTarget.elements.namedItem(
    "hotelphone"
  ) as HTMLInputElement;
  const hotelStarRatingInput = e.currentTarget.elements.namedItem(
    "hotelstarrating"
  ) as HTMLInputElement;
  const hotelImageURLInput = e.currentTarget.elements.namedItem(
    "hotelimageurl"
  ) as HTMLInputElement;
  const hotelAddressInput = e.currentTarget.elements.namedItem(
    "hoteladdress"
  ) as HTMLInputElement;
  const hotelStateInput = e.currentTarget.elements.namedItem(
    "hotelstate"
  ) as HTMLInputElement;
  const hotelCityInput = e.currentTarget.elements.namedItem(
    "hotelcity"
  ) as HTMLInputElement;
  const hotelPincodeInput = e.currentTarget.elements.namedItem(
    "hotelpincode"
  ) as HTMLInputElement;
  const requiredFields = [
    hotelNameInput,
    hotelEmailInput,
    hotelPhoneInput,
    hotelStarRatingInput,
    hotelImageURLInput,
    hotelAddressInput,
    hotelStateInput,
    hotelCityInput,
    hotelPincodeInput,
  ];

  const isEmpty = requiredFields.some((input) => input.value.trim() === "");
  if (isEmpty) {
    return { status: false, requiredFields };
  } else {
    return { status: true, requiredFields };
  }
};
