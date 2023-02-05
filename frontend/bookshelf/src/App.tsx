import { Action, applyMiddleware, combineReducers, createStore, Dispatch, Reducer } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import './App.css';
import thunkMidleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {AuthorControllerApi,BookControllerApi,Configuration,AuthenticationControllerApi} from './api/'
import {BookDTO,BookListDTO,AuthorDTO,AuthorsBookDTO,ImageDTO,UserDTO} from './api/models'

// Store for Books



interface RdxBookState {
  books:BookListDTO[],
  filterTitle:string,
  loading:boolean,
  authors:AuthorDTO[]
}

// Action for Books

const ADD_BOOK = 'ADD_BOOK'
interface AddBookAction extends Action { data: BookListDTO }
const addBook = (data:BookListDTO) => ({type:ADD_BOOK, data})

const UPDATE_BOOK = 'UPDATE_BOOK'
interface UpdateBookAction extends Action { data: BookListDTO, id:number }
const updateBook = (data:BookListDTO,id:number) => ({type:UPDATE_BOOK, data,id})

const SET_TITLE_FILTER = 'SET_TITLE_FILTER'
interface SetTitleFilterAction extends Action { filter: string }
const filterTitleAction = (filter:string) => ({type:SET_TITLE_FILTER, filter})

const SET_RATING_FILTER = 'SET_RATING_FILTER'
interface SetRatingFilterAction extends Action { filter: number }
const filterRatingAction = (filter:number) => ({type:SET_RATING_FILTER, filter})

const RECEIVE_BOOKS = 'RECEIVE_BOOKS'
interface ReceiveBooksAction extends Action { data: BookListDTO[] }
const receiveBooks = (data:BookListDTO[]) => ({type:RECEIVE_BOOKS, data})

const DELETE_BOOK = 'DELETE_BOOK'
interface DeleteBookAction extends Action { data: BookListDTO }
const deleteBook = (data:BookListDTO) => ({type:DELETE_BOOK, data})


const REQUEST_BOOKS = 'REQUEST_BOOKS'
const requestBooks = () => ({type:REQUEST_BOOKS})

const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS'
interface ReceiveAuthorsAction extends Action { data: AuthorDTO[] }
const receiveAuthors = (data:AuthorDTO[]) => ({type:RECEIVE_AUTHORS, data})


const REQUEST_AUTHORS = 'REQUEST_AUTHORS'
const requestAuthors = () => ({type:REQUEST_AUTHORS})

let author_controller:AuthorControllerApi = new AuthorControllerApi()
let book_controller:BookControllerApi = new BookControllerApi()
let authentication_controller:AuthenticationControllerApi = new AuthenticationControllerApi()

const fetchAuthors = () => 
  (dispatch:any) => {
    dispatch(requestAuthors())
    author_controller.getAll()
      .then(res => {
        const authors = res.data;
        dispatch(receiveAuthors(authors));
      })
    
  }

const fetchBooks = () => 
  (dispatch:any) => {
    dispatch(requestBooks())
    book_controller.getAll()
      .then(res => {
        const books = res.data;
        dispatch(receiveBooks(books));
      })
    
  }


const initialBookState: RdxBookState =
{ books: [],
  filterTitle:"",
  loading:false,
  authors:[]
}

const reducerBooks: Reducer<RdxBookState> = (state=initialBookState, action:Action) => {
  switch (action.type) {
    case ADD_BOOK:
      const book = (action as AddBookAction).data
      return {...state, books:[...state.books, book]}

    case UPDATE_BOOK:
      
      const updatedbook = (action as UpdateBookAction).data
      const id = (action as UpdateBookAction).id
      /*
      let index = state.books.findIndex(book => book.id === id);
      let b = [...state.books];
      b[index] = {...b[index], title: updatedbook.title,images:updatedbook.images,authors:updatedbook.authors};
      return {...state, todos}
      */return {...state, books:state.books.map(book => book.id === id ?
        {...book,title:updatedbook.title,images:updatedbook.images,authors:updatedbook.authors} :
        book
        )}

    case SET_TITLE_FILTER: 
      const filterTitle = (action as SetTitleFilterAction).filter
      return {...state, filterTitle}

    case SET_RATING_FILTER: 
      const filterRating = (action as SetRatingFilterAction).filter
      return {...state, filterRating}

    case REQUEST_BOOKS:
      return {...state, loading:true}

    case RECEIVE_BOOKS:
      const books = (action as ReceiveBooksAction).data
      return {...state, books, loading:false}

    case REQUEST_AUTHORS:
        return {...state, loading:true}
  
    case RECEIVE_AUTHORS:
        const authors = (action as ReceiveAuthorsAction).data
        return {...state, authors, loading:false}

    case DELETE_BOOK:
        const dbook = (action as DeleteBookAction).data
        return {...state, books:[ ...state.books.filter((db : BookListDTO) => db.id !== dbook.id)]}

    default:
      return state
  }
}


