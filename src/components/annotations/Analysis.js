import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';
import { goto_classdownload, goto_search, searchTargets } from "../../actions/menu";
import '../../css/analysis-styles.css';

class AnalysisOption extends Component {
    render() {
        return(
            <div className="analysis-option-container">
                <h2 className="analysis-option-heading">{this.props.heading}</h2>
                <p className="analysis-option-description">{this.props.description}</p>
                <div className="analysis-option-button" onClick={this.props.handleClick}>Start</div>
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
                    of classification filtering, file look-up, and more.", redirect: this.goToSearch},
                {heading: 'Download by Class', description: "Download a ZIP file containing all, or a \
                    desired subset of, images classified as a particular species.", redirect: this.goToClassDownload}
            ]
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onClassDownload: PropTypes.bool,
        onSearch: PropTypes.bool,
        goto_classdownload: PropTypes.func,
        goto_search: PropTypes.func,
    }

    renderAnalysisOption(option) {
        var handleClick
        switch (option.heading) {
            case 'Search':
                handleClick = this.props.goto_search;
            case 'Download by Class':
                handleClick = this.props.goto_classdownload;
        }
        return (
            <AnalysisOption
                key={option.heading}
                heading={option.heading}
                description={option.description}
                handleClick={handleClick}
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

        if(this.props.onClassDownload) {
            return <Redirect to="/analysis/classdownload" />
        }

        if(this.props.onSearch) {
            return <Redirect to="/analysis/search" />
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
    onClassDownload: state.menu.onClassDownload,
    onSearch: state.menu.onSearch,
 });

export default connect(mapStateToProps, { goto_classdownload, goto_search })(Analysis);