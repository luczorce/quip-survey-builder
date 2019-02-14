import Style from '../App.less';
import FormStyle from './Form.less';

export default class SurveyList extends React.Component {
  static propTypes = {
    surveys: React.PropTypes.array,
    deleteSurveys: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      deleteMe: []
    }
  }

  choppingBlockUpdate = (event) => {
    let choppingBlock = this.state.deleteMe;

    if (event.target.checked) {

      this.setState({
        deleteMe: choppingBlock.concat(event.target.name)
      });
    } else {
      let index = choppingBlock.indexOf(event.target.name);
      
      if (index > -1) {
        choppingBlock.splice(index, 1);
      }

      this.setState({deleteMe: choppingBlock});
    }
  }

  sendChoppingBlock = () => {
    this.deleteSurveys(this.state.deleteMe);
  }

  render() {
    const options = this.props.surveys.map(s => {
      return <label className={FormStyle.formAnswerOption}>
        <input type="checkbox" name={s.id} onChange={this.choppingBlockUpdate} />
        <span>{s.name}</span>
      </label>;
    });

    const optionGridStyle = options.length > 4 ? FormStyle.checkboxGridColumns : FormStyle.checkboxGrid;

    return <section>
      <p>Choose all the questions you would like to delete.</p>
      <p><em><strong>Beware!</strong> You can not undo this action.</em></p>
      <div className={optionGridStyle}>{options}</div>
      <quip.apps.ui.Button type="button" onClick={this.sendChoppingBlock} text="delete selected surveys" />
    </section>;
  }
}
