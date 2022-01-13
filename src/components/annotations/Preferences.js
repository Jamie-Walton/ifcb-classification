import React from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeScale, setLoadPreference, setScalePreference, setSortPreference } from "../../actions/preferences";
import '../../css/classify-styles.css';

class Preferences extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            recentChecked: true,
            initialRecentChecked: true,
            sortChecked: {AZ: true, ZA: false, LS: false, SL: false},
            initialSortChecked: {AZ: true, ZA: false, LS: false, SL: false},
            scaleEntry: 560,
            initialScaleEntry: 560,
        }
        this.onSortChange = this.onSortChange.bind(this);
        this.onScaleChange = this.onScaleChange.bind(this);
        this.onLoadChange = this.onLoadChange.bind(this);
    }

    static propTypes = {
        user: PropTypes.object,
        changeScale: PropTypes.func,
        setLoadPreference: PropTypes.func,
        setScalePreference: PropTypes.func,
        setSortPreference: PropTypes.func,
    }

    componentDidMount() {
        switch (this.props.sort) {
            case 'AZ':
                this.setState({ 
                    sortChecked: {AZ: true, ZA: false, LS: false, SL: false},
                    initialSortChecked: {AZ: true, ZA: false, LS: false, SL: false},
                });
                break
            case 'ZA':
                this.setState({ 
                    sortChecked: {AZ: false, ZA: true, LS: false, SL: false},
                    initialSortChecked: {AZ: false, ZA: true, LS: false, SL: false},
                });
                break
            case 'LS':
                this.setState({ 
                    sortChecked: {AZ: false, ZA: false, LS: true, SL: false},
                    initialSortChecked: {AZ: false, ZA: false, LS: true, SL: false},
                });
                break
            case 'SL':
                this.setState({ 
                    sortChecked: {AZ: false, ZA: false, LS: false, SL: true},
                    initialSortChecked: {AZ: false, ZA: false, LS: false, SL: true}, 
                });
        }
        this.setState({
            recentChecked: this.props.load==='recent',
            initialRecentChecked: this.props.load==='recent',
            scaleEntry: this.props.scale,
            initialScaleEntry: this.props.scale,
        });
    }
    
    close() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById('preferences').classList.toggle('show-pref');
        this.props.history.go(0);
    }

    onScaleChange(e) {
        this.setState({ scaleEntry: e.target.value });
        this.props.changeScale(e.target.value);
        this.props.setScalePreference(e.target.value, this.props.user.username);
    }

    onSortChange(e) {
        switch (e.target.value){
            case 'AZ':
                this.setState({ sortChecked: {AZ: true, ZA: false, LS: false, SL: false} });
                this.props.setSortPreference({AZ: true, ZA: false, LS: false, SL: false}, this.props.user.username);
                break
            case 'ZA':
                this.setState({ sortChecked: {AZ: false, ZA: true, LS: false, SL: false} });
                this.props.setSortPreference({AZ: false, ZA: true, LS: false, SL: false}, this.props.user.username);
                break
            case 'LS':
                this.setState({ sortChecked: {AZ: false, ZA: false, LS: true, SL: false} });
                this.props.setSortPreference({AZ: false, ZA: false, LS: true, SL: false}, this.props.user.username);
                break
            case 'SL':
                this.setState({ sortChecked: {AZ: false, ZA: false, LS: false, SL: true} });
                this.props.setSortPreference({AZ: false, ZA: false, LS: false, SL: true}, this.props.user.username);
        }
    } 
    
    onLoadChange(e) {
        switch (e.target.value){
            case 'recent':
                this.setState({ recentChecked: true });
                break
            case 'edited':
                this.setState({ recentChecked: false })
        }
        this.props.setLoadPreference(e.target.value, this.props.user.username);
    }
    
    render() {

        return(
            <div className="preferences-window" id="preferences">
                <div className="window-close" onClick={() => this.close()}></div>
                <h1 className="preferences-heading">Preferences</h1>
                <div className="preferences-container">
                    <div className="left-pref-col">
                        <div className="pref-category">
                            <p className="pref-subheading">On Website Load</p>
                            <div className="pref-form">
                                <div style={{'display':'flex'}}>
                                    <input 
                                        type="radio" 
                                        name="load" 
                                        id="recent" 
                                        className="pref-radio" 
                                        value="recent"
                                        checked={this.state.recentChecked}
                                        onChange={this.onLoadChange}
                                    />
                                    <label className="pref-radio-label" for="recent">Load most recent file</label>
                                </div>
                                <div style={{'display':'flex'}}>
                                    <input 
                                        type="radio" 
                                        name="load" 
                                        id="edited" 
                                        className="pref-radio" 
                                        value="edited"
                                        checked={!this.state.recentChecked}
                                        onChange={this.onLoadChange}
                                    />
                                    <label className="pref-radio-label" for="edited">Load last edited file</label>
                                </div>
                            </div>
                        </div>
                        <div className="pref-category" style={{'margin':'2vw 0 0 0'}}>
                            <p className="pref-subheading">Image Scale</p>
                            <div className="pref-form">
                                <input 
                                    type="number" 
                                    name="scale" 
                                    id="scale" 
                                    value={this.state.scaleEntry}
                                    className="target-jump-container scale"
                                    step='0.01'
                                    onChange={this.onScaleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="right-pref-col">
                        <div className="pref-category">
                            <p className="pref-subheading">Sort Targets</p>
                            <div className="pref-form">
                                <input 
                                    type="radio" 
                                    name="sort" 
                                    id="AZ" 
                                    className="pref-radio" 
                                    value="AZ"
                                    checked={this.state.sortChecked.AZ}
                                    onChange={this.onSortChange}
                                />
                                <label className="pref-radio-label" for="recent">By class, from A to Z</label><br></br>
                                <input 
                                    type="radio" 
                                    name="sort" 
                                    id="ZA" 
                                    className="pref-radio" 
                                    value="ZA"
                                    checked={this.state.sortChecked.ZA}
                                    onChange={this.onSortChange} 
                                />
                                <label className="pref-radio-label" for="edited">By class, from Z to A</label><br></br>
                                <input 
                                    type="radio" 
                                    name="sort" 
                                    id="LS" 
                                    className="pref-radio" 
                                    value="LS"
                                    checked={this.state.sortChecked.LS}
                                    onChange={this.onSortChange}
                                />
                                <label className="pref-radio-label" for="edited">By size, from largest to smallest</label><br></br>
                                <input 
                                    type="radio" 
                                    name="sort" 
                                    id="SL" 
                                    className="pref-radio" 
                                    value="SL"
                                    checked={this.state.sortChecked.SL}
                                    onChange={this.onSortChange}
                                />
                                <label className="pref-radio-label" for="edited">By size, from smallest to largest</label><br></br>
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
});

export default connect(mapStateToProps, {changeScale, setLoadPreference, setScalePreference, setSortPreference})(Preferences)