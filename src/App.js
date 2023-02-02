import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "f1d4793b803e47408bb102185056dcc3";
const CLIENT_SECRET = "74d09c05be44444388a27e92691eccc4";

function App() {
  const [ searchInput, setSearchInput ] = useState('');
  const [ accessToken, setAccessToken ] = useState('');

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

  // Vyhledávání
  async function search() {
    // Jméno umělce
    console.log("Search for " + searchInput);    
  }


  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder='Search for Artist'
            type="input"
            onKeyPress={event => {
              if(event.key == 'Enter'){
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className="mx-2 row row-cols-4">
          <Card>
            <Card.Img src="#" />
            <Card.Body>
              <Card.Title>Album name Here</Card.Title>
            </Card.Body>
          </Card>
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
