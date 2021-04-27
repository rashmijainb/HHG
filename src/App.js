import React, {useState, useEffect} from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
const URL = 'https://6087b71da3b9c200173b89dd.mockapi.io/api/v1/';

const App = () => {
    const [offset, setOffset] = useState(1);
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0)
    const useSignUpForm = (callback) => {
      const [inputs, setInputs] = useState({});
      const handleSubmit = (event) => {
          if (event) {
            event.preventDefault();
          }
          callback();
        }
      const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
      }
      return {
        handleSubmit,
        handleInputChange,
        inputs
      };
    }

    const signup = async() => {
      let employee = {
        'name':`${inputs.name}`,
        'email':`${inputs.email}`,
        'position':`${inputs.position}`,
      };
      const res = await axios.post(URL+'employees',employee);
      alert('Employee Saved');
      getData()
    }
    const {inputs, handleInputChange, handleSubmit} = useSignUpForm( signup);

    React.useEffect(() => {
        getData()
    }, [offset])

    const getData = async() => {
      const res = await axios.get(URL+'employees')
      const data = res.data;
      const slice = data.slice(offset, offset * perPage)
      const postData = slice.map(pd => <tr key={pd.id}>
          <td>{pd.name}</td>
          <td>{pd.email}</td>
          <td>{pd.position}</td>
          
      </tr>)
      setData(postData)
      setPageCount(Math.ceil(data.length / perPage))
    }

    
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage + 1)
    };

    return (
        <>
            <h1 id='title'>Employees</h1>
              <div className="col-md-12">
                <table id="employee" className="table table-stripped">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                  </tr>
                  {data}
                </table>
              
               <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}/>
                <h1 id='title'>Add New Employee</h1>
               <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="control-label">Name</label>
                  <input className="form-control" type="text" name="name" onChange={handleInputChange} value={inputs.firstName} required />
                </div>
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <input className="form-control" type="email" name="email" onChange={handleInputChange} value={inputs.email} required />
                </div>
                <div className="form-group">
                  <label className="control-label">Position</label>
                  <input className="form-control" type="text" name="position" onChange={handleInputChange} value={inputs.password1}/>
                </div>
                <button className="btn btn-primary" type="submit">Add Employee</button>
              </form>
            </div>
        </>
    )
}


export default App;
