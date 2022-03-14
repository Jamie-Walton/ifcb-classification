import React from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import Annotations from "./Annotations";
import PublicClassify from "./PublicClassify";


class Classify extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          
      }
  }

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