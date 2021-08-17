import React from "react";
import axios from "axios";
import Header from '../layout/Header';
import BinNote from './BinNote';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { classifyTarget, classifyRow, classifyAll, save, sync } from "../../actions/classify";

import '../../css/classify-styles.css';
import loader from "./loader.GIF";
import toTop from "../../icons/to-top.png";
import dropdown from "../../icons/dropdown.png";

class TimeSeriesControl extends React.Component {
    handleDropdown() {
        document.getElementById('timeseries_dropdown').classList.toggle('show');
        document.getElementById('timeseries_label').classList.toggle('hide');
        document.getElementById('timeseries_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return (
            <div>
                <div className="time time-series" id='timeseries_bar'>
                    <p className="time-selection">{this.props.timeseries}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select time series'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown time-series" id='timeseries_dropdown'>
                    <ul className="timeseries-option">{options}</ul>
                </div>
                <p className="time-label" id='timeseries_label'>Time Series</p>
            </div>
        );
    }
}

class YearControl extends React.Component {
    handleDropdown() {
        document.getElementById('year_dropdown').classList.toggle('show');
        document.getElementById('year_label').classList.toggle('hide');
        document.getElementById('year_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return(
            <div>
                <div className="time" id='year_bar'>
                    <p className="time-selection">{this.props.year}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select Year'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='year_dropdown'>
                    <ul className="year-option">{options}</ul>
                </div>
                <p className="time-label" id='year_label'>Year</p>
            </div>
        );
    }
}

class Bar extends React.Component {
    handleHover() {
        document.getElementById('day' + this.props.number).classList.toggle('show');
    }
    render() {
        return(
            <div className="bar-container">
                <div className="day" id={'day' + this.props.number}>{this.props.day}</div>
                <div className="bar" id={'bar' + this.props.number} 
                    onClick={() => this.props.onClick(this.props.number)}
                    onMouseEnter={() => this.handleHover()}
                    onMouseLeave={() => this.handleHover()}
                    style={{height: String(this.props.height*8) + 'vw'}}></div>
            </div>
        );}
  }

class DayControl extends React.Component {
    handleDropdown() {
        document.getElementById('day_dropdown').classList.toggle('show-day');
    }
    
    render() {
        return(
            <div>
                <div className="time" id='day_bar'>
                    <p className="time-selection" id="day_text">{this.props.day}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select Day'} onClick={() => this.handleDropdown()}></img>
                </div>
                <p className="time-label" id='day_label'>Day</p>
            </div>
        );
    }
}

