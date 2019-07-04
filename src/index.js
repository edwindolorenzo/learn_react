import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// const para = {
//     text: 'When you have a talking mouth'
// }

// class Hello extends Component{
//     render(){

//         para.iAmNewPara = 'I can change you!';
//         return(

//             <div>

//             <h2> {para.text}</h2>
//             <p> {para.iAmNewPara}</p>
//             </div>
//         )
//     }
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
