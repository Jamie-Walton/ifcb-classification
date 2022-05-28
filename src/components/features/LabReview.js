import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

import Header from '../layout/Header';
import { Grid, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { goto_communityfile } from "../../actions/menu";
import '../../css/analysis-styles.css';
import '../../css/notebook-styles.css';
import '../../css/classify-styles.css';
import loader from "../annotations/loader.GIF";


class LabFilePreview extends Component {
    getDate(file) {
        const timestamp = file.slice(1,5) + '-' + file.slice(5,7) + '-' + file.slice(7,12) + ':' + 
            file.slice(12,14) + ':' + file.slice(14,16);
        const date = new Date(timestamp);
        const dateString = date.toDateString().slice(4,10) + ',' + date.toDateString().slice(10,);
        
        return dateString
    }

    handleDownload() {
        document.getElementById('download-src').src = 'http://odontella.oceandatacenter.ucsc.edu:8000/mat/' + this.props.ifcb + '/' + this.props.file + '/'
    }

    render() {
        var appearance = ''
        if(this.props.complete) {
            appearance = 'community-file-preview-categorized';
        }

        return (
            <div className={"community-file-preview-container " + appearance}>
                <div>
                    <p className="community-file-date">{this.getDate(this.props.file)}</p>
                    <p className="community-file-file">{this.props.file}</p>
                    <p className="community-file-file">{this.props.timeseries}</p>
                    <p className="community-file-classifier">{this.props.classifier !== null ? 'Completed by ' + this.props.classifier : <br/>}</p>
                </div>
                <div className="community-file-preview-buttons">
                    <div className="round-button download community-download" onClick={() => this.handleDownload()}>
                        <div style={{display: 'none'}}>
                        <iframe id="download-src" />
                        </div>
                    </div>
                    <div className="round-button right-arrow community-download" onClick={() => this.props.onClick(this.props.timeseries, this.props.file)}></div>
                </div>
            </div>
        );
    }
}

class Filter extends Component {
    renderOption(option) {
        return(
            <div className="filter-option" onClick={() => this.props.applyFilter(this.props.filter, option)}>{option}</div>
        );
    }
    
    render() {
        return(
            <div>
                <div className="filter-choice" onClick={() => this.props.onClick(this.props.filter)}>
                    <p className="filter-choice-text">{this.props.filter}</p>
                    <p className="filter-choice-plus" id={this.props.filter + "-plus"}>+</p>
                </div>
                <div className="filter-dropdown" id={this.props.filter + "-dropdown"}>
                    {this.props.options.map((option) => (this.renderOption(option)))}
                </div>
            </div>
        );
    }
}

class LabReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originalFiles: [],
            files: [],
            selectedTimeseries: '',
            selectedFile: '',
            users: [],
            days: [],
            timeseries: [],
            ifcbs: [],
            statuses: ['Complete', 'Incomplete'],
            appliedFilters: [],
            rowCount: 0,
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onAnalysis: PropTypes.bool,
        onCommunityFile: PropTypes.bool,
        goto_communityfile: PropTypes.func,
    }

    getDate(file) {
        const timestamp = file.slice(1,5) + '-' + file.slice(5,7) + '-' + file.slice(7,12) + ':' + 
            file.slice(12,14) + ':' + file.slice(14,16);
        const date = new Date(timestamp);
        const dateString = date.toDateString().slice(4,10) + ',' + date.toDateString().slice(10,);
        
        return dateString
    }

    filterFiles(appliedFilters) {
        var files = this.state.originalFiles;
        var users = appliedFilters.filter(n => n.category === 'user').map(n => n.choice)
        var days = appliedFilters.filter(n => n.category === 'day').map(n => n.choice)
        var timeseries = appliedFilters.filter(n => n.category === 'timeseries').map(n => n.choice)
        var ifcbs = appliedFilters.filter(n => n.category === 'ifcb').map(n => n.choice)
        var statuses = appliedFilters.filter(n => n.category === 'status').map(n => n.choice)

        if(users.length > 0) {
            files = files.filter(n => users.includes(n.completion_marker));
        }
        if(days.length > 0) {
            files = files.filter(n => days.includes(this.getDate(n.file)));
        }
        if(timeseries.length > 0) {
            files = files.filter(n => timeseries.includes(n.timeseries));
        }
        if(ifcbs.length > 0) {
            files = files.filter(n => ifcbs.includes(n.ifcb));
        }
        if(statuses.length === 1) {
            if(statuses.includes('Complete')) {
                files = files.filter(n => n.complete === true);
            } else {
                files = files.filter(n => n.complete === false);
            }
        }
       
        this.setState({ files: files });
    }

    componentDidMount() {
        axios
            .get('/bins/')
            .then((res) => {
                const files = res.data.sort((a, b) => (a.file < b.file) ? 1 : -1);
                this.setState({ 
                    files: files,
                    originalFiles: files,
                    users: [...new Set(files.map(f => f.completion_marker))].filter(n => n!==null),
                    days: [...new Set(files.sort().map(f => this.getDate(f.file)))],
                    timeseries: [...new Set(files.map(f => f.timeseries))],
                    ifcbs: [...new Set(files.map(f => f.ifcb))],
                    rowCount: Math.floor(files.length/4)+1,
                })

            })
            .catch((err) => console.log(err));
    }

    handleFileClick(timeseries, file) {
        this.setState({ 
            selectedTimeseries: timeseries,
            selectedFile: file,
        });
    }

    renderLegend() {
        return(
            <div className='community-review-legend'>
                <div className='legend-entry'>
                    <div className='legend-bubble categorized-bubble' />
                    <p className='legend-text'>Complete</p>
                </div>
                <div className='legend-entry'>
                    <div className='legend-bubble incomplete-bubble' />
                    <p className='legend-text'>Incomplete</p>
                </div>
            </div>
        );
    }

    handleFilterChoiceClick(option) {
        document.getElementById(option + '-plus').classList.toggle('rotate-plus');
        document.getElementById(option + '-dropdown').classList.toggle('show-filter-dropdown');
    }

    handleApplyFilter(category, choice) {
        var appliedFilters = this.state.appliedFilters;
        if(!appliedFilters.includes({category: category, choice: choice})) {
            appliedFilters.push({category: category, choice: choice});
        }
        this.setState({ appliedFilters: appliedFilters });
        this.filterFiles(appliedFilters);
    }

    handleRemoveFilter(filter) {
        const applied = this.state.appliedFilters;
        const index = applied.findIndex(entry => entry === filter);
        const newAppliedFilters = applied.slice(0, index).concat(applied.slice(index+1,applied.length));
        this.setState({ appliedFilters: newAppliedFilters });
        this.filterFiles(newAppliedFilters);
    }

    renderFilterChoice(filter, options) {
        return(
            <Filter
                filter={filter}
                options={options}
                onClick={(option) => this.handleFilterChoiceClick(option)}
                applyFilter={(category, choice) => this.handleApplyFilter(category, choice)}
            />
        );
    }

    renderAppliedFilters(filter) {
        return (
            <div className="filter-choice applied" onClick={() => this.handleRemoveFilter(filter)}>
                <p className="filter-choice-text applied-text">{filter.category.toUpperCase() + ': ' + filter.choice}</p>
                <p className="filter-choice-plus applied-text rotate-plus" id={this.props.filter + "-plus"}>+</p>
            </div>
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

        if(this.props.onAnalysis) {
            return <Redirect push to="/analysis" />
        }

        if(this.props.onCommunityFile) {
            return <Redirect push to={"/analysis/communityreview/" + this.state.selectedTimeseries + "/" + this.state.selectedFile + "/" + this.state.selectedUser} />
        }

        if(this.state.selectedTimeseries !== '') {
            return <Redirect push to={"/classify/" + this.state.selectedTimeseries + '/' + this.state.selectedFile + '/'} />
        }

        const cache = new CellMeasurerCache({
            defaultHeight: 10,
            minHeight: 10,
            fixedWidth: true
          });

        const files = this.state.files;

        const cellRenderer = ({columnIndex, key, rowIndex, parent, style}) => ( 

            <CellMeasurer
                cache={cache}
                key={key}
                parent={parent}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
            >
            {({ measure, registerChild }) => (
            
                <div ref={registerChild} key={key} style={style}>
                    <div onLoad={measure}>
                        {files[(rowIndex*4)+columnIndex] ?
                            <LabFilePreview
                                timeseries={files[(rowIndex*4)+columnIndex].timeseries}
                                file={files[(rowIndex*4)+columnIndex].file}
                                ifcb={files[(rowIndex*4)+columnIndex].ifcb}
                                classifier={files[(rowIndex*4)+columnIndex].completion_marker}
                                complete={files[(rowIndex*4)+columnIndex].complete}
                                onClick={() => this.handleFileClick(files[(rowIndex*4)+columnIndex].timeseries, files[(rowIndex*4)+columnIndex].file)}
                            /> : 
                            <div/> }
                        </div>
                </div>
            )}
            </CellMeasurer>
        )
        
           return(
            <div>
                <Header />
                <title>IFCB | Lab Review</title>
                <div className='main'>
                    <div className="page">
                        <div>
                            <div className="notebook-heading">
                                <h1 className="notebook-header">Analysis</h1>
                            </div>
                            <h2 className="analysis-option-heading page-heading community-review-heading">Lab Review</h2>
                            {this.renderLegend()}
                            <div className="applied-filters applied-filter-labreview">{this.state.appliedFilters.map((filter) => (this.renderAppliedFilters(filter)))}</div>
                            <div className="filter-buttons filter-buttons-labreview">
                                {this.renderFilterChoice('user', this.state.users)}
                                {this.renderFilterChoice('day', this.state.days)}
                                {this.renderFilterChoice('timeseries', this.state.timeseries)}
                                {this.renderFilterChoice('ifcb', this.state.ifcbs)}
                                {this.renderFilterChoice('status', this.state.statuses)}
                            </div>
                            <div>
                                {this.state.files.length > 0 ?
                                    <Grid
                                        width={document.documentElement.clientWidth*0.8}
                                        height={800}
                                        columnWidth={document.documentElement.clientWidth*0.8/4}
                                        rowHeight={document.documentElement.clientWidth*0.13}
                                        rowCount={this.state.rowCount}
                                        columnCount={4}
                                        cellRenderer={cellRenderer}
                                        scrollToAlignment="start"
                                        className="community-review-grid"
                                        files={this.state.files}
                                    /> :
                                    <div/>
                                }
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
    onHome: state.menu.onHome,
    onLearn: state.menu.onLearn,
    onClassify: state.menu.onClassify,
    onNotebook: state.menu.onClassify,
    onAnalysis: state.menu.onAnalysis,
    onCommunityFile: state.menu.onCommunityFile,
 });

export default connect(mapStateToProps, { goto_communityfile })(LabReview);