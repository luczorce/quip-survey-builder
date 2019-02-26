import QuestionHeader from './QuestionHeader.jsx';
import { qatypes } from '../util/enums.js';
import { Question, Option } from '../util/models.js';
import Style from "./Form.less";
import GlobalStyle from "../App.less";

export default class Checkbox extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    optionsList: React.PropTypes.object,
    guid: React.PropTypes.number,
    id: React.PropTypes.number,
    errors: React.PropTypes.array,
    updateQuestion: React.PropTypes.func,
    updateOptions: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid, this.props.id, qatypes.checkbox);
  }

  moveQuestionDown = () => {
    const question = new Question(qatypes.checkbox, this.props);
    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    const question = new Question(qatypes.checkbox, this.props);
    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.checkbox, this.props);
    updatedQuestion.helper = event.target.value;

    this.props.updateQuestion(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.checkbox, this.props);
    updatedQuestion.question = event.target.value;

    this.props.updateQuestion(updatedQuestion);
  }

  questionOptionsAdd = () => {
    let updatedOptions = this.props.optionsList.options;

    updatedOptions.push(new Option());

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

    let errors;

    if (this.props.errors && this.props.errors.length) {
      errors = <p className={GlobalStyle.errorMessage}>{this.props.errors.join('; ')}</p>;
    }

    return <li key={this.props.guid}>
      {errors}

      <div className={Style.formSection}>
        <QuestionHeader name="checkboxes" description="for listing out options where many can be picked" id={this.props.id} deleteFunc={this.deleteQuestion} />
        
        <label className={Style.formInput}>
          <span>question</span>
          <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
        </label>

        <label className={Style.formInput}>
          <span>optional helper text</span>
          <input type="text" value={this.props.helper} placeholder="(Choose any that apply)" onChange={this.questionHelperValueUpdate} disabled={this.props.lock} />
        </label>

        <p className={GlobalStyle.flexirow}>
          <span>options</span>
          <quip.apps.ui.Button type="button" onClick={this.questionOptionsAdd} disabled={this.props.lock} text="add option" />
        </p>

        { !this.props.optionsList.options.length && <p>no options yet...</p> }
        { Boolean(this.props.optionsList.options.length) && <ol>{options}</ol> }

        <p className={Style.sectionFooter}>
          <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover} disabled={this.props.lock}>move question up</button>
          <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover} disabled={this.props.lock}>move question down</button>
        </p>
      </div>
    </li>;
  }
}