import Style from './Form.less';

export default class QuestionFooterMemo extends React.Component {
  render() {
    return <span className={Style.footerMemo}>
      <span className={Style.bigger}>*</span> is required
    </span>;
  }
}
