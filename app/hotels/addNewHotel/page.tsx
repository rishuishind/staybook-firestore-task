"use client";
import { checkEmpty } from "@/lib/checkEmpty";
import { useState } from "react";
import Image from "next/image";
import { addHotels } from "@/lib/firebase/addHotel";
import { v4 as uuidv4 } from "uuid";

/*
    import addHotelDetailsInFirebaseCollection function here and pass hotelDetails Object
    pass collection name and hotelData from here to the function
*/
interface ImageDetails {
  id: string;
  imageUrl: string;
  imageTitle: string;
}

export default function AddNewHotelPage() {
  const [imagesObj, setImagesObj] = useState<ImageDetails[]>([]);
  const [imageUrls, setImageUrls] = useState<string>("");
  const [imageTitles, setImageTitles] = useState<string>("");

  const handleMultipleImages = () => {
    if (imageUrls === "" || imageTitles === "") {
      alert("Please fill the image URL and Title");
      return;
    }
    const id = uuidv4();
    setImagesObj((prev) => [
      ...prev,
      { id, imageUrl: imageUrls, imageTitle: imageTitles },
    ]);
    setImageUrls("");
    setImageTitles("");
    console.log(imagesObj, "imagesObj");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    //Checking For empty Fields
    const check = checkEmpty(e);
    if (check.status === false) {
      alert("Please fill all the fields");
      return;
    }
    const result = await addHotels(e, imagesObj);
    if (result.status === true) {
      alert("Hotel Added Successfully");
      setImagesObj([]);
    } else {
      alert("Error Adding Hotel");
      setImagesObj([]);
    }
  };

  const handleDeleteImage = (idx: number) => {
    const images = imagesObj;
    images.splice(idx, 1);
    setImagesObj([...images]);
  };

  return (
    // add components to utilize them and reuse them insted of using a input field again and again
    <div className="container mx-auto py-8">
      <form
        onSubmit={handleSubmit}
        className="p-5 space-y-5 bg-orange-500 rounded-md"
      >
        <div className="grid grid-cols-2 gap-x-4 flex-wrap gap-y-8">
          <input
            className="border p-2 rounded-md"
            type="text"
            name="hotelname"
            placeholder="hotel name"
          />
          <input
            className="border p-2 rounded-md"
            type="email"
            name="hotelemail"
            placeholder="hotel email"
          />
          <input
            type="tel"
            className="border p-2 rounded-md"
            name="hotelphone"
            placeholder="Phone"
          />
          <div className="flex gap-x-2 items-center">
            <label htmlFor="star rating" className="text-white">
              Star Rating
            </label>
            <input
              type="number"
              className="border p-2 rounded-md"
              name="hotelstarrating"
              placeholder="Star Rating"
              max={5}
              min={0}
            />
          </div>
          <input
            type="text"
            className="border p-2 rounded-md"
            name="hotelimageurl"
            placeholder="Image URL"
          />
          <input
            type="text"
            className="border p-2 rounded-md"
            name="hoteladdress"
            placeholder="Address"
          />
          <input
            type="text"
            className="border p-2 rounded-md"
            name="hotelstate"
            placeholder="State"
          />
          <input
            type="text"
            className="border p-2 rounded-md"
            name="hotelcity"
            placeholder="City"
          />
          <div>
            <input
              type="text"
              className="border w-full p-2 rounded-md"
              name="hotelpincode"
              placeholder="Pincode"
            />
          </div>
          <div className="flex flex-col-reverse gap-y-3">
            <button
              type="button"
              onClick={handleMultipleImages}
              className="px-4 py-2 bg-black rounded-md text-white"
            >
              Add Images
            </button>
            <input
              type="text"
              className="border p-2 rounded-md mt-2"
              placeholder="Enter image URL"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
            />
            <input
              type="text"
              className="border p-2 rounded-md mt-2"
              placeholder="Enter image Title"
              value={imageTitles}
              onChange={(e) => setImageTitles(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-white text-black px-4 py-2 rounded-md"
          type="submit"
        >
          Submit
        </button>
      </form>
      <div className="grid grid-cols-3 py-4 gap-x-5">
        {imagesObj.map((obj, idx) => {
          const isValidUrl =
            obj.imageUrl.startsWith("http://") ||
            obj.imageUrl.startsWith("https://");
          if (!isValidUrl) {
            alert("Please enter a valid URL");
            return;
          }
          return (
            <div key={idx} className="grid grid-rows-2 gap-y-3 h-[60%] ">
              <Image
                src={obj.imageUrl}
                alt={obj.imageTitle}
                height={300}
                width={300}
                className="h-full"
              />
              <div>
                <button
                  onClick={() => handleDeleteImage(idx)}
                  className="px-5 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
