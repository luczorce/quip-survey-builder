import SavedIcon from './Indicators.jsx';
import DeleteQuestion from './DeleteQuestion.jsx';
import Style from './Form.less';

export default class QuestionHeader extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    id: React.PropTypes.string,
    isHeader: React.PropTypes.boolean,
    deleteFunc: React.PropTypes.func
  }

  render() {
    return <p className={Style.sectionDescription}>
      <span><span style={{fontWeight: 'bold', textTransform: 'uppercase'}}>{this.props.name}</span> ({this.props.description})</span>

      <span className={Style.sectionControls}>
        <DeleteQuestion deleteFunc={this.props.deleteFunc} isHeader={this.props.isHeader} />
        { this.props.id !== null && <SavedIcon /> }
      </span>
    </p>;
  }
}
