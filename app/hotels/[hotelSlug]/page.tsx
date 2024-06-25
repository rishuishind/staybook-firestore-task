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
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomModal from "@/components/CustomModal";

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

export default function Page({ params }: { params: { hotelSlug: string } }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const [updatingString, setUpdatingString] = useState<{
    url: string;
    id: string;
  }>({ url: "", id: "" });
  const [newState, setNewState] = useState<string>("");
  const [previousState, setPreviousState] = useState<string>("");
  const [modalData, setModalData] = useState<{
    imageUrl: string;
    imageTitle: string;
    id: string;
  }>({ imageUrl: "", imageTitle: "", id: "" });
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
      await deleteDoc(doc(db, "Hotels", params.hotelSlug));
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

  const handleImageUpdate = async (
    imageId: string,
    newImageUrl: string,
    newImageTitle: string
  ) => {
    console.log(imageId, "imageId");
    try {
      const dbRef = doc(db, "Hotels", params.hotelSlug, "images", imageId);
      await updateDoc(dbRef, {
        imageUrl: newImageUrl,
        imageTitle: newImageTitle,
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
          <div className="grid grid-cols-2 gap-5">
            <div className="gap-3 grid grid-cols-3">
              {hotelData.hotelImagesList.map((image, index) => (
                <div key={index} className="mb-4">
                  <Image
                    src={image.imageUrl}
                    onClick={() => {
                      openModal();
                      setModalData(image);
                    }}
                    width={300}
                    height={200}
                    alt={`Hotel image ${index + 1}`}
                    className="rounded cursor-pointer"
                  />
                </div>
              ))}
              <CustomModal isOpen={modalIsOpen} onClose={closeModal}>
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col h-[50vh] rounded-md p-5 bg-slate-400 w-full">
                    <form className="flex flex-col gap-y-5">
                      <label htmlFor="url">Image URL:</label>
                      <input
                        type="text"
                        value={modalData.imageUrl}
                        className="py-2 px-2 rounded-md"
                        onChange={(e) => {
                          setModalData((prev) => {
                            return { ...prev, imageUrl: e.target.value };
                          });
                        }}
                      />
                      <label htmlFor="text">Image Text:</label>
                      <input
                        type="text"
                        value={modalData.imageTitle}
                        className="py-2 px-2 rounded-md"
                        onChange={(e) => {
                          setModalData((prev) => {
                            return { ...prev, imageTitle: e.target.value };
                          });
                        }}
                      />
                    </form>
                    <div>
                      <button
                        onClick={() => {
                          handleImageUpdate(
                            modalData.id,
                            modalData.imageUrl,
                            modalData.imageTitle
                          );
                        }}
                        className="px-4 py-2 rounded-md bg-white text-black mt-5"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </CustomModal>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4 h-[90vh] bg-white py-5 rounded-md px-7">
                <div className="col-span-2">
                  <label htmlFor="hotelName" className="px-1">
                    Hotel Name:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelName || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelName);
                      setUpdatingFor("hotelName");
                    }}
                    onChange={(e) => {
                      setData(e);
                    }}
                    name="hotelName"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelName" && (
                    <div className="flex justify-end gap-x-4 mt-2">
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
                          setHotelData({
                            ...hotelData,
                            hotelName: previousState,
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
                <div className="col-span-2">
                  <label htmlFor="hotelEmailId" className="px-1">
                    Hotel EmailId:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelEmailId || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelEmailId);
                      setUpdatingFor("hotelEmailId");
                    }}
                    onChange={setData}
                    name="hotelEmailId"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelEmailId" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick(
                            "hotelEmailId",
                            hotelData?.hotelEmailId
                          );
                          setUpdatingFor("empty");
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
                          setPreviousState("");
                        }}
                        className="px-3 py-2 rounded-md bg-red-400 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="hotelContactNumber" className="px-1">
                    Hotel Contact Number:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelContactNumber || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelContactNumber);
                      setUpdatingFor("hotelContactNumber");
                    }}
                    onChange={setData}
                    name="hotelContactNumber"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelContactNumber" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick(
                            "hotelContactNumber",
                            hotelData?.hotelContactNumber
                          );
                          setUpdatingFor("empty");
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
                <div className="col-span-2">
                  <label htmlFor="hotelStarRating" className="px-1">
                    Hotel Star Rating:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelStarRating || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelStarRating);
                      setUpdatingFor("hotelStarRating");
                    }}
                    onChange={setData}
                    name="hotelStarRating"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelStarRating" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick(
                            "hotelStarRating",
                            hotelData?.hotelStarRating
                          );
                          setUpdatingFor("empty");
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
                <div className="col-span-2">
                  <label htmlFor="hotelAddress" className="px-1">
                    Hotel Address:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelAddress || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelAddress);
                      setUpdatingFor("hotelAddress");
                    }}
                    onChange={setData}
                    name="hotelAddress"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelAddress" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick(
                            "hotelAddress",
                            hotelData?.hotelAddress
                          );
                          setUpdatingFor("empty");
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
                <div className="col-span-2">
                  <label htmlFor="hotelState" className="px-1">
                    Hotel State:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelState || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelState);
                      setUpdatingFor("hotelState");
                    }}
                    onChange={setData}
                    name="hotelState"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelState" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick("hotelState", hotelData?.hotelState);
                          setUpdatingFor("empty");
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
                            hotelState: previousState,
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
                <div className="col-span-2">
                  <label htmlFor="hotelCity" className="px-1">
                    Hotel City:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelCity || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelCity);
                      setUpdatingFor("hotelCity");
                    }}
                    onChange={setData}
                    name="hotelCity"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelCity" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick("hotelCity", hotelData?.hotelCity);
                          setUpdatingFor("empty");
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
                            hotelCity: previousState,
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
                <div className="col-span-2">
                  <label htmlFor="hotelPincode" className="px-1">
                    Hotel Pincode:
                  </label>
                  <input
                    type="text"
                    value={hotelData?.hotelPincode || ""}
                    onClick={() => {
                      setPreviousState(hotelData?.hotelPincode);
                      setUpdatingFor("hotelPincode");
                    }}
                    onChange={setData}
                    name="hotelPincode"
                    className="px-3 py-1 rounded-md border w-full"
                  />
                  {updatingFor === "hotelPincode" && (
                    <div className="flex justify-end gap-x-4 mt-2">
                      <button
                        onClick={() => {
                          handleInputClick(
                            "hotelPincode",
                            hotelData?.hotelPincode
                          );
                          setUpdatingFor("empty");
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
              </div>
              <div className="flex justify-end gap-x-4 mt-4">
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-md bg-red-400 text-white"
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
}