class FileControl extends React.Component {
    handleDropdown() {
        document.getElementById('file_dropdown').classList.toggle('show');
        document.getElementById('file_label').classList.toggle('hide');
        document.getElementById('file_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        var fileName = this.props.file;
        const file = fileName.slice(9,12) + ':' + fileName.slice(12,14) + ':' + fileName.slice(14,16) + 'Z';
        return(
            <div>
                <div className="time" id='file_bar'>
                    <p className="time-selection">{file}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select File'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='file_dropdown'>
                    <ul className="file-option">{options}</ul>
                </div>
                <p className="time-label" id='file_label'>File</p>
            </div>
        );
    }
}

class SetControl extends React.Component {
    handleDropdown() {
        document.getElementById('set_dropdown').classList.toggle('show');
        document.getElementById('set_label').classList.toggle('hide');
        document.getElementById('set_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const classList = this.props.options;
        const options = classList.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return(
            <div>
                <div className="set" id="set_bar">
                <p className="time-selection">{this.props.set}</p>
                <img src={dropdown} className="time-icon"
                alt={'Select Set'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="set-dropdown" id='set_dropdown'>
                    <ul className="set-option">{options}</ul>
                </div>
                <p className="time-label" id="set_label">Set</p>
            </div>
        );
    }
}

class Group extends React.Component {  
    render() {
        return(
            <div>
                <div className="set" id="group_bar" onClick={() => this.props.onClick(this.props.group)}>
                    <p className="time-selection">{this.props.group}</p>
                </div>
                <p className="time-label" id="group_label">Group</p>
            </div>
        );
    }
}

class Sort extends React.Component {  
    render() {
        return(
            <div>
                <div className="set" id="sort_bar" onClick={() => this.props.onClick(this.props.sort)}>
                    <p className="time-selection">{this.props.sort}</p>
                </div>
                <p className="time-label" id="sort_label">Sort</p>
            </div>
        );
    }
}

class PlanktonImage extends React.Component {

  render() {
  const url = this.props.nameSpace + this.props.timestamp + '_' + this.props.ifcb + '_' + this.props.targetNum + '.jpg';
      return(
          <img src={url} className="image" 
          alt={this.props.classification} 
          id={this.props.targetNum + '-image'}
          style={{height: String(Number(this.props.height)*this.props.scale)+'vw'}}></img>
      );
  }
}

class Plankton extends React.Component {
  
  renderImage() {  
    return (
        <PlanktonImage 
            nameSpace={'http://128.114.25.154:8888/' + this.props.timeseries + '/'}
            timestamp={this.props.timestamp}
            timeseries={this.props.timeseries}
            ifcb={this.props.ifcb}
            targetNum={this.props.targetNum}
            classification={this.props.class_name}
            height={this.props.height}
            scale={this.props.scale}
        />
      );
  }

  getHeight() {
    if (this.props.height < 0) {
      return '5'
    } else {
        return String((Number(this.props.height) * this.props.scale) + 2.25)
    }
  }

  getWidth() {
    if (this.props.width < 0) {
      return '5'
    } else {
        return String(Number(this.props.width)*this.props.scale)
    }
  }

  handleInfoClick() {
    this.props.infoChange(this.props.targetNum, false, true);
    document.getElementById(this.props.targetNum + '-info').classList.toggle('show-info');
    document.getElementById(this.props.targetNum + '-image').classList.toggle('hide');
    document.getElementById(this.props.targetNum).classList.toggle('hide');
  }

  render() {
    const infoStyle = {
        height: this.getHeight() + 'vw',
        width: this.getWidth() + 'vw'
    };
    
    return(
          <div>
            <div className="plankton-button" id="plankton-button" onClick={() => this.props.onClick(this.props.targetNum)}>
                <div className="plankton">
                    {this.renderImage()}
                    <div className="info" onMouseEnter={() => this.props.infoChange(this.props.targetNum, false, false)} 
                        onMouseLeave={() => this.props.infoChange(this.props.targetNum, true, false)}
                        onClick={() => this.handleInfoClick()}></div>
                    <div className="info-div" id={this.props.targetNum + '-info'} style={infoStyle}>
                        <p className="classification-info">{this.props.class_name}</p>
                        <p className="target-num-info">{'Target ' + this.props.targetNum}</p>
                        <p className="editor-info">{'Classified by ' + this.props.editor + ',\n' + this.props.date}</p>
                        {(this.props.infoShowing.includes(this.props.targetNum)) ? 
                        <BinNote
                            timeseries={this.props.timeseries}
                            ifcb={this.props.ifcb}
                            file={this.props.file}
                            type='target'
                            image={this.props.targetNum}
                        /> :
                        <div></div>
                        }
                    </div>
                    <div className='id' id={this.props.targetNum}>
                        <p className='id-text' id={this.props.targetNum + '-text'}>{this.props.class_abbr}</p>
                    </div>
                </div>
            </div>
          </div>
      );
  }
}

class Micrometer extends React.Component {
    // Double check that scale is correct?
    render() {
        return(
            <div className="drag-box">
                <div className="micrometer-block"
                style={{width: (String(34*this.props.scale) + 'vw')}}></div>
                <p className="micrometer-text">10µm</p>
            </div>
        );
    }
}

class ClassMenu extends React.Component {
  render() {
      const options = this.props.classes.map((x) => 
      <li key={x}><button id={x} onClick={() => this.props.onClick(x)}>{x}</button></li>);
      return(
      <div className="sidebar">
      <div className="class-menu">
          <div className="control-box">
            <div className="annotation-control" onClick={() =>  this.props.handleSelectAllClick()}>
                <p className="control-text">Select All</p>
            </div>
            <div className="annotation-control" onClick={() =>  this.props.handleUndoClick()}>
                <p className="control-text">Undo</p>
            </div>
            <div className="annotation-control" onClick={() =>  this.props.handleSaveClick()}>
                <p className="control-text">Save</p>
            </div>
          </div>
          <ul>{options}</ul>
      </div>
      <Micrometer scale={this.props.scale}/>
      </div>
      );
  }
}

class Annotations extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          loading: true,
          classes: [],
          classAbbrs: [],
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
          targets: [],
          history: [],
          rows: [],
          scale: 0.056,
          set: 1,
          group: 'Class',
          sort: 'A to Z',
          sortCode: 'AZ',
          lastScroll: 0,
      }
  }

