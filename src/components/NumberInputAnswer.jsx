import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class NumberInputAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  constructor(props) {
    super();

    this.state = {
      hasError: false
    };
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);

    let answer = this.props.answer.answer;
    if (answer !== null && answer.length) {
      const hasError = !this.isValidAnswer(answer);
      this.setState({hasError: hasError});
    }
  }

  answerUpdate = (event) => {
    const value = event.target.value;

    this.props.update(this.props.answer.id, qatypes.numberInput, value);
    
    if (this.isValidAnswer(value)) {
      this.storeAnswer(value);
    }
  }

  isValidAnswer = (value) => {
    if (!value.length) {
      this.setState({hasError: false});
      return false;
    }

    value = Number(value);
    let isValid = true;
    
    if (this.props.min !== null && value !== null && value < this.props.min) {
      isValid = false;
    }

    if (this.props.max !== null && value !== null && value > this.props.max) {
      isValid = false;
    }

    this.setState({hasError: !isValid});
    return isValid;
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.numberInput, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    let input, helper;

    if (this.props.min !== null && this.props.max !== null) {
      input = <input type="number" value={this.props.answer.answer} onChange={this.answerUpdate} min={this.props.min} max={this.props.max} className={this.state.hasError ? Style.inputError : ''} />;
      helper = <span className={Style.numberHelper}>minimum: {this.props.min}, maximum: {this.props.max}</span>
    } else if (this.props.min !== null) {
      input = <input type="number" value={this.props.answer.answer} onChange={this.answerUpdate} min={this.props.min} className={this.state.hasError ? Style.inputError : ''} />;
      helper = <span className={Style.numberHelper}>minimum: {this.props.min}</span>
    } else if (this.props.max !== null) {
      input = <input type="number" value={this.props.answer.answer} onChange={this.answerUpdate} max={this.props.max} className={this.state.hasError ? Style.inputError : ''} />;
      helper = <span className={Style.numberHelper}>maximum: {this.props.max}</span>
    } else {
      input = <input type="number" value={this.props.answer.answer} onChange={this.answerUpdate} />
    }

    return <div key={this.props.answer.id}>
      <label className={Style.formAnswerNumber}>
        <span>{this.props.question}</span>

        <div className={Style.answerRow}>
          {input}
          {helper}
        </div>
      </label>
    </div>;
  }
}