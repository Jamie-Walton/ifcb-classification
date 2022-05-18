import React, { Component } from "react";
import axios from "axios";
import Header from '../layout/Header';
import Plankton from '../annotations/Plankton';
import '../../css/datepicker.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { classifyPublicTarget, classifyRow, classifyAll, save, sync } from "../../actions/classify";
import { goto_communityreview } from "../../actions/menu";
import { changeScale } from "../../actions/preferences";

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
            <div className="community-file-preview-container community-file-info">
                <div>
                    <p className="community-file-date community-file-heading">{this.getDate(this.props.file)}</p>
                    <p className="community-file-file">{this.props.file}</p>
                    <p className="community-file-classifier">{this.props.classifier}</p>
                </div>
                <div className="community-file-preview-buttons">
                    <div className="round-button download community-download" onClick={() => this.handleDownload()}>
                        <div style={{display: 'none'}}>
                        <iframe id="download-src" />
                        </div>
                    </div>
                    <div className="round-button right-arrow community-download flip-right-arrow" onClick={() => this.props.onClick()}></div>
                </div>
            </div>
        );
    }
}

class CommunityFile extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          loading: true,
          newFile: '',
          newTimeSeries: '',
          planktonClickEnabled: true,
          infoShowing: [],
          bin: {timeseries:'', ifcb:'', year:'', day:'', file:''},
          user: '',
          targets: [],
          targetNumbers: [],
          rows: [],
          scrollToIndex: undefined,
          jumpEntry: '',
          jumpSubmit: '',
          initialTargetJump: '',
          lastEditBin: '',
          lastEditTarget: '',
          lastScroll: 0,
      }
  }

  static propTypes = {
    preferences: PropTypes.object,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    changeScale: PropTypes.func,
    save: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    sync: PropTypes.func.isRequired,
    isSyncing: PropTypes.bool,
    user: PropTypes.object,
    scaleEntry: PropTypes.number,
    onNotebook: PropTypes.bool,
    onAnalysis: PropTypes.bool,
    goto_communityreview: PropTypes.func,
  };

  getNewTimeSeries(option) {
    this.setState({ loading: true });

    var k = this.state.timeSeriesOptions.findIndex(timeseries => timeseries === option);
    const timeseries = this.state.timeSeriesNames[k];

    axios
        .get('/process/public/timeseries/' + timeseries + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: timeseries,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }
  

  componentDidMount() {
    const urlInfo = this.props.location.pathname.split('/')
    const timeseries = urlInfo[3];
    const file = urlInfo[4];
    const user = urlInfo[5];
    this.setState({ loading: true, user: user });

    if (file !== undefined) {
        axios
            .get('/process/public/file/' + timeseries + '/' + file + '/' + user + '/')
            .then((res) => {
                this.setState({ 
                    bin: res.data.bin, 
                    yearOptions: res.data.options.year_options.reverse(),
                    dayOptions: res.data.options.day_options[1],
                    dateOptions: res.data.options.filled_days.map((date) => (new Date(date))),
                    fileOptions: res.data.options.file_options,
                    filledDays: res.data.options.filled_days,
                    dayOption: res.data.bin.day,
                })
                axios
                    .get('/process/public/targets/' + timeseries + '/' + file + '/' + user + '/')
                    .then((targetResponse) => {
                        this.setState({ 
                            targets: targetResponse.data,
                            targetNumbers: targetResponse.data.map(t => t.number),
                            loading: false,
                        });
                        axios
                            .get('/process/rows/community/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + user + '/')
                            .then((rowResponse) => {
                                this.setState({ 
                                    rows: rowResponse.data.options.rows,
                                });
                            });
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ bin: {timeseries:'', ifcb:'', year:'', day:'', file:'Not Found'} });
                return;
            });
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
        this.props.history.go(0);
    }
  }

  disablePlanktonClick(targetNum, bool, infoShowing) {
    const infoClassList = document.getElementById(targetNum + '-info').classList;
    if ((infoShowing) || (infoClassList.contains('show-info'))) {
        if (!this.state.infoShowing.includes(targetNum)) {
            this.setState({ infoShowing: this.state.infoShowing.concat([targetNum]) });
        }
        this.setState({ planktonClickEnabled: false });
    } else {
        const newInfoShowing = this.state.infoShowing.filter(function(item) {
            return item !== targetNum
        })
        this.setState({ planktonClickEnabled: bool, infoShowing: newInfoShowing });
    }
  }

  renderLoader() {
    return <img src={loader} alt="Loading targets..." width="80" loop="infinite" style={{'margin':'0 0 3vw 0'}}></img>
  }

  returnToClassify() {
    this.setState({ newFile: 'blank' });
  }

  renderNotFound() {
      return(
        <div className='main'>
            <div className="page">
                <div className="content">
                    <div className="inner-content">
                        <h1>File Not Found</h1>
                        <p className="not-found-message">The IFCB file you're looking for doesn't exist. There may be a typo in the time series, file number, or sort code in the URL.</p>
                        <div className="return-button" onClick={() => this.returnToClassify()}>Return to Classify</div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  renderPage() {
    const cache = new CellMeasurerCache({
        defaultHeight: 10,
        minHeight: 10,
        fixedWidth: true
      });

    const scrollToIndex = this.state.scrollToIndex;

    const selectedDate = (this.state.bin.day === '') ? new Date() : new Date(this.state.bin.day + '-' + this.state.bin.year);

    const rowRenderer = ({index, key, parent, style}) => (
        
        (this.state.targets.length < 1) ? <div/> : 

            <CellMeasurer
                cache={cache}
                key={key}
                parent={parent}
                rowIndex={index}
            >
            {({ measure, registerChild }) => (
            <div ref={registerChild} key={key} style={style}>
                <div onLoad={measure} className="row">
                    <div className="image-row">
                        {this.state.rows[index].map((i) => 
                            <Plankton 
                                timeseries={this.state.bin.timeseries}
                                file={this.state.bin.file}
                                timestamp={this.state.bin.file}
                                id={i}
                                targetNum={this.state.targets[i].number}
                                class_name={this.state.targets[i].class_name}
                                class_abbr={this.state.targets[i].class_abbr}
                                height={this.state.targets[i].height}
                                width={this.state.targets[i].width}
                                scale={this.props.scaleEntry / 10}
                                ifcb={this.state.bin.ifcb}
                                editor={'jamiewalton'}
                                date={this.state.targets[i].date}
                                onClick={() => console.log()}
                                onCheck={() => console.log()}
                                infoChange={(targetNum, bool, infoShowing) => this.disablePlanktonClick(targetNum, bool, infoShowing)}
                                infoShowing={this.state.infoShowing}
                                public={false}
                                categorizeMode={false}
                                noteOption={false}
                            />
                        )}
                    </div>
                </div>
            </div>
            )}
            </CellMeasurer>
        )
      return(
        
        <div className='main'>
            <div className="page">
            <div className="content">
                    <div className="inner-content">
                    <div className="notebook-heading">
                        <h1 className="notebook-header">Analysis</h1>
                    </div>
                    <h2 className="analysis-option-heading page-heading community-review-heading">Community Review</h2>
                        {this.state.bin.file ? 
                            <CommunityFilePreview 
                                timeseries={this.state.bin.timeseries}
                                file={this.state.bin.file}
                                ifcb={this.state.bin.ifcb}
                                classifier={this.state.user}
                                onClick={() => this.props.goto_communityreview()}
                            /> : <div/>}
                        <div className="annotations">
                            <div>
                                <div className="image-grid remove-top-margin" id="image-grid">
                                    {
                                    (this.state.loading || this.props.isSaving) ? this.renderLoader() : console.log()
                                    }
                                    {
                                    (this.state.emptyCategories && this.state.categorizeMode) ? <p className="empty-categories-text">Nothing to categorize! Switch over to Identify mode to start classifying.</p> :
                                        <List
                                            height={800} // fix later
                                            rowCount={this.state.rows.length}
                                            rowHeight={cache.rowHeight}
                                            rowRenderer={rowRenderer}
                                            scrollToAlignment="start"
                                            scrollToIndex={scrollToIndex}
                                            width={document.documentElement.clientWidth*0.72}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
      );
  }

  render() {

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
        return <Redirect to="/analysis/" />
    }

    if(this.props.onCommunityReview) {
        return <Redirect to="/analysis/communityreview/" />
    }

    if(this.state.newFile.length !== 0) {
        if (this.state.newFile === 'blank') {
            return <Redirect to='/classify' />
        }
        const newURL = '/classify/' + this.state.newTimeSeries + '/' + this.state.newFile;
        return <Redirect to={newURL} />
    }

    if (this.state.rows !== [] && this.state.initialTargetJump === '' && !this.state.loading) {
        const urlInfo = this.props.location.pathname.split('/');
        if (urlInfo.length > 4) {
            const targetNum = urlInfo[4];
            var k = this.state.targets.findIndex(target => target.number === targetNum);
            var scrollToIndex = this.state.rows.findIndex(row => row.includes(k));

            if (isNaN(scrollToIndex) || scrollToIndex<0) {
                scrollToIndex = undefined;
            }

            this.setState({
                jumpEntry: targetNum,
                jumpSubmit: targetNum,
                initialTargetJump: targetNum,
                scrollToIndex: scrollToIndex
            });
        }
    }

    return(
        <div className='body'>
        <title>{'IFCB | ' + this.state.bin.file}</title>
        <Header />
        {(this.state.bin.file === 'Not Found') ? this.renderNotFound() : this.renderPage()}
        
        <script>{document.addEventListener("scroll", this.flipBackToTop)}</script>
    </div>
      );
  }
}

const mapStateToProps = state => ({
    preferences: state.auth.preferences,
    isSaving: state.classify.isSaving,
    user: state.auth.user,
    scaleEntry: state.classify.scaleEntry,
    onHome: state.menu.onHome,
    onLearn: state.menu.onLearn,
    onNotebook: state.menu.onNotebook,
    onAnalysis: state.menu.onAnalysis,
    onCommunityReview: state.menu.onCommunityReview,
 });

export default connect(mapStateToProps, {goto_communityreview })(CommunityFile);