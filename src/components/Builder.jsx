import Checkbox from './Checkbox.jsx';
import HeaderInput from './HeaderInput.jsx';
import NumberInput from './NumberInput.jsx';
import Radio from './Radio.jsx';
import SelectQ from './Select.jsx';
import TextareaQ from './Textarea.jsx';
import TextInput from './TextInput.jsx';

import { 
  deleteQuestion,
  getSurveyResults,
  saveSurveyName,
  saveSurveyQuestion,
  updateSurveyQuestion
} from '../util/survey-communication.js';
import { qatypes, optionTypes, purposes } from '../util/enums.js';
import { Question, OptionList } from '../util/models.js';

import Style from "../App.less";
import FormStyle from "./Form.less";

export default class Builder extends React.Component {
  static propTypes = {
    options: React.PropTypes.array,
    purpose: React.PropTypes.string,
    questions: React.PropTypes.array,
    surveyId: React.PropTypes.number,
    surveyName: React.PropTypes.string,
    onSurveySaved: React.PropTypes.func,
    updateOptions: React.PropTypes.func,
    updateQuestions: React.PropTypes.func,
    updateSurveyName: React.PropTypes.func,
  };

  constructor(props) {
    super();

    this.state = {
      disableSave: !props.surveyName.length,
      globalError: null,
      globalMessage: null
    };
  }

  componentDidMount = () => {
    let toolbar = {
      toolbarCommandIds: [
        'addFormItem',
        'getFormAnswers'
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
        },
        {
          id: 'getFormAnswers',
          label: 'get survey results',
          subCommands: [ 'getExcelAnswers' ]
        },
        {
          id: 'getExcelAnswers',
          label: 'as excel file (xlsx)',
          handler: () => {
            this.getResultsAsExcel();
          }
        }
      ]
    };

    // TODO when the first save happens, the purpose should update... 
    // we need to detect when to enable the button (even though there are likely no results)
    if (this.props.purpose === purposes.building) {
      toolbar.disabledCommandIds = [ 'getFormAnswers' ];
    }

