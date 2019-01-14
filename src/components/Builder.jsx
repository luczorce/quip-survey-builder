import Checkbox from './Checkbox.jsx';
import Radio from './Radio.jsx';
import SelectQ from './Select.jsx';
import TextareaQ from './Textarea.jsx';
import TextInput from './TextInput.jsx';

import { qatypes, optionTypes } from '../util/enums.js';

import Style from "../App.less";
import FormStyle from "./Form.less";

export default class Builder extends React.Component {
  static propTypes = {
    disableSave: React.PropTypes.bool,
    lockQuestions: React.PropTypes.bool,
    options: React.PropTypes.array,
    questions: React.PropTypes.array,
    surveyName: React.PropTypes.string,
    saveSurvey: React.PropTypes.func,
    updateOptions: React.PropTypes.func,
    updateQuestions: React.PropTypes.func,
    updateSurveyName: React.PropTypes.func,
  };

  addCheckbox = () => {
    this.addOption(qatypes.checkbox);
  }

  addOption = (type) => {
    const question = {
      type: type,
      question: '',
      guid: Date.now()
    };

    const optionList = {
      guid: question.guid,
      options: []
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
    this.props.updateOptions(optionList, null);
  }

  addRadio = () => {
    this.addOption(qatypes.radio);
  }

  addSelect = () => {
    this.addOption(qatypes.select);
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
    if (element.type === qatypes.textInput) {
      return <TextInput question={element.question} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (element.type === qatypes.textarea) {
      return <TextareaQ question={element.question} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (optionTypes.includes(element.type)) {
      let options = this.props.options.find(o => o.guid === element.guid);

      if (element.type === qatypes.select) {
        return <SelectQ question={element.question} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
      } else if (element.type === qatypes.radio) {
        return <Radio question={element.question} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
      } else if (element.type === qatypes.checkbox) {
        return <Checkbox question={element.question} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
      }
    }
  }

  deleteQuestion = (questionGuid) => {
    let questions = this.props.questions
    questions = questions.filter(q => q.guid !== questionGuid);

    this.props.updateQuestions(questions);
    // TODO consider removing an associated optionList
  }

  updateName = (event) => {
    this.props.updateSurveyName(event.target.value);
  }

  updateOption = (guid, updatedOptionsList) => {
    let options = this.props.options;
    let index = options.findIndex(o => o.guid === guid);

    if (index === -1) {
      console.log('couldnt find the right Option to update');
      return false;
    }

    options[index].options = updatedOptionsList;
    this.props.updateOptions(options[index], index);
  }

  updateQuestion = (updatedValue) => {
    let questions = this.props.questions;
    let index = questions.findIndex(q => q.guid === updatedValue.guid);

    questions[index] = updatedValue;

    this.props.updateQuestions(questions);
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
        <quip.apps.ui.Button type="button" onClick={this.addRadio} disabled={this.props.lockQuestions} text="radios" />
        <quip.apps.ui.Button type="button" onClick={this.addCheckbox} disabled={this.props.lockQuestions} text="checkboxes" />
      </nav>

      { this.props.surveyErrors && <ErrorMessage type="newSurvey" error={this.props.surveyErrors} />}

      { builderCanvas }
    </section>;
  }
}
