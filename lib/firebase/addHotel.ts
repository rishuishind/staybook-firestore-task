import dashify from "dashify";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface ImageDetails {
  id: string;
  imageUrl: string;
  imageTitle: string;
}

export const addHotels = async (e: any, imagesObj: ImageDetails[]) => {
  const dbRef = doc(
    db,
    "Hotels",
    `${dashify(e.target.hotelname.value)}-${e.target.hotelcity.value}`
  );

  const batch = writeBatch(db);

  // Add hotel data to the batch
  batch.set(dbRef, {
    hotelName: e.target.hotelname.value,
    hotelEmailId: e.target.hotelemail.value,
    hotelContactNumber: e.target.hotelphone.value,
    hotelStarRating: e.target.hotelstarrating.value,
    hotelImageUrl: e.target.hotelimageurl.value,
    hotelAddress: e.target.hoteladdress.value,
    hotelState: e.target.hotelstate.value,
    hotelCity: e.target.hotelcity.value,
    hotelPincode: e.target.hotelpincode.value,
    hotelSlug: dashify(e.target.hotelname.value),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  imagesObj.forEach((image) => {
    const imageRef = doc(dbRef, "images", `${image.id}`);
    const imgData = {
      id: image.id,
      imageUrl: image.imageUrl,
      imageTitle: image.imageTitle,
    };
    batch.set(imageRef, imgData);
  });

  try {
    await batch.commit();
    return { status: true, response: "Document successfully written!" };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { status: false, response: error };
  } finally {
    e.target.reset();
  }
};
