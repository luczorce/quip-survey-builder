import quip from 'quip';

import Builder from './components/Builder.jsx';
import SurveyList from './components/SurveyList.jsx';
import SurveyDeleter from './components/SurveyDeleter.jsx';
import SurveyForm from './components/SurveyForm.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';

import {
  createAnswer,
  getSavedSurvey,
  getSavedSurveys, 
  getSurveyQuestions
} from './util/survey-communication.js';
import { optionTypes, purposes, qatypes } from './util/enums.js';
import { Question, OptionList, Option } from './util/models.js';

import Style from "./App.less";

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      answers: props.record.get('answers') || [],
      availableSurveys: [],
      options: props.record.get('questionOptions').getRecords().map(r => r.getData()),
      purpose: props.record.get('purpose') || null,
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      surveyId: props.record.get('surveyId') || null,
      globalMessage: [],
      globalError: []
    };
  }

  recordListener = null;

  componentDidMount() {
    const purpose = this.props.record.get('purpose');

    if (purpose === purposes.loading) {
      const id = this.props.record.get('surveyId');
      
      if (id) {
        this.loadSingleSurvey(id);
        let rootRecord = quip.apps.getRootRecord();
        this.recordListener = rootRecord.listen(() => this.getUpdatedAnswerRecord());
      } else {
        this.loadSurveyForList();
      }
    } else if (purpose === purposes.deleting) {
      this.loadSurveyForDeleting();
    } else if (purpose === purposes.loadForEdit) {
      this.loadSurveyForEditing();
    }
  }

  componentWillUnmount() {
    if (this.recordListener !== null) {
      let rootRecord = quip.apps.getRootRecord();
      rootRecord.unlisten(this.recordListener);
    }
  }

  changePurposeFromBuildToEdit = (surveyId) => {
    this.props.record.set('surveyId', surveyId);
    this.props.record.set('purpose', purposes.editing);
    
    this.setState({
      purpose: purposes.editing,
      surveyId: surveyId
    });
  }

  getUpdatedAnswerRecord() {
    const record = quip.apps.getRootRecord();
    const answers = record.get('answers');
    this.setState({answers});
  }

  loadSingleSurvey = (surveyId) => {
    if (surveyId === null) return false;

    const { record } = this.props;

    if (!record.get('surveyId')) {
      let questions, answers;
      
      getSurveyQuestions(surveyId).then(questionResponse => {
        if (!questionResponse.ok) {
          return Promise.reject(questionResponse);
        } else {
          let answerPromises = [];
          let quipDocumentId = quip.apps.getThreadId();

          questions = questionResponse.data;
          record.set('questions', questions);

          questions.forEach((question, index) => {
            if (question.question_type === qatypes.header) {
              return false;
            } else {
              answerPromises.push(createAnswer(question, quipDocumentId));
            }
          });

          return Promise.all(answerPromises);
        }
      }).then(answerResponse => {
        answers = answerResponse.map(a => a.data);

        if (answerResponse.some(a => !a.ok)) {
          console.error('there was an error creating the answers');
          console.error(answerResponse);
          this.setError('there was an error creating the answers, please delete this document and try again');
          // TODO on document delete, we still need to delete any answers that were successfully created
        } else {
          record.set('answers', answers);
          record.set('surveyId', Number(surveyId));
          
          this.setState({
            questions,
            answers
          });
        }
      }, questionError => {
        console.error('there was an error loading the questions');
        console.error(questionError);
        this.setError('there was an error loading the questions');
      });
    }
  }

  loadSingleSurveyForEditing = (surveyId) => {
    if (surveyId === null) return false;

    const { record } = this.props;

    getSavedSurvey(surveyId).then(surveyResponse => {
      if (surveyResponse.ok) {
        const surveyName = surveyResponse.data.name
        record.set('surveyName', surveyName);

        getSurveyQuestions(surveyId).then(questionResponse => {
          if (!questionResponse.ok) {
            console.error('there was an error loading the questions from the survey');
            console.error(questionResponse);
            this.setError('there was an error loading the questions from the survey');
            return false;
          }

          const {questions, options} = this.transformSurveyQuestionData(questionResponse.data);

          record.set('questions', questions);
          record.clear('questionOptions');
          record.set('questionOptions', options);
          record.set('surveyId', Number(surveyId));
          record.set('purpose', purposes.editing);

          this.setState({
            purpose: purposes.editing,
            questions: questions,
            options: options,
            surveyId: surveyId,
            surveyName: surveyName
          });
        });
      } else {
        console.error('there was an issue with getting the survey data');
        console.error(surveyResponse);
        this.setError('there was an issue with getting the survey data');
      }
    });
  }

  loadSurveyForEditing = () => {
    this.loadSurveyOptions(purposes.loadForEdit);
  }

  loadSurveyForDeleting = () => {
    this.loadSurveyOptions(purposes.deleting);
  }

  loadSurveyForList = () => {
    this.loadSurveyOptions(purposes.loading);
  }

  loadSurveyOptions = (purpose) => {
    const { record } = this.props;
    
    getSavedSurveys().then(response => {
      if (!response.ok) {
        console.error('there was an error loading the surveys');
        console.error(response);
        this.setError('there was an issue loading the surveys, please reload and try again');
      } else {
        record.set('purpose', purpose);
        this.setState({
          purpose: purpose,
          availableSurveys: response.data
        });
      }
    });
  }

  setError = (message) => {
    this.setState({
      globalError: this.state.globalError.concat(message)
    });
  }

  setMessage = (message) => {
    this.setState({
      globalMessage: this.state.globalMessage.concat(message)
    });
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', purposes.building);
    this.setState({purpose: purposes.building});
  }

  transformSurveyQuestionData = (questionData) => {
    let questions = [];
    let options = [];

    questionData.forEach(data => {
      const question = new Question(data.question_type, data);
      question.helper = data.question_helper;

      if (optionTypes.includes(question.type)) {
        let optionArray = [];

        data.options.forEach((option, index) => {
          optionArray.push(new Option({
            value: option,
            helper: data.option_helpers[index]
          }));
        });

        options.push(new OptionList(question.guid, optionArray));
      }

      questions.push(question);
    });

    return { questions, options };
  }

  updateAnswerState = (id, type, value) => {
    let answers = this.state.answers;
    let index = answers.findIndex(a => (a.id === id && a.answer_type === type));

    if (index === -1) return;

    answers[index].answer = value;
    this.props.record.set('answers', answers);
    // this.setState({answers: answers});
  }

  updateOptionsState = (optionList, optionalIndex) => {
    const { record } = this.props;
    let optionListRecord = record.get('questionOptions');
    
    if (optionalIndex !== null) {
      const oldRecord = optionListRecord.get(optionalIndex);
      optionListRecord.remove(oldRecord);
      optionListRecord.add(optionList, optionalIndex);
    } else {
      optionListRecord.add(optionList);
    }
    
    const options = optionListRecord.getRecords().map(record => record.getData());
    this.setState({options: options});
  }

  updateQuestionsState = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
    this.setState({questions: questions});
  }

  updateSurveyNameState = (name) => {
    const { record } = this.props;

    record.set('surveyName', name);
    this.setState({
      surveyName: name
    });
  }

  render() {
    let canvas;
    let message, errorMessage;

    if (this.state.purpose === purposes.building || this.state.purpose === purposes.editing) {
      canvas = <Builder questions={this.state.questions} 
        options={this.state.options} 
        purpose={this.state.purpose} 
        surveyId={this.state.surveyId} 
        surveyName={this.state.surveyName} 
        updateOptions={this.updateOptionsState} 
        updateQuestions={this.updateQuestionsState} 
        updateSurveyName={this.updateSurveyNameState} 
        onSurveySaved={this.changePurposeFromBuildToEdit} />;
    } else if (this.state.purpose === purposes.loading || this.state.purpose === purposes.loadForEdit) {
      if (this.props.record.get('surveyId')) {
        canvas = <SurveyForm questions={this.state.questions} answers={this.state.answers} updateAnswer={this.updateAnswerState} />;
      } else if (this.state.purpose === purposes.loading) {
        canvas = <SurveyList surveys={this.state.availableSurveys} loadSurvey={this.loadSingleSurvey} />;
      } else if (this.state.purpose === purposes.loadForEdit) {
        canvas = <SurveyList surveys={this.state.availableSurveys} loadSurvey={this.loadSingleSurveyForEditing} />;
      }
    } else if (this.state.purpose === purposes.deleting) {
      canvas = <SurveyDeleter surveys={this.state.availableSurveys} />;
    } else {
      canvas = <nav>
        <p>manage your surveys:</p>
        <p className={Style.flexirow}>
          <quip.apps.ui.Button type="button" onClick={this.startBuildingSurvey} text="build a new survey" />
          <quip.apps.ui.Button type="button" onClick={this.loadSurveyForEditing} text="edit an existing survey" />
          <quip.apps.ui.Button type="button" onClick={this.loadSurveyForDeleting} text="delete surveys" />
        </p>
        
        <p>load the survey for responders:</p>
        <p className={Style.flexirow}>
          <quip.apps.ui.Button type="button" onClick={this.loadSurveyForList} text="answer a survey" />
        </p>
      </nav>;
    }

    if (this.state.globalMessage.length) {
      message = <p className={Style.notificationMessage}>{this.state.globalMessage.join('; ')}</p>;
    }

    if (this.state.globalError.length) {
      errorMessage = <p className={Style.errorMessage}>{this.state.globalError.join('; ')}</p>;
    }


    return <div>
      { message }
      { errorMessage }
      { canvas }
    </div>;
  }
}
