export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    index: React.PropTypes.number
  }

  constructor(props) {
    super();

    this.state = {
      value: props.question
    };
  }

  questionUpdated = (event) => {
    // TODO add a debounce?
    console.log('text input updated');
    this.setState({value: event.target.value});
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