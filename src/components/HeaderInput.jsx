import QuestionHeader from './QuestionHeader.jsx';
import { qatypes } from '../util/enums.js';
import { Question } from '../util/models.js';
import Style from "./Form.less";
import GlobalStyle from "../App.less";

export default class HeaderInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    guid: React.PropTypes.number,
    id: React.PropTypes.number,
    errors: React.PropTypes.array,
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid, this.props.id, qatypes.header);
  }

  moveQuestionDown = () => {
    const question = new Question(qatypes.header, this.props);

    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    const question = new Question(qatypes.header, this.props);

    this.props.updateOrder(question, true);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.header, this.props);
    updatedQuestion.value = event.target.value;

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
        <QuestionHeader name="header" description="for separating sections of questions" id={this.props.id} deleteFunc={this.deleteQuestion} isHeader="true" />
        
        <label className={Style.formInput}>
          <span>text</span>
          <input type="text" value={this.props.value} placeholder="(Industry Specific Questions)" onChange={this.questionValueUpdate} />
        </label>

        <p className={Style.sectionFooter}>
          <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover}>move header up</button>
          <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover}>move header down</button>
        </p>
      </div>
    </li>;
  }
}