import React from "react";
import akashiwo from "../../assets/akashiwo-character.png";
import "../../css/classify-styles.css";

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toc: [
                {id: 0, title: "Welcome!", text: "Let's get started classifying phytoplankton.", buttons: null},
                {id: 1, title: "Start categorizing", text: "Your first task is to find the images that the AutoClassification algorithm misidentified. Use the left menu to select a species, then click on all the phytoplankton that DON’T belong.", buttons: null},
                {id: 2, title: "What if you're unsure?", text: "If you’re torn on whether an image belongs or not, leave it in its original category (don’t click). But don’t worry too much— our scientists always check over your data before using it, so it’s okay if you sometimes make a mistake.", buttons: null},
                {id: 3, title: "Keep going!", text: "When you finish with all the plankton on the screen, click on another species from the sample and categorize. When you’ve gone through all the species, hit the finish button so we know the file is complete.", buttons: null},
                {id: 4, title: "Switch modes", text: "If you’re up for a challenge, switch over to identify mode using the toggle bar above the images.", buttons: null},
                {id: 5, title: "Start identifying", text: "Now you’ll see all the images that you marked as misidentified or that the AutoClassification algorithm couldn’t figure out. Select a classification in the left menu, then click on all the images that match it.", buttons: null},
                {id: 6, title: "Try another method", text: "You can also work the other way: choose an image, then hover over the classifications in the left menu until you find the one that matches it. Select the classification, then click on the image to classify it.", buttons: null},
                {id: 7, title: "What if you're unsure?", text: "Again, if you’re not sure where an image belongs, just leave it unclassified. If you’re finding that identify mode is too challenging, you can always stick to just categorizing.", buttons: null},
                {id: 8, title: "Finish strong", text: "When you’re done identifying, click the finish the button. Load up a new sample by selecting a day and an IFCB location in the sample menu and keep classifying!", buttons: null},
                {id: 9, title: 'Congrats!', text: "You’re ready to dive in. You can always revisit this tutorial if you need any help.", buttons: null},
            ],
            tracks: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            ],
            slide: 0,
            track: 0,
        }
    }

    back() {
        const i = this.state.tracks[this.state.track].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[this.state.track][i-1];
        this.setState({ slide: slide });
    }

    next() {
        const i = this.state.tracks[this.state.track].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[this.state.track][i+1];
        this.setState({ slide: slide });
    }

    handleButton(track) {
        const prevTrack = this.state.track;
        this.setState({ track: track });
        const i = this.state.tracks[prevTrack].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[track][i+1];
        this.setState({ slide: slide });
    }

    render() {

        const slide = this.state.toc[this.state.slide];

        return (
            <div className="public-time-controls">
                <img src={akashiwo} alt="Drawing of a celebratory phytoplankton" className="akashiwo-character"></img>
                <div id={"tutorial-1"} className="visible-tutorial-text">
                    <p className="tutorial-title">{slide.title}</p>
                    <p className="tutorial-body">{slide.text}</p>
                    {slide.buttons ? <div className='tutorial-button-container'>{slide.buttons.map((button) => <div key={button.track} className='tutorial-button' onClick={() => this.handleButton(button.track)}>{button.text}</div>)}</div> : <div/>}
                    <div className='tutorial-nav-container'>
                        {this.state.slide > 0 ? <p className="tutorial-back" onClick={() => this.back()}>{'< Back'}</p> : <div/>}
                        {this.state.slide < this.state.toc.length - 1 && !slide.buttons ? <p className="tutorial-next" onClick={() => this.next()}>{'Next >'}</p> : <div/>}
                    </div>
                </div>
            </div>
        );


    }
}

export default (Tutorial);