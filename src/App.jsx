import Style from "./App.less";
import FormStyle from "./components/Form.less";
import Builder from './components/Builder.jsx';

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      // can be either building or loading
      currentUse: props.record.get('purpose') || null,
      questions: props.record.get('questions') || []
    };
  }

  loadSurveyOptions = () => {
    const { record } = this.props;
    
    record.set('purpose', 'loading');
    this.setState({currentUse: 'loading'});
  }

  saveSurvey = () => {
    console.log('saving survey');
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', 'building');
    this.setState({currentUse: 'building'});
  }

  updateQuestions = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
    this.setState({questions: questions});
  }

  render() {
    let header, canvas;

    if (this.state.currentUse === 'building') {
      header = <header className={Style.buildingHeader}>
        <label className={FormStyle.formInput}>
          <span>survey name</span>
          <input type="text" value={this.state.surveyName} />
        </label>

        <button type="button" onClick={this.saveSurvey} disabled>save survey</button>
      </header>;

      canvas = <Builder questions={this.state.questions} updateQuestions={this.updateQuestions}/>;
    } else if (this.state.currentUse === 'loading') {
      canvas = <div>retrieve a bear</div>;
    } else {
      header = <nav className={Style.flexirow}>
        <button type="button" onClick={this.startBuildingSurvey}>build a survey</button>
        <button type="button" onClick={this.loadSurveyOptions} disabled>load a survey</button>
      </nav>;
    }

    return <div>
      { header }
      { canvas }
    </div>;
  }
}