// Store for user information

interface RdxUserState {
  username: string | null,
  roles:string[],
  waiting:boolean,
  token:string
}

const REQUEST_LOGIN = 'REQUEST_LOGIN'
const requestLogin = () => ({type:REQUEST_LOGIN})


const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
interface ReceiveLoginAction extends Action { username:string, roles:string[], token:string }
const receiveLogin = (username:string, roles:string[],token:string) => ({type:RECEIVE_LOGIN, username, roles,token})


const LOGOUT = 'LOGOUT'
const logout = () => ({type:LOGOUT})

const remoteLogin = (username:string, password:string) => 
  (dispatch:Dispatch) => {
    dispatch(requestLogin())
    authentication_controller.login({username:username,password:password}) // , {method:"POST", body:JSON.stringify({username,password})})
    .then( res => {const session = res.data; dispatch(receiveLogin(session.username,session.roles,session.jwt))})
  }
/*
const remoteLogin = (username:string, password:string) => 
  (dispatch:Dispatch) => {
    dispatch(requestLogin())
    authentication_controller.login({username:username,password:password})// , {method:"POST", body:JSON.stringify({username,password})})
    .then( data => dispatch(receiveLogin(data.username,data.roles)))
  }
*/



const initialUserState = {
  username: null,
  roles:[],
  waiting:false,
  token:""
}

const reducerUsers: Reducer<RdxUserState> = (state = initialUserState, action:Action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return {...state, waiting:true }
  
    case RECEIVE_LOGIN:
      const {username,roles,token} = (action as ReceiveLoginAction)
      return {...state, waiting:false, username, roles, token}

    case LOGOUT:
      return {...state, username:null, roles:[], token:""}

    default:
      return state
  }
}

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

const useUserSelector =
  (fn: (state: RdxUserState) => any) => fn(useSelector((state: RdxGlobalState) => state.users))

const useIsAdmin = () => useUserSelector((state: RdxUserState) => state.roles.includes("ROLE_ADMIN"))

const useIsRegistered = () => useUserSelector((state: RdxUserState) => state.roles.includes("ROLE_USER"))

const useIsReviewer = () => useUserSelector((state: RdxUserState) => state.roles.includes("ROLE_REVIEWER"))

const UserInfo = 
  ({username}:{username:string}) => {
    const token = useUserSelector((state: RdxUserState) => state.token)
    const dispatch = useDispatch()

    const handleClick = () => {
      const headers = new Headers().set('Authorization', 'Bearer ' + token)
      const options = {headers:headers}
      authentication_controller.logout(options)
      dispatch(logout())
      
      }

    return <p>{username} is logged in <button onClick={handleClick}>Logout</button></p>
  }

const LoginBox = () => {
    const dispatch = useDispatch()

    const [inputUsername, username, setUsername] = useInput("")
    const [inputPassword, password, setPassword] = useInput("")

    const handleSubmit = (e:any) => {
      e.preventDefault()
      dispatch(remoteLogin(username, password))
      setUsername("")
      setPassword("")
    }

    return <form style={{display:"inline-block", padding:"10px"}} onSubmit={handleSubmit}>
      <p>Username {inputUsername}</p>
      <p>Password {inputPassword}</p>
      <input type="submit" value= "Login"/>
    </form>
  }

const UserBox = () => {
  const username = useUserSelector((state: RdxUserState) => state.username )

  return <div>
        { 
          username 
          ? 
          <UserInfo username={username}/>
          : 
          <><LoginBox /></>
        } 
        </div>
}


const AdminArea: React.FunctionComponent<{}> = (props) => {
  const isAdmin = useIsAdmin()

  return isAdmin ? <>{props.children}</> : <></>
}

const RegisteredArea: React.FunctionComponent<{}> = (props) => {
  const isAdmin = useIsRegistered()

  return isAdmin ? <>{props.children}</> : <></>
}

const ReviewerArea: React.FunctionComponent<{}> = (props) => {
  const isAdmin = useIsReviewer()

  return isAdmin ? <>{props.children}</> : <></>
}


// View components for books

const useBookSelector = 
  (fn: (state: RdxBookState) => any) => fn(useSelector( (state:RdxGlobalState) => state.books ))

  const BookListView = (props : {booklist:BookListDTO[]}) => {

    const navigate = useNavigate();

    const handleSelect = (book:BookListDTO) => {
    
      //navigate('/details', {state:{object:book,roles:rolelist}});
            
    }
        // array of N elements, where N is the number of rows needed
        console.log(props)
        const rows = [...Array( Math.ceil(props.booklist.length / 3) )];
        // chunk the products into the array of rows
        const productRows = rows.map( (row, idx) => props.booklist.slice(idx * 3, idx * 3 + 3) ); 
        // map the rows as div.row
        const content = productRows.map((row, idx) => (
            <div className="row" key={idx}>    
              { row.map( product => <div key = {product.title} className="col" onClick={()=>handleSelect(product)}><img className="image" src={product.images[0].url}/><p >Title: { product.title }</p><p > Author: { product.authors[0].name}</p></div> )}
            </div> )
        );
        return (
            <div className="bookList">
              {content}
            </div>
        );
        
}


