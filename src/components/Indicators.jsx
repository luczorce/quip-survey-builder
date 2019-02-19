import Style from "../App.less";

export default class SavedIcon extends React.Component {
  // TODO how to detect "dirty" data?
  render() {
    return <span>
      <span title="saved to server" aria-hidden="true">&#x2713;</span>
      <span className={Style.visuallyHidden}>saved to server</span>
    </span>
  }
}