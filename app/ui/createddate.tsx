'use client';

import { useEffect, useState } from "react";
import { getWordTime } from "../lib/data";

export default function CreatedDate({ word, id }: { word: string, id: string }) {
  const [time, setTime] = useState<string | null>(null);
  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTime = async () => {
      try {
        const fetchedTime = await getWordTime(word, id);

        // Safely handle the response and extract the `created_at` timestamp
        if (fetchedTime && Array.isArray(fetchedTime) && fetchedTime.length > 0) {
          const { created_at } = fetchedTime[0];
          if (isMounted) {
            setTime(created_at || null); // Use `created_at`, fallback to `null`
          }
        } else {
          if (isMounted) setTime(null); // Handle cases where no data is returned
        }
      } catch (error) {
        console.error("Error fetching word time:", error);
        if (isMounted) setTime(null);
      }
    };

    fetchTime();

    return () => {
      isMounted = false; // Prevent state updates on unmounted component
    };
  }, [word]);

  useEffect(() => {
    if (!time) return;

    const interval = setInterval(() => {
      const now = new Date();
      const createdDate = new Date(time);

      const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeDifference(`${days} day${days > 1 ? "s" : ""} ago`);
      } else if (hours > 0) {
        setTimeDifference(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      } else if (minutes > 0) {
        setTimeDifference(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
      } else {
        setTimeDifference(`${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return <div><p className="text-xs">{timeDifference}</p></div>;
}
