// QuillEditor.js
import ReactQuill from 'react-quill';
import { Alert } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import styles from '../../../styles/Support/support.module.css';
import { AllCategory, CreateTicket } from '@/pages/api/graphqlAPI';

const QuillEditor = () => {

  const [alertBg, setAlertBg] = useState();
  const [showAlert, setShowAlert] = useState();
  const [alertData, setAlertData] = useState();
  const [All_Category] = useMutation(AllCategory);
  const [Create_Ticket] = useMutation(CreateTicket);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [categoryPriority, setCategoryPriority] = useState('');
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
        setShowAlert(true)
        setAlertBg('success')
        setAlertData(`Ticket with id (${res.data.createTicket.ticket_id}) Submit Successfully`)
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

  return (
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
        <ReactQuill
          theme="snow"
          value={categoryMessage} onChange={(value) => setCategoryMessage(value)}
          modules={modules}
          formats={formats}
          style={{ height: '200px', }}
          placeholder='Enter your message'
        />
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
  );
};

export default QuillEditor;