  static propTypes = {
    classifyTarget: PropTypes.func.isRequired,
    classifyRow: PropTypes.func.isRequired,
    classifyAll: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    sync: PropTypes.func.isRequired,
    isSyncing: PropTypes.bool,
    user: PropTypes.object,
    onNotebook: PropTypes.bool,
  };

  getNewTimeSeries(option) {
    this.setState({
        loading: true,
        bin: {
            timeseries: option,
            ifcb: this.state.bin.ifcb,
            year: this.state.bin.year,
            day: this.state.bin.day,
            file: this.state.bin.file,
            edited: false
        }
    });
    axios
      .get('/classes/' + option + '/')
      .then((res) => {
        this.setState({ 
          classes: res.data.map((c) => (c.display_name)),
          classAbbrs: res.data.map((c) => (c.abbr))
        });
      })
      .catch((err) => console.log(err));
    axios
        .get('/process/timeseries/' + option + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
        .then((binResponse) => {
            this.setState({ 
                bin: binResponse.data.bin,
                yearOptions: binResponse.data.options.year_options.reverse(),
                barHeights: binResponse.data.options.day_options[0],
                dayOptions: binResponse.data.options.day_options[1],
                fileOptions: binResponse.data.options.file_options,
                setOptions: binResponse.data.options.set_options,
                rows: binResponse.data.options.rows,
                set: 1
            });
            axios
                .get('/process/targets/' + option + '/' + binResponse.data.bin.file + '/1/' + this.state.sortCode + '/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
                        history: [JSON.stringify(targetResponse.data)],
                        loading: false,
                     });
                });

    });
  };

  componentDidMount() {
    axios
      .get('/api/timeseries/')
      .then((res) => {this.setState({ timeSeriesOptions: res.data.map((c) => (c.name)) })})
      .catch((err) => console.log(err));

    this.getNewTimeSeries('IFCB104');
  }
  
  getNewYear(option) {
    this.setState({ 
        loading: true, 
        rows: [], 
        targets: [] });  
    axios
        .get('/process/year/' + this.state.bin.timeseries + '/' + option + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
        .then((yearResponse) => {
            this.setState({ 
                bin: yearResponse.data.bin,
                barHeights: yearResponse.data.options.day_options[0],
                dayOptions: yearResponse.data.options.day_options[1],
                fileOptions: yearResponse.data.options.file_options,
                setOptions: yearResponse.data.options.set_options,
                set: 1,
             });
             axios
                .get('/process/targets/' + this.state.bin.timeseries + '/' + yearResponse.data.bin.file + '/1/' + this.state.sortCode + '/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
                        rows: yearResponse.data.options.rows,
                        history: [JSON.stringify(targetResponse.data)],
                        loading: false,
                     });
                });
        })
        .catch((err) => console.log(err));
  }

  handleBar(option) {
    document.getElementById('day_dropdown').classList.toggle('show-day');

    this.setState({
        loading: true,
        rows: [],
        targets: [],
    });
    axios
        .get('/process/day/' + this.state.bin.timeseries + '/' + this.state.bin.year + '/' + option + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
        .then((dayResponse) => {
            this.setState({ 
                bin: dayResponse.data.bin,
                fileOptions: dayResponse.data.options.file_options,
                setOptions: dayResponse.data.options.set_options,
                set: 1
            });
            axios
                .get('/process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/1/' + this.state.sortCode + '/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
                        rows: dayResponse.data.options.rows,
                        history: [JSON.stringify(targetResponse.data)],
                        loading: false,
                    });
                });
    })
        .catch((err) => console.log(err));
  }

  handleNewFile(option) {
    document.getElementById('file_dropdown').classList.toggle('show');
    document.getElementById('file_label').classList.toggle('hide');
    document.getElementById('file_bar').classList.toggle('accommodate-dropdown');
    
    const file = 'D' + this.state.bin.year + this.state.bin.day.slice(0,2) + this.state.bin.day.slice(3,5) + 
    option.slice(0,3) + option.slice(4,6) + option.slice(7,9);
    this.setState({
        loading: true,
        bin: {
            timeseries: this.state.bin.timeseries,
            ifcb: this.state.bin.ifcb,
            year: this.state.bin.year,
            day: this.state.bin.day,
            file: file,
            edited: false
        },
        set: 1,
    });
    axios
        .get('/process/file/' + this.state.bin.timeseries + '/' + file + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
        .then((res) => this.setState({ 
            bin: res.data.bin, 
            setOptions: res.data.options.set_options,
            rows: res.data.options.rows
        }))
        .catch((err) => console.log(err));
    axios
        .get('/process/targets/' + this.state.bin.timeseries + '/' + file + '/1/' + this.state.sortCode + '/')
        .then((targetResponse) => {
            this.setState({ 
                targets: targetResponse.data,
                history: [JSON.stringify(targetResponse.data)],
                loading: false,
             });
        });
  }

  handleNewSet(option) {
    this.setState({
        loading: true,
        set: option,
        rows: [],
    });
    axios
      .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + option + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
      .then((rowResponse) => {
          axios
            .get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + option + '/' + this.state.sortCode + '/')
            .then((res) => this.setState({ targets: res.data }))
            .catch((err) => console.log(err));
          this.setState({ rows: rowResponse.data.options.rows });
      })
      .catch((err) => console.log(err));
    this.setState({loading: false});
  }

  handleNewGroup(option) {
    const group = (this.state.group === 'Class') ? 'Size' : 'Class';
    const sort = (this.state.group === 'Class') ? 'L to S' : 'A to Z';
    const code = (this.state.group === 'Class') ? 'LS' : 'AZ';
    this.setState({
        loading: true,
        group: group,
        sort: sort,
        sortCode: code,
        rows: [],
        targets: [],
    });
    axios
      .get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + code + '/')
      .then((res) => {this.setState({ 
          targets: res.data,
        })})
      .catch((err) => console.log(err));
    axios
      .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + code + '/' + Math.round(this.state.scale * 10000) + '/')
      .then((res) => {this.setState({ 
          rows: res.data.options.rows,
        })})
      .catch((err) => console.log(err));
    this.setState({loading: false});
  }

  handleNewSort(option) {
    const sort = (this.state.group === 'Class') 
        ? (this.state.sort === 'A to Z') ? 'Z to A' : 'A to Z' 
        : (this.state.sort === 'L to S') ? 'S to L' : 'L to S';
    const code = (this.state.group === 'Class') 
        ? (this.state.sort === 'A to Z') ? 'ZA' : 'AZ' 
        : (this.state.sort === 'L to S') ? 'SL' : 'LS';
    this.setState({
        loading: true,
        sort: sort,
        sortCode: code,
        rows: [],
        targets: [],
    });
    axios
      .get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + code + '/')
      .then((res) => {this.setState({ 
          targets: res.data,
        })})
      .catch((err) => console.log(err));
    axios
      .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + code + '/' + Math.round(this.state.scale * 10000) + '/')
      .then((res) => {this.setState({ 
          rows: res.data.options.rows,
        })})
      .catch((err) => console.log(err));
    this.setState({loading: false});
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

      this.props.classifyAll(this.state.bin.timeseries, this.state.bin.file, this.state.set, this.state.sortCode, className, classAbbr);
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
    }
  }

  handleSaveClick() {
    this.props.save(this.state.targets, this.state.bin.timeseries, this.state.bin.file, this.state.set, this.state.sortCode);
  }

  handleSyncClick() {
    document.getElementById('sync').classList.toggle('syncing');
    this.setState({ rows: [] });
    this.props.sync(this.state.bin.timeseries, this.state.bin.year, this.state.bin.day, this.state.bin.file);
    axios
        .get('/process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + this.state.sortCode + '/')
        .then((targetResponse) => {
            this.setState({ 
                targets: targetResponse.data,
                history: this.state.history.concat([JSON.stringify(targetResponse.data)]),
             });
        });
    axios
        .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + this.state.sortCode + '/' + Math.round(this.state.scale * 10000) + '/')
        .then((res) => {this.setState({ 
            rows: res.data.options.rows,
            loading: false,
          })})
        .catch((err) => console.log(err));
    document.getElementById('sync').classList.toggle('syncing');
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

    this.props.classifyRow(targetRow, this.state.bin.timeseries, this.state.bin.file, this.state.sortCode, start, end);
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

  handleDownload() {
    // TODO: Change domain later
    document.getElementById('download-src').src = 'http://localhost:8000/mat/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/'
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
      .get('process/rows/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + this.state.sortCode + '/' + Math.round((newScale) * 10000) + '/')
      .then((rowResponse) => { this.setState({ 
          scale: newScale,
          rows: rowResponse.data.options.rows 
        }); });
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
    return <DayControl
        day={this.state.bin.day} 
        options={this.state.barHeights}
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

  renderSetControl() {
    return <SetControl
        set={this.state.set} 
        options={this.state.setOptions}
        onClick={(option) => this.handleNewSet(option)} 
    />;
  }

  renderSort() {
    return <Sort
        sort={this.state.sort}
        onClick={(option) => this.handleNewSort(option)}
    />;
  }

  renderGroup() {
    return <Group
        group={this.state.group}
        onClick={(option) => this.handleNewGroup(option)}
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
  
  renderPlankton(i) {
      return <Plankton 
              timeseries={this.state.bin.timeseries}
              file={this.state.bin.file}
              timestamp={this.state.bin.file}
              id={i}
              targetNum={this.state.targets[i].number}
              class_name={this.state.targets[i].class_name}
              class_abbr={this.state.targets[i].class_abbr}
              height={this.state.targets[i].height}
              width={this.state.targets[i].width}
              scale={this.state.scale}
              ifcb={this.state.bin.ifcb}
              editor={this.state.targets[i].editor}
              date={this.state.targets[i].date}
              onClick={(i) => this.handlePlanktonClick(i)}
              infoChange={(targetNum, bool, infoShowing) => this.disablePlanktonClick(targetNum, bool, infoShowing)}
              infoShowing={this.state.infoShowing}
          />;
  }

  renderRow(row, j) {
    return(
        <div className="row">
            <div className="row-select" 
                alt={'Select row'} onClick={() => this.handleRowClick(j)}>
            </div>
            <div className="image-row">
                {row.map((i) => this.renderPlankton(i))}
            </div>
        </div>
      );
  }

  renderClassMenu() {
    return <ClassMenu 
          classes={this.state.classes}
          onClick={(name) => this.handleMenuClick(name)}
          handleSelectAllClick={() => this.handleSelectAllClick()}
          handleUndoClick={() => this.handleUndoClick()}
          handleSaveClick={() => this.handleSaveClick()}
          scale={this.state.scale}
      />;
  }

  renderBar(gb, i) {
    return <Bar 
        onClick={(i) => this.handleBar(i)}
        number={i}
        height={gb}
        day={this.state.dayOptions[i]}
    />;
  }

  renderLoader() {
    return <img src={loader} alt="Loading targets..." width="80" loop="infinite"></img>
  }

  render() { 
    if(this.props.onNotebook) {
        return <Redirect to="/notebook/" />
    }

    return(
        <div className='body'>
        <Header />
        <div className='main'>
            <div className="page">

            <div class="content">
            <a id="download" href="../../assets/login-plankton.png" download></a>
            <div className="inner-content">
                <h1>Manual Classifications</h1>
                <div className="time-controls">
                    {this.renderTimeSeriesControl()}
                    {this.renderYearControl()}
                    {this.renderDayControl()}
                    {this.renderFileControl()}
                    {this.renderSetControl()}
                    {this.renderGroup()}
                    {this.renderSort()}
                    <div className="show-notes-button" id="show-notes-button" onClick={() => this.showNotes()}>Show Notes</div>
                    <div className="hide-info-button" id="hide-info-button" onClick={() => this.hideInfo()}>Hide Info</div>
                    {this.renderSync()}
                    {this.renderDownload()}
                    <div className="scale-down" onClick={() => this.handleScale('down')}></div>
                    <div className="scale-up" onClick={() => this.handleScale('up')}></div>
                </div>
                <div className="day-dropdown" id='day_dropdown'>
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
                    <div className="image-grid">
                        {
                        (this.state.loading || this.props.isSaving) ? this.renderLoader() :
                        this.state.rows.map((row, j) => this.renderRow(row, j))
                        }
                        <img src={toTop} alt="Back to Top" className="to-top" id="to-top" onClick={() => this.backToTop()}></img>
                    </div>
                </div>
            </div>
            </div>

            </div>
        </div>
        <script>{document.addEventListener("scroll", this.flipBackToTop)}</script>
    </div>
      );
  }
}

const mapStateToProps = state => ({
    isSaving: state.classify.isSaving,
    user: state.auth.user,
    onNotebook: state.menu.onNotebook
 });

export default connect(mapStateToProps, { classifyTarget, classifyRow, classifyAll, save, sync })(Annotations);