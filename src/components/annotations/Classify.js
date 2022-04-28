import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Annotations from "./Annotations";
import PublicClassify from "./PublicClassify";


class Classify extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
};

  render() {
    if(this.props.group[0] === 1) {
      return <Annotations location={this.props.location} match={this.props.match} history={this.props.history}/>
    } else {
      return <PublicClassify location={this.props.location} match={this.props.match} history={this.props.history}/>
    }
  }
}

const mapStateToProps = state => ({
  group: state.auth.user.groups,
});

export default connect(mapStateToProps, { })(Classify);