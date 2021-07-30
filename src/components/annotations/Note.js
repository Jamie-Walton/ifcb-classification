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
        this.props.deleteBinNote(id, this.props.timeseries, this.props.file, this.props.image);
    }

    onChange = e => this.setState({ entry: e.target.value })

    onSubmit = e => {
        e.preventDefault();
        this.props.addBinNote(this.props.user, this.state.entry, this.props.note.id, [], this.props.timeseries, this.props.ifcb, this.props.file, this.props.image);
        this.props.getBinNotes(this.props.timeseries, this.props.file, this.props.image);
        const replyForm = document.getElementById("note-form");
        replyForm.reset()
        document.getElementById('reply-form' + this.props.note.id).classList.toggle('show');
    }
    
    render() {
        const { id, author, date, entry, parent, replies, timeseries, file, image } = this.props.note;
        return (
            <div className={this.props.type + "-note"} id={id}>
                <div className={this.props.type + "-note-header"}>
                    <p className="note-author">{author}</p>
                    <p className="note-date">{date.slice(0,10)}</p>
                </div>
                <p className={this.props.type + "-note-entry"}>{entry}</p>
                {(this.props.type === 'bin') ? 
                    <button className="reply-button" onClick={() => this.reply(id)}>Reply</button> :
                    <div></div>}
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

export default connect(mapStateToProps, {getBinNotes, addBinNote, deleteBinNote})(Note);