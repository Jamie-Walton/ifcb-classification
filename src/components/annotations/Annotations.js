import React from "react";
import axios from "axios";
import Header from '../layout/Header';
import Preferences from './Preferences';
import BinNote from './BinNote';
import Plankton from './Plankton';
import ClassMenu from './ClassMenu';
import TimeSeriesControl from './time/TimeSeriesControl';
import YearControl from './time/YearControl';
import DayControl from './time/DayControl';
import Bar from './time/Bar';
import FileControl from './time/FileControl';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { classifyTarget, classifyRow, classifyAll, save, sync } from "../../actions/classify";
import { changeScale } from "../../actions/preferences";

import '../../css/classify-styles.css';
import loader from "./loader.GIF";
import toTop from "../../icons/to-top.png";

class NavButton extends React.Component {
    render() {
        return(
            <div className={this.props.className} onClick={() => this.props.onClick()}>
                <p>{this.props.text}</p>
            </div>
        )
    }
}

class Annotations extends React.Component {
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
          yearOptions: [],
          dayOptions: [],
          barHeights: [],
          fileOptions: [],
          setOptions: [],
          filledDays: [],
          targets: [],
          history: [],
          rows: [],
          scrollToIndex: undefined,
          jumpEntry: '',
          targetJumpEntry: '',
          initialTargetJump: '',
          lastEditBin: '',
          lastEditTarget: '',
          scale: 0.056,
          lastScroll: 0,
          dayOption: '',
          previous: 'Previous',
          next: 'Next',
      }
      this.onTargetJumpChange = this.onTargetJumpChange.bind(this);
  }

  static propTypes = {
    preferences: PropTypes.object.isRequired,
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

  closeDropdown(element) {
    if (document.getElementById(element + '_dropdown').classList.contains('show')) {
        document.getElementById(element + '_dropdown').classList.toggle('show');
        document.getElementById(element + '_label').classList.toggle('hide');
        document.getElementById(element + '_bar').classList.toggle('accommodate-dropdown');
    }
  }

  getNewTimeSeries(option) {
    this.closeDropdown('timeseries');
    this.setState({ loading: true });
    axios
        .get('/process/timeseries/' + option + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: option,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.setState({ loading: false });
    const urlInfo = this.props.location.pathname.split('/');
    if(typeof(this.props.preferences) !== 'object') {
        this.props.loadPreferences(this.props.user.username);
    }
    if(urlInfo.length<3) {
        if(this.props.preferences.load==='edited') {
            this.jumpToLastEdit();
        } else {
            this.getNewTimeSeries('IFCB104');
        }
    } else {
        const timeseries = urlInfo[2];
        const file = urlInfo[3];

        axios
            .get('/api/timeseries/')
            .then((res) => {this.setState({ timeSeriesOptions: res.data.map((c) => (c.name)) })})
            .catch((err) => console.log(err));

            this.setState({
                loading: true,
            });
            axios
                .get('/classes/IFCB104/')
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
            .get('/process/file/' + timeseries + '/' + file + '/' + this.props.preferences.sort + 
                '/' + Math.round(this.props.preferences.scale * 1000) + '/' + this.props.preferences.phytoguide + '/')
            .then((res) => {
                this.setState({ 
                    bin: res.data.bin, 
                    yearOptions: res.data.options.year_options.reverse(),
                    barHeights: res.data.options.day_options[0],
                    dayOptions: res.data.options.day_options[1],
                    fileOptions: res.data.options.file_options,
                    setOptions: res.data.options.set_options,
                    rows: res.data.options.rows,
                    filledDays: res.data.options.filled_days,
                    dayOption: res.data.bin.day,
                })
                axios
                    .get('/process/targets/' + timeseries + '/' + file + '/' + this.props.preferences.sort + '/')
                    .then((targetResponse) => {
                        this.setState({ 
                            targets: targetResponse.data,
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
    
    if (this.props.scaleEntry !== this.props.preferences.scale) {
        this.props.changeScale(this.props.preferences.scale);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
        this.props.history.go(0);
    }
  }

  getNewYear(option) {
    this.closeDropdown('year');
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

    this.closeDropdown('day');
    this.setState({ loading: true });
    axios
        .get('/process/day/' + this.state.bin.timeseries + '/' + this.state.bin.year + '/'  + option + '/')
        .then((res) => { this.setState({ 
            newTimeSeries: this.state.bin.timeseries,
            newFile: res.data.bin.file
        }) })
        .catch((err) => console.log(err));
  }

  handleNewDay(option) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    const newDay = (element) => element === option;
    const dayNumber = this.state.dayOptions.findIndex(newDay);
    this.handleBar(dayNumber);
  }

  handleNewFile(option) {

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.closeDropdown('file');
    
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

  backToTop() {
    if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        if(document.body.scrollTop !== 0) {
            this.setState({ lastScroll: document.body.scrollTop });
        } else {
            this.setState({ lastScroll: document.documentElement.scrollTop });
        }
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
    } else {
        document.body.scrollTop = this.state.lastScroll;
        document.documentElement.scrollTop = this.state.lastScroll;
    }
  }

  flipBackToTop() {
    if (document.getElementById('to-top') !== null) {
        if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
            document.getElementById('to-top').classList.remove('flip');
        } else if (!document.getElementById('to-top').classList.contains('flip')) {
            document.getElementById('to-top').classList.add('flip');
        }
    }
  }

  handleSelectAllClick() {
      var targets = this.state.targets;
      const className = this.state.classPicker;
      const classAbbrFunc = (element) => element === this.state.classPicker;
      const classAbbr = this.state.classAbbrs[this.state.classes.findIndex(classAbbrFunc)];
      for (let i = 0; i < targets.length; i++) {
          targets[i].class_name = className;
          targets[i].class_abbr = classAbbr;
          targets[i].editor = this.props.user.username;
          const container = document.getElementById(targets[i].number);
          const text = document.getElementById(targets[i].number+'-text');
          container.style.backgroundColor = '#16609F';
          text.style.color = '#FFFFFF';
      }
      this.setState({ 
          targets: targets,
          history: this.state.history.concat([JSON.stringify(targets)])
     });
     this.props.save(targets, this.state.bin.timeseries, this.state.bin.file, this.props.preferences.sort);
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

  handleSyncClick() {
    document.getElementById('sync').classList.toggle('syncing');
    this.setState({ rows: [] });
    this.props.sync(this.state.bin.timeseries, this.state.bin.year, this.state.bin.day, this.state.bin.file);
    axios
        .get('/process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.props.preferences.sort + '/')
        .then((targetResponse) => {
            this.setState({ 
                targets: targetResponse.data,
                history: this.state.history.concat([JSON.stringify(targetResponse.data)]),
             });
        });
    axios
        .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + 
            '/' + this.props.preferences.sort + '/' + Math.round(this.state.scale * 1000) + '/' +
            this.props.preferences.phytoguide + '/')
        .then((res) => {this.setState({ 
            rows: res.data.options.rows,
            loading: false,
          })})
        .catch((err) => console.log(err));
    document.getElementById('sync').classList.toggle('syncing');
  }

  handleHistogramClick() {
    const histogram = document.getElementById('histogram');
    const histogram_dropdown = document.getElementById('histogram_dropdown');
    histogram_dropdown.classList.toggle('show-day');
    histogram.scrollTop = histogram.scrollHeight;
  }

  handleRowClick(j) {
    var targets = this.state.targets;
    const row = this.state.rows[j];
    for (var i in row) {
        var k = row[i]
        const classAbbr = (element) => element === this.state.classPicker;
        targets[k].class_name = this.state.classPicker;
        targets[k].class_abbr = this.state.classAbbrs[this.state.classes.findIndex(classAbbr)];
        targets[k].editor = this.props.user.username;
        const container = document.getElementById(targets[k].number);
        const text = document.getElementById(targets[k].number+'-text');
        container.style.backgroundColor = '#16609F';
        text.style.color = '#FFFFFF';
    }
    this.setState({ 
        targets: targets,
        history: this.state.history.concat([JSON.stringify(targets)])
    });
    const start = row[0]
    const end = row[i];
    const targetRow = targets.slice(start, end+1);

    this.props.classifyRow(targetRow, this.state.bin.timeseries, this.state.bin.file, this.props.preferences.sort, start, end);
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

        this.props.classifyTarget(targets[k], this.state.bin.timeseries, this.state.bin.file, targets[k].number);
    }
  }

  showNotes() {
      const noteDropdown = document.getElementById("note-dropdown");
      noteDropdown.classList.toggle('show');
      const showButton = document.getElementById("show-notes-button");
      (showButton.innerHTML === "Show Notes") ? showButton.innerHTML = "Hide Notes" : showButton.innerHTML = "Show Notes";

  }

  hideInfo() {
    const showButton = document.getElementById("hide-info-button");
    (showButton.innerHTML === "Hide Info") ? showButton.innerHTML = "Show Info" : showButton.innerHTML = "Hide Info";
    const infoButtons = document.getElementsByClassName('info');
      for (let i = 0; i < infoButtons.length; i++) {
          infoButtons[i].classList.toggle('hide');
      }
  }

  handleScale(dir) {
    const initialScale = this.state.scale
    var  newScale = 0;
    if (dir === 'up') {
        newScale = initialScale + 0.01;
    } else if  (dir === 'down') {
        newScale = initialScale - 0.01;
    }
    axios
      .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + 
        '/' + this.props.preferences.sort + '/' + Math.round((newScale) * 1000) + '/' +
        this.props.preferences.phytoguide + '/')
      .then((rowResponse) => { this.setState({ 
          scale: newScale,
          rows: rowResponse.data.options.rows 
        }); });
  }

  handleDownload() {
    document.getElementById('download-src').src = 'http://dhcp-25-80.ucsc.edu:8000/mat/' + this.state.bin.ifcb + '/' + this.state.bin.file + '/'
  }

  openPreferences() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById('preferences').classList.toggle('show-pref');
  }

  closePreferences() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById('preferences').classList.toggle('show-pref');
    this.props.history.go(0);
  }

  renderPreferences() {
      return (
        <Preferences 
            history={this.props.history}
            load={this.props.preferences.load}
            scale={this.props.preferences.scale}
            sort={this.props.preferences.sort}
            phytoGuide={this.props.preferences.phytoguide}
        />
      );
  }

  renderTimeSeriesControl() {
    return <TimeSeriesControl
        timeseries={this.state.bin.timeseries}
        options={this.state.timeSeriesOptions}
        onClick={(option) => this.getNewTimeSeries(option)}
    />;
  }

  renderYearControl() {
    return <YearControl
        year={this.state.bin.year}
        options={this.state.yearOptions}
        onClick={(option) => this.getNewYear(option)} 
    />;
  }

  renderDayControl() {
    const options = this.state.filledDays.slice().reverse();
    return <DayControl
        day={this.state.bin.day} 
        options={options}
        onClick={(option) => this.handleNewDay(option)}
    />;
  }

  renderFileControl() {
    return <FileControl
        file={this.state.bin.file} 
        options={this.state.fileOptions}
        onClick={(option) => this.handleNewFile(option)} 
    />;
  }

  renderSync() {
    return(
        <div className="round-button sync" id="sync-button" onClick={() => this.handleSyncClick()}></div>
    );
  }

  renderDownload() {
      return(
        <div className="round-button download" onClick={() => this.handleDownload()}>
            <div style={{display: 'none'}}>
               <iframe id="download-src" />
            </div>
        </div>
      );
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

  renderBar(gb, i) {
    const currentDay = (element) => element === this.state.bin.day;
    return <Bar 
        key={i}
        onClick={(i) => this.handleBar(i)}
        onHover={(i) => this.handleBarHover(i)}
        number={i}
        height={gb}
        day={this.state.dayOptions[i]}
        current={this.state.dayOptions.findIndex(currentDay)}
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

  jumpToLastEdit() {
    axios
        .get('/lastedit/' + this.props.user.username + '/')
        .then((res) => this.setState({ lastEditBin: res.data.bin, lastEditTarget: res.data.options }))
        .catch((err) => console.log(err));
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

  onTargetJumpChange(event) {
    var k = this.state.targets.findIndex(target => target.number === event.target.value);
    var scrollToIndex = this.state.rows.findIndex(row => row.includes(k));

    if (isNaN(scrollToIndex) || scrollToIndex<0) {
      scrollToIndex = undefined;
    }

    this.setState({
        jumpEntry: event.target.value,
        scrollToIndex: scrollToIndex
    });
  }

  renderPage() {
    const cache = new CellMeasurerCache({
        defaultHeight: 10,
        minHeight: 10,
        fixedWidth: true
      });

    const jumpEntry = this.state.jumpEntry;
    const scrollToIndex = this.state.scrollToIndex;


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
                    <div className="row-select" 
                        alt={'Select row'} onClick={() => this.handleRowClick(index)}>
                    </div>
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
                                editor={this.state.targets[i].editor}
                                date={this.state.targets[i].date}
                                onClick={(i) => this.handlePlanktonClick(i)}
                                infoChange={(targetNum, bool, infoShowing) => this.disablePlanktonClick(targetNum, bool, infoShowing)}
                                infoShowing={this.state.infoShowing}
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
                <div className="overlay" id="overlay" onClick={() => this.closePreferences()}></div>
                {this.renderPreferences()}
                    <div className="inner-content">
                        <h4 onClick={() => this.jumpToLastEdit()}>Last Edit →</h4>
                        <h1>Manual Classifications</h1>
                        <div className="time-controls">
                            {this.renderTimeSeriesControl()}
                            {this.renderYearControl()}
                            {this.renderDayControl()}
                            {this.renderFileControl()}
                            <div className="target-jump-container">
                                <input
                                    type="textarea" 
                                    className="target-jump-input"
                                    onChange={this.onTargetJumpChange}
                                    value={jumpEntry || ''}
                                    placeholder="Target..."
                                />
                                <p className="time-label jump-label" id='targetjump_label'>Jump to Target</p>
                            </div>
                            <div className="show-notes-button" id="show-notes-button" onClick={() => this.showNotes()}>Show Notes</div>
                            <div className="hide-info-button" id="hide-info-button" onClick={() => this.hideInfo()}>Hide Info</div>
                            {this.renderSync()}
                            {this.renderDownload()}
                            <div className="round-button histogram" onClick={() => this.handleHistogramClick()}></div>
                            <div className="preferences-button" onClick={() => this.openPreferences()}></div>
                        </div>
                        <div className='histogram-dropdown-container' id='histogram_dropdown'>
                            <div className="histogram-dropdown" id='histogram'>
                                <div className="timeline">
                                    <div className="bars">
                                        {this.state.barHeights.map((gb, i) => this.renderBar(gb, i))}
                                    </div>
                                    <div className="axis">
                                        <p className="month">Jan</p>
                                        <p className="month">Feb</p>
                                        <p className="month">Mar</p>
                                        <p className="month">Apr</p>
                                        <p className="month">May</p>
                                        <p className="month">Jun</p>
                                        <p className="month">Jul</p>
                                        <p className="month">Aug</p>
                                        <p className="month">Sep</p>
                                        <p className="month">Oct</p>
                                        <p className="month">Nov</p>
                                        <p className="month">Dec</p>
                                    </div>
                                </div>
                            </div>
                            <div className='day-option'>
                                <p className='day-option-text'>{this.state.dayOption}</p>
                            </div>
                        </div>
                        <div className="note-container" id="note-dropdown">
                            {((this.state.bin.timeseries) === '' || this.state.bin.file === '') ? 
                            <div></div> :
                            <BinNote 
                                timeseries={this.state.bin.timeseries}
                                ifcb={this.state.bin.ifcb}
                                file={this.state.bin.file}
                                type='bin'
                                image='None'
                            /> }
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
            return <Redirect to='/classify/' />
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
                initialTargetJump: targetNum,
                scrollToIndex: scrollToIndex
            });
        }
    }

    if (typeof(this.state.lastEditBin) !== 'string') {
        this.setState({ loading: true });
        const bin = this.state.lastEditBin;
            return <Redirect to={"/classify/" + bin.timeseries + '/' + bin.file + '/' + this.state.lastEditTarget.target} />
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

export default connect(mapStateToProps, { classifyTarget, classifyRow, classifyAll, save, sync, changeScale })(Annotations);