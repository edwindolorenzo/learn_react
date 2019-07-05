import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { list } from 'postcss';
import { isTemplateElement } from '@babel/types';
import {Row, Container, FormGroup, Col} from 'react-bootstrap';
import author from './author';
import { getCiphers } from 'tls';
import { DEFAULT_PAGE, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, DEFAULT_QUERY, PARAM_PAGE, PARAM_HPP, DEFAULT_HPP } from './constants/index'
// default params to fetcg api



const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;

// console.log(url);

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
      searchTerm: DEFAULT_QUERY,
      result: null
    }

    // bind the func to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // set top stories
  setTopStories(result){
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updateHits = [...oldHits, ...hits]
    this.setState({ result: { hits: updateHits } });
  }

  // fetch top stories
  fetchTopStories(searchTerm, page){
    // console.log(fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`).then(response => response.json()))
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setTopStories(result))
    .catch(e => e);
  }


  componentDidMount(){
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  // on search submit function
  onSubmit(event){
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    event.preventDefault();
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
    // console.log({ result: { hits: updatedList } });
    // console.log({  ...this.state.result, hits: updatedList });
    // console.log({ result: { ...this.state.result, hits: updatedList } });
    // console.log({ ...this.state.result } );
    this.setState({ result: { ...this.state.result, hits: updatedList } })
  }

  // get value
  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm: event.target.value })
  }

  render(){
    const { result, author, searchTerm } = this.state;

    // if (!result){ return null; }
    // console.log(this);

    const page = (result && result.page) || 0;
    return (


      <div className="App">
        <Row>
          <Col className='search'>
            <div className='search_form' style= { { marginTop : '5px'}}>
              <Search 
                onChange={ this.searchValue } 
                value={ searchTerm }
                onSubmit={ this.onSubmit }
              >Search Here</Search>
            </div>
          </Col>
        </Row>

        {/* Use API */}
        { result &&
        <Author
          author = { result.hits }
          searchTerm= { searchTerm }
          removeItem = { this.removeItem }
        />
        }

        {/* without API */}
        {/* <Author
          author = { author }
          searchTerm= { searchTerm }
          removeItem = { this.removeItem }
        /> */}
        <div>
          <Button
          onClick={ () => this.fetchTopStories(searchTerm, page + 1 ) }>
            Load more
          </Button>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  render(){
    const { children, onSubmit } = this.props
    return(
      <form onSubmit={ onSubmit }>
        <FormGroup>
        <input  type= 'text' onChange={ this.props.onChange } value={ this.props.value } placeholder={ children } />
        <span>
          <button>Search</button>
        </span>
        </FormGroup>
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
          //author.filter(isSearched(searchTerm)).map(item =>
          author.map(item =>
                <div key={item.objectID}>
                  <h1> <a href={ item.url }>{ item.title }</a> by { item.author } </h1>
                  {/* to use this keyword use arrow func not the old func */}
                  <Button
                  type = 'button'
                  onClick = { () => removeItem(item.objectID)} >
                    Remove
                  </Button>
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
                  <Button
                  type = 'button'
                  onClick = { () => removeItem(item.objectID)} >
                    Remove
                  </Button>
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

function Button({ onClick, children }){
  return(
    <button onClick={ onClick }>{ children }</button>
  )
}

// const Button = ({ onClick, children }) =>
//   <button onClick={ onClick }>{ children }</button>


export default App;
