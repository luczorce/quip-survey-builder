import { qatypes } from '../util/enums.js';
import Style from "./Form.less";
import MainStyle from "../App.less";

export default class Checkbox extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    optionsList: React.PropTypes.object,
    guid: React.PropTypes.number,
    updateQuestion: React.PropTypes.func,
    updateOptions: React.PropTypes.func,
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
      type: qatypes.checkbox
    };

    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    let question = {
      question: this.props.question,
      helper: this.props.helper,
      guid: this.props.guid,
      type: qatypes.checkbox
    };

    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = {
      question: this.props.question,
      helper: event.target.value,
      guid: this.props.guid,
      type: qatypes.checkbox
    };

    this.props.updateQuestion(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      question: event.target.value,
      helper: this.props.helper,
      guid: this.props.guid,
      type: qatypes.checkbox
    };

    this.props.updateQuestion(updatedQuestion);
  }

  questionOptionsAdd = () => {
    let updatedOptions = this.props.optionsList.options;

    updatedOptions.push({
      guid: Date.now(),
      value: '',
      helper: ''
    });

    this.props.updateOptions(this.props.optionsList.guid, updatedOptions);
  }

  questionOptionHelperUpdate = (value, guid) => {
    let updatedOptions = this.props.optionsList.options;
    const index = updatedOptions.findIndex(o => o.guid === guid);

    updatedOptions[index].helper = value;
    this.props.updateOptions(this.props.optionsList.guid, updatedOptions);
  }

  questionOptionsUpdate = (value, guid) => {
    let updatedOptions = this.props.optionsList.options;
    const index = updatedOptions.findIndex(o => o.guid === guid);

    updatedOptions[index].value = value;
    this.props.updateOptions(this.props.optionsList.guid, updatedOptions);
  }

  removeOption = (optionGuid) => {
    let updatedOptions = this.props.optionsList.options;
    const index = updatedOptions.findIndex(o => o.guid === optionGuid);

    updatedOptions.splice(index, 1);
    this.props.updateOptions(this.props.optionsList.guid, updatedOptions);
  }

  render() {
    const options = this.props.optionsList.options.map(o => {
      return <li key={o.guid} className={Style.formOption}>
        <input value={o.value} type="text" onChange={(event) => this.questionOptionsUpdate(event.target.value, o.guid)} />
        <quip.apps.ui.Button type="button" onClick={() => this.removeOption(o.guid)} disabled={this.props.lock} text="remove" />
        <input value={o.helper} type="text" className={Style.formOptionHelper} onChange={(event) => this.questionOptionHelperUpdate(event.target.value, o.guid)} placeholder="helper text for option" />
      </li>;
    });

    return <li key={this.props.guid} className={Style.formSection}>
      <p className={Style.sectionDescription}>
        checkboxes <em>(for listing out options where <strong>many</strong> can be picked)</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>

      <label className={Style.formInput}>
        <span>optional helper text</span>
        <input type="text" value={this.props.helper} placeholder="(Choose any that apply)" onChange={this.questionHelperValueUpdate} disabled={this.props.lock} />
      </label>

      <p className={MainStyle.flexirow}>
        <span>options</span>
        <quip.apps.ui.Button type="button" onClick={this.questionOptionsAdd} disabled={this.props.lock} text="add option" />
      </p>

      { !this.props.optionsList.options.length && <p>no options yet...</p> }
      { Boolean(this.props.optionsList.options.length) && <ol>{options}</ol> }

      <p className={Style.sectionFooter}>
        <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover} disabled={this.props.lock}>move question up</button>
        <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover} disabled={this.props.lock}>move question down</button>
      </p>
    </li>;
  }
}