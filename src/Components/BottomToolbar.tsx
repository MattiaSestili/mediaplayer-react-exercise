import * as React from "react";
import * as SongList from "./Songs";
interface IBottomToolbarProps {
  OnPlaying: (idx: number) => void;
  SelectedIndex: number;
}

interface IBottomToolbarState {
  CurrentIndex: number;
  CurrentTitle: string;
  CurrentArtist: string;
  IsPlaying: boolean;
  ProgressBar: number;
  VolumeBar: number;
  VolumeUp: boolean;
  CurrentTime: string;
  TotalTime: string;
}

export class BottomToolbar extends React.PureComponent<
  IBottomToolbarProps,
  IBottomToolbarState
> {
  private _player = new Audio();
  // to fix history doesn't go to the prev song if it is selected from the list
  private _history: number[] = [];

  public constructor(p: IBottomToolbarProps) {
    super(p);

    this.state = {
      CurrentIndex: 0,
      CurrentTitle: "",
      CurrentArtist: "",
      IsPlaying: false,
      ProgressBar: 0,
      VolumeBar: 100,
      VolumeUp: true,
      CurrentTime: "00:00",
      TotalTime: "00:00"
    };
  }

  public componentDidUpdate(oldProps: IBottomToolbarProps) {
    if (oldProps.SelectedIndex !== this.props.SelectedIndex) {
      this.setState(
        {
          CurrentIndex: this.props.SelectedIndex
        },
        () => {
          this._startPlayer();
        }
      );
    }
  }

  // according to the new react life cycle all listner and subscription should be added in the did mount phase
  // this because in a more complex app that use server rendering could cause memory leaks
  public componentDidMount() {
    this._player.addEventListener(
      "volumechange",
      () => {
        this.setState({ VolumeBar: this._player.volume * 100 });
      },
      false
    );
    this._player.addEventListener("timeupdate", () => {
      let position = this._player.currentTime / this._player.duration;
      this.setState({ ProgressBar: position * 100 });
      this._convertTime(Math.round(this._player.currentTime));
      this._totalTime(Math.round(this._player.duration));
      if (this._player.ended) {
        this._playNext();
      }
    });
  }

  public render(): JSX.Element {
    return (
      <div id="player">
        <div className="now-playing">
          <div className="meta">
            <span className="title">{this.state.CurrentTitle}</span>
            <span className="artist-name">{this.state.CurrentArtist}</span>
          </div>
        </div>

        <div className="middle-part">
          <div className="controls">
            {/** TODO add a shuffle button */}
            <button className="no-style" onClick={this._playPrev}>
              <i className="fa fa-step-backward" />
            </button>
            <button className="no-style play" onClick={this._playPause}>
              <i
                className={
                  this.state.IsPlaying
                    ? "far fa-pause-circle"
                    : "far fa-play-circle"
                }
              />
            </button>
            <button className="no-style" onClick={this._playNext}>
              <i className="fa fa-step-forward" />
            </button>
            {/** TODO add a loop button */}
          </div>
          <div className="progress">
            <div className="progress-time">{this.state.CurrentTime}</div>
            <div className="bar" onClick={this._barClicked}>
              {this.state.ProgressBar > 0 && (
                <div style={{ width: this.state.ProgressBar + "%" }} />
              )}
            </div>
            <div className="progress-time">{this.state.TotalTime}</div>
          </div>
        </div>

        <div className="volume-bar">
          <button className="no-style" onClick={this._toggleVolume}>
            <i
              className={
                this.state.VolumeUp ? "fa fa-volume-up" : "fa fa-volume-off"
              }
            />
          </button>
          <div className="fill" onClick={this._onVolumeClicked}>
            <div style={{ width: this.state.VolumeBar + "%" }} />
          </div>
        </div>
      </div>
    );
  }

  private _startPlayer = () => {
    const currentSong = SongList.default[this.state.CurrentIndex];
    this._player.src = currentSong.src;
    this.setState({
      CurrentTitle: currentSong.title,
      CurrentArtist: currentSong.artistname,
      IsPlaying: true
    });
    this._player.play();
  };

  private readonly _playNext = () => {
    if (this.state.CurrentIndex === SongList.default.length - 1) {
      this._player.pause();
      this.setState({ IsPlaying: false });
    } else {
      this._history.push(this.state.CurrentIndex);
      this.setState({ CurrentIndex: this.state.CurrentIndex + 1 }, () => {
        this.props.OnPlaying(this.state.CurrentIndex);
        this._startPlayer();
      });
    }
  };

  private readonly _playPrev = () => {
    if (this._history[this._history.length - 1] >= 0) {
      this.setState({ CurrentIndex: this._history.pop() as number }, () => {
        this.props.OnPlaying(this.state.CurrentIndex);
        this._startPlayer();
      });
    } else {
      this._player.pause();
      this.setState({ IsPlaying: false });
    }
  };

  private readonly _playPause = () => {
    if (this._player.paused && !this.state.IsPlaying) {
      this._player.play();
      this.setState({ IsPlaying: true }, () => {
        this.props.OnPlaying(this.state.CurrentIndex);
      });
    } else {
      this._player.pause();
      this.setState({ IsPlaying: false });
    }
  };

  private readonly _barClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = e.nativeEvent.offsetX;
    const offsetWidth = e.currentTarget.offsetWidth;
    const percent = offsetX / offsetWidth;
    this._player.currentTime = percent * this._player.duration;
  };

  private readonly _toggleVolume = () => {
    this.setState({ VolumeUp: !this.state.VolumeUp }, () => {
      if (!this.state.VolumeUp) {
        this._player.volume = 0;
      } else {
        this._player.volume = 1;
      }
    });
  };

  private readonly _onVolumeClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = e.nativeEvent.offsetX;
    const offsetWidth = e.currentTarget.offsetWidth;
    this._player.volume = offsetX / offsetWidth;
  };

  private readonly _convertTime = (seconds: number) => {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    this.setState({
      CurrentTime:
        (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
    });
  };
  private readonly _totalTime = (seconds: number) => {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    this.setState({
      TotalTime:
        (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
    });
  };
}
