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

class LabReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            selectedTimeseries: '',
            selectedFile: '',
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

    componentDidMount() {
        axios
            .get('/bins/')
            .then((res) => {
                this.setState({ files: res.data.reverse() })
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
                            <div>
                                {this.state.files.length > 1 ?
                                    <Grid
                                        width={document.documentElement.clientWidth*0.8}
                                        height={800}
                                        columnWidth={document.documentElement.clientWidth*0.8/4}
                                        rowHeight={document.documentElement.clientWidth*0.11}
                                        rowCount={Math.floor(this.state.files.length/4)+1}
                                        columnCount={4}
                                        cellRenderer={cellRenderer}
                                        scrollToAlignment="start"
                                        className="community-review-grid"
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