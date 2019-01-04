import TextInput from './TextInput.jsx';
import TextareaQ from './Textarea.jsx';
import { qatypes } from '../util/enums.js';
import Style from "../App.less";
import FormStyle from "./Form.less";

export default class Builder extends React.Component {
  static propTypes = {
    disableSave: React.PropTypes.bool,
    lockQuestions: React.PropTypes.bool,
    questions: React.PropTypes.array,
    surveyName: React.PropTypes.string,
    saveSurvey: React.PropTypes.func,
    updateQuestions: React.PropTypes.func,
    updateSurveyName: React.PropTypes.func,
  };

  addSelect = () => {
    const question = {
      type: qatypes.select,
      question: '',
      guid: Date.now(),
      options: []
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addTextInput = () => {
    const question = {
      type: qatypes.textInput,
      question: '',
      guid: Date.now()
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addTextarea = () => {
    const question = {
      type: qatypes.textarea,
      question: '',
      guid: Date.now()
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  // this is used in a map function to iterate
  // and transform question data into 
  // the appropriate type of form data to render
  buildSurveyElements = (element, index) => {
    console.log(element);
    if (element.type === qatypes.textInput) {
      return <TextInput question={element.question} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (element.type === qatypes.textarea) {
      return <TextareaQ question={element.question} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (element.type === qatypes.select) {
      return <li>select box</li>;
    }
  }

  deleteQuestion = (questionGuid) => {
    let questions = this.props.questions
    questions = questions.filter(q => q.guid !== questionGuid);

    this.props.updateQuestions(questions);
  }

  updateQuestion = (updatedValue) => {
    let questions = this.props.questions;
    let index = questions.findIndex(q => q.guid === updatedValue.guid);

    questions[index] = updatedValue;

    this.props.updateQuestions(questions);
  }

  updateName = (event) => {
    this.props.updateSurveyName(event.target.value);
  }

  render() {
    let builderCanvas;

    if (this.props.questions.length) {
      builderCanvas = <ol>
        {this.props.questions.map(this.buildSurveyElements)}
      </ol>;
    } else {
      builderCanvas = <p>add questions...</p>;
    }

    return <section>
      <header className={Style.buildingHeader}>
        <label className={FormStyle.formInput}>
          <span>survey name</span>
          <input type="text" value={this.props.surveyName} onInput={this.updateName} disabled={this.props.lockQuestions} />
        </label>

        <quip.apps.ui.Button 
          type="button" 
          onClick={this.props.saveSurvey} 
          primary="true"
          disabled={this.props.disableSave} 
          text={this.props.lockQuestions ? 'survey saved' : 'save survey'} />
      </header>

      <nav className={Style.flexirow}>
        <strong>add to form:</strong>

        <quip.apps.ui.Button type="button" onClick={this.addTextInput} disabled={this.props.lockQuestions} text="short text" />
        <quip.apps.ui.Button type="button" onClick={this.addTextarea} disabled={this.props.lockQuestions} text="long form text" />
        <quip.apps.ui.Button type="button" onClick={this.addSelect} disabled={this.props.lockQuestions} text="select box" />
      </nav>

      { this.props.surveyErrors && <ErrorMessage type="newSurvey" error={this.props.surveyErrors} />}

      { builderCanvas }
    </section>;
  }
}
