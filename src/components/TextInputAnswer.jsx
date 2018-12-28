import Style from "./Form.less";

export default class TextInputAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  answerUpdate = (event) => {
    // debounce communication to server to update the answer
    // TODO make question type enum
    this.props.update(this.props.answer.id, 'text_input', event.target.value);
  }

  render() {
    return <div key={this.props.answer.id} className={Style.formSection}>
      <label className={Style.formInput}>
        <span>{this.props.question}</span>
        <input type="text" value={this.props.answer ? this.props.answer.answer : ''} onChange={this.answerUpdate} />
      </label>
    </div>;
  }
}