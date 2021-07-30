import React from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import Note from "./Note";
import '../../css/notebook-styles.css';
import loader from "./loader.GIF";

export class Notebook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            prev: 0,
            next: 150,
            hasMore: true,
            setHasMore: false,
            current: [],
        }
    }

    static propTypes = {
        user: PropTypes.object,
    };

    componentDidMount() {
        axios
            .get('/notebook/')
            .then((res) => {
                this.setState({ 
                    notes: res.data,
                    current: res.data.slice(this.state.prev, this.state.next)
                });
            })
            .catch((err) => console.log(err));
    }

    getMoreData = () => {
        if (this.state.current.length === this.state.notes.length) {
          this.setState({ hasMore: false, setHasMore: false });
          return
        }
        setTimeout(() => {
            this.setState({ 
                current: this.state.current.concat(this.state.notes.slice(this.state.prev + 150, this.state.next + 150)),
                prev: this.state.prev + 150,
                next: this.state.next + 150,
            });
        })
    }

    renderNote(note) {
        var url = '';
        if (note.image !== 'None') {
            url = 'http://128.114.25.154:8888/' + note.timeseries + '/' + note.file + '_' + note.ifcb + '_' + note.image + '.jpg';
        }
        return(
            <div className="notebook-note">
                {(url === '') ? <div></div> : 
                <img src={url} className="notebook-image" alt={this.props.classification}></img>}
                <div className="notebook-entry">
                    {(note.parent === null) ? 
                    <Note
                        note={note}
                        user={this.props.user.username}
                        timeseries={note.timeseries}
                        ifcb={note.ifcb}
                        file={note.file}
                        type='bin'
                        image={note.image}
                    /> : <div></div>
                    }
                </div>
            </div>
        );
    }
    
    render() {
        return(
            <div>
                <Header />
                <div className='main'>
                    <div className="page">
                        <div>
                            <div className="notebook-heading">
                                <h1 className="notebook-header">Notebook</h1>
                                <div className="filter-button">Filter</div>
                            </div>
                            <InfiniteScroll
                                className="infinite-scroll"
                                dataLength={this.state.current.length}
                                next={() => this.getMoreData()}
                                hasMore={this.state.hasMore}
                                loader={<img className="notebook-loader" src={loader} alt="Loading"></img>}
                                >
                            <div className="notebook-content">
                                {this.state.current.map((note) => (this.renderNote(note)))}
                            </div>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
 });

export default connect(mapStateToProps)(Notebook);