"use client";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  MutableRefObject,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Meeting = () => {
  const socket = io("http://localhost:8000");
  const [stream, setStream] = useState<any>(null);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const myVideoRefNext = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        if (myVideoRef.current && myVideoRefNext.current) {
          myVideoRef.current.srcObject = stream;
          myVideoRefNext.current.srcObject = stream;
        }
      });
  }, []);

  return (
    <div className="meeting">
      {stream && (
        <video
          ref={myVideoRef}
          className="meeting__video"
          autoPlay
          playsInline
        />
      )}

      {stream && (
        <video
          ref={myVideoRefNext}
          className="meeting__video"
          autoPlay
          playsInline
        />
      )}
    </div>
  );
};

export default Meeting;
