import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    guid: React.PropTypes.number,
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func,
    lock: React.PropTypes.bool
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      question: event.target.value,
      guid: this.props.guid,
      type: qatypes.textInput
    };

    this.props.updated(updatedQuestion);
  }

  moveQuestionUp = () => {
    let question = {
      question: this.props.question,
      guid: this.props.guid,
      type: qatypes.textInput
    };

    this.props.updateOrder(question, true);
  }

  moveQuestionDown = () => {
    let question = {
      question: this.props.question,
      guid: this.props.guid,
      type: qatypes.textInput
    };

    this.props.updateOrder(question, false);
  }

  render() {
    return <li key={this.props.guid} className={Style.formSection}>
      <p className={Style.sectionDescription}>
        text input <em>(for short answers)</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>

      <p className={Style.sectionFooter}>
        <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover} disabled={this.props.lock}>move question up</button>
        <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover} disabled={this.props.lock}>move question down</button>
      </p>
    </li>;
  }
}