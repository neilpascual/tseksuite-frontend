import axios from 'axios'
import { transformResult, transformExaminers } from '../helpers/helpers';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token");
  }

  console.log('Token', token)

  return {
    id: 1,
    name: "Francis Alex",
    role: "Admin",
    token,
  };
};


export const loginUser = async ( loginCredentials ) => {

    return {
        token: "thisissampletoken",
        id: 1,
        name: 'Francis alex',
        role: 'Admin',
        ...loginCredentials
    }
}

export const getAllResults = async() => {
      try {

        const response = await axios.get(`${API_BASE_URL}/result/get`);
        if(!response) {console.log('Error, API')}

        console.log(response.data.data)

        const formatted = response.data.data.map(transformResult);
        
        
        return formatted

      } catch (error) {
        console.error(error)
        toast.error(error)
      }
}

export const getAllExaminers = async()=> {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/examiner/get`)

    if(!response){console.log('Failed to fetch data!')}

    const formattedData = response.data.data.map(transformExaminers)

    return formattedData

  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const getAllDepartments = async() => {

  try {
    const response = await axios.get(`${API_BASE_URL}/department/get`)

    if(!response) { console.log("Cannot fetch departments!") }
    console.log(response.data.data)
    return response.data.data
    
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const toggleDepartmentActiveStatus = async(department) => {

  try {

    await axios.patch(
          `${API_BASE_URL}/department/toggle-status/${department.dept_id}`,
          {
            is_active: !department.is_active,
          }
        );

  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const addDepartment = async(newDeptName) => {
  try {
    await axios.post(`${API_BASE_URL}/department/create`, {
            dept_name: newDeptName,
            is_active: true,
          });
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const editDepartment = async(editingDept) => {
  try {
    await axios.put(
        `${API_BASE_URL}/department/update/${editingDept.dept_id}`,
        {
          dept_name: editingDept.dept_name,
        }
      );
  } catch (error) {

    console.error(error)
    toast.error(error)

  }
}

export const deleteDepartment = async(deletingDept) => {
  try {
    await axios.delete(`${API_BASE_URL}/department/delete/${deletingDept.dept_id}`);
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const submitResults = async({results, examinerId}) => {
  try {

    const body  = {
      quiz_id: quiz_id,
      examiner_id: examinerId,
      answers : [
        { 
          question_id : question_id,
          answer_id : answer_id,
        },
      ],
      status: 'COMPLETED'

    }

    await axios.post('url', body )

  } catch (err) {
    console.error(err)
  }
}

export const addQuestion = async(quizId, payload) => {
  try {
      const res = await axios.post(
        `${API_BASE_URL}/question/${quizId}/create`,
        payload
      );

      return { ...res.data.data }
  } catch (err) {
    console.error(err)
  }
}

export const getQuestions =  async(quizId) => {
  try {

    const response =await axios.get(`${API_BASE_URL}/question/get/${quizId}`);
    return response.data.data || []

  } catch (err) {
    console.error(err)
  }
}

export const updateQuestion = async(quizId, questionId, payload) => {
  try {
    await axios.put(
        `${API_BASE_URL}/question/${quizId}/update/${questionId}`,
        payload
      );
  } catch (err) {
    console.error(err)
  }
}

export const deleteQuestion = async(quizId, questionId) => {
  try {
    await axios.delete( `${API_BASE_URL}/question/${quizId}/delete/${questionId}` );
  } catch (err) {
    console.error(err)
  }
}


export const getOptions = async(questionId) => {
  try {

    const response = await axios.get(`${API_BASE_URL}/answer/test/${questionId}`);
    return response.data.data || []
  } catch (err) {
    console.error(err)
  }
}

export const getAnswer = async(questionId) => {
  try {
    const res = await axios.get( `${API_BASE_URL}/answer/get/${questionId}`);

    return res.data.data || []
  } catch (err) {
    console.error(err)
  }
}

export const updateAnswer = async(answerId, options) => {
  try {
    await axios.put( `${API_BASE_URL}/answer/${answerId}/update`, options);
  } catch (err) {
    console.error(err) 
  }
}

export const addAnswer = async(questionId, options) => {
  try {
    await axios.post( `${API_BASE_URL}/answer/${questionId}/create`, options );
  } catch (err) {
    console.error(err)
  }
}

export const deleteAnswer = async(oldId) =>{
    try {
      await axios.delete(`${API_BASE_URL}/answer/${oldId}/delete`);
    } catch (err) {
      console.error(err)
    }
  }

export const addResult = async(payload) => {
  try {

    const headers = { headers: {"Content-Type": "application/json" } }
    const response = await axios.post(`${API_BASE_URL}/result/create`, payload, headers );

    return response.data.data || []
    
  } catch (err) {
    console.error(err)
  }
}

export const addBridge = async(payload) => {
  try {

    const headers =  { headers: { "Content-Type": "application/json" }}
    await axios.post(`${API_BASE_URL}/bridge/create`, payload, headers);
    
  } catch (err) {
    console.error(err)
  }
}

export const getQuizzes = async(deptId) => {

  try {
    const response = await axios.get(
        `${API_BASE_URL}/quiz/get/${deptId}`
      );

    return response.data.data || []
  } catch (err) {
    console.error(err)
  }

}


export const addQuiz = async (deptId, payload) => {
  try {
    await axios.post(`${API_BASE_URL}/quiz/${deptId}/create`, payload);
  } catch (err) {
    console.error(err)
  }
}

export const editQuiz = async (deptId, quizId, payload) => {
  try {
    await axios.put( `${API_BASE_URL}/quiz/${deptId}/update/${quizId}`, payload);
  } catch (err) {
    console.error(err)
  }
}

export const deleteQuiz = async (deptId, quizId) => { 
  try {
    await axios.delete(
          `${API_BASE_URL}/quiz/${deptId}/delete/${quizId}`
);
  } catch (err) {
    console.error(err)
  }
}

export const generateInviteLink = async(payload) => {
  try {
    const link = await axios.post(`${API_BASE_URL}/invitation/generate`,payload );

    return link.data.data.link || ''
  } catch (err) {
    console.error(err)
  }
}

export const validateInvitationLink = async(token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/invitation/validate/${token}`)

    const status = response.status
    
    return { ...response.data.data, status }

  } catch (err) {
    console.error(err)
  }
}

export const submitExaminerData = async(payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invitation/complete`, payload, { headers: { "Content-Type":"application/json" } })

    console.log(response)
    return response.data.data

  } catch (err) {
    console.error(err)
  }
}
