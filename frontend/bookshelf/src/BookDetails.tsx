import { Action, applyMiddleware, combineReducers, createStore, Dispatch, Reducer } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import './App.css';
import thunkMidleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import {useLocation} from 'react-router-dom';

// Store for Books

interface Book {
  title:string,
  url:string,
  author:string,
  summary:string,
  rating:number,
  reviews:Review[]
}

interface Review {
    comment:string,
    rating:number
}

interface RdxReviewState {
    data:Review[],
    loading:boolean
  }

interface TestState {
  object:Book,
  roles:string[]
}

// Action for Books

const ADD_REVIEW = 'ADD_REVIEW'
interface AddReviewAction extends Action { data: Review }
const addReview = (data:Review) => ({type:ADD_REVIEW, data})

const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS'
interface ReceiveReviewsAction extends Action { data: Review[] }
const receiveReviews = (data:Review[]) => ({type:RECEIVE_REVIEWS, data})




const fetchBooks = () => 
  (dispatch:any) => {
    fetch("books.json")
    .then( resp => resp.json() )
    .then( data => dispatch(receiveReviews(data)))
  }


const initialReviewState: RdxReviewState =
{ data: [],
  loading:false
}

const reducerReviews: Reducer<RdxReviewState> = (state=initialReviewState, action:Action) => {
  switch (action.type) {
    case ADD_REVIEW:
      const review = (action as AddReviewAction).data
      return {...state, data:[...state.data, review]}

    case RECEIVE_REVIEWS:
      const data = (action as ReceiveReviewsAction).data
      return {...state, data, loading:false}

    default:
      return state
  }
}


// Store for user information



// Custom hooks

const useInput: (initialState: string) => [JSX.Element, string, React.Dispatch<React.SetStateAction<string>>]
  =
  (initialState) => {
    const [text, setText] = useState(initialState)

    const handleChange = (e: any) => { setText(e.target.value) }

    const input = <input type="text" value={text} onChange={handleChange} />

    return [input, text, setText]
  }




// View components for users


const useIsAdmin = () =>{ const location = useLocation(); return (location.state as TestState).roles.includes("ROLE_ADMIN")}

const useIsRegistered = () =>{ const location = useLocation(); return (location.state as TestState).roles.length != 0 }




const AdminArea: React.FunctionComponent<{}> = (props) => {
  const isAdmin = useIsAdmin()

  return isAdmin ? <>{props.children}</> : <></>
}

const RegisteredArea: React.FunctionComponent<{}> = (props) => {
  const isAdmin = useIsRegistered()

  return isAdmin ? <>{props.children}</> : <></>
}


// View components for books




const BookInfo:React.FunctionComponent<{title:string,image:string,author:string,summary:string}> = (props) => {
  
    return <div><img className="image" src={props.image}/>
        <p>Title: {props.title}</p>
    <p>Author: {props.author}</p>
    <p>Summary: {props.summary}</p>
    </div>
      
  }

  const useReviewSelector = 
  (fn: (state: RdxReviewState) => any) => fn(useSelector( (state:RdxGlobalState) => state.reviews ))

  const ReviewList = () => {
    const reviews = useReviewSelector( (state:RdxReviewState) => state.data )

    return <div>{reviews.map((review:Review)  => <div> <p>Comment: {review.comment}</p>
        <p>Rating: {review.rating}</p>  </div>
        )}
        </div>
        
   
      
  }
  

const ReviewForm = () => {
  const dispatch = useDispatch()
  
  const [inputComment, comment, setComment] = useInput("")
  const [inputRating, rating, setRating] = useInput("")

  const handleSubmit = (e:any) => { 
    e.preventDefault();
    


    dispatch(addReview({comment:comment,rating:parseInt(rating)}))

    setComment(""); 
    setRating("") 
  }

  return <form onSubmit={handleSubmit}>
    <p>Comment: {inputComment}</p>
    <p>Rating: {inputRating}</p>
    <input type="submit" value="Add review"/>
  </form>
}


// Layout components

const Container:React.FunctionComponent<{}> = (props) => 
  <div style={{margin:"10px"}}>
    {props.children}
  </div>




const PageLayout = () => {
    const location = useLocation();

    console.log((location.state as TestState).object.title)

  return <div className='container'>
    <Container>
      <BookInfo title = {(location.state as TestState).object.title} image = {(location.state as TestState).object.url} author = {(location.state as TestState).object.author} summary = {(location.state as TestState).object.summary} />
      <RegisteredArea>
        <ReviewList />
        <ReviewForm/>
      </RegisteredArea>
    </Container>
  </div>
}
// Root of the application 

// Create and initialize the store

const logger = createLogger()

interface RdxGlobalState {
    reviews: RdxReviewState
}
const reducer = combineReducers({reviews:reducerReviews})

const store = createStore(reducer, applyMiddleware( thunkMidleware, logger ) )

const Page = () => {
    const location = useLocation();
    const dispatch = useDispatch()

    useEffect(() => { dispatch(receiveReviews((location.state as TestState).object.reviews)) }, [])
    return <PageLayout/>
}

function BookDetails() {
  return <Provider store={store}>
            <Page/>
         </Provider>
}

export default BookDetails;
