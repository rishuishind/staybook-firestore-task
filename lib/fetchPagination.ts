import { db } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { get } from "http";

interface HotelDetails {
  hotelName: string;
  hotelEmailId: string;
  hotelContactNumber: string;
  hotelStarRating: string;
  hotelImageUrl: string;
  hotelAddress: string;
  hotelState: string;
  hotelCity: string;
  hotelPincode: string;
  hotelSlug: string;
  createdAt: string;
  updatedAt: string;
}
interface returnTypeOfFunction {
  hotelDocs: HotelDetails[];
  lastDocSlug: string | null;
  status: boolean;
}

export const fetchDocuments = async (
  docsLimit: number,
  lastDoc: string | null
): Promise<returnTypeOfFunction> => {
  try {
    const alldocref = collection(db, "Hotels");
    let q;
    if (lastDoc) {
      q = query(
        alldocref,
        orderBy("hotelSlug"),
        startAfter(lastDoc),
        limit(docsLimit)
      );
    } else {
      q = query(alldocref, limit(docsLimit));
    }
    const docs = await getDocs(q);

    const hotelDocs: HotelDetails[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      hotelDocs.push({
        hotelName: data.hotelName,
        hotelEmailId: data.hotelEmailId,
        hotelContactNumber: data.hotelContactNumber,
        hotelStarRating: data.hotelStarRating,
        hotelImageUrl: data.hotelImageUrl,
        hotelAddress: data.hotelAddress,
        hotelState: data.hotelState,
        hotelCity: data.hotelCity,
        hotelPincode: data.hotelPincode,
        hotelSlug: data.hotelSlug,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    if (docs.docs[docs.docs.length - 1]?.data()) {
      const lastDocSlug = docs.docs[docs.docs.length - 1].data().hotelSlug;
      return { hotelDocs, lastDocSlug, status: true };
    }
    return { hotelDocs, lastDocSlug: null, status: false };
  } catch (error) {
    console.error("Error getting documents: ", error);
    return { hotelDocs: [], lastDocSlug: null, status: false };
  }
};
