import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { list } from 'postcss';
import { isTemplateElement } from '@babel/types';
import {Row, Container} from 'react-bootstrap';
import author from './author';
import { getCiphers } from 'tls';

// default params to fetcg api

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;


var paragraph = 'Welcome to React ';
let name ='Edwindo';

// filter the result by search

function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm);
  }
}
class App extends Component{

  // Setting up internal component state
  // ES6 class can use constructor to initialize internal state

  constructor(props){
    super(props);

    this.state = {
      author,
      searchTerm: '',
      result: null
    }

    // bind the func to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
  }

  // set top stories
  setTopStories(result){
    this.setState({ result: result});
  }

  // fetch top stories
  fetchTopStories(searchTerm){
    // console.log(fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`).then(response => response.json()))
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
    .then(response => response.json())
    .then(result => this.setTopStories(result))
    .catch(e => e);
  }


  componentDidMount(){
    this.fetchTopStories(this.state.searchTerm);
  }

  /*
  removeItem(id){
    console.log('Remove item' + id);
    function isNotId(item){
      return item.objectID !== id;
    };

    const updatedList = this.state.author.filter(isNotId);
    this.setState({author: updatedList});
  }
  */


  // REFACTORING 
  // Without API
  // ==================
  // removeItem(id){
  //   const isNotId = item => item.objectID !== id;
  //   const updatedList = this.state.author.filter(isNotId);
  //   this.setState({ author: updatedList })
  // }

  // Use API
  removeItem(id){
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: {...this.state.result, hits: updatedList} })
  }

  // get value
  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm: event.target.value })
  }

  render(){
    const { result, author, searchTerm } = this.state;

    if (!result){ return null; }
    // console.log(this);
    return (


      <div className="App">
        <Container>
          <Row>
            <div className='search_form'>
              <Search 
                onChange={ this.searchValue } 
                value={ searchTerm }
              >Search Here</Search>
            </div>
          </Row>
        </Container>

        {/* Use API */}
        <Author
          author = { result.hits }
          searchTerm= { searchTerm }
          removeItem = { this.removeItem }
        />

        {/* without API */}
        {/* <Author
          author = { author }
          searchTerm= { searchTerm }
          removeItem = { this.removeItem }
        /> */}
      </div>
    );
  }
}

class Search extends Component {
  render(){
    const { children } = this.props
    return(
      <form>
        { children }
        <input  type= 'text' onChange={ this.props.onChange } value={ this.props.value } />
      </form>
    )
  }
}

class Author extends Component {
  render(){
    const { author, searchTerm, removeItem } = this.props
    return(
      <div>
        <h1>
        {
          author.filter(isSearched(searchTerm)).map(item =>
                <div key={item.objectID}>
                  <h1> <a href={ item.url }>{ item.title }</a> by { item.author } </h1>
                  {/* to use this keyword use arrow func not the old func */}
                  <Delete
                  type = 'button'
                  onClick = { () => removeItem(item.objectID)} >
                    Remove
                  </Delete>
                </div>
          )
        }
      </h1>
      <h1>{ paragraph } {name}</h1>
      </div>
    )
  }
}


class ApiTable extends Component {
  render(){
    const { author, searchTerm, removeItem } = this.props
    return(
      <div>
        <h1>
        {
          author.filter(isSearched(searchTerm)).map(item =>
                <div key={item.objectID}>
                  <h1> <a href={ item.url }>{ item.title }</a> by { item.author } </h1>
                  {/* to use this keyword use arrow func not the old func */}
                  <Delete
                  type = 'button'
                  onClick = { () => removeItem(item.objectID)} >
                    Remove
                  </Delete>
                </div>
          )
        }
      </h1>
      <h1>{ paragraph } {name}</h1>
      </div>
    )
  }
}

// class Delete extends Component {
//   render(){
//     const { onClick, children } = this.props
//     return(
//       <button onClick={ onClick }>{ children }</button>
//     )
//   }
// }

// function Delete({ onClick, children }){
//   return(
//     <button onClick={ onClick }>{ children }</button>
//   )
// }

const Delete = ({ onClick, children }) =>
  <button onClick={ onClick }>{ children }</button>


export default App;
