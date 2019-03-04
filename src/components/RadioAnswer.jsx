import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";
import GlobalStyle from '../App.less';

export default class RadioAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    options: React.PropTypes.array,
    optionHelpers: React.PropTypes.array,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  constructor(props) {
    super();

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);
    this.logDocumentActivity = debounce(5000, this.logDocumentActivity);
  }

  answerUpdate = (event) => {
    const value = event.target.value;

    this.setState({error: null});
    this.logDocumentActivity();
    this.storeAnswer(value);
    this.props.update(this.props.answer.id, qatypes.radio, value);
  }

  logDocumentActivity = () => {
    quip.apps.sendMessage(`updated the answer to the question: ${this.props.question}`);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.radio, value)
      .then(response => {
        if (!response.ok) {
          console.error('something went wrong with updating the answer');
          console.error(response);
          this.setState({error: 'this answer did not update'});
        }
      });
  }

  render() {
    const options = this.props.options.map((option, index) => {
      let checked = Boolean(option === this.props.answer.answer);
      let helper;

      if (this.props.optionHelpers[index] && this.props.optionHelpers[index].length) {
        helper = <span className={Style.surveyOptionHelper}>{this.props.optionHelpers[index]}</span>
      }
      
      return <label className={Style.formAnswerOption}>
        <input type="radio" value={option} checked={checked} name={'radio' + this.props.answer.id} onChange={this.answerUpdate} />
        <span>{option}</span>
        {helper}
      </label>;
    });

    let questionHelper;
    let error;

    if (this.props.helper && this.props.helper.length) {
      questionHelper = <p className={Style.surveyHelper}>{this.props.helper}</p>;
    }

    if (this.state.error !== null && this.state.error.length) {
      error = <p className={GlobalStyle.errorMessage}>{this.state.error}</p>;
    }

    return <div key={this.props.answer.id} className={Style.answerRadio}>
      {error}
      <p className={Style.surveyQuestion}>{this.props.question}</p>
      {questionHelper}
      {options}
    </div>;
  }
}