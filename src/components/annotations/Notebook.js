import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import BinNote from '../annotations/BinNote';

export class Notebook extends React.Component {
    render() {
        return(
            <div>
                <Header />
                <div className='main'>
                    <div class="page">
                        <div class="content">
                            <BinNote 
                                timeseries='IFCB104'
                                file='D20210504T094256'
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notebook;