    quip.apps.updateToolbar(toolbar);
  }

  addCheckbox = () => {
    this.addOption(qatypes.checkbox);
  }

  addHeader = () => {
    const question = new Question(qatypes.header);
    
    let questions = this.props.questions;
    questions.push(question);
    
    this.props.updateQuestions(questions);
  }

  addNumberInput = () => {
    const question = new Question(qatypes.numberInput);

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addOption = (type) => {
    const question = new Question(type);
    const optionList = new OptionList(question.guid);

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
    const question = new Question(qatypes.textInput);

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  addTextarea = () => {
    const question = new Question(qatypes.textarea);

    let questions = this.props.questions;
    questions.push(question);
    
    this.props.updateQuestions(questions);
  }

  // this is used in a map function to iterate
  // and transform question data into 
  // the appropriate type of form data to render
  buildSurveyElements = (element, index) => {
    if (element.type === qatypes.header) {
      return <HeaderInput value={element.value} 
          guid={element.guid} 
          id={element.id} 
          errors={element.errors} 
          updated={this.updateQuestion} 
          deleted={this.removeQuestion} 
          updateOrder={this.updateQuestionOrder} />;
    } else if (element.type === qatypes.textInput) {
      return <TextInput question={element.question} 
          helper={element.helper} 
          guid={element.guid} 
          id={element.id} 
          errors={element.errors} 
          updated={this.updateQuestion} 
          deleted={this.removeQuestion} 
          updateOrder={this.updateQuestionOrder} />;
    } else if (element.type === qatypes.numberInput) {
      return <NumberInput question={element.question} 
          helper={element.helper} 
          min={element.min} 
          max={element.max} 
          guid={element.guid} 
          id={element.id} 
          errors={element.errors} 
          updated={this.updateQuestion} 
          updateOrder={this.updateQuestionOrder} 
          deleted={this.removeQuestion} />;
    } else if (element.type === qatypes.textarea) {
      return <TextareaQ question={element.question} 
          helper={element.helper} 
          guid={element.guid} 
          id={element.id} 
          errors={element.errors} 
          updated={this.updateQuestion} 
          updateOrder={this.updateQuestionOrder} 
          deleted={this.removeQuestion} />;
    } else if (optionTypes.includes(element.type)) {
      let options = this.props.options.find(o => o.guid === element.guid);

      if (element.type === qatypes.select) {
        return <SelectQ question={element.question} 
            helper={element.helper} 
            optionsList={options} 
            guid={element.guid} 
            id={element.id} 
            errors={element.errors} 
            updateQuestion={this.updateQuestion} 
            updateOptions={this.updateOption} 
            updateOrder={this.updateQuestionOrder} 
            deleted={this.removeQuestion} />;
      } else if (element.type === qatypes.radio) {
        return <Radio question={element.question} 
            helper={element.helper} optionsList={options} 
            guid={element.guid} 
            id={element.id} 
            errors={element.errors} 
            updateQuestion={this.updateQuestion} 
            updateOptions={this.updateOption} 
            updateOrder={this.updateQuestionOrder} 
            deleted={this.removeQuestion} />;
      } else if (element.type === qatypes.checkbox) {
        return <Checkbox question={element.question} 
            helper={element.helper} 
            optionsList={options} 
            guid={element.guid} 
            id={element.id} 
            errors={element.errors} 
            updateQuestion={this.updateQuestion} 
            updateOptions={this.updateOption} 
            updateOrder={this.updateQuestionOrder} 
            deleted={this.removeQuestion} />;
      }
    }
  }

  catchSurveyNameFailure = (response) => {
    console.log('error with saving survey name');
    console.log(response);
    
    this.setState({
      globalError: `name ${response.data.name}`
    });
  }

  getResultsAsExcel = () => {
    getSurveyResults(this.props.surveyId).then(response => {
      if (response.ok) {
        return response.data;
      } else {
        // TODO error message
        return false;
      }
    }).then(surveyData => {
      if (surveyData === false) return false;

      console.log(surveyData);
      // if (surveyData.length) {
      // } else {
      //   // TODO no Data notification
      // }
    })
  }

  removeQuestion = (guid, id = null, type = null) => {
    let questions = this.props.questions;
    
    if (id !== null) {
      deleteQuestion(id, type).then(response => {
        if (response.ok) {
          questions = questions.filter(q => q.guid !== guid);
        } else {
          let index = questions.findIndex(q => q.guid === guid);
          questions[index].errors.push('there was an issue deleting this question, please try again');
        }

        this.props.updateQuestions(questions);
      });
    } else {
      questions = questions.filter(q => q.guid !== guid);
      this.props.updateQuestions(questions);
    }

    // TODO consider removing an associated optionList
  }

  saveSurvey = () => {
    this.setState({
      globalError: null,
      globalMessage: null
    }, () => {
      this.saveSurveyName()
        .then((surveyId) => {
          this.props.onSurveySaved(surveyId);
          return surveyId;
        }, this.catchSurveyNameFailure)
        .then(this.saveSurveyQuestions);
    });
  }

  saveSurveyName = () => {
    return new Promise((resolve, reject) => {
      saveSurveyName(this.props.surveyName, this.props.surveyId).then(response => {
        if (!response.ok) {
          return reject(response);
        } else {
          this.setState({
            globalError: null
          }, () => {
            return resolve(response.data.id);
          });
        }
      });
    });
  }

  saveSurveyQuestions = (surveyId) => {
    const questionPromises = this.props.questions.map((question, index) => {
      if (optionTypes.includes(question.type)) {
        let optionsList = this.props.options.find(o => o.guid === question.guid);
        question.options = optionsList.options.map(o => o.value);
        question.optionHelpers = optionsList.options.map(o => o.helper);
      }

      return new Promise((resolve, reject) => {
        if (question.id !== null) {
          updateSurveyQuestion(question, index)
            .then(questionResponse => {
              resolve({question, questionResponse});
            });
        } else {
          saveSurveyQuestion(surveyId, question, index)
            .then(questionResponse => {
              resolve({question, questionResponse});
            });
        }
      });
    });

    Promise.all(questionPromises).then(responses => {
      responses.forEach(r => {
        if (r.questionResponse.ok) {
          r.question.id = r.questionResponse.data.id;
          r.question.errors.length = 0;
        } else {
          let errorMessages = [];
          Object.keys(r.questionResponse.data).forEach(e => {
            errorMessages.push(`${e} ${r.questionResponse.data[e].join(', ')}`);
          });

          r.question.errors = errorMessages;
        }
        
        this.updateQuestion(r.question);
      });

      if (responses.map(r => r.questionResponse).some(r => !r.ok)) {
        console.log('found some errors in the Promise all finale');
        this.setState({
          globalError: 'there were issues saving, please double check all questions'
        }, () => {
          setTimeout(() => {
            this.setState({ globalError: null });
          }, 5000)
        });
      } else {
        this.setState({
          globalMessage: 'the survey and all questions saved successfully'
        }, () => {
          setTimeout(() => {
            this.setState({ globalMessage: null });
          }, 5000)
        });
      }
    });
  }

  updateName = (event) => {
    const name = event.target.value;

    this.props.updateSurveyName(name);
    this.setState({
      disableSave: !name.length
    });
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
      { this.state.globalError && 
        <p className={Style.errorMessage}>{this.state.globalError}</p>
      }

      { this.state.globalMessage && 
        <p className={Style.notificationMessage}>{this.state.globalMessage}</p>
      }

      <header className={Style.buildingHeader}>
        <label className={FormStyle.formInput}>
          <span>survey name</span>
          <input type="text" value={this.props.surveyName} onInput={this.updateName} />
        </label>

        <quip.apps.ui.Button 
          type="button" 
          onClick={this.saveSurvey} 
          primary="true"
          disabled={this.state.disableSave} 
          text={this.props.purpose == purposes.editing ? 'update survey' : 'save survey'} />
      </header>

      { builderCanvas }
    </section>;
  }
}
