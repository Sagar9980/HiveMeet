"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Meeting = () => {
  const socket = io("http://localhost:8000");

  const [me, setMe] = useState("");
  const [stream, setStream] = useState<any>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideoRef: any = useRef();
  const userVideoRef: any = useRef();
  const connectionRef: any = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        setStream(stream);
        myVideoRef.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("strema", (stream) => {
      userVideoRef.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

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

      {!stream && <p>Loading...</p>}
      {callAccepted && !callEnded ? (
        <video ref={userVideoRef} className="meeting__viewo" autoPlay />
      ) : null}
      <div>
        <input
          type="text"
          className="text-black"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="text-black"
          onChange={(e) => setIdToCall(e.target.value)}
        />
        <button onClick={() => callUser(idToCall)}>Call</button>
      </div>
      <div>
        {true && true ? (
          <div>
            <h1 className="text-white">{name} is calling...</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Meeting;
