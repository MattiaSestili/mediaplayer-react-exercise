import * as React from "react";
import { PlayerList } from "./PlayerList";
import { BottomToolbar } from "./BottomToolbar";

interface IPlayerContainerState {
  CurrentIndex: number;
  // CurrentTitle: string;
  // CurrentArtist: string;
  // IsPlaying: boolean;
  // ProgressBar: number;
  // VolumeBar: number;
  // VolumeUp: boolean;
  // CurrentTime: string;
  // TotalTime: string;
}

export class PlayerContainer extends React.Component<
  {},
  IPlayerContainerState
> {
  public constructor(p: {}) {
    super(p);

    this.state = {
      CurrentIndex: -1
    };
  }

  public render(): JSX.Element {
    // Note: this exchange of index could be done using an Observable a generic component that it uses between single components and re-render
    // without use props and callback. this render the code more mantainable and readble
    // i.e: http://reactivex.io/documentation/observable.html

    // this kind of object would make ten times simpler update the component itself. For instance overing with the mouse and render the icon or change
    // the volume or add a shuffle button or add extra complexity without overuse and for sure ending up misuse the setState.
    return (
      <div>
        <PlayerList
          SelectedIndex={this.state.CurrentIndex}
          OnSongSelected={this._highlightStartSong}
        />
        <BottomToolbar
          OnPlaying={this._highlightStartSong}
          SelectedIndex={this.state.CurrentIndex}
        />
      </div>
    );
  }

  private readonly _highlightStartSong = (i: number) => {
    this.setState({ CurrentIndex: i });
  };
}
