import { Card, CardContent, IconButton, Typography } from "@mui/material";
import * as moment from "moment";
import "moment-duration-format";
import { useEffect, useState } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Timer } from "./App";

export const TimerCard = ({
  onChange,
  onStop,
  ...timer
}: Timer & { onChange: (timer: Timer) => void; onStop: (timer: Timer) => void }) => {
  const delta = timer.paused ? 0 : new Date().getTime() - timer.startTime;
  const [currentTime, setCurrentTime] = useState<number>(timer.elapsedTime + delta);
  const duration = moment.duration(currentTime, "milliseconds");
  useEffect(() => {
    let timeOut: null | NodeJS.Timeout = null;
    if (!timer.paused) {
      timeOut = setInterval(() => {
        setCurrentTime(timer.elapsedTime + new Date().getTime() - timer.startTime);
      }, 1000);
    }
    return () => {
      if (timeOut !== null) clearInterval(timeOut);
    };
  }, [timer]);
  const change = () => {
    let { elapsedTime, startTime } = timer;
    if (!timer.paused) {
      elapsedTime += new Date().getTime() - timer.startTime;
    } else {
      startTime = new Date().getTime();
    }
    onChange(Object.assign(timer, { paused: !timer.paused, elapsedTime, startTime }));
  };
  const stop = () => {
    let { elapsedTime } = timer;
    if (!timer.paused) {
      elapsedTime += new Date().getTime() - timer.startTime;
    }
    onStop(Object.assign(timer, { elapsedTime }));
  };
  return (
    <Card sx={{ width: 200, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {timer.name}
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>{duration.format("hh:mm:ss", { trim: false })}</Typography>
          <div style={{ flex: 1 }} />
          <IconButton onClick={change}>{timer.paused ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
          <IconButton onClick={stop}>
            <StopIcon />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};
