"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useRouter } from "next/router";

const Meeting = () => {
  const [peers, setPeers] = useState<any>([]);
  const socketRef: any = useRef();
  const userVideoRef: any = useRef();
  const peersRef: any = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        if (socketRef.current) {
          socketRef.current.emit("join room", 123);
          socketRef.current.on("all users", (users: any) => {
            const peers: any = [];
            users.forEach((userId: any) => {
              const peer = createPeer(userId, socketRef.current.id, stream);
              peersRef.current.push({
                peerId: userId,
                peer,
              });
              peers.push(peer);
            });
            setPeers(peers);
          });

          socketRef.current.on("user joined", (payload: any) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });

            setPeers((users: any) => [...users, peer]);
          });
        }
      });
  }, []);

  function createPeer(userToSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div className="meeting">
      <video
        ref={userVideoRef}
        className="meeting__video"
        autoPlay
        playsInline
      />
      {peers.map((peer: any, index: any) => {
        return <Video key={index} peer={peer} />;
      })}
    </div>
  );
};

const Video = (props: any) => {
  const ref: any = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video className="meeting__video" playsInline autoPlay ref={ref} />;
};

export default Meeting;
