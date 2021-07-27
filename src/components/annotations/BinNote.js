import React from "react";
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";

import { getBinNotes, addBinNote } from "../../actions/classify";

class Note extends React.Component {
    state = {
        entry: '',
    }

    static propTypes = {
        getBinNotes: PropTypes.func.isRequired,
        addBinNote: PropTypes.func,
        notes: PropTypes.array,
    };
    
    reply(id) {
        document.getElementById('reply-form' + id).classList.toggle('show');
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user, this.state.entry, this.props.note.id, [], this.props.timeseries, this.props.file);
        this.props.getBinNotes(this.props.timeseries, this.props.file);
        const replyForm = document.getElementById("reply-form" + this.props.note.id);
        replyForm.reset()
    }
    
    render() {
        const { id, author, date, entry, parent, replies, timeseries, file } = this.props.note;
        console.log('Rendering note ' + id);
        return (
            <div className={this.props.noteType} style={{margin: this.props.margin}} id={id}>
                <div className="note-header">
                    <p className="note-author">{author}</p>
                    <p className="note-date">{date}</p>
                </div>
                <p className="note-entry">{entry}</p>
                <button className="reply-button" onClick={() => this.reply(id)}>Reply</button>
                {(author === this.props.user) ? <button className="reply-button">Delete</button> : <div></div>}
                <div className="reply-form" id={"reply-form" + id}>
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
                        </form>
                    </div>
            </div>
        );
    }
}

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
        console.log('Count: ' + count + ', Note: ' + note.id);
        var noteType;
        if (note.parent === null) {
            noteType = "top-level";
        } else {
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
            noteType = "reply"
        }
        if (note.replies.length !== 0) {
            note.replies.map((reply) => this.renderNote(reply, count+1))
        }
        return(
            <div>
                {console.log('Reply ' + note.id + ' can be rendered as a ' + noteType)}
                {console.log(note)}
                <Note 
                    note={note}
                    noteType={noteType}
                    user={this.props.user.username}
                    timeseries={this.props.timeseries}
                    file={this.props.file}
                    margin={String(count*1.5) + "vw"}
                />
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
            <div className="note-container">
                <div id="note-container">
                    {console.log(this.props.notes)}
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