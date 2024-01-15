import ReactQuill from 'react-quill';
import { Alert } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import Dropdown from 'react-bootstrap/Dropdown';
import React, { useEffect, useState } from 'react';
import styles from '../../../styles/Support/support.module.css';
import { AllCategory, CreateTicket, GetAllTags } from '@/pages/api/graphqlAPI';

const QuillEditor = () => {

  const quillRef = React.useRef();
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [alertBg, setAlertBg] = useState();
  const [showAlert, setShowAlert] = useState();
  const [alertData, setAlertData] = useState();
  const [categoryId, setCategoryId] = useState('');
  const [Get_All_Tags] = useMutation(GetAllTags);
  const [All_Category] = useMutation(AllCategory);
  const [Create_Ticket] = useMutation(CreateTicket);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [categoryPriority, setCategoryPriority] = useState('');
  const [predefinedSuggestions, setPredefinedSuggestions] = useState([]);
  const [categoryMessageRequired, setCategoryMessageRequired] = useState(false);

  const modules = {
    toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image'], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], ['blockquote', 'code-block'],],
  };

  const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'code-block'];

  async function getAllCategories() {
    await All_Category()
      .then(res => {
        setAllCategories(res.data.findAllCategory)
      })
      .catch(err => {
        setShowAlert(true)
        setAlertBg('danger')
        setAlertData(err?.message)
      });
  };

  useEffect(() => {
    getAllCategories()
  }, []);

  async function formSubmit(e) {
    e.preventDefault()
    let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
    if (categoryMessage === '') {
      setCategoryMessageRequired(true)
    } else {
      Create_Ticket({
        variables: {
          createTicketArgs: {
            category_id: categoryValue,
            title: categoryTitle,
            priority: categoryPriority,
            message: categoryMessage,
            user_id: Number(LoginUserId)
          }
        },
      }).then(async (res) => {
        // setShowAlert(true)
        // setAlertBg('success')
        // setAlertData(`Ticket with id (${res.data.createTicket.ticket_id}) Submit Successfully`)
        setCategoryId(`${res.data.createTicket.ticket_id}`)
        handleShow()
        setCategoryValue('')
        setCategoryTitle('')
        setCategoryPriority('')
        setCategoryMessage('')
      }).catch(error => {
        setShowAlert(true)
        setAlertBg('danger')
        setAlertData(error?.message)
      });
    }
  }

  useEffect(() => {
    setTimeout(function () {
      if (alertData === true) {
        setShowAlert(false)
      }
    }, 1000);
  },)



  async function getAllTags() {
    await Get_All_Tags()
      .then(res => {
        setPredefinedSuggestions(res.data.getAllTags)
      })
      .catch(err => {
        setShowAlert(true)
        setAlertBg('danger')
        setAlertData(err?.message)
      });
  };

  useEffect(() => {
    getAllTags()
  }, []);



  // const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const handleInputChange = (e) => {
    const value = e;
    setCategoryMessage(value);
    if (/\B#\w+/i.test(value)) {
      if ((/#\w*/.test(value))) {
        // Extract the last word starting with #
        const match = value.match(/#\w*/);
        const lastHashWord = match ? match[0] : '';
        const newSuggestions = predefinedSuggestions.filter(suggestion =>
          suggestion.tag_name.toLowerCase().includes(lastHashWord.toLowerCase().substring(1))
        );
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  };
  const handleSelectSuggestion = (selectedValue) => {
    const updatedValue = (prevInput) => prevInput.replace(/#\w*/, selectedValue.tag_description)
    setCategoryMessage(updatedValue);
  };


  return (
    <>
      <form onSubmit={(e) => formSubmit(e)}>
        {showAlert ?
          <Alert variant={alertBg} className='mb-0'>
            {alertData}
          </Alert>
          :
          <></>
        }
        <div className="mb-3">
          <label for="ticketCategory" className="form-label" style={{ fontSize: "14px", fontWeight: "600" }}>Category</label>
          <select className='form-control' value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)} required style={{ width: "100%" }}>
            <option value=''>Open this to select category</option>
            {allCategories.map((allCategory, i) => {
              return (
                <option key={allCategory.id} value={allCategory.id}>
                  {allCategory.category_name}
                </option>
              );
            })}
            ;
          </select>
        </div>
        <div className="mb-3">
          <label for="ticketTitle" className="form-label" style={{ fontSize: "14px", fontWeight: "600" }}>Title</label>
          <input type="text" className="form-control" id="ticketTitle" name='ticketTitle' placeholder="Enter ticket title" required value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)} autoComplete='off' />
        </div>
        <div className="mb-3">
          <label for="ticketPriority" className="form-label" style={{ fontSize: "14px", fontWeight: "600" }}>Priority</label>
          <select className="form-select" id='ticketPriority' value={categoryPriority} onChange={(e) => setCategoryPriority(e.target.value)} aria-label="Default select example" required>
            <option value=''>Open this to select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label for="ticketMessage" className="form-label" style={{ fontSize: "14px", fontWeight: "600" }}>Message</label>
          <div>
            {(suggestions.length !== 0) ?
              <Dropdown drop="up" style={{ zIndex: '1' }}>
                <Dropdown.Toggle style={{ visibility: 'hidden', padding: 0, margin: 0 }}></Dropdown.Toggle>
                <Dropdown.Menu show>
                  {suggestions.map((suggestion, index) => (
                    <Dropdown.Item eventKey={index + 1} key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                      {suggestion.tag_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              :
              <></>
            }
            <ReactQuill ref={quillRef} theme="snow" value={categoryMessage} onChange={(value) => handleInputChange(value)} modules={modules} formats={formats} style={{ height: '200px', }} placeholder='Enter your message' />
          </div>
        </div>
        <br />
        {categoryMessageRequired ?
          <div id="emailHelp" className="form-text text-danger">Message Required!</div>
          :
          <></>
        }
        <br />
        <button type="submit" className={`btn btn-primary ${styles.callMeBack} my-3`}>Call me back</button>
      </form>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Ticket Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center'>Ticket with id <b><u>({categoryId})</u></b> Submitted!</h5>
          <h5 className='mt-4'>Automatic Response:</h5>
          <h6>Hii, thank you for your ticket with id: <u>{categoryId}</u>, we are unavailable at the moment but we will reply upon return... Thank You!</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuillEditor;
