import { useRef, useEffect } from "react";

const Video = ({ peer }: any) => {
  const peerVideoRef: any = useRef();

  useEffect(() => {
    peerVideoRef.current.srcObject = peer.streams[0];
  }, []);

  return (
    <video className="meeting__video" ref={peerVideoRef} playsInline autoPlay />
  );
};

export default Video;
