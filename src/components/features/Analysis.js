import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import axios from "axios";

import Header from '../layout/Header';
import { goto_classdownload, goto_search, goto_communityreview, goto_labreview } from "../../actions/menu";
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
                {heading: 'Search', description: "Find any image or collection of images with the help of classification filtering, file look-up, and more."},
                {heading: 'Download by Class', description: "Download a ZIP file containing all, or a desired subset of, images classified as a particular species."},
                {heading: 'Analyze Community Data', description: "Check over community scientist classifications, review completion statuses, and download their datasets."},
                {heading: 'Analyze Lab Data', description: "Review lab classification files and download the datasets."},
            ],
            bin: '',
            target: '',
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onClassDownload: PropTypes.bool,
        onSearch: PropTypes.bool,
        onCommunityReview: PropTypes.bool,
        onLabReview: PropTypes.bool,
        goto_classdownload: PropTypes.func,
        goto_search: PropTypes.func,
    }

    renderAnalysisOption(option) {
        var handleClick
        if (option.heading === 'Search') {
            handleClick = this.props.goto_search;
        } else if (option.heading === 'Download by Class') {
            handleClick = this.props.goto_classdownload;
        } else if (option.heading === 'Analyze Community Data') {
            handleClick = this.props.goto_communityreview;
        } else if (option.heading === 'Analyze Lab Data') {
            handleClick = this.props.goto_labreview;
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
            return <Redirect push to="/classify" />
        }

        if(this.props.onHome) {
            return <Redirect push to="/" />
        }
    
        if(this.props.onLearn) {
            return <Redirect push to="/learn" />
        }

        if(this.props.onNotebook) {
            return <Redirect push to="/notebook/" />
        }

        if(this.props.onClassDownload) {
            return <Redirect push to="/analysis/classdownload" />
        }

        if(this.props.onSearch) {
            return <Redirect push to="/analysis/search" />
        }

        if(this.props.onCommunityReview) {
            return <Redirect push to="/analysis/communityreview" />
        }

        if(this.props.onLabReview) {
            return <Redirect push to="/analysis/labreview" />
        }

        return(
            <div>
                <Header />
                <title>IFCB | Analysis</title>
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
    onHome: state.menu.onHome,
    onLearn: state.menu.onLearn,
    onNotebook: state.menu.onNotebook,
    onClassDownload: state.menu.onClassDownload,
    onSearch: state.menu.onSearch,
    onCommunityReview: state.menu.onCommunityReview,
    onLabReview: state.menu.onLabReview,
 });

export default connect(mapStateToProps, { goto_classdownload, goto_search, goto_communityreview, goto_labreview })(Analysis);