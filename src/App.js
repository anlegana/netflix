import React, { useState, useRef, useEffect, setState, state } from "react";
import ReactDom from "react-dom";
import { findDOMNode } from "react-dom";

import Typography from "@material-ui/core/Typography";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Forward10Icon from "@material-ui/icons/Forward10";
import HistoryIcon from "@material-ui/icons/History";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Slider from "@material-ui/core/Slider";
import { formatMs, withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import "./App.css";
import screenfull from "screenfull";
import { Button, IconButton } from "@material-ui/core";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import CommentIcon from "@material-ui/icons/Comment";
import SpeedIcon from "@material-ui/icons/Speed";
import {
  ImportExportOutlined,
  PlayCircleFilledWhiteRounded,
  RateReviewSharp,
  RateReviewTwoTone,
} from "@material-ui/icons";
/*Main bar */
const PrettoSlider = withStyles({
  root: {
    /*the border of the circle of the slider is red*/
    color: "red",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    /* the circle of the slider is red*/
    backgroundColor: "red",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    color: "red",
    height: 8,
    borderRadius: 4,
  },
  rail: {
    color: "white",
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function App() {
  /*full screen functions*/
  const videoRef = useRef(null);
  const toggleFullScreen = () => {
    //screenfull.request(findDOMNode(playerRef.current))
    //screenfull.toggle(findDOMNode(playerRef.current));
    screenfull.toggle(videoRef.current);
  };
  /*play and pause functions and states*/

  const [state, setState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    playbackRate: 1,
    played: 0,
    seeking: false,
  });
  const { playing } = state;
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  /*Forward and backward functions*/
  const playerRef = useRef(null);

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };
  const handleForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  /*volume functions*/
  const { muted } = state;
  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };
  /*volume slider function*/
  const { volume } = state;
  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  /*{const handleVolumeSeekDown = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };
  /*player rate function*/

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "playbackRate-popover" : undefined;

  const { playbackRate } = state;

  const handlePlayerRateChange = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  /*main bar*/
  const { played } = state;
  const { seeking } = state;
  const handleProgress = (changeState) => {
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };
  const onSeek = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };
  const onSeekMouseDown = (e) => {
    setState({ ...state, ...state, seeking: true });
  };
  const OnSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };

  /*current time and remaining time */
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const format = (seconds) => {
    if (isNaN(seconds)) {
      return "00:00";
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString.padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  const elapsedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);
  const changeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  return (
    <>
      <Grid
        container
        className="root_app"
        alignContent="center"
        spacing={1}
        ref={videoRef}
      >
        {/* player */}
        <Grid item xs={12} className="playerContainer">
          <ReactPlayer
            url="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
            playing={playing}
            className="reactPlayerVideo"
            width="100%"
            height="100%"
            ref={playerRef}
            muted={muted}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
          />
        </Grid>

        {/* Top Controls */}
        <Grid item xs={12} className="topControls">
          <ArrowBackIcon
            className="arrowGoBack"
            fontSize="large"
          ></ArrowBackIcon>
          <h1 className="messageGoBack">Back to Browse</h1>
        </Grid>

        {/* Bottom Controls! */}
        <Grid
          container
          xs={12}
          alignContent="center"
          className="bottomControls controls"
        >
          {/* Slider and time! */}
          <Grid item xs={12} className="slider">
            <PrettoSlider
              min={0}
              max={100}
              value={
                played * 100
              } /*when we fast forward the bar is also moving,and the time is from  to 100*/
              /*className="slider"*/
              onChange={onSeek}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={OnSeekMouseUp}
            />

            <Button
              variant="text"
              className="minuteSeconds"
              onClick={changeDisplayFormat}
            >
              <Typography>
                {elapsedTime}/{totalDuration}
              </Typography>
            </Button>
          </Grid>
          {/* PlayBtn */}
          <Grid item xs={1}>
            <IconButton onClick={handlePlayPause}>
              {playing ? (
                <PauseIcon className="pauseIcon" />
              ) : (
                <PlayArrowIcon className="PlayArrowIcon" />
              )}
            </IconButton>
          </Grid>
          {/* Reverse */}
          <Grid item xs={1}>
            <IconButton onClick={handleRewind}>
              <HistoryIcon className="rewindIcon" />
            </IconButton>
          </Grid>
          {/* FordwardButton */}
          <Grid item xs={1}>
            <IconButton onClick={handleForward}>
              <Forward10Icon className="forwardIcon" />
            </IconButton>
          </Grid>
          {/* Volume */}
          <Grid item xs={1} className="volumeControls">
            <IconButton onClick={handleMute}>
              {muted ? (
                <VolumeOff fontSize="large" className="volumeOffIcon" />
              ) : (
                <VolumeUpIcon fontSize="large" className="volumeUpIcon" />
              )}
            </IconButton>
            <Slider
              min={0}
              max={100}
              defaultValue={100}
              width={100}
              onChange={handleVolumeChange}

              /*onChangeCommitted={handleVolumeSeekDown}*/
            ></Slider>
          </Grid>

          {/*  Title and episode */}
          <Grid item xs={2}>
            <IconButton onClick={handleForward}>
              <Typography className="title">The Animal(U.S)</Typography>

              <Typography className="episode"> S1:E2</Typography>
            </IconButton>
          </Grid>

          {/* HelpOutlineIcon */}
          <Grid item xs={1}>
            <IconButton>
              <HelpOutlineIcon className="helpOutlineIcon" />
            </IconButton>
          </Grid>
          {/* SkipNextIcon */}
          <Grid item xs={1}>
            <IconButton>
              <SkipNextIcon className="skipNextIcon" />
            </IconButton>
          </Grid>
          {/*FilterNoneIcon */}
          <Grid item xs={1}>
            <IconButton>
              <FilterNoneIcon className="filterNoneIcon" />
            </IconButton>
          </Grid>
          {/*  CommentIcon */}
          <Grid item xs={1}>
            <IconButton>
              <CommentIcon className="CommentIcon" />
            </IconButton>
          </Grid>

          {/*  Speed */}
          <Grid item xs={1}>
            <Button onClick={handlePopover} variant="text">
              {/*<Typography>{playbackRate}X</Typography>*/}
              <SpeedIcon className="speedIcon" />
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Grid container direction="column-reverse">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <Button
                    onClick={() => handlePlayerRateChange(rate)}
                    variant="text"
                  >
                    <Typography color="secondary">{rate}</Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>
          </Grid>
          {/*  FullScreenIcon */}
          <Grid item xs={1}>
            <IconButton onClick={toggleFullScreen}>
              <FullscreenIcon className="fullscreenIcon" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
