import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';
import { searchTargets, getBins } from "../../actions/classify";
import '../../css/analysis-styles.css';
import '../../css/notebook-styles.css';
import loader from "./loader.GIF";

class Target extends Component {
    render() {
        const desiredBin = (element) => element[0].id === this.props.target.bin;
        const binIndex = this.props.bins.findIndex(desiredBin);
        const bin = this.props.bins[binIndex][0];
        const url = 'http://128.114.25.154:8888/' + bin.timeseries + '/' + bin.file + '_' + bin.ifcb + '_' + this.props.target.number + '.jpg';
        return(
            <div>
                <img src={url} className="image"
                    alt={this.props.target.class_name}
                    id={this.props.target.number + '-image'}
                    style={{height: String(Number(this.props.height)*0.056)+'vw'}}>
                </img>
                <div className='id'>
                    <div className='search-result-plus' id={this.props.id + '-plus'}>+</div>
                    <div className='search-result-info' id={this.props.id + '-info'}>
                        Insert info here
                    </div>
                </div>
            </div>
        );
    }
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targets: [],
            basicSearch: '',
            loading: false,
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onAnalysis: PropTypes.bool,
        searchTargets: PropTypes.func,
        targetSearchResults: PropTypes.array,
        binsSearchResults: PropTypes.array,
    }

    onChange = e => this.setState({ basicSearch: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        document.getElementById("no-results").style.display = 'none';
        this.props.searchTargets(this.state.basicSearch);
        const bins = this.props.targetSearchResults.map(target => target.bin);
        this.props.getBins(bins);
        this.setState({ 
            targets: this.props.targetSearchResults,
            bins: this.props.binsSearchResults
        });
        if (this.props.targetSearchResults === [[]]) {
            document.getElementById("no-results").style.display = 'flex';
        }
    }

    renderTarget(target) {
        return( 
            <Target
                target={target}
                bins={this.state.bins}
            />
        );
    }

    renderLoader() {
        return <img src={loader} alt="Loading targets..." width="80" loop="infinite"></img>
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
                            <h2 className="analysis-option-heading page-heading">Search</h2>
                            <div>
                                <form className="search-form" id="search-form" onSubmit={this.onSubmit}>
                                    <div className="search-bar">
                                        <div className="search-icon"></div>
                                        <input
                                            type="text"
                                            className="search-input"
                                            name="basicSearch"
                                            onChange={this.onChange}
                                            value={this.state.basicSearch}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div>
                                <p className="no-results" id="no-results" style={{ display: 'none' }}>No results</p>
                                <div className="image-grid">
                                    {
                                    (this.state.loading) ? this.renderLoader() :
                                    this.state.targets.map((target, i) => this.renderTarget(target, i))
                                    }
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
    targetSearchResults: state.classify.targetSearchResults,
    binsSearchResults: state.classify.binsSearchResults,
 });

export default connect(mapStateToProps, { searchTargets, getBins })(Search);