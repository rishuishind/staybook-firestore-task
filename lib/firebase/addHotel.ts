import dashify from "dashify";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

interface ImageDetails {
  imageUrl: string;
  imageTitle: string;
}

export const addHotels = async (e: any, imagesObj: ImageDetails[]) => {
  const dbRef = doc(
    db,
    "Hotels",
    `${dashify(e.target.hotelname.value)}-${e.target.hotelcity.value}`
  );
  const imageDocsRefs = imagesObj.map(() => {
    const id = uuidv4();
    const imageRef = doc(dbRef, "images", `${id}`);
    return { imageRef, id };
  });
  try {
    await setDoc(dbRef, {
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
    console.log(imagesObj, "imagesObj12");
    //Batch Writing all the images
    const batch = writeBatch(db);
    imageDocsRefs.forEach(async (imagesRef, index) => {
      const imgData = {
        id: imagesRef.id,
        imageUrl: imagesObj[index].imageUrl,
        imageTitle: imagesObj[index].imageTitle,
      };
      console.log(imgData, "imagesRef at index", index);
      await setDoc(imagesRef.imageRef, imgData);
    });
    await batch.commit();
    return { status: true, response: "Document successfully written!" };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { status: false, response: error };
  } finally {
    e.target.reset();
  }
};
