import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";
import GlobalStyle from '../App.less';

export default class SelectAnswer extends React.Component {
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
    this.props.update(this.props.answer.id, qatypes.select, value);
  }

  logDocumentActivity = () => {
    quip.apps.sendMessage(`updated the answer to the question: ${this.props.question}`);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.select, value)
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
      let selected = Boolean(option === this.props.answer.answer);
      let helper;

      if (this.props.optionHelpers[index] && this.props.optionHelpers[index].length) {
        helper = ` (${this.props.optionHelpers[index]})`;
      }
      
      return <option value={option} selected={selected}>{option}{helper}</option>;
    });

    let questionHelper;
    let error;

    if (this.props.helper && this.props.helper.length) {
      questionHelper = <p className={Style.surveyHelper}>{this.props.helper}</p>;
    }

    if (this.state.error !== null && this.state.error.length) {
      error = <p className={GlobalStyle.errorMessage}>{this.state.error}</p>;
    }

    return <div key={this.props.answer.id} className={Style.answerSelect}>
      {error}
      <label className={Style.formAnswerSelect}>
        <p className={Style.surveyQuestion}>{this.props.question}</p>
        {questionHelper}

        <select onChange={this.answerUpdate}>
          <option>--</option>
          {options}
        </select>
      </label>
    </div>;
  }
}