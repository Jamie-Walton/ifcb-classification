import React from "react";
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";

import { addBinNote, deleteBinNote, flagBinNote, sendNotesChange, sendReplyOpen } from "../../actions/classify";

class Note extends React.Component {
    state = {
        entry: '',
    }

    static propTypes = {
        addBinNote: PropTypes.func,
        deleteBinNote: PropTypes.func,
        sendNotesChange: PropTypes.func,
        sendReplyOpenChange: PropTypes.func,
        notes: PropTypes.array,
    };
    
    reply(id) {
        document.getElementById('reply-form' + id).classList.toggle('show');
        this.props.sendReplyOpen();
    }

    delete(id) {
        this.props.deleteBinNote(id);
        this.props.sendNotesChange();
    }

    flag(id) {
        this.props.flagBinNote(id);
        this.props.sendNotesChange();
    }

    getFlagButton(isFlagged) {
        if (isFlagged) {
            return 'Unflag'
        } else {
            return 'Flag'
        }
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user, this.state.entry, this.props.note.id, [], this.props.timeseries, this.props.ifcb, this.props.file, this.props.image);
        this.props.sendNotesChange();
        const replyForm = document.getElementById("note-form");
        replyForm.reset()
        document.getElementById('reply-form' + this.props.note.id).classList.toggle('show');
    }
    
    render() {
        const { id, author, date, entry, parent, replies, timeseries, file, image, flag } = this.props.note;
        return (
            <div className={this.props.type + "-note"} id={id}>
                <div className={this.props.type + "-note-header"}>
                    <p className="note-author">{author}</p>
                    <p className="note-date">{date.slice(0,10)}</p>
                    {(flag) ? <div className="flag-small"></div> : <div></div>}
                </div>
                <p className={this.props.type + "-note-entry"}>{entry}</p>
                {(this.props.type === 'bin') ? 
                    <button className="reply-button" onClick={() => this.reply(id)}>Reply</button> :
                    <div></div>}
                {(author === this.props.user) ? 
                    <button className="reply-button" onClick={() => this.delete(id)}>Delete</button> :
                    <div></div>}
                {(author === this.props.user) ? 
                    <button className="reply-button" onClick={() => this.flag(id)}>{this.getFlagButton(flag)}</button> :
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
                            <button type="submit" className={this.props.type + "-note-submit"}></button>
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

export default connect(mapStateToProps, {addBinNote, deleteBinNote, flagBinNote, sendNotesChange, sendReplyOpen})(Note);