const BookList = () => {
  const books = useBookSelector( (state:RdxBookState) => state.books )
  const filterTitle = useBookSelector( (state:RdxBookState) => state.filterTitle )
  const loading = useBookSelector( (state:RdxBookState) => state.loading )
  //const filterRating = useBookSelector( (state:RdxBookState) => state.filterRating )
  const roles = useUserSelector((state:RdxUserState) => state.roles)

  return loading ? 
  <p>Is Loading</p>
  :
  
      <BookListView booklist = {books.filter((b:BookListDTO) => b.title.includes(filterTitle) )}/>
  
}
/*
function searchRating(b:Book,search:number): boolean {
  if (search ==0 || b.rating==search)
      return true
  else
      return false
}
*/
const BookForm = () => {
  const authors = useBookSelector( (state:RdxBookState) => state.authors )
  const dispatch = useDispatch()
  
  const [inputTitle, title, setTitle] = useInput("")
  const [inputImage, image, setImage] = useInput("")
  const [author, setAuthor] = useState<AuthorDTO>({id:1,name:"rui"})

  const handleSubmit = (e:any) => { 
    e.preventDefault(); 

    const img: ImageDTO ={
      url:image
    }

    dispatch(addBook({title:title,authors:[author],images:[img]}))
    
    //needed to know the id of the book in the repository in case we want to update it or delete it
    const update = async() =>{
      await book_controller.addOne({title:title,authors:[author.id],images:[image] })
      dispatch(fetchBooks())
    }

    update()

    

    setTitle("")
    setImage("")

  }

  const handleFilter = (e:any) => { 
    const a = authors.find((auth:AuthorDTO) => auth.id === e.target.value);
    const auth:AuthorDTO = {
      id:e.target.value,
      name:a.name
    }
    setAuthor(auth)
  }

  return <form onSubmit={handleSubmit}>
    <p>Title: {inputTitle}</p>
    <p>Image: {inputImage}</p>
    <p>Author: <Box sx={{ width: 200,display:"inline-block" }}>
  <FormControl fullWidth sx={{backgroundColor: 'white', opacity:'0.8'}}>
    
    <Select
      sx={{height:40}}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Rating"
      onChange={handleFilter}
    >
      {authors.map((auth:AuthorDTO) => <MenuItem value={auth.id}>{auth.name}</MenuItem>)}
    </Select>
  </FormControl>
  </Box></p>
    <input type="submit" value="Add book"/>
  </form>
}

