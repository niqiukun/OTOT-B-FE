import React from 'react';
import { useState, useEffect } from 'react';
import { Alert, Button, ListGroup, Row, Col, Container, InputGroup, FormControl } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const PROXY = "https://cors-anywhere.herokuapp.com/";
  const URL = "https://5xpkh3hjbg.execute-api.ap-southeast-1.amazonaws.com/dev/";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingItem, setEditingItem] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setIsLoading(true);
    axios.get(PROXY + URL + 'items')
      .then(res => {
        let temp = res.data;
        if (temp.indexOf(': ') === -1) {
          setItems([]);
        } else {
          temp = temp.substring(temp.indexOf(': ') + 2);
          temp = temp.split(', ')
          setItems(temp);
        }
        setIsLoading(false);
      })
      .catch(err => {
        setAlertType('danger');
        setAlertMessage(err.response.data);
        setShowAlert(true);
        setIsLoading(false);
      })
  }

  const onNewItemButtonClick = () => {
    setIsLoading(true);
    axios.post(PROXY + URL + 'items', {name: newItem})
      .then(res => {
        setAlertType('success');
        setAlertMessage(res.data);
        setShowAlert(true);
        setNewItem('');
        setIsLoading(false);
        refreshList();
      })
      .catch(err => {
        setAlertType('danger');
        setAlertMessage(err.response.data);
        setShowAlert(true);
        setIsLoading(false);
      })
  }

  const onDeleteItemButtonClick = (i) => {
    setIsLoading(true);
    axios.delete(PROXY + URL + 'items/' + i.toString())
      .then(res => {
        setAlertType('success');
        setAlertMessage(res.data);
        setShowAlert(true);
        setNewItem('');
        setIsLoading(false);
        refreshList();
      })
      .catch(err => {
        setAlertType('danger');
        setAlertMessage(err.response.data);
        setShowAlert(true);
        setIsLoading(false);
      })
  }

  const onSaveItemButtonClick = (i) => {
    setIsLoading(true);
    axios.put(PROXY + URL + 'items/' + i.toString(), {name: editingItem})
    .then(res => {
      setAlertType('success');
      setAlertMessage(res.data);
      setShowAlert(true);
      setNewItem('');
      setIsLoading(false);
      setEditingIndex(-1);
      refreshList();
    })
    .catch(err => {
      setAlertType('danger');
      setAlertMessage(err.response.data);
      setShowAlert(true);
      setIsLoading(false);
    })
  }

  return (
    <div className="App">

      <Container>
        <Alert variant={alertType} show={showAlert} dismissible='true' onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
        <Row>
          <Col md={{ span: 4, offset: 2 }}>
            <h2>
              My Todo List
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <InputGroup>
              <FormControl
                placeholder="Enter new item here"
                aria-label="New Item"
                aria-describedby="item-name"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
              <InputGroup.Append>
                <Button 
                  variant="primary"
                  onClick={onNewItemButtonClick}
                  disabled={isLoading}
                >Add Item</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 8, offset: 2}}>
          <ListGroup>
            {items.length === 0 &&
              <ListGroup.Item>You have no items in your todo list!</ListGroup.Item>
            }
            {items.map((x, i) => {
              return (
                <ListGroup.Item key={i}>
                  {editingIndex === i 
                    ? <FormControl className="edit-form" value={editingItem} onChange={e => setEditingItem(e.target.value)}></FormControl>
                    : x
                  }
                  <Button 
                    className="item-button" 
                    variant="outline-danger"
                    disabled={isLoading}
                    onClick={e => onDeleteItemButtonClick(i)}
                  >Delete</Button>
                  {editingIndex === i 
                    ? <Button 
                        className="item-button" 
                        variant="outline-primary"
                        disabled={isLoading}
                        onClick={e => onSaveItemButtonClick(i)}
                      >Save</Button>
                    : <Button 
                        className="item-button" 
                        variant="outline-primary"
                        disabled={isLoading}
                        onClick={e => {
                          setEditingItem(items[i]);
                          setEditingIndex(i);
                        }}
                      >Edit</Button>
                  }
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
