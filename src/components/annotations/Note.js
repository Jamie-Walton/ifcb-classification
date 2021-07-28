import React from "react";
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";

import { getBinNotes, addBinNote, deleteBinNote } from "../../actions/classify";

class Note extends React.Component {
    state = {
        entry: '',
    }

    static propTypes = {
        getBinNotes: PropTypes.func,
        addBinNote: PropTypes.func,
        deleteBinNote: PropTypes.func,
        notes: PropTypes.array,
    };
    
    reply(id) {
        document.getElementById('reply-form' + id).classList.toggle('show');
    }

    delete(id) {
        this.props.deleteBinNote(id, this.props.timeseries, this.props.file);
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user, this.state.entry, this.props.note.id, [], this.props.timeseries, this.props.file);
        this.props.getBinNotes(this.props.timeseries, this.props.file);
        const replyForm = document.getElementById("note-form");
        replyForm.reset()
        document.getElementById('reply-form' + this.props.note.id).classList.toggle('show');
    }
    
    render() {
        const { id, author, date, entry, parent, replies, timeseries, file } = this.props.note;
        return (
            <div id={id}>
                <div className="note-header">
                    <p className="note-author">{author}</p>
                    <p className="note-date">{date}</p>
                </div>
                <p className="note-entry">{entry}</p>
                <button className="reply-button" onClick={() => this.reply(id)}>Reply</button>
                {(author === this.props.user) ? 
                    <button className="reply-button" onClick={() => this.delete(id)}>Delete</button> :
                    <div></div>}
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

const mapStateToProps = state => ({
    notes: state.classify.notes,
 });

export default connect(mapStateToProps, {getBinNotes, addBinNote, deleteBinNote})(Note);