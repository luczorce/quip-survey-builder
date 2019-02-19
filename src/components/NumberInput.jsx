import SavedIcon from "./Indicators.jsx";
import { qatypes } from '../util/enums.js';
import { Question } from '../util/models.js';
import Style from "./Form.less";
import GlobalStyle from "../App.less";

export default class NumberInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    guid: React.PropTypes.number,
    errors: React.PropTypes.array,
    id: React.PropTypes.number,
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func
  }

  deleteQuestion = () => {
    // TODO if question is on server, delete it TOO
    this.props.deleted(this.props.guid);
  }

  maxValueUpdate = (event) => {
    let max = event.target.value;

    if (event.target.value === '') {
      max = null;
    }

    let updatedQuestion = new Question(qatypes.numberInput, this.props);
    updatedQuestion.max = max;

    this.props.updated(updatedQuestion);
  }

  minValueUpdate = (event) => {
    let min = event.target.value;

    if (event.target.value === '') {
      min = null;
    }

    let updatedQuestion = new Question(qatypes.numberInput, this.props);
    updatedQuestion.min = min;

    this.props.updated(updatedQuestion);
  }

  moveQuestionDown = () => {
    let question = new Question(qatypes.numberInput, this.props);
    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    let question = new Question(qatypes.numberInput, this.props);
    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.numberInput, this.props);
    updatedQuestion.helper = event.target.value;

    this.props.updated(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.numberInput, this.props);
    updatedQuestion.question = event.target.value;

    this.props.updated(updatedQuestion);
  }

  render() {
    let errors;

    if (this.props.errors && this.props.errors.length) {
      errors = <p className={GlobalStyle.errorMessage}>{this.props.errors.join('; ')}</p>;
    }

    return <li key={this.props.guid}>
      {errors}

      <div className={Style.formSection}>
        <p className={Style.sectionDescription}>
          number input <em>(for number-only answers)</em>
          <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter}>delete question</button>

          { this.props.id !== null && <SavedIcon /> }
        </p>
        
        <label className={Style.formInput}>
          <span>question</span>
          <input type="text" value={this.props.question} placeholder="(How many days since your last sneeze?)" onChange={this.questionValueUpdate} />
        </label>

        <label className={Style.formInput}>
          <span>optional helper text</span>
          <input type="text" value={this.props.helper} placeholder="(If you can't remember, then please give your best estimate)" onChange={this.questionHelperValueUpdate} />
        </label>

        <label className={Style.formInput}>
          <span>minimum value (leave blank for no minimum)</span>
          <input type="number" value={this.props.min} onChange={this.minValueUpdate} />
        </label>

        <label className={Style.formInput}>
          <span>maximum value (leave blank for no maximum)</span>
          <input type="number" value={this.props.max} onChange={this.maxValueUpdate} />
        </label>

        <p className={Style.sectionFooter}>
          <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover}>move question up</button>
          <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover}>move question down</button>
        </p>
      </div>
    </li>;
  }
}