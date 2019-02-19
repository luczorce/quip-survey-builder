import SavedIcon from "./Indicators.jsx";
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
    // TODO if question is on server, delete it TOO
    this.props.deleted(this.props.guid);
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
        <p className={Style.sectionDescription}>
          header <em>(for separating sections of questions)</em>
          <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter}>delete question</button>

          { this.props.id !== null && <SavedIcon /> }
        </p>
        
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