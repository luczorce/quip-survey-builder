import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class TextInputAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);
  }

  answerUpdate = (event) => {
    this.storeAnswer(event.target.value);
    this.props.update(this.props.answer.id, qatypes.textInput, event.target.value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.textInput, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    return <div key={this.props.answer.id} className={Style.answerInput}>
      <label className={Style.formAnswerInput}>
        <p className={Style.surveyQuestion}>{this.props.question}</p>
        <input type="text" value={this.props.answer ? this.props.answer.answer : ''} onChange={this.answerUpdate} />
      </label>
    </div>;
  }
}