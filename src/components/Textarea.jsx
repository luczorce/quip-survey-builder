import QuestionHeader from './QuestionHeader.jsx';
import QuestionFooterMemo from './QuestionFooterMemo.jsx';
import Required from './Required.jsx';
import { qatypes } from '../util/enums.js';
import { Question } from '../util/models.js';
import Style from "./Form.less";
import GlobalStyle from "../App.less";

export default class TextareaQ extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    guid: React.PropTypes.number,
    id: React.PropTypes.number,
    errors: React.PropTypes.array,
    updated: React.PropTypes.func,
    updateOrder: React.PropTypes.func,
    deleted: React.PropTypes.func
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid, this.props.id, qatypes.textarea);
  }

  moveQuestionDown = () => {
    const question = new Question(qatypes.textarea, this.props);
    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    const question = new Question(qatypes.textarea, this.props);
    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.textarea, this.props);
    updatedQuestion.helper = event.target.value;

    this.props.updated(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.textarea, this.props);
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
        <QuestionHeader name="textarea" description="for long form answers" id={this.props.id} deleteFunc={this.deleteQuestion} />
        
        <label className={Style.formInput}>
          <span>question <Required /></span>
          <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} />
        </label>

        <label className={Style.formInput}>
          <span>helper text</span>
          <input type="text" value={this.props.helper} placeholder="(new lines for each person, include their title: Mary Smith, CEO of Kola Co.)" onChange={this.questionHelperValueUpdate} />
        </label>

        <p className={Style.sectionFooter}>
          <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover}>move question up</button>
          <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover}>move question down</button>

          <QuestionFooterMemo />
        </p>
      </div>
    </li>;
  }
}