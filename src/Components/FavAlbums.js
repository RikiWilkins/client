import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const FavAlbums = () => {
    const [search, setSearchInput] = useState('');
    const history = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(search);
    }

    return (
        <Container>
            <Link to="/">
                <Button>
                    Go Back
                </Button>
            </Link>
            <InputGroup className="mb-3 input-group input-group-lg">
                <FormControl
                    placeholder="Search for an album"
                    value={search}
                    onChange={(event) => setSearchInput(event.target.value)}
                />
                <InputGroup.Append>
                    <Button onClick={handleSubmit}>
                        Search
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Container>
    )
}

export default FavAlbums;