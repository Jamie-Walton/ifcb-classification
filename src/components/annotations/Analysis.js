import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';

class AnalysisOption extends Component {
    render() {
        return(
            <div className="analysis-option-container">
                <h2 className="analysis-option-heading">{this.props.heading}</h2>
                <p className="analysis-option-description">{this.props.description}</p>
                <div className="analysis-option-button">Go</div>
            </div>
        );
    }
}

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            analysisOptions: [
                {heading: 'Search', description: "Find any image or collection of images with the help \
                    of classification filtering, file look-up, and more. The advanced image search spans \
                    across all bins loaded for manual classification in the web appplication."},
                {heading: 'Download by Class', description: "Download a ZIP file containing all (or a \
                    desired subset of) images classified as a particular species. Customize your image set \
                    by number, editor, and more."}
            ]
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
    }

    renderAnalysisOption(option) {
        return (
            <AnalysisOption 
                heading={option.heading}
                description={option.description}
            />
        );
    }

    render() {
        if(this.props.onClassify) {
            return <Redirect to="/" />
        }

        if(this.props.onNotebook) {
            return <Redirect to="/notebook" />
        }

        return(
            <div>
                <Header />
                <div className='main'>
                    <div className="page">
                        <div>
                            <div className="notebook-heading">
                                <h1 className="notebook-header">Analysis</h1>
                            </div>
                            <div className="analysis-options">
                                {this.state.analysisOptions.map((option) => (this.renderAnalysisOption(option)))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    user: state.auth.user,
    onClassify: state.menu.onClassify,
    onNotebook: state.menu.onClassify,
 });

export default connect(mapStateToProps)(Analysis);