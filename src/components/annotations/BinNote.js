import React from "react";
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";

import { getBinNotes, addBinNote } from "../../actions/classify";
import Note from "./Note";

export class BinNote extends React.Component {
    state = {
        entry: '',
        parents: [],
    }
    
    static propTypes = {
        getBinNotes: PropTypes.func.isRequired,
        addBinNote: PropTypes.func,
        notes: PropTypes.array,
        user: PropTypes.object,
    };

    renderNote(note, count) {
        if (note.parent !== null) {
            var reply = note;
            var iters = 0;
            while (reply.parent !== null) {
                var parentFunc = (element) => element.id === reply.parent;
                var reply = this.props.notes[this.props.notes.findIndex(parentFunc)];
                iters = iters + 1;
            }
            if (count!==iters) {
                return;
            }
        }
        return(
            <div>
                <Note
                    note={note}
                    user={this.props.user.username}
                    timeseries={this.props.timeseries}
                    file={this.props.file}
                />
                <div className="reply" style={{margin: "0 0 0 " + String((count+1)) + "vw"}}>
                {(note.replies.length !== 0) ?
                    note.replies.map((reply) => this.renderNote(reply, count+1)) :
                    <div></div>
                }
                </div>
            </div>
        
        );
    }

    componentDidMount() {
        this.props.getBinNotes(this.props.timeseries, this.props.file);
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user.username, this.state.entry, null, [], this.props.timeseries, this.props.file);
        this.props.getBinNotes(this.props.timeseries, this.props.file);
        const noteForm = document.getElementById("note-form");
        noteForm.reset()
    }
    
    render() {
        return(
            <div className="notes-content">
                <div id="note-container">
                    {this.props.notes.map((note) => this.renderNote(note, 0))}
                </div>
                    <div className="note-form">
                        <form onSubmit={this.onSubmit} id="note-form">
                            <div className="new-note">
                            <input
                                type="textarea"
                                rows="10"
                                className="note-input"
                                name="note-entry"
                                id="note-entry"
                                onChange={this.onChange}
                                value={this.entry}
                            />
                            <button type="submit" className="bin-note-submit"></button>
                            </div>
                            {(this.props.notes === []) ? <p className="bin-note-label">Add a Note</p> : <div></div>}
                        </form>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    notes: state.classify.notes,
    user: state.auth.user
 });

export default connect(mapStateToProps, {getBinNotes, addBinNote})(BinNote);