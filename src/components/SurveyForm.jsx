import CheckboxAnswer from './CheckboxAnswer.jsx';
import NumberInputAnswer from './NumberInputAnswer.jsx';
import RadioAnswer from './RadioAnswer.jsx';
import SelectAnswer from './SelectAnswer.jsx';
import TextInputAnswer from './TextInputAnswer.jsx';
import TextareaAnswer from './TextareaAnswer.jsx';
import { qatypes } from '../util/enums.js';

export default class SurveyForm extends React.Component {
  static propTypes = {
    questions: React.PropTypes.array,
    answers: React.PropTypes.array,
    updateAnswer: React.PropTypes.func
  };

  buildForm = () => {
    if (!this.props.questions.length) return <p>no questions</p>;

    return this.props.questions.map(q => {
      if (q.question_type === qatypes.textInput) {
        let answer = this.props.answers.find(a => a.input_text_question_id === q.id);

        return <TextInputAnswer 
                question={q.question}
                answer={answer}
                update={this.props.updateAnswer} />;
      } else if (q.question_type === qatypes.numberInput) {
        let answer = this.props.answers.find(a => a.input_number_question_id === q.id);

        return <NumberInputAnswer 
                question={q.question} 
                min={q.min} 
                max={q.max} 
                answer={answer} 
                update={this.props.updateAnswer} />;
      } else if (q.question_type === qatypes.textarea) {
        let answer = this.props.answers.find(a => a.textarea_question_id === q.id);

        return <TextareaAnswer 
                question={q.question}
                answer={answer}
                update={this.props.updateAnswer} />;
      } else {
        let answer = this.props.answers.find(a => a.option_question_id === q.id);

        if (q.question_type === qatypes.select) {
          return <SelectAnswer 
                  question={q.question} 
                  answer={answer}
                  options={q.options}
                  update={this.props.updateAnswer} />;
        } else if (q.question_type === qatypes.radio) {
          return <RadioAnswer 
                  question={q.question} 
                  answer={answer}
                  options={q.options}
                  update={this.props.updateAnswer} />;
        } else if (q.question_type === qatypes.checkbox) {
          return <CheckboxAnswer 
                  question={q.question} 
                  answer={answer}
                  options={q.options}
                  update={this.props.updateAnswer} />;
        }
      }
    });
  }

  render() {
    const fields = this.buildForm();
    return <section>
      {fields}
    </section>;
  }
}
