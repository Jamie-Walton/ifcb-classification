import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';
import '../../css/analysis-styles.css';
import '../../css/notebook-styles.css';
import loader from "../annotations/loader.GIF";

class ClassDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            classifiers: [],
            classChoice: '',
            optionalChoices: {
                include: [],
                exclude: [],
                number: 'all',
            },
            loading: false,
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
            .get('/classes/SCW/')
            .then((res) => {
                this.setState({ 
                    classes: res.data.map((c) => (c.display_name)),
                });
            })
            .catch((err) => console.log(err));
        axios
            .get('/classdownload/classifiers/')
            .then((res) => {
                this.setState({ 
                    classifiers: res.data.options.classifiers,
                });
            })
            .catch((err) => console.log(err));
    }

    handleClassOptionClick(option) {
        if (this.state.classChoice !== '') {
            document.getElementById(this.state.classChoice + '-text').style.color = '#707070';
            document.getElementById(this.state.classChoice + '-cont').style.backgroundColor = '#F8F7F7';
        }
        this.setState({ classChoice: option });
        document.getElementById(option + '-text').style.color = '#FFFFFF';
        document.getElementById(option + '-cont').style.backgroundColor = '#16609F';
    }

    handleClassifierOptionClick(option) {
        const classifierIncludes = this.state.optionalChoices.include;
        const classifierExcludes = this.state.optionalChoices.exclude;
        document.getElementById(option + '-text').style.color = '#707070';
        document.getElementById(option + '-cont').style.backgroundColor = '#F8F7F7';
        if (classifierIncludes.includes(option)) {
            const index = classifierIncludes.indexOf(option);
            classifierIncludes.splice(index, 1);
            const newExcludes = classifierExcludes.concat([option]);
            this.setState({ optionalChoices: {
                include: classifierIncludes,
                exclude: newExcludes,
                number: this.state.optionalChoices.number
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#7dad0b';
            document.getElementById(option + '-text').style.color = '#FFFFFF';
        } else if (classifierExcludes.includes(option)) {
            const index = classifierExcludes.indexOf(option);
            classifierExcludes.splice(index, 1);
            this.setState({ optionalChoices: {
                include: classifierIncludes,
                exclude: classifierExcludes,
                number: this.state.optionalChoices.number
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#F8F7F7';
            document.getElementById(option + '-text').style.color = '#707070';
        } else {
            const newIncludes = classifierIncludes.concat([option]);
            this.setState({ optionalChoices: {
                include: newIncludes,
                exclude: classifierExcludes,
                number: this.state.optionalChoices.number
            } });
            document.getElementById(option + '-cont').style.backgroundColor = '#16609F';
            document.getElementById(option + '-text').style.color = '#FFFFFF';
        }
    }

    handleAllClick() {
        document.getElementById('all-cont').style.backgroundColor = '#16609F';
        document.getElementById('all-text').style.color = '#FFFFFF';
        this.setState({ optionalChoices: {
            include: this.state.optionalChoices.include,
            exclude: this.state.optionalChoices.exclude,
            number: 'all'
        } })
    }

    handleNumberChange(e) {
        this.setState({ optionalChoices: {
            include: this.state.optionalChoices.include,
            exclude: this.state.optionalChoices.exclude,
            number: e.target.value
        } });
        document.getElementById('all-cont').style.backgroundColor = '#F8F7F7';
        document.getElementById('all-text').style.color = '#707070';
    }

    onChange = e => (this.handleNumberChange(e))

    download() {
        this.setState({ loading: true });
        const include = (this.state.optionalChoices.include.length < 1) ? ('None') : (this.state.optionalChoices.include.join('-'));
        const exclude = (this.state.optionalChoices.exclude.length < 1) ? ('None') : (this.state.optionalChoices.exclude.join('-'));
        const number = this.state.optionalChoices.number
        document.getElementById('download-src').src = 'http://dhcp-25-148.ucsc.edu:8000/classdownload/' + this.state.classChoice + '/' + include + '/' + exclude + '/' + number + '/'
    }

    loadFrame() {
        this.setState({ loading: false });
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

    renderLoader() {
        return <img src={loader} alt="Loading targets..." width="50" loop="infinite" style={{margin:'2vw 0 0 0'}}></img>
      }

    render() {
        if(this.props.onClassify) {
            return <Redirect to="/classify" />
        }

        if(this.props.onNotebook) {
            return <Redirect to="/notebook/" />
        }

        if(this.props.onAnalysis) {
            return <Redirect to="/analysis" />
        }

        return(
            <div>
                <Header />
                <title>IFCB | Class Download</title>
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
                                <div>
                                    <div className="download-step-container classifiers">
                                        <div className="download-step-heading">
                                            <div className="step-icon">2</div>
                                            <p className="download-step-text">Choose classifiers (optional)</p>
                                        </div>
                                        <p className="download-step-subtext">Click an option once to include it or twice to exclude it.</p>
                                        <div className="class-options">
                                            {this.state.classifiers.map((option) => (this.renderClassifierOption(option.editor)))}
                                        </div>
                                    </div>
                                    <div className="download-step-container">
                                    <div className="download-step-heading">
                                        <div className="step-icon">3</div>
                                        <p className="download-step-text">Choose number (optional)</p>
                                    </div>
                                    <p className="download-step-subtext">Enter in the number of images to include.</p>
                                    <div className="class-options">
                                        <form>
                                        <input 
                                            type="number" 
                                            id="number" 
                                            name="number" 
                                            min="1"
                                            onChange={this.onChange}
                                            value={this.state.optionalChoices.number}
                                        />
                                        </form>
                                        <div className="filter-choice download-option" id={'all-cont'}>
                                            <p className="filter-choice-text" id={'all-text'} onClick={() => this.handleAllClick()}>All</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="download-button" onClick={() => this.download()}>Download</div>
                                <div style={{display: 'none'}}>
                                    <iframe title="Download Images" id="download-src" onload={() => this.loadFrame()} />
                                </div>
                                <div>{ (this.state.loading) ? this.renderLoader() : <div/> }</div>
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