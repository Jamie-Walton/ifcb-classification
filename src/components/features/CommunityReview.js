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


class CommunityFilePreview extends Component {
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
        return (
            <div className="community-file-preview-container">
                <div>
                    <p className="community-file-date">{this.getDate(this.props.file)}</p>
                    <p className="community-file-file">{this.props.file}</p>
                    <p className="community-file-classifier">{this.props.classifier}</p>
                </div>
                <div className="community-file-preview-buttons">
                    <div className="round-button download community-download" onClick={() => this.handleDownload()}>
                        <div style={{display: 'none'}}>
                        <iframe id="download-src" />
                        </div>
                    </div>
                    <div className="round-button right-arrow community-download" onClick={() => this.props.onClick(this.props.timeseries, this.props.file, this.props.classifier)}></div>
                </div>
            </div>
        );
    }
}

class CommunityReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            selectedTimeseries: '',
            selectedFile: '',
            selectedUser: '',
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
            .get('/communityfiles/')
            .then((res) => {
                this.setState({ files: res.data.reverse() })
            })
            .catch((err) => console.log(err));
    }

    handleFileClick(timeseries, file, user) {
        this.setState({ 
            selectedTimeseries: timeseries,
            selectedFile: file,
            selectedUser: user
         });
         this.props.goto_communityfile();
    }

    render() {
        if(this.props.onClassify) {
            return <Redirect to="/classify" />
        }

        if(this.props.onHome) {
            return <Redirect to="/" />
        }
    
        if(this.props.onLearn) {
            return <Redirect to="/learn" />
        }

        if(this.props.onNotebook) {
            return <Redirect to="/notebook/" />
        }

        if(this.props.onAnalysis) {
            return <Redirect to="/analysis" />
        }

        if(this.props.onCommunityFile) {
            return <Redirect to={"/analysis/communityreview/" + this.state.selectedTimeseries + "/" + this.state.selectedFile + "/" + this.state.selectedUser} />
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
                            <CommunityFilePreview
                                timeseries={files[(rowIndex*4)+columnIndex].bin.timeseries}
                                file={files[(rowIndex*4)+columnIndex].bin.file}
                                ifcb={files[(rowIndex*4)+columnIndex].bin.ifcb}
                                classifier={files[(rowIndex*4)+columnIndex].classifier}
                                onClick={() => this.handleFileClick(files[(rowIndex*4)+columnIndex].bin.timeseries, files[(rowIndex*4)+columnIndex].bin.file, files[(rowIndex*4)+columnIndex].classifier)}
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
                <title>IFCB | Community Review</title>
                <div className='main'>
                    <div className="page">
                        <div>
                            <div className="notebook-heading">
                                <h1 className="notebook-header">Analysis</h1>
                            </div>
                            <h2 className="analysis-option-heading page-heading community-review-heading">Community Review</h2>
                            <div>
                                {this.state.files.length > 1 ?
                                    <Grid
                                        width={document.documentElement.clientWidth*0.8}
                                        height={800}
                                        columnWidth={document.documentElement.clientWidth*0.8/4}
                                        rowHeight={document.documentElement.clientWidth*0.1}
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

export default connect(mapStateToProps, { goto_communityfile })(CommunityReview);