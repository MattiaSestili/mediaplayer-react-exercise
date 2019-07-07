import * as React from "react";
import * as SongList from "./Songs";

interface IPlayerListProps {
  SelectedIndex: number;
  OnSongSelected: (idx: number) => void;
}

interface IPlayerListState {
  CurrentIndex: number;
  IsPlaying: boolean;
  MouseOver: boolean;
}

export class PlayerList extends React.PureComponent<
  IPlayerListProps,
  IPlayerListState
> {
  public constructor(p: IPlayerListProps) {
    super(p);
    this.state = {
      CurrentIndex: p.SelectedIndex ? p.SelectedIndex : -1,
      IsPlaying: false,
      MouseOver: false
    };
  }

  public componentDidUpdate(oldProps: IPlayerListProps) {
    if (oldProps.SelectedIndex !== this.props.SelectedIndex) {
      this.setState({
        CurrentIndex: this.props.SelectedIndex
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <table
          className="table table-dark"
          style={{ backgroundColor: "#2b2b2c" }}
        >
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Tile</th>
              <th scope="col">Artis</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {SongList.default.map((s, i) => (
              <tr
                key={i}
                style={{
                  color: this.state.CurrentIndex === i ? "green" : "",
                  cursor: this.state.MouseOver ? "pointer" : ""
                }}
                onClick={() => this._startPlayer(i)}
                onMouseOver={() => this.setState({ MouseOver: true })}
                onMouseLeave={() => this.setState({ MouseOver: false })}
              >
                <td key={i + 1} style={{ width: "100px" }}>
                  {/** todo add a button when the mouse is on this row */}
                </td>
                <td key={i + 2}>{s.title}</td>
                <td key={i + 3}>{s.artistname}</td>
                <td key={i + 4}>{}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  private readonly _startPlayer = (idx: number) => {
    this.setState(
      { CurrentIndex: idx, IsPlaying: !this.state.IsPlaying },
      () => {
        this.props.OnSongSelected(idx);
      }
    );
  };
}
