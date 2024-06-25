"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { db } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import dashify from "dashify";
import { useRouter } from "next/navigation";
import EditableInput from "@/components/EditableInput";


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
  hotelImagesList: any[];
  createdAt: string;
  updatedAt: string;
}
export default function page({ params }: { params: { hotelSlug: string } }) {
  const [updatingString, setUpdatingString] = useState<{
    url: string;
    id: string;
  }>({ url: "", id: "" });
  const [newState, setNewState] = useState<string>("");
  const [previousState, setPreviousState] = useState<string>("");
  const [hotelData, setHotelData] = useState<HotelDetails>({
    hotelName: "",
    hotelEmailId: "",
    hotelContactNumber: "",
    hotelStarRating: "",
    hotelImageUrl: "",
    hotelAddress: "",
    hotelState: "",
    hotelCity: "",
    hotelPincode: "",
    hotelSlug: "",
    hotelImagesList: [],
    createdAt: "",
    updatedAt: "",
  });
  const [updatingFor, setUpdatingFor] = useState("");
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "Hotels", dashify(params.hotelSlug)));
      router.push("/hotels");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  useEffect(() => {
    const decodedSlug = decodeURIComponent(params.hotelSlug);
    const docRef = doc(db, "Hotels", decodedSlug);
    const fetchData = async () => {
      try {
        const doc = await getDoc(docRef);
        const imagesCol = collection(docRef, "images");
        const querySnapshot = await getDocs(imagesCol);
        const imgArray: any[] = [];
        querySnapshot.forEach((doc) => {
          imgArray.push(doc.data());
        });
        if (doc.exists()) {
          setHotelData(doc.data() as HotelDetails);
          setHotelData((prev) => ({
            ...prev,
            hotelImagesList: imgArray,
          }));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    fetchData();
  }, [params.hotelSlug]);

  const handleImageUpdat = async (imageId: string, newImageUrl: string) => {
    console.log(imageId, "imageId");
    try {
      const dbRef = doc(db, "Hotels", params.hotelSlug, "images", imageId);
      await updateDoc(dbRef, {
        imageUrl: newImageUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputClick = async (key: string, value: any) => {
    try {
      const dbRef = doc(db, "Hotels", params.hotelSlug);
      await updateDoc(dbRef, {
        [key]: value,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setUpdatingFor("empty");
    }
  };
  const setData = (e: any) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    setNewState(e.target.value);
  };
  return (
    <>
      {hotelData?.hotelName ? (
        <div className="p-4 bg-slate-200 h-screen">
          <div className="grid grid-cols-3 gap-5">
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelName");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelName" className="px-1">
                    Hotel Name:
                  </label>
                  <input
                    type="text"
                    value={hotelData ? hotelData?.hotelName : ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelName);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelName"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelName" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelName", hotelData?.hotelName);
                      setUpdatingFor("empty");
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({ ...hotelData, hotelName: previousState });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelEmailId");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelEmailId" className="px-1">
                    Hotel EmailId:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelEmailId}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelEmailId);
                      console.log("first", previousState);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelEmailId"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelEmailId" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelEmailId", hotelData?.hotelEmailId);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelEmailId: previousState,
                      });
                      console.log("second", previousState);
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelContactNumber");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelContactNumber" className="px-1">
                    Hotel Contact:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelContactNumber}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelContactNumber);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelContactNumber"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelContactNumber" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick(
                        "hotelContactNumber",
                        hotelData?.hotelContactNumber
                      );
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelContactNumber: previousState,
                      });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelStarRating");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelStarRating" className="px-1">
                    Hotel Star Rating:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelStarRating}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelStarRating);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelStarRating"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelStarRating" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick(
                        "hotelStarRating",
                        hotelData?.hotelStarRating
                      );
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelStarRating: previousState,
                      });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelImageUrl");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelImageUrl" className="px-1">
                    Hotel Image URL:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelImageUrl}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelImageUrl);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelImageUrl"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelImageUrl" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick(
                        "hotelImageUrl",
                        hotelData?.hotelImageUrl
                      );
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelImageUrl: previousState,
                      });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelAddress");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelAddress" className="px-1">
                    Hotel Address:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelAddress}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelAddress);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelAddress"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelAddress" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelAddress", hotelData?.hotelAddress);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelAddress: previousState,
                      });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelState");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelState" className="px-1">
                    Hotel State:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelState}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelState);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelState"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelState" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelState", hotelData?.hotelState);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({ ...hotelData, hotelState: previousState });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelCity");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelCity" className="px-1">
                    Hotel City:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelCity}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelCity);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelCity"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelCity" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelCity", hotelData?.hotelCity);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({ ...hotelData, hotelCity: previousState });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("hotelPincode");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="hotelPincode" className="px-1">
                    Hotel Pincode:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelPincode}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelPincode);
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelPincode"
                    className="px-3 py-1 rounded-md border"
                  />
                </div>
              </div>
              {updatingFor === "hotelPincode" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleInputClick("hotelPincode", hotelData?.hotelPincode);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                      setHotelData({
                        ...hotelData,
                        hotelPincode: previousState,
                      });
                      setPreviousState("");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div>
              <div
                onClick={() => {
                  setUpdatingFor("imageObject");
                }}
                className="flex flex-col gap-y-2 mb-3"
              >
                <div>
                  <label htmlFor="imageObject" className="px-1">
                    Hotel Image Object:
                  </label>
                  {hotelData?.hotelImagesList?.map((image, index) => {
                    return (
                      <input
                        key={index}
                        type="text"
                        value={hotelData.hotelImagesList[index]?.imageUrl}
                        onChange={(e) => {
                          setHotelData({
                            ...hotelData,
                            hotelImagesList: hotelData.hotelImagesList.map(
                              (item, i) => {
                                if (i === index) {
                                  console.log(item.id, "id");
                                  setUpdatingString({
                                    url: e.target.value,
                                    id: String(item.id),
                                  });
                                  return {
                                    ...item,
                                    imageUrl: e.target.value,
                                  };
                                }
                                return item;
                              }
                            ),
                          });
                        }}
                        name="imageObject"
                        className="px-3 py-1 rounded-md border"
                      />
                    );
                  })}
                </div>
              </div>
              {updatingFor === "imageObject" && (
                <div className="flex justify-center gap-x-4">
                  <button
                    onClick={() => {
                      handleImageUpdat(updatingString.id, updatingString.url);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setUpdatingFor("empty");
                    }}
                    className="px-3 py-2 rounded-md bg-red-400 text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-x-4">
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-md bg-red-400 text-white"
            >
              Delete Hotel
            </button>
          </div>
        </div>
      ) : (
        <span className="">Loading...</span>
      )}
    </>
  );
}
