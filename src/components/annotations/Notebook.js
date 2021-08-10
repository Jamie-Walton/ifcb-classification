import React, { Component } from 'react';
import { Grid, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import { filterNotebook, receiveNotesChange } from "../../actions/classify";
import Header from '../layout/Header';
import Note from "./Note";
import '../../css/notebook-styles.css';
import loader from "./loader.GIF";

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
                    {this.props.options.map((option) => (this.renderOption(option[this.props.filter])))}
                </div>
            </div>
        );
    }
}

class Notebook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [{
                "id": "",
                "author": "",
                "date": "",
                "entry": "",
                "parent": null,
                "replies": [],
                "timeseries": "",
                "ifcb": "",
                "file": "",
                "image": ""
            }],
            flags: [],
            classes: [],
            searchTerms: "",
            authors: [{author: ''}],
            bins: [{bin: ''}],
            timeseries: [{timeseries: ''}],
            ifcbs: [{ifcb: ''}],
            types: [
                {type: 'Bin Note'}, 
                {type: 'Target Note'}
            ],
            appliedFilters: [],
        }
    }

    static propTypes = {
        user: PropTypes.object,
        onClassify: PropTypes.bool,
        notes: PropTypes.array,
        filterNotebook: PropTypes.func,
        receiveNotesChange: PropTypes.func,
        noteChangeFlag: PropTypes.bool
    }

    getNotebook(filters) {
        if (filters.length === 0) {
            axios
                .get('/notebook/')
                .then((res) => {
                    this.setState({ 
                        notes: res.data,
                        flags: Array(res.data.length).fill(''),
                    });
                })
                .catch((err) => console.log(err));
        } else {
            this.props.filterNotebook(filters);
        }
    }

    componentDidMount() {
        this.getNotebook([]);
        axios
            .get('/notebook/filters/')
            .then((res) => {
                this.setState({ 
                    authors: res.data.options.authors,
                    bins: res.data.options.bins,
                    timeseries: res.data.options.timeseries,
                    ifcbs: res.data.options.ifcbs,
                });
            })
            .catch((err) => console.log(err));
    }

    componentDidUpdate() {
        if (this.props.noteChangeFlag) {
            this.getNotebook(this.state.appliedFilters);
            this.props.receiveNotesChange();
        }
    }

    handleFilterClick() {
        document.getElementById('filter_dropdown').classList.toggle('show');
    }

    onChange = e => this.setState({ searchTerms: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        const newAppliedFilters = this.state.appliedFilters.concat([ {category: "search", choice: this.state.searchTerms} ]);
        this.setState({ appliedFilters: newAppliedFilters })
        this.props.filterNotebook(newAppliedFilters);
    }

    handleFilterChoiceClick(option) {
        document.getElementById(option + '-plus').classList.toggle('rotate-plus');
        document.getElementById(option + '-dropdown').classList.toggle('show');
    }

    handleApplyFilter(category, choice) {
        const duplicates = this.state.appliedFilters.filter(entry => (entry['category'] === category) && (entry['choice'] === choice))
        if (duplicates.length === 0) {
            const newAppliedFilters = this.state.appliedFilters.concat([ {category: category, choice: choice} ])
            this.getNotebook(newAppliedFilters);
            this.setState({ appliedFilters: newAppliedFilters });
        }
    }

    handleRemoveFilter(filter) {
        const applied = this.state.appliedFilters;
        const index = applied.findIndex(entry => entry === filter);
        const newAppliedFilters = applied.slice(0, index).concat(applied.slice(index+1,applied.length));
        this.setState({ appliedFilters: newAppliedFilters });
        this.getNotebook(newAppliedFilters);
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
        return <Redirect to="/" />
    }

    const cache = new CellMeasurerCache({
        defaultHeight: 200,
        minHeight: 200,
        fixedWidth: true
      });

    // Grid data as an array of arrays
    const notes = this.state.notes;
    const username = this.props.user.username;
    const flags = this.state.flags
    var skips = 0;
    var rendered = [];

    function renderReply(note, count) {
        return(
            <div className="reply" style={{margin: "0 0 0 " + String(count) + "vw"}}>
                <Note
                    note={note}
                    user={username}
                    timeseries={note.timeseries}
                    ifcb={note.ifcb}
                    file={note.file}
                    type='bin'
                    image={note.image}
                />
                <div className="reply" style={{margin: "0 0 0 " + String((count+1)) + "vw"}}>
                {(note.replies.length !== 0) ?
                    note.replies.map((reply) => renderReply(reply, count+1)) :
                    <div></div>
                }
                </div>
            </div>
        );
    }
    
    function cellRenderer({columnIndex, key, parent, rowIndex, style}) {
        if ((rowIndex === 0) && (columnIndex === 0)) {
            skips = 0;
            rendered = [];
        }
        var noteIndex = (3*rowIndex) + columnIndex + skips;
        if ((noteIndex) < notes.length) {
            if ((notes[noteIndex].parent !== null) || (rendered.includes(noteIndex))) {
                while (notes[noteIndex].parent !== null || (rendered.includes(noteIndex))) {
                    noteIndex = noteIndex + 1;
                    skips = skips + 1;
                    if (noteIndex >= notes.length) {
                        return
                    }
                }
            }
            rendered = rendered.concat([noteIndex]);
            const note = notes[noteIndex];
            const count = 0;
            var url = '';
            if (note.image !== 'None') {
                url = 'http://128.114.25.154:8888/' + note.timeseries + '/' + note.file + '_' + note.ifcb + '_' + note.image + '.jpg';
            }
            const flatNote = JSON.stringify(note);
            const includesFlag = flatNote.includes('true');
            return (
                <CellMeasurer
                    cache={cache}
                    columnIndex={columnIndex}
                    key={key}
                    parent={parent}
                    rowIndex={rowIndex}
                >
                {({ measure, registerChild }) => (
                    <div ref={registerChild} key={key} style={style}>
                        <div className="notebook-note" onLoad={measure}>
                            {(url === '') ? <div></div> : 
                            <img src={url} className="notebook-image" alt={'Target ' + note.image}></img>}
                            {(includesFlag) ? <div className="flag"></div> : <div></div>}
                            <div className="notebook-entry"> 
                                <div>
                                    {(note.image === 'None') ? 
                                    <div className="notebook-entry">
                                        <p className="notebook-entry-heading">{note.timeseries + ', ' + note.file}</p>
                                    </div> :
                                    <div className="notebook-entry">
                                        <p className="notebook-entry-heading">{'Target ' + note.image}</p>
                                        <p className="notebook-entry-subtitle">{note.timeseries + ', ' + note.file}</p>
                                    </div>
                                    }
                                    <Note
                                        note={note}
                                        user={username}
                                        timeseries={note.timeseries}
                                        ifcb={note.ifcb}
                                        file={note.file}
                                        type='bin'
                                        image={note.image}
                                    />
                                    {(note.replies.length !== 0) ?
                                        note.replies.map((reply) => renderReply(reply, count+1)) :
                                        <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </CellMeasurer>
            );
            } else {return}
      }

    return (
            <div>
                <Header />
                <div className='main'>
                    <div className="page">
                        <div>
                            <div className="notebook-heading">
                                <h1 className="notebook-header">Notebook</h1>
                                <div className="filter-button" onClick={() => this.handleFilterClick()}>Filter</div>
                            </div>
                            <div className="day-dropdown withmargin" id='filter_dropdown'>
                                <form className="search-form" id="search-form" onSubmit={this.onSubmit}>
                                    <div className="search-bar">
                                        <div className="search-icon"></div>
                                        <input
                                            type="text"
                                            className="search-input"
                                            name="searchTerms"
                                            onChange={this.onChange}
                                            value={this.state.searchTerms}
                                        />
                                    </div>
                                    <div className="applied-filters">{this.state.appliedFilters.map((filter) => (this.renderAppliedFilters(filter)))}</div>
                                    <div className="filter-buttons">
                                        {this.renderFilterChoice('author', this.state.authors)}
                                        {this.renderFilterChoice('file', this.state.bins)}
                                        {this.renderFilterChoice('timeseries', this.state.timeseries)}
                                        {this.renderFilterChoice('ifcb', this.state.ifcbs)}
                                    </div>
                                </form>
                            </div>
                            <div className="notebook-content">
                                <AutoSizer>
                                {({ width, height }) => (
                                    <Grid
                                        cellRenderer={cellRenderer}
                                        columnCount={3}
                                        columnWidth={document.documentElement.clientWidth*0.29}
                                        rowHeight={cache.rowHeight}
                                        deferredMeasurementCache={cache}
                                        cellRenderer={cellRenderer}
                                        rowCount={Math.ceil(this.state.notes.length/3)}
                                        height={height}
                                        width={width}
                                        notes={this.props.notes}
                                    />
                                )}
                                </AutoSizer>
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
    noteChangeFlag: state.classify.noteChangeFlag
 });

export default connect(mapStateToProps, {filterNotebook, receiveNotesChange})(Notebook);
