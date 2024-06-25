/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { fetchDocuments } from "@/lib/fetchPagination";
import Image from "next/image";

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

export default function page() {
  //States Declaration
  const [hotelDocuments, setHotelDocuments] = useState<HotelDetails[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchDocuments(5, null);
      setLastDoc(response.lastDocSlug);
      if (response.status == true) {
        setHotelDocuments(response.hotelDocs);
      } else {
        console.log("Error in fetching data");
      }
    };
    fetchData();
  }, []);

  const nextBatchFetch = async () => {
    const response = await fetchDocuments(5, lastDoc);
    if (response.lastDocSlug === null) {
      setHasMore(false);
      return;
    }
    if (response.status == true) {
      setHotelDocuments((prev) => [...prev, ...response.hotelDocs]);
      setLastDoc(response.lastDocSlug);
    } else {
      console.log("Error in fetching next batch of data");
    }
  };

  return (
    <section className="w-full h-screen overflow-hidden">
      <div className="container mx-auto h-full py-10">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold tracking-wide">All Hotels List</h1>
          <Link
            href={"/hotels/addNewHotel"}
            className="p-2 px-4 bg-green-100 text-green-800 font-medium tracking-wide rounded"
          >
            Add New Hotel
          </Link>
        </div>
        {/* fetch the actual hotelDocuments here and map them */}
        <InfiniteScroll
          dataLength={hotelDocuments.length}
          next={nextBatchFetch}
          style={{
            display: "flex",
            flexDirection: "column",
          }} //To put endMessage and loader to the top.
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          height={700}
          scrollableTarget="scrollableDiv"
        >
          {hotelDocuments.map((hotel, index) => (
            <Link
              href={`/hotels/${hotel.hotelSlug}-${hotel.hotelCity}`}
              key={index}
              className="border-2 border-black m-12 p-8 rounded-lg flex justify-between"
            >
              <div>
                <Image
                  src={hotel.hotelImageUrl}
                  alt="hotel image"
                  width={200}
                  height={200}
                />
              </div>
              <div className="flex justify-center items-center">
                <span className="text-center text-2xl">
                  hotel details of <span className="text-red-500">{hotel.hotelName}</span>
                </span>
              </div>
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </section>
  );
}

/*
 {hotelDocuments.map((_, index) => (
            <Link
              href={`/hotels/hotel-${index}`}
              key={index}
              className="bg-green-500 w-full aspect-video rounded-lg p-4"
            >
              hotel details of {index}
            </Link>
          ))} */

//   const container = containerRef.current;

//   const handleScroll = async () => {
//     if (!container) return;

//     const target = container.scrollTop + container.offsetHeight + 1;
//     console.log(target, container.scrollHeight);
//     if (target >= container.scrollHeight) {
//       // await handlefetchNextBatchOfHotelList();
//       // fetchDocuments(true);
//       console.log("at the bottom!!");
//     }
//   };

//   if (container) {
//     container.addEventListener("scroll", handleScroll);
//   }

//   return () => {
//     if (container) {
//       container.removeEventListener("scroll", handleScroll);
//     }
//   };
// }, []);
