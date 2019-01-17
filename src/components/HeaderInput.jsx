import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class HeaderInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    guid: React.PropTypes.number,
    lock: React.PropTypes.bool
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func,
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  moveQuestionDown = () => {
    let question = {
      value: this.props.value,
      guid: this.props.guid,
      type: qatypes.header
    };

    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    let question = {
      value: this.props.value,
      guid: this.props.guid,
      type: qatypes.header
    };

    this.props.updateOrder(question, true);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      value: event.target.value,
      guid: this.props.guid,
      type: qatypes.header
    };

    this.props.updated(updatedQuestion);
  }

  render() {
    return <li key={this.props.guid} className={Style.formSection}>
      <p className={Style.sectionDescription}>
        header <em>(for separating sections of questions)</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>text</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>

      <p className={Style.sectionFooter}>
        <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover} disabled={this.props.lock}>move header up</button>
        <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover} disabled={this.props.lock}>move header down</button>
      </p>
    </li>;
  }
}