import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class TextareaAnswer extends React.Component {
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
    this.props.update(this.props.answer.id, qatypes.textarea, event.target.value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.textarea, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    return <div key={this.props.answer.id}>
      <label className={Style.formAnswerTextarea}>
        <span>{this.props.question}</span>
        <textarea value={this.props.answer ? this.props.answer.answer : ''} onChange={this.answerUpdate} />
      </label>
    </div>;
  }
}