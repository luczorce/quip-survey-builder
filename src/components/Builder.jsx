import Checkbox from './Checkbox.jsx';
import HeaderInput from './HeaderInput.jsx';
import NumberInput from './NumberInput.jsx';
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

  componentDidMount = () => {
    quip.apps.updateToolbar({
      toolbarCommandIds: [
        'addFormItem'
      ],
      menuCommands: [
        {
          id: 'addFormItem',
          label: 'Add to Form',
          subCommands: ['shortText', 'longText', 'number', 'selectBox', 'radio', 'checkbox', 'header']
        },
        {
          id: 'shortText',
          label: 'short text',
          handler: () => {
            this.addTextInput();
          }
        },
        {
          id: 'longText',
          label: 'long form text',
          handler: () => {
            this.addTextarea();
          }
        },
        {
          id: 'number',
          label: 'whole number',
          handler: () => {
            this.addNumberInput();
          }
        },
        {
          id: 'selectBox',
          label: 'select box',
          handler: () => {
            this.addSelect();
          }
        },
        {
          id: 'radio',
          label: 'radio',
          handler: () => {
            this.addRadio();
          }
        },
        {
          id: 'checkbox',
          label: 'checkbox',
          handler: () => {
            this.addCheckbox();
          }
        },
        {
          id: 'header',
          label: 'header',
          handler: () => {
            this.addHeader();
          }
        }
      ]
    });
  }

  addCheckbox = () => {
    this.addOption(qatypes.checkbox);
  }

  addHeader = () => {
    const question = {
      type: qatypes.header,
      value: '',
      guid: Date.now()
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addNumberInput = () => {
    const question = {
      type: qatypes.numberInput,
      question: '',
      helper: '',
      min: null,
      max: null,
      guid: Date.now()
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addOption = (type) => {
    const question = {
      type: type,
      question: '',
      helper: '',
      guid: Date.now()
    };

    const optionList = {
      guid: question.guid,
      options: []
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateOptions(optionList, null);
    this.props.updateQuestions(questions);
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
      helper: '',
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
      helper: '',
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
    if (element.type === qatypes.header) {
      return <HeaderInput value={element.value} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} updateOrder={this.updateQuestionOrder} />;
    } else if (element.type === qatypes.textInput) {
      return <TextInput question={element.question} helper={element.helper} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} lock={this.props.lockQuestions} updateOrder={this.updateQuestionOrder} />;
    } else if (element.type === qatypes.numberInput) {
      return <NumberInput question={element.question} helper={element.helper} min={element.min} max={element.max} guid={element.guid} updated={this.updateQuestion} updateOrder={this.updateQuestionOrder} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (element.type === qatypes.textarea) {
      return <TextareaQ question={element.question} helper={element.helper} guid={element.guid} updated={this.updateQuestion} updateOrder={this.updateQuestionOrder} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
    } else if (optionTypes.includes(element.type)) {
      let options = this.props.options.find(o => o.guid === element.guid);

      if (element.type === qatypes.select) {
        return <SelectQ question={element.question} helper={element.helper} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} updateOrder={this.updateQuestionOrder} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
      } else if (element.type === qatypes.radio) {
        return <Radio question={element.question} helper={element.helper} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} updateOrder={this.updateQuestionOrder} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
      } else if (element.type === qatypes.checkbox) {
        return <Checkbox question={element.question} helper={element.helper} optionsList={options} guid={element.guid} updateQuestion={this.updateQuestion} updateOptions={this.updateOption} updateOrder={this.updateQuestionOrder} deleted={this.deleteQuestion} lock={this.props.lockQuestions} />;
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

  updateQuestionOrder = (question, moveUp) => {
    let questions = this.props.questions;
    let index = questions.findIndex(q => q.guid === question.guid);
    let newIndex;
    // remove it from the array first
    questions.splice(index, 1);

    if (moveUp) {
      // moving it up
      newIndex = ( index > 0 ) ? index - 1 : 0;
    } else {
      // moving it down
      newIndex = index + 1;
    }

    questions.splice(newIndex, 0, question);
    this.props.updateQuestions(questions);
  }

  render() {
    let builderCanvas;

    if (this.props.questions.length) {
      builderCanvas = <ol>
        {this.props.questions.map(this.buildSurveyElements)}
      </ol>;
    } else {
      builderCanvas = <p>add questions to the form...</p>;
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

      { this.props.surveyErrors && <ErrorMessage type="newSurvey" error={this.props.surveyErrors} />}

      { builderCanvas }
    </section>;
  }
}
