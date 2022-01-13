import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Header from '../layout/Header';
import { searchTargets, getBins } from "../../actions/classify";
import '../../css/analysis-styles.css';
import '../../css/notebook-styles.css';
import '../../css/classify-styles.css';
import loader from "../annotations/loader.GIF";

class Target extends Component {
    
    showMore() {
        document.getElementById(this.props.target.id + '-info').style.display = 'block';
        document.getElementById(this.props.target.id + '-preview').style.display = 'none';
        
        const initialWidth = Number(this.props.target.height);
        const idWidth = document.getElementById(this.props.target.id + '-info').style.width;
        const scale = idWidth / initialWidth;
        const style = {height: String(Number(this.props.target.height)*0.056*scale)+'vw'}
        document.getElementById(this.props.target.id + '-image').style = style;

    }

    showLess() {
        document.getElementById(this.props.target.id + '-info').style.display = 'none';
        document.getElementById(this.props.target.id + '-preview').style.display = 'flex';
        const style = String(Number(this.props.target.height)*0.056)+'vw'
        document.getElementById(this.props.target.id + '-image').style.height = style;
    }
    
    render() {
        if (this.props.bins !== []) {
            
            const desiredBin = (element) => element.id === this.props.target.bin;
            const binIndex = this.props.bins.findIndex(desiredBin);
            const bin = this.props.bins[binIndex];
            const url = 'http://128.114.25.154:8888/' + bin.timeseries + '/' + bin.file + '_' + bin.ifcb + '_' + this.props.target.number + '.jpg';
            
            return(
                <div className="search-result">
                    <img src={url} className="image searh-result-image"
                        alt={this.props.target.class_name}
                        id={this.props.target.id + '-image'}
                        style={{height: String(Number(this.props.target.height)*0.056)+'vw'}}>
                    </img>
                    <div className='id' id={this.props.target.id + '-preview'}>
                        <div className='search-result-plus' id={this.props.target.id + '-plus'} onClick={() => this.showMore()}><p className="plus">+</p></div>
                    </div>
                    <div className='id description' style={{display: 'none'}} id={this.props.target.id + '-info'}>
                        <div className='search-result-plus exit' onClick={() => this.showLess()}>
                            <p className="plus x">X</p>
                        </div>
                        <p className="description-heading">{this.props.target.class_name}</p>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'File: '}</p>
                            <p>{bin.file}</p>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'Time Series: '}</p>
                            <p>{bin.timeseries}</p>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'IFCB: '}</p>
                            <p>{bin.ifcb}</p>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'Target: '}</p>
                            <p>{this.props.target.number}</p>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'Classifer: '}</p>
                            <p>{this.props.target.editor}</p>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p className="description-label">{'Date: '}</p>
                            <p>{this.props.target.date}</p>
                        </div>
                        <div className='search-redirect-button' onClick={() => this.props.redirectToFile(bin.timeseries, bin.file, this.props.target.number)}>Go to File</div>
                    </div>
                </div>
            );
        }
        else {
            return <div/>
        }
    }
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targets: [[]],
            bins: [[]],
            basicSearch: '',
            loading: false,
            renderable: false,
            redirectInfo: ''
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
        this.setState({ renderable: false });
        document.getElementById("no-results").style.display = 'none';
        this.props.searchTargets(this.state.basicSearch);
        this.setState({ 
            targets: this.props.targetSearchResults
        });
        if (this.props.targetSearchResults === [[]]) {
            document.getElementById("no-results").style.display = 'flex';
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.targetSearchResults !== this.props.targetSearchResults) {
            var targets;
            if (this.props.targetSearchResults[0].length !== undefined) {
                targets = this.props.targetSearchResults[0];
            } else {
                targets = this.props.targetSearchResults;
            }
            this.props.getBins(targets.map(target => target.bin));
        }

        if (prevProps.binsSearchResults !== this.props.binsSearchResults) {
            this.setState({
                renderable: true,
            });
        }
    }

    redirectToFile(timeseries, file, target) {
        this.setState({ redirectInfo: {timeseries: timeseries, file: file, target: target} });
    }

    renderTarget(target) {
        return( 
            <Target
                target={target}
                bins={this.props.binsSearchResults[0]}
                key={target.id}
                redirectToFile={(timeseries, file, target) => this.redirectToFile(timeseries, file, target)}
            />
        );
    }

    renderLoader() {
        return <img src={loader} alt="Loading targets..." width="80" loop="infinite"></img>
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

        if(this.state.redirectInfo !== '') {
            const timeseries = this.state.redirectInfo.timeseries;
            const file = this.state.redirectInfo.file;
            const target = this.state.redirectInfo.target;
            return <Redirect to={"/classify/" + timeseries + "/" + file + "/" + target} />
        }

        var targets;
        var resultsDisplay;
        ((typeof this.props.targetSearchResults[0].length !== "undefined")) 
           ? (targets = this.props.targetSearchResults[0]) : (targets = this.props.targetSearchResults);
        (targets.length === 0) ? (resultsDisplay = {display: 'flex'}) : (resultsDisplay = {display: 'none'})
        
           return(
            <div>
                <Header />
                <title>IFCB | Search</title>
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
                                <p className="no-results" id="no-results" style={resultsDisplay}>No results</p>
                                <div className="image-grid">
                                    {
                                    (this.state.loading) ? this.renderLoader() :
                                    (this.state.renderable) ? (targets.map((target) => this.renderTarget(target))) : (<div/>)
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