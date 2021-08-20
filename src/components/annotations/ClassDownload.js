import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';
import '../../css/analysis-styles.css';
import '../../css/notebook-styles.css';

class ClassDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            classifiers: [],
            classChoice: '',
            classifierChoices: {
                include: [],
                exclude: [],
            },
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onAnalysis: PropTypes.bool,
    }

    componentDidMount() {
        axios
            .get('/classes/IFCB104/')
            .then((res) => {
                this.setState({ 
                    classes: res.data.map((c) => (c.display_name)),
                });
            })
            .catch((err) => console.log(err));
        axios
            .get('/notebook/filters/')
            .then((res) => {
                this.setState({ 
                    classifiers: res.data.options.authors,
                });
            })
            .catch((err) => console.log(err));
    }

    handleClassOptionClick(option) {
        document.getElementById(option + '-text').style.color = '#707070';
        document.getElementById(option + '-cont').style.backgroundColor = '#F8F7F7';
        this.setState({ classChoice: option });
        document.getElementById(option + '-text').style.color = '#FFFFFF';
        document.getElementById(option + '-cont').style.backgroundColor = '#16609F';
    }

    handleClassifierOptionClick(option) {
        const classifierIncludes = this.state.classifierChoices.include;
        const classifierExcludes = this.state.classifierChoices.exclude;
        document.getElementById(option + '-text').style.color = '#707070';
        document.getElementById(option + '-cont').style.backgroundColor = '#F8F7F7';
        if (classifierIncludes.includes(option)) {
            const index = classifierIncludes.indexOf(option);
            classifierIncludes.splice(index, 1);
            const newExcludes = classifierExcludes.concat([option]);
            this.setState({ classifierChoices: {
                include: classifierIncludes,
                exclude: newExcludes
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#7dad0b';
            document.getElementById(option + '-text').style.color = '#FFFFFF';
        } else if (classifierExcludes.includes(option)) {
            const index = classifierExcludes.indexOf(option);
            classifierExcludes.splice(index, 1);
            this.setState({ classifierChoices: {
                include: classifierIncludes,
                exclude: classifierExcludes
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#F8F7F7';
            document.getElementById(option + '-text').style.color = '#707070';
        } else {
            const newIncludes = classifierIncludes.concat([option]);
            this.setState({ classifierChoices: {
                include: newIncludes,
                exclude: classifierExcludes
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#16609F';
            document.getElementById(option + '-text').style.color = '#FFFFFF';
        }
    }

    renderClassOption(option) {
        return(
            <div className="filter-choice download-option" id={option + '-cont'} onClick={() => this.handleClassOptionClick(option)}>
                <p className="filter-choice-text" id={option + '-text'}>{option}</p>
            </div>
        );
    }

    renderClassifierOption(option) {
        return(
            <div className="filter-choice download-option" id={option + '-cont'} onClick={() => this.handleClassifierOptionClick(option)}>
                <p className="filter-choice-text" id={option + '-text'}>{option}</p>
            </div>
        );
    }

    render() {
        if(this.props.onClassify) {
            return <Redirect to="/" />
        }

        if(this.props.onNotebook) {
            return <Redirect to="/notebook" />
        }

        if(this.props.onAnalysis) {
            return <Redirect to="/analysis" />
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
                            <h2 className="analysis-option-heading page-heading">Download by Class</h2>
                            <div className="download-steps">
                                <div className="download-step-container">
                                    <div className="download-step-heading">
                                        <div className="step-icon">1</div>
                                        <p className="download-step-text">Choose a classification</p>
                                    </div>
                                    <p className="download-step-subtext">Select one classification name.</p>
                                    <div className="class-options">
                                        {this.state.classes.map((option) => (this.renderClassOption(option)))}
                                    </div>
                                </div>
                                <div className="download-step-container">
                                    <div className="download-step-heading">
                                        <div className="step-icon">2</div>
                                        <p className="download-step-text">Choose classifiers (optional)</p>
                                    </div>
                                    <p className="download-step-subtext">Click an option once to include it or twice to exclude it.</p>
                                    <div className="class-options">
                                        {this.state.classifiers.map((option) => (this.renderClassifierOption(option.author)))}
                                    </div>
                                </div>
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
    onAnalysis: state.menu.onAnalysis,
 });

export default connect(mapStateToProps)(ClassDownload);