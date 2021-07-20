import React from "react";
import axios from "axios";
import Draggable from 'react-draggable';

import loader from "./loader.GIF";
import toTop from "./icons/to-top.png";
import dropdown from "./icons/dropdown.png";
/*
import calendar from "./icons/calendar.png";
import dropup from "./icons/dropup.png";
import selectGray from "./icons/select-gray.png";
import selectWhite from "./icons/select-white.png";
*/

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
                <div className="time" id='timeseries_bar'>
                    <p className="time-selection">{this.props.timeseries}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select time series'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='timeseries_dropdown'>
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
    render() {
      return(
      <div className="bar" onClick={() => this.props.onClick(this.props.number)} style={{height: String(this.props.height*8) + 'vw'}}>{this.props.number}</div>
      );}
  }

class DayControl extends React.Component {
    handleDropdown() {
        document.getElementById('day_dropdown').classList.toggle('show-day');
    }
    
    render() {
        // add axis
        return(
            <div>
                <div className="time" id='day_bar'>
                    <p className="time-selection">{this.props.day}</p>
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

class Sort extends React.Component {
    
    render() {
        return(
            <div>
                <div className="set" id="sort_bar" onClick={() => this.props.onClick(this.props.sort)}>
                <p className="time-selection">{this.props.sort}</p>
                </div>
                <p className="time-label" id="set_label">Sort</p>
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
          style={{height: String(Number(this.props.width)*this.props.scale)+'vw'}}></img>
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
            width={this.props.width}
            scale={this.props.scale}
        />
      );
  }

  render() {
      return(
          <button className="plankton-button" onClick={() => this.props.onClick(this.props.targetNum)}>
              <div className="plankton">
                  {this.renderImage()}
                  <div className='id' id={this.props.targetNum}>
                      <p className='id-text' id={this.props.targetNum + '-text'}>{this.props.class_abbr}</p>
                  </div>
              </div>
          </button>
      );
  }
}

class Micrometer extends React.Component {
    // Double check that scale is correct?
    render() {
        return(
            <Draggable>
                <div className="drag-box">
                    <div className="micrometer-block"
                    style={{width: '1.904vw'}}></div>
                    <p className="micrometer-text">10µm</p>
                </div>
            </Draggable>
        );
    }
}

class ClassMenu extends React.Component {
  render() {
      const options = this.props.classes.sort().map((x) => 
      <li key={x}><button id={x} onClick={() => this.props.onClick(x)}>{x}</button></li>);
      return(
      <div className="sidebar">
      <div className="class-menu">
          <div className="control-box">
            <div className="annotation-control" onClick={() =>  this.props.handleSelectAllClick()}>
                <p className="control-text">Select All</p>
            </div>
            <div className="annotation-control" onClick={() =>  this.props.handleSelectAllClick()}>
                <p className="control-text">Undo</p>
            </div>
          </div>
          <ul>{options}</ul>
      </div>
      <Micrometer/>
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
          bin: {timeseries:'', ifcb:'', year:'', day:'', file:''},
          timeSeriesOptions: [],
          yearOptions: [],
          dayOptions: [],
          fileOptions: [],
          setOptions: [],
          targets: [],
          scale: 0.056,
          set: 1,
          sort: 'A to Z'
      }
  }

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
        .get('/process/timeseries/' + option + '/')
        .then((binResponse) => {
            this.setState({ 
                bin: binResponse.data.bin,
                yearOptions: binResponse.data.options.year_options.reverse(),
                dayOptions: binResponse.data.options.day_options.reverse(),
                fileOptions: binResponse.data.options.file_options,
                setOptions: binResponse.data.options.set_options,
                set: 1
            });
            console.log(this.state.setOptions)
            axios
                .get('/process/targets/' + option + '/' + binResponse.data.bin.file + '/1/1/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
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
    this.setState({ loading: true });  
    axios
        .get('/process/year/' + this.state.bin.timeseries + '/' + option + '/')
        .then((yearResponse) => {
            this.setState({ 
                bin: yearResponse.data.bin,
                dayOptions: yearResponse.data.options.day_options.reverse(),
                fileOptions: yearResponse.data.options.file_options,
                setOptions: yearResponse.data.options.set_options,
                set: 1,
                loading: false,
             })
        })
        .catch((err) => console.log(err));
  }

  handleBar(option) {
    document.getElementById('day_dropdown').classList.toggle('show-day');

    this.setState({
        loading: true,
    });
    axios
        .get('/process/day/' + this.state.bin.timeseries + '/' + this.state.bin.year + '/' + option + '/')
        .then((dayResponse) => {
            this.setState({ 
                bin: dayResponse.data.bin,
                fileOptions: dayResponse.data.options.file_options,
                setOptions: dayResponse.data.options.set_options,
                set: 1
            });
            axios
                .get('/process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/1/1/')
                .then((targetResponse) => {
                    this.setState({ 
                        targets: targetResponse.data,
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
        .get('/process/file/' + this.state.bin.timeseries + '/' + file + '/')
        .then((res) => this.setState({ 
            bin: res.data.bin, 
            setOptions: res.data.options.set_options 
        }))
        .catch((err) => console.log(err));
    axios
        .get('/process/targets/' + this.state.bin.timeseries + '/' + file + '/1/1/')
        .then((targetResponse) => {
            this.setState({ 
                targets: targetResponse.data,
                loading: false,
             });
        });
  }

  handleNewSet(option) {
    this.setState({
        loading: true,
        set: option,
        targets: [],
    });
    axios
      .get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + option + '/1/1/')
      .then((res) => {this.setState({ 
          targets: res.data,
        })})
      .catch((err) => console.log(err));
    this.setState({loading: false});
  }

  handleNewSort(option) {
    const sort = (this.state.sort === 'A to Z') ? 'Z to A' : 'A to Z';
    const num = (this.state.sort === 'A to Z') ? 2 : 1;
    this.setState({
        loading: true,
        sort: sort,
        targets: [],
    });
    axios
      .get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + this.state.set + '/' + num + '/')
      .then((res) => {this.setState({ 
          targets: res.data,
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

      this.setState({ 
          classPicker: name,
          classMark: this.state.classAbbrs[this.state.classes.findIndex(name)]
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

  /* Fix this entire function later (will need updates to targets and row calls)
  handleRowClick(row) {
      for (const sample of this.state.rows[row]) {
          this.state.targets[sample] = this.state.classPicker;
          const container = document.getElementById(sample);
          const text = document.getElementById(sample+'_text');
          container.style.backgroundColor = '#16609F';
          text.style.color = '#FFFFFF';
      }
      this.setState({targets: this.state.targets});
  }
  */

  backToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  handleSelectAllClick() {
      var targets = this.state.targets;
      for (let i = 0; i < targets.length; i++) {
          targets[i].class_name = this.state.classPicker;
          targets[i].class_abbr = this.state.classAbbrs[this.state.classes.findIndex(this.state.classPicker)];
          const container = document.getElementById(targets[i].number);
          const text = document.getElementById(targets[i].number+'-text');
          container.style.backgroundColor = '#16609F';
          text.style.color = '#FFFFFF';
      }
      this.setState({ targets: targets });
  }

  handlePlanktonClick(i) {
    var targets = this.state.targets;
    const k = targets.findIndex(target => target.number === i);
    targets[k].class_name = this.state.classPicker;
    targets[k].class_abbr = this.state.classAbbrs[this.state.classes.findIndex(this.state.classPicker)]; // use class abbr
    this.setState({ targets: targets });
    const container = document.getElementById(targets[k].number);
    const text = document.getElementById(targets[k].number+'-text');
    container.style.backgroundColor = '#16609F';
    text.style.color = '#FFFFFF';
    axios
        .put('/process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/1/', targets[k])
        .then(console.log('clik!'))
        .catch((err) => console.log(err));
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
        options={this.state.dayOptions}
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
  
  renderPlankton(i) {
      return <Plankton 
              timeseries={this.state.bin.timeseries}
              timestamp={this.state.bin.file}
              id={i}
              targetNum={this.state.targets[i].number}
              class_name={this.state.targets[i].class_name}
              class_abbr={this.state.targets[i].class_abbr}
              width={this.state.targets[i].width}
              onClick={(i) => this.handlePlanktonClick(i)}
              scale={this.state.scale}
              ifcb={this.state.bin.ifcb}
          />;
  }

  renderClassMenu() {
    return <ClassMenu 
          classes={this.state.classes}
          onClick={(name) => this.handleMenuClick(name)}
          handleSelectAllClick={() => this.handleSelectAllClick()}
          handleUndoClick={() => this.handleUndoClick()}
      />;
  }

  renderMicrometer() {
      return <Micrometer
      scale={this.state.scale}/>
  }

  renderBar(gb, i) {
    return <Bar 
        onClick={(i) => this.handleBar(i)}
        number={i}
        height={gb}
    />;
  }

  renderLoader() {
    return <img src={loader} alt="Loading targets..." width="80" loop="infinite"></img>
  }

  render() {  
    const targets = this.state.targets;
    console.log(targets);
    return(
      <div>
        <h1>Manual Classifications</h1>
        <div className="time-controls">
            {this.renderTimeSeriesControl()}
            {this.renderYearControl()}
            {this.renderDayControl()}
            {this.renderFileControl()}
            {this.renderSetControl()}
            {this.renderSort()}
        </div>
        <div className="day-dropdown" id='day_dropdown'>
            {this.state.dayOptions.map((gb, i) => this.renderBar(gb, i))}
        </div>
        <div className="annotations">
            {this.renderClassMenu()}
            <div>
                <div className="image-grid">
                    {
                    this.state.loading ? this.renderLoader() :
                    targets.map((target, i) => this.renderPlankton(i))
                    }
                    <img src={toTop} alt="Back to Top" className="to-top" onClick={() => this.backToTop()}></img>
                </div>
            </div>
        </div>
      </div>
      );
  }
}

export default Annotations;