"use client";
import React, { useState, useEffect, useRef } from "react";

const Meeting = () => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    };

    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="meeting">
      {stream && (
        <video
          ref={videoRef}
          className="meeting__video"
          autoPlay
          playsInline
          muted
        />
      )}
      {!stream && <p>Loading...</p>}
    </div>
  );
};

export default Meeting;
