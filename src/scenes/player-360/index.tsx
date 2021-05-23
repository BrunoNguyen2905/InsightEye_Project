import Player360 from "../../components/Player360";
import * as React from "react";
const src =
  "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8";

const Player360Component = () => (
  <div>
    Player360Component
    <div style={{ height: "300px", width: "600px", position: "relative" }}>
      <Player360 src={src} mute={true} />
    </div>
  </div>
);

export default Player360Component;
