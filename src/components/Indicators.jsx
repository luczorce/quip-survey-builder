import Style from '../App.less';
import FormStyle from './Form.less';

export default class SavedIcon extends React.Component {
  // TODO how to detect "dirty" data?
  render() {
    return <span className={FormStyle.icon}>
      <span title="saved to server" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c6470" strokeWidth="4" strokeLinecap="round" strokeLinejoin="arcs"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </span>
      <span className={Style.visuallyHidden}>saved to server</span>
    </span>;
  }
}
