import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class TextareaQ extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    guid: React.PropTypes.number,
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func,
    lock: React.PropTypes.bool
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  moveQuestionDown = () => {
    let question = {
      question: this.props.question,
      helper: this.props.helper,
      guid: this.props.guid,
      type: qatypes.textarea
    };

    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    let question = {
      question: this.props.question,
      helper: this.props.helper,
      guid: this.props.guid,
      type: qatypes.textarea
    };

    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = {
      question: this.props.question,
      helper: event.target.value,
      guid: this.props.guid,
      type: qatypes.textarea
    };

    this.props.updated(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      question: event.target.value,
      helper: this.props.helper,
      guid: this.props.guid,
      type: qatypes.textarea
    };

    this.props.updated(updatedQuestion);
  }

  render() {
    return <li key={this.props.guid} className={Style.formSection}>
      <p className={Style.sectionDescription}>
        textarea <em>(for long form answers)</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>

      <label className={Style.formInput}>
        <span>optional helper text</span>
        <input type="text" value={this.props.helper} placeholder="(new lines for each person, include their title: Mary Smith, CEO of Kola Co.)" onChange={this.questionHelperValueUpdate} disabled={this.props.lock} />
      </label>

      <p className={Style.sectionFooter}>
        <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover} disabled={this.props.lock}>move question up</button>
        <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover} disabled={this.props.lock}>move question down</button>
      </p>
    </li>;
  }
}