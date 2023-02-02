import logo from 'D:\Grabify\client\src\logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {BeakerIcon, ZapIcon} from '@primer/octicons-react';
import { useNavigate } from '@reach/router';
import { navigate } from '@reach/router';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
//import FavAlbum from './Components/FavAlbums.js';
import FavAlbums from '../Pages/FavAlbums.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const CLIENT_ID = "f1d4793b803e47408bb102185056dcc3";
const CLIENT_SECRET = "74d09c05be44444388a27e92691eccc4";

const navigateToFav = () => { 
  navigate('/favalbums'); 
};

export default function Home() {
    const [ searchInput, setSearchInput ] = useState('');
    const [ accessToken, setAccessToken ] = useState('');
    const [ albums, setAlbums ] = useState([]);
    const [ starred, setStarred ] = useState(
      JSON.parse(localStorage.getItem('starred')) || {}
    );
  
    // funkce pro provedení jen při spuštění aplikace (vícekrát není potřeba)
    useEffect(() => {
      // určení podmínek, které musí být splněny
      var authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }
  
      fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => setAccessToken(data.access_token))
    }, [])
  
    // uložení stavu oblíbených alb do localStorage
    useEffect(() => {
      const starredFromLocalStorage = JSON.parse(localStorage.getItem('starred')) || [];
      setStarred(starredFromLocalStorage);
    }, []);
  
    useEffect(() => {
      localStorage.setItem('starred', JSON.stringify(starred));
    }, [starred]);  
  
    // Vyhledávání
    async function Search() {
      // Jméno umělce
      console.log("Search for " + searchInput);  
      
      // Získání ID umělce
      var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }
      var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
        .then(response => response.json())
        .then(data => { return data.artists.items[0].id })
  
      console.log("Artist ID: " + artistID);
      
      // Získání alb umělce
      var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setAlbums(data.items);
        })
  
    }
    console.log(albums);
  
    return (
      <div className="Home">
        <Container>
          <InputGroup className="mb-3 mt-3" size="lg">
            <FormControl
              placeholder='Search for Artist'
              type="input"
              onKeyPress={event => {
                if(event.key == 'Enter'){
                  Search();
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={Search}>
              Search
            </Button>
          </InputGroup>
        </Container>
  
        <Container>
          <Row className="mx-2 row row-cols-4 d-flex justify-content-center">
            {albums.map((album, i) => {
              console.log(album);
              return (
                <Card className='m-1'>
                  <Card.Img className='mt-3' src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setStarred({...starred, [album.id]: !starred[album.id] });
                    }}>
                      {starred[album.id]? (
                        <span role="img" arial-label="star">★</span>
                      ) : (
                        <span role="img" arial-label="star-outline">☆</span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
            
          </Row>
        </Container>
  
        <Container className="d-flex justify-content-end align-items-end position-fixed mb-3" style={{ bottom: "15px", right: "15px" }}>
          <button type="button" onClick={navigateToFav} className="btn btn-circle btn-primary mb-4 p-3">
            <Router>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/favalbums" element={<FavAlbums/>} />
            </Router>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
            </svg>
          </button>
        </Container>
      </div>
    );
  }