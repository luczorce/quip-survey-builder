import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class SelectAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    options: React.PropTypes.array,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);
  }

  answerUpdate = (event) => {
    const value = event.target.value;
    this.storeAnswer(value);
    this.props.update(this.props.answer.id, qatypes.select, value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.select, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    const options = this.props.options.map(option => {
      let selected = Boolean(option === this.props.answer.answer);
      return <option value={option} selected={selected}>{option}</option>;
    });

    return <div key={this.props.answer.id}>
      <label className={Style.formAnswerInput}>
        <span>{this.props.question}</span>

        <select onChange={this.answerUpdate}>
          <option>--</option>
          {options}
        </select>
      </label>
    </div>;
  }
}