const UpdateBook = () => {
  const books = useBookSelector( (state:RdxBookState) => state.books )
  const authors = useBookSelector( (state:RdxBookState) => state.authors )
  const dispatch = useDispatch()
  
  const [inputTitle, title, setTitle] = useInput("")
  const [inputImage, image, setImage] = useInput("")
  const [author, setAuthor] = useState<AuthorDTO>({id:1,name:"rui"})
  const [book, setBook] = useState<BookListDTO>({id:1,title:"some title", images:[], authors:[]})

  const handleSubmit = (e:any) => { 
    e.preventDefault(); 

    const img: ImageDTO ={
      url:image
    }

    dispatch(updateBook({title:title,authors:[author],images:[img]},book.id))
    
    //needed to know the id of the book in the repository in case we want to update it or delete it
    
    book_controller.updateOne(book.id,{title:title,authors:[author.id],images:[image] })

    
    setBook({id:1,title:"some title", images:[], authors:[]})
    setTitle("")
    setImage("")

  }

  const handleFilter = (e:any) => { 
    e.preventDefault();
    const a = books.find((book:BookListDTO) => book.id === e.target.value);
    const b:BookListDTO = {
      id:e.target.value,
      title:a.title,
      images:a.images,
      authors:a.authors
    }
    setTitle(b.title)
    setImage(b.images[0].url)
    setBook(b)
  }

  const handleFilterAuthor = (e:any) => { 
    const a = authors.find((auth:AuthorDTO) => auth.id === e.target.value);
    const auth:AuthorDTO = {
      id:e.target.value,
      name:a.name
    }
    setAuthor(auth)
  }

  return <><p>Book to update: <Box sx={{ width: 200, display: "inline-block" }}>
    <FormControl fullWidth sx={{ backgroundColor: 'white', opacity: '0.8' }}>

      <Select
        sx={{ height: 40 }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Rating"
        onChange={handleFilter}
      >
        {books.map((book: BookListDTO) => <MenuItem value={book.id}>{book.id}</MenuItem>

        )}
      </Select>
    </FormControl>
  </Box></p><div>
      {book.id == 1 ?
        <p></p>
        :
        <form onSubmit={handleSubmit}>
          <p>Title: {inputTitle}</p>
          <p>Image: {inputImage}</p>
          <p>Author: <Box sx={{ width: 200, display: "inline-block" }}>
            <FormControl fullWidth sx={{ backgroundColor: 'white', opacity: '0.8' }}>

              <Select
                sx={{ height: 40 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Rating"
                onChange={handleFilterAuthor}
              >
                {authors.map((auth: AuthorDTO) => <MenuItem value={auth.id}>{auth.name}</MenuItem>

                )}
              </Select>
            </FormControl>
          </Box></p>
          <input type="submit" value="Update book" />
        </form>}
    </div></>
}

const SearchForm = () => {
  const dispatch = useDispatch()

  const [inputSearch, search] = useInput("")

  useEffect(() => { dispatch(filterTitleAction(search)) })

  return <div style={{display:"inline-block"}}>Search: {inputSearch}</div>
}

const DeleteBook = () => {

  const books = useBookSelector( (state:RdxBookState) => state.books)
  console.log(books)
  const [book, setBook] = useState<BookListDTO>({id:1,title:"some title", images:[], authors:[]})
  const dispatch = useDispatch()


  const handleSubmit = (e:any) => { 
    e.preventDefault();

    dispatch(deleteBook(book))

    book_controller.deleteOne(book.id)

  }

  const handleFilter = (e:any) => { 
    const b = books.find((book:BookListDTO) => book.id === e.target.value);
    const book:BookListDTO = {
      id:e.target.value,
      title: b.title,
      images: b.images,
      authors: b.authors

    }

    

    console.log(book)
    setBook(book)
  }

  return <form onSubmit={handleSubmit}>
    <div>Book to delete: <Box sx={{ width: 200,display:"inline-block" }}>
  <FormControl fullWidth sx={{backgroundColor: 'white', opacity:'0.8'}}>

    <Select
      sx={{height:40}}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Rating"
      onChange={handleFilter}
    >
      {books.map((bs : BookListDTO) => <MenuItem value = {bs.id}>{bs.title}</MenuItem>)}
    </Select>
  </FormControl>
  </Box></div>
    <input type="submit" value="Delete Book"/>
  </form>

}
/*
const FilterForm = () => {

  const dispatch = useDispatch()

  const [filter,setFilter] = useState(0)

  const handleFilter = (e:any) => { 
    e.preventDefault(); 

    setFilter(e.target.value)
  }

  useEffect(() => { dispatch(filterRatingAction(filter)) })

  return <Box sx={{ width: 200 , marginTop: '2%', marginLeft: '10%',display:"inline-block" }}>
  <FormControl fullWidth sx={{backgroundColor: 'white', opacity:'0.8'}}>
    <InputLabel id="demo-simple-select-label">Rating</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Rating"
      onChange={handleFilter}
    >
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={4}>4</MenuItem>
      <MenuItem value={5}>5</MenuItem>
    </Select>
  </FormControl>
  </Box>
}
*/
// Layout components

const Header: React.FunctionComponent<{title:string}> = (props) =>
  <div style={{padding:"10px", background:"lightblue", textAlign:"center"}}>
    <p>{props.title}</p>
    <div>
      {props.children}
    </div>
  </div>

const Container:React.FunctionComponent<{}> = (props) => 
  <div style={{margin:"10px"}}>
    {props.children}
  </div>




const PageLayout = () => 
  <div className='container'>
    <Header title={"My Personal Library"}>
      <UserBox/>
    </Header>
    <Container>
      <RegisteredArea>
        <SearchForm/>
      </RegisteredArea>
      <BookList/>
      <RegisteredArea><BookForm/></RegisteredArea>
      <AdminArea><DeleteBook/></AdminArea>
      <ReviewerArea><UpdateBook/></ReviewerArea>
    </Container>
  </div>

// Root of the application 

// Create and initialize the store

const logger = createLogger()

interface RdxGlobalState {
  users: RdxUserState,
  books: RdxBookState
}
const reducer = combineReducers({users:reducerUsers, books: reducerBooks})

const store = createStore(reducer, applyMiddleware( thunkMidleware, logger ) )

const Page = () => {
  const dispatch = useDispatch()

  useEffect(() => { dispatch(fetchBooks()) }, [])

  useEffect(() => {dispatch(fetchAuthors())},[])

  return <PageLayout/>
}

function App() {
  return <Provider store={store}>
            <Page/>
         </Provider>
}

export default App;
