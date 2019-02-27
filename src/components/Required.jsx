import Style from './Form.less';

export default class Required extends React.Component {
  render() {
    return <span className={Style.bigger} title="required">*</span>;
  }
}
