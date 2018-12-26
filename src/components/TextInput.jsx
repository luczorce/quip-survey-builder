import { debounce } from 'throttle-debounce';

export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    index: React.PropTypes.number,
    updated: React.PropTypes.func
  }

  constructor(props) {
    super();

    this.updateParentQuestion = debounce(300, this.updateParentQuestion);

    this.state = {
      value: props.question
    };
  }

  questionUpdated = (event) => {
    this.setState({value: event.target.value});

    let updatedQuestion = {
      index: this.props.index, 
      question: event.target.value,
      type: 'textInput'
    };

    this.updateParentQuestion(updatedQuestion);
  }

  updateParentQuestion(updatedQuestion) {
    this.props.updated(updatedQuestion);
  }

  render() {
    return <div key={'text-input-' + this.props.index}>
      <p><em>text input</em></p>
      
      <label>
        <span>question</span>

        <input type="text" value={this.state.value} placeholder="(Who did you talk to last?)" onChange={this.questionUpdated} />
      </label>
      <div>index: {this.props.index + 1}</div>
    </div>;
  }
}