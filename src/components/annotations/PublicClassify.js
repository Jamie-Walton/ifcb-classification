import React from "react";
import axios from "axios";
import Header from '../layout/Header';
import Plankton from './Plankton';
import ClassMenu from './ClassMenu';
import DatePicker from "react-datepicker";
import '../../css/datepicker.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { classifyPublicTarget, classifyRow, classifyAll, save, sync } from "../../actions/classify";
import { changeScale } from "../../actions/preferences";

import '../../css/classify-styles.css';
import loader from "./loader.GIF";
import toTop from "../../icons/to-top.png";
import akashiwo from "../../assets/akashiwo-character.png";

class NavButton extends React.Component {
    render() {
        return(
            <div className={this.props.className} onClick={() => this.props.onClick()}>
                <p>{this.props.text}</p>
            </div>
        )
    }
}

class PublicClassify extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          loading: true,
          newFile: '',
          newTimeSeries: '',
          classes: [],
          classAbbrs: [],
          classDescriptions: [],
          classExamples: [],
          classNonexamples: [],
          classPicker: 'Unclassified',
          classMark: 'UNC',
          planktonClickEnabled: true,
          infoShowing: [],
          bin: {timeseries:'', ifcb:'', year:'', day:'', file:''},
          timeSeriesOptions: [],
          timeSeriesNames: [],
          yearOptions: [],
          dayOptions: [],
          dateOptions: [],
          fileOptions: [],
          setOptions: [],
          filledDays: [],
          targets: [],
          targetNumbers: [],
          history: [],
          rows: [],
          scrollToIndex: undefined,
          jumpEntry: '',
          jumpSubmit: '',
          initialTargetJump: '',
          lastEditBin: '',
          lastEditTarget: '',
          scale: 0.056,
          lastScroll: 0,
          dayOption: '',
          previous: 'Previous',
          next: 'Next',
      }
  }

  static propTypes = {
    preferences: PropTypes.object,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    changeScale: PropTypes.func,
    classifyTarget: PropTypes.func.isRequired,
    classifyRow: PropTypes.func.isRequired,
    classifyAll: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    sync: PropTypes.func.isRequired,
    isSyncing: PropTypes.bool,
    user: PropTypes.object,
    scaleEntry: PropTypes.number,
    onNotebook: PropTypes.bool,
    onAnalysis: PropTypes.bool,
  };

  getNewTimeSeries(option, timeseries) {
    this.setState({ loading: true });

    if (timeseries === undefined) {
        var k = this.state.timeSeriesOptions.findIndex(timeseries => timeseries === option);
        timeseries = this.state.timeSeriesNames[k];
    }

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

    axios
        .get('/api/timeseries/')
        .then((res) => {
            this.setState({ 
                timeSeriesOptions: res.data.map((c) => (c.public_name)),
                timeSeriesNames: res.data.map((c) => (c.name)),
                });
            if(urlInfo.length<3) {
                this.getNewTimeSeries('Santa Cuz Wharf', 'SCW');
            }
            })
        .catch((err) => console.log(err));

    const timeseries = urlInfo[2];
    const file = urlInfo[3];
    this.setState({ loading: true });

    axios
        .get('/classes/SCW/')
        .then((res) => {
            this.setState({ 
                classes: res.data.map((c) => (c.display_name.replace('_', ' '))),
                classAbbrs: res.data.map((c) => (c.abbr)),
                classDescriptions: res.data.map((c) => (c.description)),
                classExamples: res.data.map((c) => (c.examples.split(',').filter(n => n.length > 1))),
                classNonexamples: res.data.map((c) => (c.nonexamples.split(',').filter(n => n.length))),
            });
        })
        .catch((err) => console.log(err));
    axios
        .get('/process/public/file/' + timeseries + '/' + file + '/' + this.props.user.username + '/')
        .then((res) => {
            this.setState({ 
                bin: res.data.bin, 
                yearOptions: res.data.options.year_options.reverse(),
                dayOptions: res.data.options.day_options[1],
                dateOptions: res.data.options.filled_days.map((date) => (new Date(date))),
                fileOptions: res.data.options.file_options,
                setOptions: res.data.options.set_options,
                rows: res.data.options.rows,
                filledDays: res.data.options.filled_days,
                dayOption: res.data.bin.day,
            })
            axios
                .get('/process/public/targets/' + timeseries + '/' + file + '/' + this.props.user.username + '/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
                        targetNumbers: targetResponse.data.map(t => t.number),
                        history: [JSON.stringify(targetResponse.data)],
                        loading: false,
                    });
            });
        })
        .catch((err) => {
            console.log(err);
            this.setState({ bin: {timeseries:'', ifcb:'', year:'', day:'', file:'Not Found'} });
            return;
        });

  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
        this.props.history.go(0);
    }
  }

  highlightTarget(targetNum) {
    const container = document.getElementById(targetNum);
    const text = document.getElementById(targetNum+'-text');
    container.style.backgroundColor = '#16609F';
    text.style.color = '#FFFFFF';
  }

  unhighlightTarget(targetNum) {
    const container = document.getElementById(targetNum);
    const text = document.getElementById(targetNum+'-text');
    container.style.backgroundColor = '#FFFFFF';
    text.style.color = '#4E4E4E';
  }

  getNewYear(option) {
    this.setState({ loading: true });
    axios
        .get('/process/year/' + this.state.bin.timeseries + '/' + option + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: this.state.bin.timeseries,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }

  handleBarHover(option) {
      this.setState({ dayOption: this.state.dayOptions[option] });
  }

  handleBar(option) {
    const histogram = document.getElementById('histogram_dropdown').classList;
    if (histogram.contains('show-day')) {
        histogram.toggle('show-day');
    }

    this.setState({ loading: true });
    axios
        .get('/process/day/' + this.state.bin.timeseries + '/' + this.state.bin.year + '/'  + option + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: this.state.bin.timeseries,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }

  onDateChange(day) {
    axios
        .get('/process/public/day/' + this.state.bin.timeseries + '/' + String(day).split(' ').slice(1,4).join('') + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: this.state.bin.timeseries,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }

  handleNewFile(option) {

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    
    const file = 'D' + this.state.bin.year + this.state.bin.day.slice(0,2) + this.state.bin.day.slice(3,5) + 
    option.slice(0,3) + option.slice(4,6) + option.slice(7,9);
    
    this.setState({ 
        newTimeSeries: this.state.bin.timeseries,
        newFile: file
    })
  }

  handleMouseOver(element) {
    element.style.backgroundColor = '#16609F';
  }

  handleMouseOut(element) {
    element.style.backgroundColor = '#079CCC';
  }

  handleMenuClick(name) {
      const prevMenu = document.getElementById(this.state.classPicker);
      prevMenu.style.backgroundColor = '#079CCC';
      prevMenu.addEventListener('mouseover', this.handleMouseOver(prevMenu));
      prevMenu.addEventListener('mouseout', this.handleMouseOut(prevMenu));

      const ids = document.getElementsByClassName('id');
      const idTexts = document.getElementsByClassName('id-text');
      for (let i=0; i<ids.length; i++) {
          if (ids[i].style.backgroundColor !== '#FFFFFF') {
            ids[i].style.backgroundColor = '#FFFFFF';
            idTexts[i].style.color = '#4E4E4E';
        }
      }

      const nameAbbr = (element) => element === name;
      this.setState({ 
          classPicker: name,
          classMark: this.state.classAbbrs[this.state.classes.findIndex(nameAbbr)],
        });
      const menu = document.getElementById(name);
      menu.removeEventListener('mouseout', this.handleMouseOut(menu));
      menu.style.backgroundColor = '#16609F';
      
      for (const target of this.state.targets) {
          if (target.class_name === name) {
              const container = document.getElementById(target.number);
              const text = document.getElementById(target.number+'-text');
              container.style.backgroundColor = '#16609F';
              text.style.color = '#FFFFFF';
          }
      }
  }

  handleUndoClick() {
    if (this.state.history.length > 1) {
      const newHistory = this.state.history.slice(0, this.state.history.length-1);
      const targets = JSON.parse(newHistory[newHistory.length-1]);
      const rows = this.state.rows;
      this.setState({ rows: [] });
      this.setState({
          targets: targets,
          history: newHistory,
      });
      this.setState({ rows: rows });
      this.props.save(targets, this.state.bin.timeseries, this.state.bin.file, this.props.preferences.sort);
    }
  }

  handleHistogramClick() {
    const histogram = document.getElementById('histogram');
    const histogram_dropdown = document.getElementById('histogram_dropdown');
    histogram_dropdown.classList.toggle('show-day');
    histogram.scrollTop = histogram.scrollHeight;
  }

  handlePlanktonClick(i) {
    if (this.state.planktonClickEnabled) {
        var targets = this.state.targets;
        const k = targets.findIndex(target => target.number === i);
        const classAbbr = (element) => element === this.state.classPicker;
        targets[k].class_name = this.state.classPicker;
        targets[k].class_abbr = this.state.classAbbrs[this.state.classes.findIndex(classAbbr)];
        targets[k].editor = this.props.user.username;
        const history = this.state.history;
        this.setState({
            history: history.concat([JSON.stringify(targets)]),
            targets: targets,
        });
        const container = document.getElementById(targets[k].number);
        const text = document.getElementById(targets[k].number+'-text');
        container.style.backgroundColor = '#16609F';
        text.style.color = '#FFFFFF';

        this.props.classifyPublicTarget(targets[k], this.state.bin.timeseries, this.state.bin.file, targets[k].number, this.props.user);
    }
  }

  renderClassMenu() {
    return <ClassMenu 
          classes={this.state.classes}
          descriptions={this.state.classDescriptions}
          examples={this.state.classExamples}
          nonexamples={this.state.classNonexamples}
          onClick={(name) => this.handleMenuClick(name)}
          handleSelectAllClick={() => this.handleSelectAllClick()}
          handleUndoClick={() => this.handleUndoClick()}
          scale={this.state.scale}
          showPhytoGuide={this.props.preferences.phytoguide}
      />;
  }

  renderNavButton(direction) {
    var dir;
    var text;
    var className;
    (direction === 'next') ? (dir = 1) : (dir = -1);
    (direction === 'next') ? (className = 'next-button') : (className='previous-button');

    const currentFile = (element) => 
        'D' + this.state.bin.year + this.state.bin.day.slice(0,2) + this.state.bin.day.slice(3,5) + 
        element.slice(0,3) + element.slice(4,6) + element.slice(7,9) === this.state.bin.file;
    const fileNumber = this.state.fileOptions.findIndex(currentFile);
    if ((fileNumber === this.state.fileOptions.length-1 && dir === 1) || (fileNumber === 0 && dir === -1)) {
        const currentDay = (element) => element === this.state.bin.day;
        const dayNumber = this.state.filledDays.findIndex(currentDay);
        if ((dayNumber === this.state.filledDays.length-1 && dir === 1) || (dayNumber === 0 && dir === -1)) {
            const currentYear = (element) => element === Number(this.state.bin.year);
            const yearOptions = this.state.yearOptions.slice().reverse()
            const yearNumber = yearOptions.findIndex(currentYear);
            if ((yearNumber === yearOptions.length-1 && dir === 1)) {
                return <NavButton
                    text={'Up to Date'}
                    className={'up-to-date-button'}
                />;
            } else if (yearNumber === 0 && dir === -1) {
                return <NavButton
                    text={'No Previous Data'}
                    className={'up-to-date-button'}
                />;
            } else {
                text = (direction === 'next') ? ('Next Year   >') : ('<   Previous Year');
                return <NavButton
                    text={text}
                    onClick={() => this.getNewYear(yearOptions[yearNumber + dir])}
                    className={className}
                />
            }
        } else {
            text = (direction === 'next') ? ('Next Day   >') : ('<   Previous Day');
            return <NavButton
                text={text}
                onClick={() => this.handleNewDay(this.state.filledDays[dayNumber + dir])}
                className={className}
            />
        }
    } else {
        text = (direction === 'next') ? ('Next File   >') : ('<   Previous File');
        return <NavButton
            text={text}
            onClick={() => this.handleNewFile(this.state.fileOptions[fileNumber + dir])}
            className={className}
        />
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
                                onClick={(i) => this.handlePlanktonClick(i)}
                                infoChange={(targetNum, bool, infoShowing) => this.disablePlanktonClick(targetNum, bool, infoShowing)}
                                infoShowing={this.state.infoShowing}
                                public={true}
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
                        <h1>Classify Phytoplankton</h1>
                        <p className='subtitle'>Match each phytoplankton with their species! Select a sample by choosing a date and an IFCB location.</p>
                        <div style={{'display':'flex'}}>
                            <div className="public-time-controls">
                                <DatePicker 
                                    onChange={(day) => this.onDateChange(day)}
                                    value={selectedDate}
                                    selected={selectedDate}
                                    includeDates={this.state.dateOptions}
                                    placeholderText={this.state.bin.day + '-' + this.state.bin.year}
                                    className='datepicker'
                                    inline
                                />
                                <div className="timeseries-box">
                                    {this.state.timeSeriesOptions.filter(n => n!=='').map((option, i) => 
                                        <li key={i} className="timeseries-list-item" onClick={option => this.getNewTimeSeries(option)}>{option}</li>)}
                                </div>
                                <img src={akashiwo} alt="Drawing of a celebratory phytoplankton" className="akashiwo-character"></img>
                            </div>
                        </div>
                        <div className="annotations">
                            {this.renderClassMenu()}
                            <div className="image-grid" id="image-grid">
                                {
                                (this.state.loading || this.props.isSaving) ? this.renderLoader() : console.log()
                                }
                                <List
                                    height={800} // fix later
                                    rowCount={this.state.rows.length}
                                    rowHeight={cache.rowHeight}
                                    rowRenderer={rowRenderer}
                                    scrollToAlignment="start"
                                    scrollToIndex={scrollToIndex}
                                    width={document.documentElement.clientWidth*0.72}
                                />
                                <img src={toTop} alt="Back to Top" className="to-top" id="to-top" onClick={() => this.backToTop()}></img>
                            </div>
                        </div>
                        <div className='navigation-container'>
                            <div style={{'display':'flex'}}>
                                {this.renderNavButton('previous')}
                                {this.renderNavButton('next')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
      );
  }

  render() {
    
    if(this.props.onNotebook) {
        return <Redirect to="/notebook/" />
    }

    if(this.props.onAnalysis) {
        return <Redirect to="/analysis/" />
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
    onNotebook: state.menu.onNotebook,
    onAnalysis: state.menu.onAnalysis,
 });

export default connect(mapStateToProps, { classifyPublicTarget, classifyRow, classifyAll, save, sync, changeScale })(PublicClassify);