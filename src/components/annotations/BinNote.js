import React from "react";
import axios from "axios";
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";

import { addBinNote, sendNotesChange, receiveNotesChange, receiveReplyOpen } from "../../actions/classify";
import Note from "../features/Note";

export class BinNote extends React.Component {
    state = {
        entry: '',
        parents: [],
        notes: [],
    }
    
    static propTypes = {
        addBinNote: PropTypes.func,
        receiveNotesChange: PropTypes.func,
        noteChangeFlag: PropTypes.bool,
        receiveReplyOpen: PropTypes.func,
        replyChangeFlag: PropTypes.bool,
        user: PropTypes.object,
    };

    getNotes() {
        axios
            .get('/process/note/' + this.props.timeseries + '/' + this.props.file + '/' + this.props.image + '/')
            .then((res) => {
                this.setState({ notes: res.data });
            })
            .catch((err) => console.log(err));
    }

    renderNote(note, count) {
        if (note.parent !== null) {
            var reply = note;
            var iters = 0;
            while (reply.parent !== null) {
                var parentFunc = (element) => element.id === reply.parent;
                var reply = this.state.notes[this.state.notes.findIndex(parentFunc)];
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
                    ifcb={this.props.ifcb}
                    file={this.props.file}
                    type={this.props.type}
                    image={this.props.image}
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
        this.getNotes();
    }

    componentDidUpdate() {
        if(this.props.noteChangeFlag) {
            this.props.receiveNotesChange();
            this.getNotes();
        }
        if(this.props.replyChangeFlag) {
            this.props.receiveReplyOpen();
            this.getNotes();
        }
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user.username, this.state.entry, null, [], this.props.timeseries, this.props.ifcb, this.props.file, this.props.image);
        this.props.sendNotesChange();
        this.getNotes();
        const noteForm = document.getElementById("note-form");
        noteForm.reset()
    }
    
    render() {
        return(
            <div className={this.props.type + "-notes-content"}>
                {(this.props.type === 'bin') ? <div className="refresh" onClick={() => this.getNotes()}></div> : <div></div>}
                <div id="note-container">
                    {this.state.notes.map((note) => this.renderNote(note, 0))}
                </div>
                    <div className={this.props.type + "-note-form"}>
                        <form onSubmit={this.onSubmit} id="note-form">
                            <div className={this.props.type + "-new-note"}>
                            <input
                                type="textarea"
                                rows="10"
                                className={this.props.type + "-note-input"}
                                name={this.props.type + "-note-entry"}
                                id="note-entry"
                                onChange={this.onChange}
                                value={this.entry}
                            />
                            <button type="submit" className={this.props.type + "-note-submit"}></button>
                            </div>
                            {(this.state.notes === []) ? <p className="bin-note-label">Add a Note</p> : <div></div>}
                        </form>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    noteChangeFlag: state.classify.noteChangeFlag,
    replyChangeFlag: state.classify.replyChangeFlag,
    user: state.auth.user
 });

export default connect(mapStateToProps, {addBinNote, sendNotesChange, receiveNotesChange, receiveReplyOpen})(BinNote);