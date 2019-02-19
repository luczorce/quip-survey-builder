import SavedIcon from "./Indicators.jsx";
import { qatypes } from '../util/enums.js';
import { Question } from '../util/models.js';
import Style from "./Form.less";
import GlobalStyle from "../App.less";

export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
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

  moveQuestionDown = () => {
    const question = new Question(qatypes.textInput, this.props);
    this.props.updateOrder(question, false);
  }

  moveQuestionUp = () => {
    const question = new Question(qatypes.textInput, this.props);
    this.props.updateOrder(question, true);
  }

  questionHelperValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.textInput, this.props);
    updatedQuestion.helper = event.target.value;

    this.props.updated(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = new Question(qatypes.textInput, this.props);
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
          text input <em>(for short answers)</em>
          <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter}>delete question</button>

            { this.props.id !== null && <SavedIcon /> }
        </p>
        
        <label className={Style.formInput}>
          <span>question</span>
          <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} />
        </label>

        <label className={Style.formInput}>
          <span>optional helper text</span>
          <input type="text" value={this.props.helper} placeholder="(Give first and last name, like: John Smith)" onChange={this.questionHelperValueUpdate} />
        </label>

        <p className={Style.sectionFooter}>
          <button type="button" onClick={this.moveQuestionUp} className={Style.sectionMover}>move question up</button>
          <button type="button" onClick={this.moveQuestionDown} className={Style.sectionMover}>move question down</button>
        </p>
      </div>
    </li>;
  }
}